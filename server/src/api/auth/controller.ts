import { Request, Response } from "express";
import { emailSchema, loginSchema, signupSchema } from "../../utils";
import bcrypt from "bcryptjs";
import { db } from "../../prismaClient";
import { getUserByEmail } from "../../utils/user";
import { generateToken } from "../../utils/jwt";
import { upsertStreamUser } from "../../lib/stream";

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { fullName, email, password } = req.body;

  const validation = signupSchema.safeParse({ fullName, email, password });

  if (!validation.success) {
    res.status(400).json({
      error: validation.error.errors.map((err) => err.message).join(", "),
    });
    return;
  }

  const validatedData = validation.data;

  if (!emailSchema.test(validatedData.email)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  try {
    const existingUser = await getUserByEmail(validatedData.email);

    if (existingUser) {
      res.status(409).json({ error: "User with this email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const user = await db.user.create({
      data: {
        fullName: validatedData.fullName,
        email: validatedData.email,
        password: hashedPassword,
        profilePic: randomAvatar,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    try {
      await upsertStreamUser({
        id: user.id.toString(),
        name: user.fullName,
        image: user.profilePic || "",
      });
      console.log(`Stream user created for ${user.fullName}`);
    } catch (error) {
      console.log("Error creating Stream user:", error);
    }

    const token = generateToken({ id: user.id });

    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({
      message: "User created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const validation = loginSchema.safeParse({ email, password });

  if (!validation.success) {
    res.status(400).json({
      error: validation.error.errors.map((err) => err.message).join(", "),
    });
    return;
  }

  const validatedData = validation.data;

  if (!emailSchema.test(validatedData.email)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  try {
    const user = await getUserByEmail(validatedData.email);

    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.password
    );

    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const { password: _, ...userWithoutPassword } = user;

    const token = generateToken({ id: user.id });

    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({
      message: "User login successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

export const onboard = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;

  const { fullName, bio, nativeLanguage, learningLanguage, location } =
    req.body;

  if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
    res.status(400).json({
      message: "All fields are required for onboarding",
      missingFields: [
        !fullName && "fullName",
        !bio && "bio",
        !nativeLanguage && "nativeLanguage",
        !learningLanguage && "learningLanguage",
        !location && "location",
      ].filter(Boolean),
    });
  }

  try {
    const updateUser = await db.user.update({
      where: { id: userId },
      data: {
        ...req.body,
        isOnboarded: true,
      },
    });

    if (!updateUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { password, ...userWithoutPassword } = updateUser;

    try {
      await upsertStreamUser({
        id: updateUser.id.toString(),
        name: updateUser.fullName,
        image: updateUser.profilePic || "",
      });
      console.log(
        `Stream user updated after onboarding for ${updateUser.fullName}`
      );
    } catch (streamError) {
      console.log("Error updating Stream user during onboarding");
    }

    res.status(200).json({ success: true, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
