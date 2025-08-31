import express from "express";
import {
  createNotice,
  getNotices,
  getNoticeById,
  deleteNotice,
} from "../controllers/noticesController.js";
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get("/", getNotices);
router.get("/:id", getNoticeById);

// Admin-only routes
router.post("/", protect, createNotice);
router.delete("/:id", protect, deleteNotice);

export default router;
