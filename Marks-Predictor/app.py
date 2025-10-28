from __future__ import annotations

import json
from pathlib import Path

import streamlit as st

ROOT = Path(__file__).resolve().parent
MODEL_SPEC_PATH = ROOT / "model_spec.json"
SECTION_ORDER = ["Academics", "Wellbeing", "Lifestyle", "Profile"]


def load_model_spec() -> dict:
    return json.loads(MODEL_SPEC_PATH.read_text(encoding="utf-8"))


def predict_score(model_spec: dict, payload: dict) -> tuple[float, list[dict[str, float | str]]]:
    score = model_spec["model"]["intercept"]
    drivers = []

    for feature in model_spec["features"]:
        if feature["kind"] == "numeric":
            impact = (
                (float(payload[feature["name"]]) - feature["mean"]) / feature["scale"]
            ) * feature["coefficient"]
        else:
            impact = feature["coefficients"].get(payload[feature["name"]], 0.0)

        score += impact
        drivers.append(
            {
                "label": feature["label"],
                "impact": round(float(impact), 2),
            }
        )

    lower = max(model_spec["model"]["targetMin"], score - model_spec["model"]["predictionBandHalfWidth"])
    upper = min(model_spec["model"]["targetMax"], score + model_spec["model"]["predictionBandHalfWidth"])
    bounded = max(model_spec["model"]["targetMin"], min(model_spec["model"]["targetMax"], score))
    top_drivers = sorted(drivers, key=lambda item: abs(item["impact"]), reverse=True)[:5]
    return round(float(bounded), 1), top_drivers + [{"label": "Range", "impact": round(float(upper - lower), 1)}]


model_spec = load_model_spec()
features = model_spec["features"]
metrics = model_spec["model"]["metrics"]

st.set_page_config(page_title="Student Marks Predictor", layout="wide")
st.title("Student Marks Predictor")
st.caption(
    f"Enhanced ridge model with {len(features)} validated inputs. "
    f"RMSE improved from {metrics['baseline']['rmse']} to {metrics['enhanced']['rmse']}."
)

payload = {}
sections = {
    section: [feature for feature in features if feature["section"] == section]
    for section in SECTION_ORDER
}

for section in SECTION_ORDER:
    group = sections.get(section, [])
    if not group:
        continue

    st.subheader(section)
    columns = st.columns(2)
    for index, feature in enumerate(group):
        with columns[index % 2]:
            if feature["kind"] == "numeric":
                payload[feature["name"]] = st.number_input(
                    feature["label"],
                    min_value=float(feature["min"]),
                    max_value=float(feature["max"]),
                    value=float(feature["default"]),
                    step=float(feature["step"]),
                    help=feature["description"],
                )
            else:
                payload[feature["name"]] = st.selectbox(
                    feature["label"],
                    options=feature["options"],
                    index=feature["options"].index(feature["default"]),
                    help=feature["description"],
                )

if st.button("Predict Exam Score", use_container_width=True):
    predicted_score, drivers = predict_score(model_spec, payload)
    st.metric("Predicted Exam Score", f"{predicted_score:.1f}")
    st.write("Top model drivers")
    for driver in drivers[:-1]:
        st.write(f"- {driver['label']}: {driver['impact']:+.2f} points")
    st.caption(
        f"Approximate prediction band width: ±{model_spec['model']['predictionBandHalfWidth']} points."
    )
