import { CheckCircle2, Circle, Clock3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { useDemo } from "../state/DemoContext";
import type { AssessmentPartId } from "../api/contracts";
import { getAssessmentProgress, getPartProgress } from "../utils/assessment";

const parts = [
  ["p1", "P1", "MCQ Test", "8 deterministic MCQ questions covering all axes."],
  ["p2", "P2", "Code Audit", "Record at least three findings before accepting an AI-generated PR."],
  ["p3", "P3", "Recovery / Debug", "Triage a stack trace and choose rollback or fix-forward."],
  ["p4", "P4", "Prompt / Plan", "Scope the Vietnamese export-data task for an AI coding agent."],
  ["p5", "P5", "Mini-viva", "Explain security, testing, and agent guardrails."]
] satisfies Array<[AssessmentPartId, string, string, string]>;

export function EntryTestOverview() {
  const navigate = useNavigate();
  const { assessment, assessmentAnswers, assessmentBusy, assessmentError, apiMode, startAssessment } = useDemo();
  const overall = getAssessmentProgress(assessmentAnswers);
  const nextPartId = parts.find(([partId]) => !getPartProgress(assessmentAnswers, partId).complete)?.[0] ?? "p5";

  async function openPart(partId: AssessmentPartId) {
    await startAssessment();
    navigate(`/entry-test/${partId}`);
  }

  return (
    <div>
      <PageHeader title="Entry Test Overview" eyebrow="F1 - 30 to 60 minute intake">
        The entry test does not pass or fail the learner. It produces structured evidence for an AI-Ready Profile; this prototype uses the mock API adapter until backend scoring is ready.
      </PageHeader>
      <div className="mb-4 flex flex-wrap gap-2">
        <StatusBadge status={apiMode === "mock" ? "warning" : "valid"} label={`${apiMode === "mock" ? "Mock" : "Real"} API adapter`} />
        <StatusBadge status={assessment.assessmentId ? "valid" : "warning"} label={assessment.assessmentId ? `Assessment ${assessment.status}` : "Assessment not started"} />
        <StatusBadge status={overall.complete ? "valid" : "warning"} label={`${overall.completedParts}/${overall.totalParts} parts complete`} />
      </div>
      {assessmentError ? <p role="alert" className="mb-4 rounded border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">{assessmentError}</p> : null}
      <div data-tour="entry-test-parts" className="grid gap-4">
        {parts.map(([partId, label, title, text]) => {
          const progress = getPartProgress(assessmentAnswers, partId);
          return (
          <div key={partId} className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 gap-3">
              {progress.complete ? <CheckCircle2 className="mt-1 shrink-0 text-emerald-600" size={20} /> : progress.completed > 0 ? <Clock3 className="mt-1 shrink-0 text-amber-600" size={20} /> : <Circle className="mt-1 shrink-0 text-slate-300" size={20} />}
              <div>
              <p className="text-xs font-bold uppercase text-blue-700">{label}</p>
              <h2 className="text-lg font-bold text-slate-950">{title}</h2>
              <p className="mt-1 text-sm text-slate-600">{text}</p>
              <p className="mt-2 text-xs font-semibold text-slate-500">{progress.completed}/{progress.total} complete</p>
              </div>
            </div>
            <button disabled={assessmentBusy} onClick={() => void openPart(partId)} className="rounded bg-blue-600 px-4 py-2 text-center text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
              {progress.completed > 0 ? "Continue" : "Open"} {label}
            </button>
          </div>
        )})}
      </div>
      <button disabled={assessmentBusy} onClick={() => void openPart(nextPartId)} className="mt-6 inline-flex rounded bg-slate-950 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">
        {assessmentBusy
          ? "Starting..."
          : overall.complete
            ? "Review P5 and submit"
            : overall.completedParts > 0
              ? `Resume from ${nextPartId.toUpperCase()}`
              : "Begin P1"}
      </button>
    </div>
  );
}
