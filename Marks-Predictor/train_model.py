from __future__ import annotations

import csv
import json
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.model_selection import cross_validate
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

ROOT = Path(__file__).resolve().parent
DATASET_PATH = ROOT / "student_habits_performance.csv"
OUTPUT_PATH = ROOT / "model_spec.json"

NUMERIC_FEATURES = [
    "age",
    "study_hours_per_day",
    "social_media_hours",
    "netflix_hours",
    "attendance_percentage",
    "sleep_hours",
    "exercise_frequency",
    "mental_health_rating",
]

CATEGORICAL_FEATURES = [
    "gender",
    "part_time_job",
    "diet_quality",
    "parental_education_level",
    "internet_quality",
    "extracurricular_participation",
]

ALL_FEATURES = [
    "age",
    "gender",
    "study_hours_per_day",
    "social_media_hours",
    "netflix_hours",
    "part_time_job",
    "attendance_percentage",
    "sleep_hours",
    "diet_quality",
    "exercise_frequency",
    "parental_education_level",
    "internet_quality",
    "mental_health_rating",
    "extracurricular_participation",
]

BASELINE_FEATURES = [
    "study_hours_per_day",
    "attendance_percentage",
    "mental_health_rating",
    "sleep_hours",
    "part_time_job",
]

FEATURE_METADATA = {
    "age": {
        "label": "Age",
        "kind": "numeric",
        "section": "Profile",
        "description": "Student age in years.",
        "min": 15,
        "max": 35,
        "step": 1,
    },
    "gender": {
        "label": "Gender",
        "kind": "categorical",
        "section": "Profile",
        "description": "Used only because it appears in the training data.",
    },
    "study_hours_per_day": {
        "label": "Study Hours Per Day",
        "kind": "numeric",
        "section": "Academics",
        "description": "Average daily focused study hours.",
        "min": 0,
        "max": 16,
        "step": 0.1,
        "unit": "hours",
    },
    "social_media_hours": {
        "label": "Social Media Hours",
        "kind": "numeric",
        "section": "Lifestyle",
        "description": "Average daily time spent on social media.",
        "min": 0,
        "max": 12,
        "step": 0.1,
        "unit": "hours",
    },
    "netflix_hours": {
        "label": "Streaming Hours",
        "kind": "numeric",
        "section": "Lifestyle",
        "description": "Average daily entertainment streaming hours.",
        "min": 0,
        "max": 12,
        "step": 0.1,
        "unit": "hours",
    },
    "part_time_job": {
        "label": "Part-Time Job",
        "kind": "categorical",
        "section": "Profile",
        "description": "Whether the student currently has a part-time job.",
    },
    "attendance_percentage": {
        "label": "Attendance Percentage",
        "kind": "numeric",
        "section": "Academics",
        "description": "Recent attendance percentage.",
        "min": 0,
        "max": 100,
        "step": 0.1,
        "unit": "%",
    },
    "sleep_hours": {
        "label": "Sleep Hours",
        "kind": "numeric",
        "section": "Lifestyle",
        "description": "Average nightly sleep duration.",
        "min": 0,
        "max": 12,
        "step": 0.1,
        "unit": "hours",
    },
    "diet_quality": {
        "label": "Diet Quality",
        "kind": "categorical",
        "section": "Lifestyle",
        "description": "Self-assessed diet quality.",
    },
    "exercise_frequency": {
        "label": "Exercise Days Per Week",
        "kind": "numeric",
        "section": "Lifestyle",
        "description": "How many days per week the student exercises.",
        "min": 0,
        "max": 7,
        "step": 1,
        "unit": "days",
    },
    "parental_education_level": {
        "label": "Parental Education",
        "kind": "categorical",
        "section": "Profile",
        "description": "Highest parental education level from the training schema.",
    },
    "internet_quality": {
        "label": "Internet Quality",
        "kind": "categorical",
        "section": "Lifestyle",
        "description": "Reliability of the student's home internet access.",
    },
    "mental_health_rating": {
        "label": "Mental Health Rating",
        "kind": "numeric",
        "section": "Wellbeing",
        "description": "Self-rating from 1 (low) to 10 (high).",
        "min": 1,
        "max": 10,
        "step": 1,
    },
    "extracurricular_participation": {
        "label": "Extracurricular Participation",
        "kind": "categorical",
        "section": "Profile",
        "description": "Whether the student participates in extracurricular activities.",
    },
}


def load_rows() -> list[dict[str, str]]:
    with DATASET_PATH.open(newline="", encoding="utf-8") as dataset_file:
        return list(csv.DictReader(dataset_file))


def build_feature_matrix(
    rows: list[dict[str, str]], feature_names: list[str]
) -> np.ndarray:
    matrix = []
    for row in rows:
        sample = []
        for feature_name in feature_names:
            value = row[feature_name]
            if feature_name in NUMERIC_FEATURES:
                sample.append(float(value))
            else:
                sample.append(value)
        matrix.append(sample)
    return np.array(matrix, dtype=object)


def build_pipeline(
    feature_names: list[str], model
) -> Pipeline:
    numeric_indices = [
        index for index, feature_name in enumerate(feature_names)
        if feature_name in NUMERIC_FEATURES
    ]
    categorical_indices = [
        index for index, feature_name in enumerate(feature_names)
        if feature_name in CATEGORICAL_FEATURES
    ]

    return Pipeline(
        steps=[
            (
                "preprocessor",
                ColumnTransformer(
                    transformers=[
                        (
                            "numeric",
                            Pipeline(
                                steps=[
                                    ("imputer", SimpleImputer(strategy="median")),
                                    ("scaler", StandardScaler()),
                                ]
                            ),
                            numeric_indices,
                        ),
                        (
                            "categorical",
                            Pipeline(
                                steps=[
                                    ("imputer", SimpleImputer(strategy="most_frequent")),
                                    (
                                        "encoder",
                                        OneHotEncoder(handle_unknown="ignore"),
                                    ),
                                ]
                            ),
                            categorical_indices,
                        ),
                    ]
                ),
            ),
            ("model", model),
        ]
    )


def evaluate_pipeline(
    pipeline: Pipeline, X: np.ndarray, y: np.ndarray
) -> dict[str, float | int]:
    scores = cross_validate(
        pipeline,
        X,
        y,
        cv=5,
        scoring={
            "mae": "neg_mean_absolute_error",
            "rmse": "neg_root_mean_squared_error",
            "r2": "r2",
        },
        n_jobs=1,
    )
    return {
        "folds": 5,
        "mae": round(float(-scores["test_mae"].mean()), 4),
        "rmse": round(float(-scores["test_rmse"].mean()), 4),
        "r2": round(float(scores["test_r2"].mean()), 4),
    }


def round_value(value: float, precision: int = 6) -> float:
    return round(float(value), precision)


def build_numeric_feature_specs(
    rows: list[dict[str, str]],
    feature_names: list[str],
    scaler: StandardScaler,
    coefficients: np.ndarray,
) -> list[dict[str, object]]:
    specs = []
    numeric_feature_names = [
        feature_name for feature_name in feature_names if feature_name in NUMERIC_FEATURES
    ]
    for index, feature_name in enumerate(numeric_feature_names):
        values = np.array([float(row[feature_name]) for row in rows], dtype=float)
        metadata = FEATURE_METADATA[feature_name]
        step = metadata.get("step", 1)
        midpoint = float(np.median(values))
        default = int(round(midpoint)) if step == 1 else round_value(midpoint, 1)
        specs.append(
            {
                "name": feature_name,
                **metadata,
                "default": default,
                "dataMin": round_value(values.min()),
                "dataMax": round_value(values.max()),
                "mean": round_value(scaler.mean_[index]),
                "scale": round_value(scaler.scale_[index]),
                "coefficient": round_value(coefficients[index]),
            }
        )
    return specs


def build_categorical_feature_specs(
    rows: list[dict[str, str]],
    feature_names: list[str],
    encoder: OneHotEncoder,
    coefficients: np.ndarray,
    numeric_feature_count: int,
) -> list[dict[str, object]]:
    specs = []
    cursor = numeric_feature_count
    categorical_feature_names = [
        feature_name
        for feature_name in feature_names
        if feature_name in CATEGORICAL_FEATURES
    ]

    for feature_name, categories in zip(categorical_feature_names, encoder.categories_):
        categories = [str(category) for category in categories.tolist()]
        metadata = FEATURE_METADATA[feature_name]
        counter = Counter(row[feature_name] for row in rows)
        category_coefficients = {}
        for category in categories:
            category_coefficients[category] = round_value(coefficients[cursor])
            cursor += 1
        specs.append(
            {
                "name": feature_name,
                **metadata,
                "default": counter.most_common(1)[0][0],
                "options": categories,
                "coefficients": category_coefficients,
            }
        )
    return specs


def train_and_export() -> None:
    rows = load_rows()
    X_full = build_feature_matrix(rows, ALL_FEATURES)
    X_baseline = build_feature_matrix(rows, BASELINE_FEATURES)
    y = np.array([float(row["exam_score"]) for row in rows], dtype=float)

    enhanced_pipeline = build_pipeline(ALL_FEATURES, Ridge(alpha=1.0))
    baseline_pipeline = build_pipeline(BASELINE_FEATURES, LinearRegression())

    baseline_metrics = evaluate_pipeline(baseline_pipeline, X_baseline, y)
    enhanced_metrics = evaluate_pipeline(enhanced_pipeline, X_full, y)

    enhanced_pipeline.fit(X_full, y)
    preprocessor = enhanced_pipeline.named_steps["preprocessor"]
    trained_model = enhanced_pipeline.named_steps["model"]
    numeric_pipeline = preprocessor.named_transformers_["numeric"]
    categorical_pipeline = preprocessor.named_transformers_["categorical"]
    scaler = numeric_pipeline.named_steps["scaler"]
    encoder = categorical_pipeline.named_steps["encoder"]
    coefficients = trained_model.coef_

    numeric_specs = build_numeric_feature_specs(rows, ALL_FEATURES, scaler, coefficients)
    categorical_specs = build_categorical_feature_specs(
        rows,
        ALL_FEATURES,
        encoder,
        coefficients,
        numeric_feature_count=len(numeric_specs),
    )

    model_spec = {
        "schemaVersion": 1,
        "dataset": {
            "path": DATASET_PATH.name,
            "rowCount": len(rows),
            "target": "exam_score",
        },
        "model": {
            "name": "marks-predictor-ridge-v1",
            "type": "ridge_regression",
            "alpha": 1.0,
            "trainedAt": datetime.now(timezone.utc).isoformat(),
            "intercept": round_value(trained_model.intercept_),
            "targetMin": 0,
            "targetMax": 100,
            "predictionBandHalfWidth": enhanced_metrics["rmse"],
            "metrics": {
                "baseline": {
                    "name": "legacy_linear_5_feature_model",
                    **baseline_metrics,
                },
                "enhanced": enhanced_metrics,
            },
        },
        "features": numeric_specs + categorical_specs,
    }

    with OUTPUT_PATH.open("w", encoding="utf-8") as output_file:
        json.dump(model_spec, output_file, indent=2)
        output_file.write("\n")

    print(f"Wrote model spec to {OUTPUT_PATH}")
    print(
        "Enhanced RMSE:",
        enhanced_metrics["rmse"],
        "| Baseline RMSE:",
        baseline_metrics["rmse"],
    )


if __name__ == "__main__":
    train_and_export()
