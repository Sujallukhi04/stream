import express from "express";
import { login, logout, signup, onboard } from "./controller";
import { protectRoute } from "../../middleware/auth";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/onboarding", protectRoute, onboard);

router.get(
  "/me",
  protectRoute,
  (req: express.Request, res: express.Response) => {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  }
);

export default router;
