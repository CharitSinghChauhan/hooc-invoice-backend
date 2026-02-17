import { Router } from "express";
import { adminMiddleware } from "../middlewares/auth-middleware";
import {
  createProjectController,
  getProjectsController,
} from "../controllers/project-controller";

const router = Router();

router.post("/projects", adminMiddleware, createProjectController);
router.get("/projects", adminMiddleware, getProjectsController);

export default router;
