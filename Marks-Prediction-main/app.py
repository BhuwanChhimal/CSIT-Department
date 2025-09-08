import streamlit as st
import numpy as np, joblib, warnings
warnings.filterwarnings("ignore")

st.set_page_config(page_title="Student Exam Score")

model = joblib.load("best_model.pkl")

st.title("Student Exam Score Predictor")

study_hours   = st.slider("Study hours per Day", 0.0, 12.0, 2.0, 0.5)
attendance    = st.slider("Attendance Percentage", 0.0, 100.0, 80.0, 1.0)
mental_health = st.slider("Mental Health (1–10)", 1, 10, 5, 1)
sleep_hours   = st.slider("Sleep Hours per Night", 0.0, 12.0, 7.0, 0.5)
ptj_encoded   = 1 if st.selectbox("Part-Time Job", ["No", "Yes"]) == "Yes" else 0

if st.button("Predict Exam Score"):
    X = np.array([[study_hours, attendance, mental_health, sleep_hours, ptj_encoded]])
    y_hat = float(model.predict(X)[0])
    y_hat = max(0, min(100, y_hat))  # clamp to 0–100 if your scores are %
    st.metric("Predicted Exam Score", f"{y_hat:.1f}")
