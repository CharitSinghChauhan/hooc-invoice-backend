import { Router } from "express";
import { getUserController, googleOAuthController } from "../controllers/auth-controller";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();

router.get("/google/callback", googleOAuthController);
router.get("/me", authMiddleware, getUserController)

export default router;
