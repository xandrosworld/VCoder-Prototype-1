import { AlertTriangle, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { ProgressBar } from "../components/common/ProgressBar";
import { StatusBadge } from "../components/common/StatusBadge";
import { useDemo } from "../state/DemoContext";
import { simulatedScoringSteps } from "../utils/scoringSimulation";

export function ScoringPage() {
  const [step, setStep] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const navigate = useNavigate();
  const {
    apiMode,
    assessment,
    assessmentBusy,
    assessmentError,
    pollAssessmentStatus,
    retryAssessment
  } = useDemo();

  useEffect(() => {
    if (!assessment.assessmentId || assessment.status === "draft" || assessment.status === "not_started") {
      navigate("/entry-test", { replace: true });
    }
  }, [assessment.assessmentId, assessment.status, navigate]);

  useEffect(() => {
    if (assessment.profileReady) return;
    const timer = window.setInterval(() => setElapsedSeconds((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(timer);
  }, [assessment.profileReady]);

  useEffect(() => {
    if (assessment.status !== "scoring" || assessment.profileReady || assessmentError) return;
    const poll = window.setTimeout(() => void pollAssessmentStatus(), 800);
    return () => window.clearTimeout(poll);
  }, [
    assessment.profileReady,
    assessment.scoredParts,
    assessment.status,
    assessmentError,
    pollAssessmentStatus
  ]);

  useEffect(() => {
    setStep(Math.min(assessment.scoredParts, simulatedScoringSteps.length));
  }, [assessment.scoredParts]);

  useEffect(() => {
    if (!assessment.profileReady) return;
    const timeout = window.setTimeout(() => navigate("/profile"), 700);
    return () => window.clearTimeout(timeout);
  }, [assessment.profileReady, navigate]);

  const progress = assessment.totalParts > 0 ? (assessment.scoredParts / assessment.totalParts) * 100 : 0;
  const timedOut = elapsedSeconds >= 60 && !assessment.profileReady;

  return (
    <div>
      <PageHeader title="Assessment Scoring" eyebrow="F1 -> F2 async scoring">
        The assessment was accepted asynchronously. This page polls scoring status and opens the Profile only after the backend reports that a snapshot is ready.
      </PageHeader>

      <div className="mb-4 flex flex-wrap gap-2">
        <StatusBadge status={apiMode === "mock" ? "warning" : "valid"} label={`${apiMode === "mock" ? "Mock" : "Real"} API`} />
        <StatusBadge status={assessment.profileReady ? "valid" : assessment.status === "partial" ? "error" : "warning"} label={`Status: ${assessment.status}`} />
        <StatusBadge label={`${elapsedSeconds}s elapsed`} />
      </div>

      {assessmentError || timedOut ? (
        <div role="alert" className="mb-5 rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-950">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 shrink-0" size={20} />
            <div>
              <h2 className="font-bold">{timedOut ? "Scoring is taking longer than expected" : "Could not refresh scoring status"}</h2>
              <p className="mt-1 text-sm">{assessmentError ?? "The 60-second demo target was exceeded. The assessment is still preserved."}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  disabled={assessmentBusy}
                  onClick={() => {
                    retryAssessment();
                    setElapsedSeconds(0);
                    void pollAssessmentStatus();
                  }}
                  className="inline-flex items-center gap-2 rounded bg-rose-700 px-3 py-2 text-sm font-bold text-white disabled:opacity-50"
                >
                  <RefreshCw size={16} /> Retry status
                </button>
                <Link to="/entry-test" className="rounded border border-rose-300 px-3 py-2 text-sm font-bold">Back to test</Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mb-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-700">
          <span>Scored parts</span>
          <span>{assessment.scoredParts}/{assessment.totalParts}</span>
        </div>
        <div className="mt-3">
          <ProgressBar value={progress} tone={assessment.profileReady ? "green" : assessment.status === "partial" ? "amber" : "blue"} />
        </div>
        <p className="mt-2 text-xs text-slate-500">Assessment ID: {assessment.assessmentId}</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-4">
          {simulatedScoringSteps.map((label, index) => {
            const done = step > index || assessment.profileReady;
            const active = !assessment.profileReady && step === index;
            return (
              <div key={label} className="flex items-center gap-3 rounded border border-slate-200 bg-slate-50 p-3">
                {done ? <CheckCircle2 className="text-emerald-600" /> : active ? <Loader2 className="animate-spin text-blue-600" /> : <span className="h-6 w-6 rounded-full border border-slate-300" />}
                <span className={`font-semibold ${done || active ? "text-slate-950" : "text-slate-500"}`}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
