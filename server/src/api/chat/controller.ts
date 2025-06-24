import { Request, Response } from "express";
import { generateStreamToken } from "../../lib/stream";

export const getStreamToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = generateStreamToken(req.user?.id!);
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error in getStreamToken controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
