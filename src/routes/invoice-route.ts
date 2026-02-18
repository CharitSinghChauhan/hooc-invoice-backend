import { Router } from "express";
import { authMiddleware } from "../middlewares/auth-middleware";
import {
  createInvoiceController,
  getInvoicesController,
  getInvoiceController,
  updateInvoiceController,
  deleteInvoiceController,
} from "../controllers/invoice-controller";

const router = Router();

// All invoice routes require authentication
router.post("/", authMiddleware, createInvoiceController);
router.get("/", authMiddleware, getInvoicesController);
router.get("/:id", authMiddleware, getInvoiceController);
router.put("/:id", authMiddleware, updateInvoiceController);
router.delete("/:id", authMiddleware, deleteInvoiceController);

export default router;
