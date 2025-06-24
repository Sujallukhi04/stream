import express from "express";
import { protectRoute } from "../../middleware/auth";
import { getStreamToken } from "./controller";

const router = express.Router();

router.get("/token", protectRoute, getStreamToken);

export default router;
