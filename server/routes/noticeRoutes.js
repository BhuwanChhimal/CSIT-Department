import express from "express";
import {
  createNotice,
  getNotices,
  getNoticeById,
  deleteNotice,
} from "../controllers/noticesController.js";
import { protect } from '../middlewares/authMiddleware.js';
import upload from "../utils/multerConfig.js";
import multer from "multer";

const router = express.Router();

// Public routes
router.get("/", getNotices);
router.get("/:id", getNoticeById);

// Admin-only routes
router.post("/", protect,

  (req, res, next) => {
    upload.single("file")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  
  createNotice);
router.delete("/:id", protect, deleteNotice);

export default router;
