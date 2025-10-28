import {
  PredictionValidationError,
  getMarksPredictorMetadata,
  predictMarks,
} from "../services/marksPredictorService.js";

export const getPredictionMetadata = (_req, res) => {
  res.json(getMarksPredictorMetadata());
};

export const createPrediction = (req, res) => {
  try {
    const prediction = predictMarks(req.body ?? {});
    res.json(prediction);
  } catch (error) {
    if (error instanceof PredictionValidationError) {
      return res.status(error.statusCode).json({
        message: error.message,
        errors: error.details,
      });
    }

    console.error("Marks predictor failed:", error);
    return res.status(500).json({
      message: "Unable to generate a marks prediction right now.",
    });
  }
};
