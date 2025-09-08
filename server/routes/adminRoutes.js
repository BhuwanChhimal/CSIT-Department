// server/routes/adminRoutes.js
import express from 'express';
import { getPendingUsers, approveUser,getAllStudents,assignSubjects,getAllTeachers } from '../controllers/adminController.js';
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/pending-users', protect, getPendingUsers);
router.get('/students', protect, getAllStudents);
router.get('/teachers', protect, getAllTeachers);
router.put('/approve-user/:userId', protect, approveUser);
router.put('/assign-subjects/:teacherId', protect, assignSubjects);

export default router;