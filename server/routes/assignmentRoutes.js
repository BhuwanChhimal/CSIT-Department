import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  uploadAssignment,
  getStudentAssignments,
  getTeacherAssignments,
  submitAssignment,
  getSubmissionsForTeacher,
  deleteAssignment
} from "../controllers/assignmentController.js";
import upload from "../utils/multerConfig.js";
import multer from "multer";
import studentUpload from "../utils/studentmulterConfig.js";

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

router.post("/:assignmentId/submit", protect,
  (req,res,next) =>{
    studentUpload.single("file")(req,res,function(err){
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    })
  },
  submitAssignment
);
// routes/assignmentRoutes.js
router.get("/:assignmentId/submissions", protect, getSubmissionsForTeacher);
router.delete("/:id", protect, deleteAssignment);

router.get("/teacher", protect, getTeacherAssignments);
router.get('/student', protect, getStudentAssignments);

export default router;
