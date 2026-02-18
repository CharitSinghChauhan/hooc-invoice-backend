import { Router } from "express";
import {
  getUserController,
  googleOAuthController,
} from "../controllers/auth-controller";
import { adminMiddleware } from "../middlewares/auth-middleware";

const router = Router();

router.get("/google/callback", googleOAuthController);
router.get("/me", adminMiddleware, getUserController);

export default router;
