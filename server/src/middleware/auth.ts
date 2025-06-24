import jwt from "jsonwebtoken";
import { getUserById } from "../utils/user";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { TokenPayload } from "../types";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({ message: "Unauthorized - No token provided" });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET!) as TokenPayload;

    if (!decoded) {
      res.status(401).json({ message: "Unauthorized - Invalid token" });
      return;
    }

    const user = await getUserById(decoded.id);

    if (!user) {
      res.status(401).json({ message: "Unauthorized - User not found" });
      return;
    }

    //@ts-ignore
    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
