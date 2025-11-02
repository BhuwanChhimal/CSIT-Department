// server/routes/attendanceRoutes.js
import express from "express";
import { getAttendanceStatus, getTeacherAttendanceByDate, markAttendance } from "../controllers/attendanceController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/mark", protect, markAttendance);
router.get("/status", protect, getAttendanceStatus);
router.get("/teacher", protect, getTeacherAttendanceByDate);
export default router;