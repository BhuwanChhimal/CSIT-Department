import express from "express";

import {
  compareTextsForPlagiarism,
  getAssignmentPlagiarismReport,
} from "../controllers/plagiarismController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { verifyRole } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(protect, verifyRole(["teacher"]));
router.post("/compare", compareTextsForPlagiarism);
router.get("/assignments/:assignmentId/report", getAssignmentPlagiarismReport);

export default router;
