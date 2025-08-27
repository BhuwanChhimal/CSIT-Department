import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  uploadAssignment,
  getTeacherAssignments,
} from "../controllers/assignmentController.js";
import upload from "../utils/multerConfig.js";
import multer from "multer";
const router = express.Router();
router.post(
  "/upload",
  protect,
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
  uploadAssignment
);

router.get("/teacher", protect, getTeacherAssignments);

export default router;
