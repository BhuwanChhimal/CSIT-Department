import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modelSpecPath = path.resolve(
  __dirname,
  "../../Marks-Predictor/model_spec.json"
);

const modelSpec = JSON.parse(fs.readFileSync(modelSpecPath, "utf-8"));
const numericFeatures = modelSpec.features.filter(
  (feature) => feature.kind === "numeric"
);
const categoricalFeatures = modelSpec.features.filter(
  (feature) => feature.kind === "categorical"
);

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const roundTo = (value, digits = 1) =>
  Number.parseFloat(value.toFixed(digits));

export class PredictionValidationError extends Error {
  constructor(message, details = []) {
    super(message);
    this.name = "PredictionValidationError";
    this.statusCode = 400;
    this.details = details;
  }
}

const publicFeatureMetadata = modelSpec.features.map((feature) => {
  const {
    coefficient,
    coefficients,
    mean,
    scale,
    ...safeFeature
  } = feature;
  return safeFeature;
});

export function getMarksPredictorMetadata() {
  return {
    model: modelSpec.model,
    dataset: modelSpec.dataset,
    features: publicFeatureMetadata,
  };
}

export function validateAndNormalizeInput(payload = {}) {
  const normalizedInput = {};
  const errors = [];

  for (const feature of numericFeatures) {
    const rawValue = payload[feature.name];
    const value = Number(rawValue);

    if (rawValue === undefined || rawValue === null || rawValue === "") {
      errors.push({
        field: feature.name,
        message: `${feature.label} is required.`,
      });
      continue;
    }

    if (!Number.isFinite(value)) {
      errors.push({
        field: feature.name,
        message: `${feature.label} must be a valid number.`,
      });
      continue;
    }

    if (value < feature.min || value > feature.max) {
      errors.push({
        field: feature.name,
        message: `${feature.label} must be between ${feature.min} and ${feature.max}.`,
      });
      continue;
    }

    normalizedInput[feature.name] = value;
  }

  for (const feature of categoricalFeatures) {
    const rawValue = payload[feature.name];

    if (typeof rawValue !== "string" || rawValue.trim() === "") {
      errors.push({
        field: feature.name,
        message: `${feature.label} is required.`,
      });
      continue;
    }

    if (!feature.options.includes(rawValue)) {
      errors.push({
        field: feature.name,
        message: `${feature.label} must be one of: ${feature.options.join(", ")}.`,
      });
      continue;
    }

    normalizedInput[feature.name] = rawValue;
  }

  if (errors.length > 0) {
    throw new PredictionValidationError("Prediction input is invalid.", errors);
  }

  return normalizedInput;
}

export function predictMarks(payload = {}) {
  const input = validateAndNormalizeInput(payload);
  let score = modelSpec.model.intercept;
  const contributionMap = [];

  for (const feature of numericFeatures) {
    const standardizedValue = (input[feature.name] - feature.mean) / feature.scale;
    const impact = standardizedValue * feature.coefficient;
    score += impact;
    contributionMap.push({
      field: feature.name,
      label: feature.label,
      impact: roundTo(impact, 2),
    });
  }

  for (const feature of categoricalFeatures) {
    const impact = feature.coefficients[input[feature.name]] ?? 0;
    score += impact;
    contributionMap.push({
      field: feature.name,
      label: feature.label,
      impact: roundTo(impact, 2),
    });
  }

  const boundedScore = clamp(
    score,
    modelSpec.model.targetMin,
    modelSpec.model.targetMax
  );
  const band = modelSpec.model.predictionBandHalfWidth;

  const drivers = contributionMap
    .filter((item) => Math.abs(item.impact) >= 0.15)
    .sort((left, right) => Math.abs(right.impact) - Math.abs(left.impact))
    .slice(0, 5)
    .map((item) => ({
      ...item,
      direction: item.impact >= 0 ? "positive" : "negative",
    }));

  return {
    predictedScore: roundTo(boundedScore, 1),
    likelyRange: {
      lower: roundTo(
        clamp(boundedScore - band, modelSpec.model.targetMin, modelSpec.model.targetMax),
        1
      ),
      upper: roundTo(
        clamp(boundedScore + band, modelSpec.model.targetMin, modelSpec.model.targetMax),
        1
      ),
    },
    modelVersion: modelSpec.model.name,
    metrics: modelSpec.model.metrics.enhanced,
    comparison: {
      baseline: modelSpec.model.metrics.baseline,
      improvement: {
        rmse: roundTo(
          modelSpec.model.metrics.baseline.rmse - modelSpec.model.metrics.enhanced.rmse,
          2
        ),
        mae: roundTo(
          modelSpec.model.metrics.baseline.mae - modelSpec.model.metrics.enhanced.mae,
          2
        ),
      },
    },
    drivers,
    input,
  };
}
