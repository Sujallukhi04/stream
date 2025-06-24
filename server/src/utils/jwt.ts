import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { TokenPayload } from "../types";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET environment variable");
}

export const generateToken = (user: TokenPayload): string => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
};
