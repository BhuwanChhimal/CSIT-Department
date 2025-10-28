import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BrainCircuit,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5002";

const SECTION_ORDER = ["Academics", "Wellbeing", "Lifestyle", "Profile"];

const buildInitialForm = (features, attendancePercentage) => {
  const initialForm = {};

  features.forEach((feature) => {
    initialForm[feature.name] = feature.default;
  });

  if (typeof attendancePercentage === "number" && attendancePercentage >= 0) {
    initialForm.attendance_percentage = Number(attendancePercentage.toFixed(1));
  }

  return initialForm;
};

const groupFeatures = (features = []) =>
  SECTION_ORDER.map((section) => ({
    section,
    fields: features.filter((feature) => feature.section === section),
  })).filter((group) => group.fields.length > 0);

const getScoreSummary = (score) => {
  if (score >= 85) {
    return {
      title: "Strong trajectory",
      description: "Your current habits point toward a high-performing outcome.",
      accent: "text-emerald-600",
    };
  }

  if (score >= 70) {
    return {
      title: "Solid outlook",
      description: "You are on a healthy path, with room to strengthen consistency.",
      accent: "text-cyan-600",
    };
  }

  if (score >= 55) {
    return {
      title: "Needs a push",
      description: "A few habits are pulling the estimate down more than they should.",
      accent: "text-amber-600",
    };
  }

  return {
    title: "At-risk projection",
    description: "This estimate suggests you would benefit from intervention soon.",
    accent: "text-rose-600",
  };
};

const formatImpact = (impact) =>
  `${impact > 0 ? "+" : ""}${impact.toFixed(1)} pts`;

export default function MarksPredictor({ attendancePercentage = null }) {
  const token = localStorage.getItem("token");
  const [metadata, setMetadata] = useState(null);
  const [form, setForm] = useState({});
  const [result, setResult] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [isMetadataLoading, setIsMetadataLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasEditedAttendance, setHasEditedAttendance] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchMetadata = async () => {
      if (!token) {
        setGeneralError("You need to be signed in to use the marks predictor.");
        setIsMetadataLoading(false);
        return;
      }

      try {
        setIsMetadataLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/api/marks-predictor/metadata`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!isMounted) {
          return;
        }

        setMetadata(response.data);
        setForm(buildInitialForm(response.data.features, attendancePercentage));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setGeneralError(
          error.response?.data?.message ||
            "Could not load predictor metadata right now."
        );
      } finally {
        if (isMounted) {
          setIsMetadataLoading(false);
        }
      }
    };

    fetchMetadata();

    return () => {
      isMounted = false;
    };
  }, [token]);

  useEffect(() => {
    if (!metadata || hasEditedAttendance) {
      return;
    }

    if (typeof attendancePercentage !== "number" || attendancePercentage < 0) {
      return;
    }

    setForm((currentForm) => ({
      ...currentForm,
      attendance_percentage: Number(attendancePercentage.toFixed(1)),
    }));
  }, [attendancePercentage, hasEditedAttendance, metadata]);

  const featureGroups = groupFeatures(metadata?.features);
  const scoreSummary = result
    ? getScoreSummary(result.predictedScore)
    : getScoreSummary(72);

  const handleInputChange = (feature, value) => {
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [feature.name]: "",
    }));
    setGeneralError("");

    if (feature.name === "attendance_percentage") {
      setHasEditedAttendance(true);
    }

    setForm((currentForm) => ({
      ...currentForm,
      [feature.name]: feature.kind === "numeric" ? value : value,
    }));
  };

  const handleReset = () => {
    if (!metadata) {
      return;
    }

    setForm(buildInitialForm(metadata.features, attendancePercentage));
    setFieldErrors({});
    setGeneralError("");
    setResult(null);
    setHasEditedAttendance(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setGeneralError("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/marks-predictor/predict`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(response.data);
    } catch (error) {
      const validationErrors = error.response?.data?.errors || [];

      if (validationErrors.length > 0) {
        const nextErrors = {};
        validationErrors.forEach((item) => {
          nextErrors[item.field] = item.message;
        });
        setFieldErrors(nextErrors);
      }

      setGeneralError(
        error.response?.data?.message ||
          "Prediction failed. Please review the inputs and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isMetadataLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3 text-slate-700">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          <p>Loading predictor model and input schema...</p>
        </div>
      </div>
    );
  }

  if (!metadata) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700 shadow-sm">
        {generalError || "The marks predictor could not be loaded."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.12),_transparent_32%),linear-gradient(135deg,#f8fafc_0%,#ecfeff_45%,#f8fafc_100%)] shadow-sm">
        <div className="grid gap-6 border-b border-slate-200 px-8 py-7 lg:grid-cols-[1.4fr,1fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-3 py-1 text-sm font-medium text-emerald-700">
              <BrainCircuit className="h-4 w-4" />
              Production-ready predictor
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Estimate your exam score from the habits that matter most
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              This version runs inside the main app, validates every field on the
              server, and uses a reproducible 14-factor ridge regression model
              trained from the bundled student habits dataset.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Model Fit
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {metadata?.model?.metrics?.enhanced?.r2}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Cross-validated R²
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                RMSE Gain
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {(
                  metadata?.model?.metrics?.baseline?.rmse -
                  metadata?.model?.metrics?.enhanced?.rmse
                ).toFixed(1)}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                points better than the legacy model
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Inputs Used
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {metadata?.features?.length}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                validated factors per prediction
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 px-8 py-7 lg:grid-cols-[1.2fr,0.8fr]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Prediction Inputs
                </h3>
                <p className="text-sm text-slate-600">
                  Fill in the fields below, then generate a fresh estimate.
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Server-side validation enabled
              </div>
            </div>

            {typeof attendancePercentage === "number" &&
              attendancePercentage >= 0 && (
                <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
                  Your latest attendance rate of{" "}
                  <span className="font-semibold">
                    {attendancePercentage.toFixed(1)}%
                  </span>{" "}
                  has been prefilled and will keep syncing until you edit it.
                </div>
              )}

            {featureGroups.map((group) => (
              <div
                key={group.section}
                className="rounded-3xl border border-slate-200 bg-white/90 p-5"
              >
                <div className="mb-4">
                  <h4 className="text-base font-semibold text-slate-900">
                    {group.section}
                  </h4>
                  <p className="text-sm text-slate-500">
                    Inputs grouped by the part of student life they represent.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {group.fields.map((feature) => (
                    <label key={feature.name} className="block">
                      <span className="mb-2 block text-sm font-medium text-slate-700">
                        {feature.label}
                      </span>

                      {feature.kind === "numeric" ? (
                        <input
                          min={feature.min}
                          max={feature.max}
                          step={feature.step}
                          type="number"
                          value={form[feature.name] ?? ""}
                          onChange={(event) =>
                            handleInputChange(feature, event.target.value)
                          }
                          className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 text-slate-900 outline-none transition ${
                            fieldErrors[feature.name]
                              ? "border-rose-300 focus:border-rose-400"
                              : "border-slate-200 focus:border-cyan-400"
                          }`}
                        />
                      ) : (
                        <select
                          value={form[feature.name] ?? feature.default}
                          onChange={(event) =>
                            handleInputChange(feature, event.target.value)
                          }
                          className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 text-slate-900 outline-none transition ${
                            fieldErrors[feature.name]
                              ? "border-rose-300 focus:border-rose-400"
                              : "border-slate-200 focus:border-cyan-400"
                          }`}
                        >
                          {feature.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )}

                      <span className="mt-2 block text-xs leading-5 text-slate-500">
                        {feature.description}
                        {feature.unit ? ` Unit: ${feature.unit}.` : ""}
                      </span>

                      {fieldErrors[feature.name] && (
                        <span className="mt-2 block text-xs font-medium text-rose-600">
                          {fieldErrors[feature.name]}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {generalError && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {generalError}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Predicting...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Prediction
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Reset Inputs
              </button>
            </div>
          </form>

          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-slate-900 p-3 text-white">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Prediction Summary</p>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {scoreSummary.title}
                  </h3>
                </div>
              </div>

              <p className={`mt-4 text-5xl font-bold ${scoreSummary.accent}`}>
                {result ? result.predictedScore.toFixed(1) : "--"}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {result
                  ? `Likely range ${result.likelyRange.lower.toFixed(1)} to ${result.likelyRange.upper.toFixed(1)}`
                  : "Run the model to see your predicted score range."}
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {scoreSummary.description}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Model Notes
              </h3>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p>
                  The enhanced model uses {metadata?.features?.length} validated
                  factors and lowers cross-validated RMSE from{" "}
                  <span className="font-semibold text-slate-900">
                    {metadata?.model?.metrics?.baseline?.rmse}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-slate-900">
                    {metadata?.model?.metrics?.enhanced?.rmse}
                  </span>
                  .
                </p>
                <p>
                  Predictions are clipped to the 0 to 100 score range and
                  returned with an error band based on model RMSE.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Strongest Drivers
              </h3>
              <div className="mt-4 space-y-3">
                {result?.drivers?.length ? (
                  result.drivers.map((driver) => (
                    <div
                      key={driver.field}
                      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          {driver.label}
                        </p>
                        <p className="text-xs text-slate-500">
                          {driver.direction === "positive"
                            ? "Helping the prediction"
                            : "Pulling the prediction down"}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          driver.direction === "positive"
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }`}
                      >
                        {formatImpact(driver.impact)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    Your biggest positive and negative drivers will appear here
                    after a prediction.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
