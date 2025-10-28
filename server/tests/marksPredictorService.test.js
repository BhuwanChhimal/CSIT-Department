import test from "node:test";
import assert from "node:assert/strict";

import {
  PredictionValidationError,
  getMarksPredictorMetadata,
  predictMarks,
} from "../services/marksPredictorService.js";

const validPayload = {
  age: "20",
  gender: "Female",
  study_hours_per_day: "4.5",
  social_media_hours: "1.5",
  netflix_hours: "1.0",
  part_time_job: "No",
  attendance_percentage: "91.2",
  sleep_hours: "7.0",
  diet_quality: "Good",
  exercise_frequency: "4",
  parental_education_level: "Bachelor",
  internet_quality: "Good",
  mental_health_rating: "8",
  extracurricular_participation: "Yes",
};

test("metadata exposes the trained feature schema and improved metrics", () => {
  const metadata = getMarksPredictorMetadata();

  assert.equal(metadata.features.length, 14);
  assert.equal(metadata.model.name, "marks-predictor-ridge-v1");
  assert.ok(
    metadata.model.metrics.enhanced.rmse < metadata.model.metrics.baseline.rmse
  );
});

test("predictMarks accepts stringified inputs and returns a bounded score", () => {
  const prediction = predictMarks(validPayload);

  assert.ok(prediction.predictedScore >= 0);
  assert.ok(prediction.predictedScore <= 100);
  assert.ok(prediction.likelyRange.lower <= prediction.predictedScore);
  assert.ok(prediction.likelyRange.upper >= prediction.predictedScore);
  assert.ok(prediction.drivers.length > 0);
  assert.ok(prediction.comparison.improvement.rmse > 0);
});

test("predictMarks rejects out-of-range numeric values", () => {
  assert.throws(
    () =>
      predictMarks({
        ...validPayload,
        attendance_percentage: "150",
      }),
    (error) => {
      assert.ok(error instanceof PredictionValidationError);
      assert.equal(error.statusCode, 400);
      assert.equal(error.details[0].field, "attendance_percentage");
      return true;
    }
  );
});

test("predictMarks rejects invalid categorical values", () => {
  assert.throws(
    () =>
      predictMarks({
        ...validPayload,
        internet_quality: "Excellent",
      }),
    (error) => {
      assert.ok(error instanceof PredictionValidationError);
      assert.equal(error.statusCode, 400);
      assert.equal(error.details[0].field, "internet_quality");
      return true;
    }
  );
});
