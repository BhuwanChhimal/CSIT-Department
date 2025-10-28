import express from "express";
import {
  createPrediction,
  getPredictionMetadata,
} from "../controllers/marksPredictorController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/metadata", protect, getPredictionMetadata);
router.post("/predict", protect, createPrediction);

export default router;
