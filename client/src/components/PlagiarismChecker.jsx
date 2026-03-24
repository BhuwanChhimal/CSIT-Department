import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  AlertTriangle,
  FileText,
  LoaderCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5002";

const riskStyles = {
  high: "bg-rose-100 text-rose-700 border-rose-200",
  medium: "bg-amber-100 text-amber-800 border-amber-200",
  review: "bg-sky-100 text-sky-700 border-sky-200",
  low: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const formatPercent = (value) => `${Number(value).toFixed(1)}%`;

const MetricPill = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
    <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
  </div>
);

const PairMetric = ({ label, value }) => (
  <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</p>
    <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
  </div>
);

export default function PlagiarismChecker({ assignments = [] }) {
  const token = localStorage.getItem("token");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
  const [report, setReport] = useState(null);
  const [reportError, setReportError] = useState("");
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [manualForm, setManualForm] = useState({
    sourceText: "",
    referenceText: "",
    assignmentPromptText: "",
  });
  const [manualErrors, setManualErrors] = useState({});
  const [manualResult, setManualResult] = useState(null);
  const [manualError, setManualError] = useState("");
  const [isManualLoading, setIsManualLoading] = useState(false);

  useEffect(() => {
    if (!assignments.length || selectedAssignmentId) {
      return;
    }

    setSelectedAssignmentId(assignments[0]._id);
  }, [assignments, selectedAssignmentId]);

  useEffect(() => {
    if (!selectedAssignmentId || !token) {
      return;
    }

    const fetchReport = async () => {
      setIsReportLoading(true);
      setReportError("");

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/plagiarism/assignments/${selectedAssignmentId}/report`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReport(response.data);
      } catch (error) {
        setReportError(
          error.response?.data?.message ||
            "Unable to load the plagiarism report for this assignment."
        );
        setReport(null);
      } finally {
        setIsReportLoading(false);
      }
    };

    fetchReport();
  }, [selectedAssignmentId, token]);

  const refreshReport = async () => {
    if (!selectedAssignmentId || !token) {
      return;
    }

    setIsReportLoading(true);
    setReportError("");

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/plagiarism/assignments/${selectedAssignmentId}/report`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReport(response.data);
    } catch (error) {
      setReportError(
        error.response?.data?.message ||
          "Unable to refresh the plagiarism report right now."
      );
    } finally {
      setIsReportLoading(false);
    }
  };

  const handleManualChange = (field, value) => {
    setManualForm((current) => ({ ...current, [field]: value }));
    setManualErrors((current) => ({ ...current, [field]: "" }));
    setManualError("");
  };

  const handleManualCompare = async (event) => {
    event.preventDefault();
    setIsManualLoading(true);
    setManualErrors({});
    setManualError("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/plagiarism/compare`,
        manualForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setManualResult(response.data);
    } catch (error) {
      const validationErrors = error.response?.data?.errors || [];
      if (validationErrors.length > 0) {
        const nextErrors = {};
        validationErrors.forEach((item) => {
          nextErrors[item.field] = item.message;
        });
        setManualErrors(nextErrors);
      }

      setManualError(
        error.response?.data?.message ||
          "Unable to compare the texts right now."
      );
      setManualResult(null);
    } finally {
      setIsManualLoading(false);
    }
  };

  const selectedAssignment = useMemo(
    () => assignments.find((assignment) => assignment._id === selectedAssignmentId),
    [assignments, selectedAssignmentId]
  );
  const topPairs = report?.pairs?.slice(0, 8) || [];
  const skippedSubmissions =
    report?.submissions?.filter(
      (submission) => submission.extraction.status !== "ready"
    ) || [];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.16),_transparent_30%),linear-gradient(140deg,#fffdf5_0%,#f8fafc_42%,#eef2ff_100%)] shadow-sm">
        <div className="grid gap-6 border-b border-slate-200 px-8 py-7 lg:grid-cols-[1.3fr,1fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-sm font-medium text-amber-700">
              <ShieldCheck className="h-4 w-4" />
              Production-ready plagiarism analysis
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Review suspicious overlap across real student submissions
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              This checker analyzes uploaded submissions inside the main app,
              extracts text from supported files, ignores matching assignment prompt
              language, and ranks student pairs with evidence-backed similarity
              signals instead of a single opaque score.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
            <MetricPill
              label="Assignments Ready"
              value={assignments.length}
            />
            <MetricPill
              label="Prompt Filtering"
              value="Enabled"
            />
            <MetricPill
              label="Manual Compare"
              value="Included"
            />
          </div>
        </div>

        <div className="grid gap-6 px-8 py-7 lg:grid-cols-[1.25fr,0.75fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Assignment Report
                  </h3>
                  <p className="text-sm text-slate-600">
                    Select an assignment to compare all supported student submissions.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={refreshReport}
                  disabled={!selectedAssignmentId || isReportLoading}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isReportLoading ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Refresh
                </button>
              </div>

              {assignments.length ? (
                <div className="mt-5">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Assignment
                  </label>
                  <select
                    value={selectedAssignmentId}
                    onChange={(event) => setSelectedAssignmentId(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400"
                  >
                    {assignments.map((assignment) => (
                      <option key={assignment._id} value={assignment._id}>
                        {assignment.title} · {assignment.subject}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                  Upload at least one assignment with submissions to run a plagiarism report.
                </div>
              )}

              {selectedAssignment && (
                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">
                    {selectedAssignment.title}
                  </span>{" "}
                  from {selectedAssignment.subject}.
                </div>
              )}

              {reportError && (
                <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {reportError}
                </div>
              )}

              {isReportLoading ? (
                <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-700">
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                  Building the plagiarism report...
                </div>
              ) : report ? (
                <div className="mt-6 space-y-5">
                  <div className="grid gap-4 md:grid-cols-4">
                    <MetricPill
                      label="Submissions"
                      value={report.assignment.submissionCount}
                    />
                    <MetricPill
                      label="Analyzed"
                      value={report.assignment.analyzedSubmissionCount}
                    />
                    <MetricPill
                      label="Flagged Pairs"
                      value={report.summary.flaggedPairsCount}
                    />
                    <MetricPill
                      label="Highest Match"
                      value={formatPercent(report.summary.highestSimilarity || 0)}
                    />
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-wrap items-center gap-3">
                      {Object.entries(report.summary.riskBreakdown).map(([risk, count]) => (
                        <span
                          key={risk}
                          className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                            riskStyles[risk]
                          }`}
                        >
                          {risk}: {count}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-sm text-slate-600">
                      Prompt filtering is{" "}
                      <span className="font-semibold text-slate-900">
                        {report.prompt.usedForFiltering ? "active" : "not available"}
                      </span>
                      . Matching phrases that come directly from the assignment brief are
                      discounted before scoring pairs.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {topPairs.length ? (
                      topPairs.map((pair) => (
                        <article
                          key={pair.pairId}
                          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                                    riskStyles[pair.riskLevel]
                                  }`}
                                >
                                  {pair.riskLevel} risk
                                </span>
                                <span className="text-sm font-semibold text-slate-900">
                                  {formatPercent(pair.similarityScore)}
                                </span>
                              </div>
                              <h4 className="mt-3 text-lg font-semibold text-slate-900">
                                {pair.left.student.name} vs {pair.right.student.name}
                              </h4>
                              <p className="mt-1 text-sm text-slate-500">
                                {pair.left.fileName} compared with {pair.right.fileName}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <a
                                href={`${API_BASE_URL}/${pair.left.fileUrl}`}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                              >
                                Open Left
                              </a>
                              <a
                                href={`${API_BASE_URL}/${pair.right.fileUrl}`}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                              >
                                Open Right
                              </a>
                            </div>
                          </div>

                          <div className="mt-4 grid gap-3 md:grid-cols-5">
                            <PairMetric
                              label="Containment"
                              value={pair.metrics.shingleContainment}
                            />
                            <PairMetric
                              label="Fingerprint"
                              value={pair.metrics.fingerprintJaccard}
                            />
                            <PairMetric
                              label="Lexical Cosine"
                              value={pair.metrics.lexicalCosine}
                            />
                            <PairMetric
                              label="Shared Sentences"
                              value={pair.metrics.sharedSentences}
                            />
                            <PairMetric
                              label="Longest Phrase"
                              value={`${pair.metrics.longestSharedPhraseWords} words`}
                            />
                          </div>

                          <div className="mt-4">
                            <p className="text-sm font-medium text-slate-700">
                              Strongest shared phrases
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {pair.evidencePhrases.length ? (
                                pair.evidencePhrases.map((phrase) => (
                                  <span
                                    key={`${pair.pairId}-${phrase.phrase}`}
                                    className="rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900"
                                  >
                                    “{phrase.phrase}”
                                  </span>
                                ))
                              ) : (
                                <span className="text-sm text-slate-500">
                                  No strong shared phrases were preserved after prompt filtering.
                                </span>
                              )}
                            </div>
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-5 text-sm text-slate-600">
                        No comparable submission pairs were found yet. This can happen when
                        there are fewer than two extractable submissions.
                      </div>
                    )}
                  </div>

                  {skippedSubmissions.length > 0 && (
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-center gap-2 text-slate-900">
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                        <h4 className="text-lg font-semibold">
                          Submissions Not Fully Analyzed
                        </h4>
                      </div>
                      <div className="mt-4 space-y-3">
                        {skippedSubmissions.map((submission) => (
                          <div
                            key={submission.submissionId}
                            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                          >
                            <p className="font-medium text-slate-900">
                              {submission.student.name} · {submission.fileName}
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                              {submission.extraction.reason ||
                                "This file could not be analyzed."}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-slate-900 p-3 text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Manual Compare
                  </h3>
                  <p className="text-sm text-slate-600">
                    Compare any two texts directly when you need a quick check.
                  </p>
                </div>
              </div>

              <form className="mt-5 space-y-4" onSubmit={handleManualCompare}>
                {[
                  {
                    field: "sourceText",
                    label: "Source Text",
                    placeholder: "Paste the student text you want to inspect...",
                  },
                  {
                    field: "referenceText",
                    label: "Reference Text",
                    placeholder: "Paste the second text to compare against...",
                  },
                  {
                    field: "assignmentPromptText",
                    label: "Assignment Prompt (Optional)",
                    placeholder:
                      "Paste the assignment prompt to discount copied question wording...",
                  },
                ].map((input) => (
                  <label key={input.field} className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      {input.label}
                    </span>
                    <textarea
                      rows={input.field === "assignmentPromptText" ? 4 : 6}
                      value={manualForm[input.field]}
                      onChange={(event) =>
                        handleManualChange(input.field, event.target.value)
                      }
                      placeholder={input.placeholder}
                      className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 text-slate-900 outline-none transition ${
                        manualErrors[input.field]
                          ? "border-rose-300 focus:border-rose-400"
                          : "border-slate-200 focus:border-amber-400"
                      }`}
                    />
                    {manualErrors[input.field] && (
                      <span className="mt-2 block text-xs font-medium text-rose-600">
                        {manualErrors[input.field]}
                      </span>
                    )}
                  </label>
                ))}

                {manualError && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {manualError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isManualLoading}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isManualLoading ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Compare Texts
                </button>
              </form>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Manual Result
              </h3>

              {manualResult ? (
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                        riskStyles[manualResult.riskLevel]
                      }`}
                    >
                      {manualResult.riskLevel} risk
                    </span>
                    <span className="text-3xl font-bold text-slate-900">
                      {formatPercent(manualResult.similarityScore)}
                    </span>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <PairMetric
                      label="Containment"
                      value={manualResult.metrics.shingleContainment}
                    />
                    <PairMetric
                      label="Fingerprint"
                      value={manualResult.metrics.fingerprintJaccard}
                    />
                    <PairMetric
                      label="Lexical Cosine"
                      value={manualResult.metrics.lexicalCosine}
                    />
                    <PairMetric
                      label="Longest Phrase"
                      value={`${manualResult.metrics.longestSharedPhraseWords} words`}
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Evidence phrases
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {manualResult.evidencePhrases.length ? (
                        manualResult.evidencePhrases.map((phrase) => (
                          <span
                            key={phrase.phrase}
                            className="rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900"
                          >
                            “{phrase.phrase}”
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-slate-500">
                          No strong repeated phrases survived prompt filtering.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                  Run a manual comparison to see the similarity score, risk level,
                  and strongest shared phrases here.
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-slate-900">
                <FileText className="h-5 w-5 text-slate-700" />
                <h3 className="text-lg font-semibold">Supported Inputs</h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Submission reports currently extract text from supported plain-text
                formats, `docx`, and `pdf` files. Files without enough extractable
                text are surfaced separately so they do not silently skew the report.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
