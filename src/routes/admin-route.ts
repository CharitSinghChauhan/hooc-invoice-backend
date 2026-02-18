import { Router } from "express";
import { adminMiddleware } from "../middlewares/auth-middleware";
import {
  createProjectController,
  getProjectsController,
  getProjectController,
  updateProjectController,
  deleteProjectController,
} from "../controllers/project-controller";

const router = Router();

router.post("/projects", adminMiddleware, createProjectController);
router.get("/projects", adminMiddleware, getProjectsController);
router.get("/projects/:id", adminMiddleware, getProjectController);
router.put("/projects/:id", adminMiddleware, updateProjectController);
router.delete("/projects/:id", adminMiddleware, deleteProjectController);

export default router;
