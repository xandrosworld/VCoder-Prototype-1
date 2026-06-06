import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { AssessmentAnswers, AssessmentPartId, AuditFinding } from "../api/contracts";
import { AxisBadge } from "../components/common/AxisBadge";
import { PageHeader } from "../components/common/PageHeader";
import { ProgressBar } from "../components/common/ProgressBar";
import { StatusBadge } from "../components/common/StatusBadge";
import {
  p1Questions,
  p2AuditScenario,
  p3RecoveryScenario,
  p4PromptPlanScenario,
  p5VivaQuestions
} from "../data/entryTestItems";
import { useDemo } from "../state/DemoContext";
import type { ArtifactScenario } from "../types/domain";
import { getAssessmentProgress, getPartProgress } from "../utils/assessment";

const orderedParts: AssessmentPartId[] = ["p1", "p2", "p3", "p4", "p5"];
const partLabels: Record<AssessmentPartId, string> = {
  p1: "P1 MCQ",
  p2: "P2 Audit",
  p3: "P3 Recovery",
  p4: "P4 Prompt / Plan",
  p5: "P5 Mini-viva"
};

function buildDemoAnswers(current: AssessmentAnswers, partId: AssessmentPartId): AssessmentAnswers {
  if (partId === "p1") {
    return {
      ...current,
      p1: Object.fromEntries(p1Questions.map((question) => [question.id, question.correctKey]))
    };
  }
  if (partId === "p2") {
    return {
      ...current,
      p2: [
        {
          location: "Database query line",
          type: "SQL injection",
          severity: "critical",
          why: "Untrusted email is interpolated directly into SQL.",
          proposed_fix: "Use a parameterized query and add an injection regression test."
        },
        {
          location: "Password comparison",
          type: "Authentication",
          severity: "critical",
          why: "The endpoint compares plaintext passwords and may crash when no user exists.",
          proposed_fix: "Handle missing users and verify a password hash using a proven library."
        },
        {
          location: "Token response",
          type: "Secret management",
          severity: "critical",
          why: "A hardcoded live-style token is returned to every successful login.",
          proposed_fix: "Issue a signed short-lived token from server-side configuration and rotate exposed credentials."
        }
      ]
    };
  }
  if (partId === "p3") {
    return {
      ...current,
      p3: {
        triage: "Stop rollout, reproduce the failure, inspect the stack trace and compare the latest AI-generated diff with the last known-good commit.",
        recovery_steps: "Capture logs, add a failing regression test, isolate buildExportRows, apply the smallest fix, then verify staging before rollout.",
        rollback_or_fix_forward: "Rollback first because the change is already failing in a production-like environment and the blast radius is not yet known.",
        rationale: "Rollback restores a known-good state while preserving time to investigate without compounding the incident."
      }
    };
  }
  if (partId === "p4") {
    return {
      ...current,
      p4: {
        plan: "Inspect the existing export route, authorization middleware, data model and tests; propose a small file-level plan before editing.",
        scoped_prompt: "Add export of the authenticated user's own records only. Preserve public contracts and summarize the diff before final changes.",
        constraints: "Reuse existing patterns, do not add dependencies, do not read .env, and do not expose other users' data.",
        acceptance_criteria: "Authorized users receive their own export; unauthorized access is rejected; empty data works; regression tests pass.",
        off_limits: "Authentication contracts, database migrations, unrelated routes, secrets and deployment configuration."
      }
    };
  }
  return {
    ...current,
    p5: {
      "p5-1": "String interpolation allows attacker-controlled input to change the SQL command. Use parameterized queries and test malicious input.",
      "p5-2": "Write tests before accepting behavior changes, security-sensitive code and known bug fixes so the review has executable evidence.",
      "p5-3": "Guardrails belong at the tool boundary: least-privilege permissions, explicit approval for destructive actions, validation, audit logs and fail-closed behavior."
    }
  };
}

export function EntryTestPartPage() {
  const params = useParams();
  const partId = (params.partId ?? "p1") as AssessmentPartId;
  const navigate = useNavigate();
  const {
    assessment,
    assessmentAnswers,
    assessmentBusy,
    assessmentError,
    replaceAssessmentAnswers,
    setArtifactAnswer,
    setP1Answer,
    setP2Finding,
    setP5Answer,
    startAssessment,
    submitEntryTest
  } = useDemo();
  const [showValidation, setShowValidation] = useState(false);

  const scenario = useMemo<ArtifactScenario | undefined>(() => {
    if (partId === "p2") return p2AuditScenario;
    if (partId === "p3") return p3RecoveryScenario;
    if (partId === "p4") return p4PromptPlanScenario;
    return undefined;
  }, [partId]);

  const validPart = orderedParts.includes(partId);
  const partProgress = validPart ? getPartProgress(assessmentAnswers, partId) : null;
  const overallProgress = getAssessmentProgress(assessmentAnswers);
  const partIndex = orderedParts.indexOf(partId);

  useEffect(() => {
    if (!assessment.assessmentId && validPart) void startAssessment();
  }, [assessment.assessmentId, startAssessment, validPart]);

  function fillDemoAnswer() {
    replaceAssessmentAnswers(buildDemoAnswers(assessmentAnswers, partId));
    setShowValidation(false);
  }

  function continueToNext() {
    if (!partProgress?.complete) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);
    const nextPart = orderedParts[partIndex + 1];
    navigate(nextPart ? `/entry-test/${nextPart}` : "/entry-test");
  }

  async function submitAndScore() {
    if (!overallProgress.complete) {
      setShowValidation(true);
      return;
    }
    const submitted = await submitEntryTest();
    if (submitted) navigate("/scoring");
  }

  if (!validPart) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
        <h1 className="font-bold text-amber-950">Unknown assessment part</h1>
        <Link to="/entry-test" className="mt-3 inline-flex font-semibold text-blue-700">Return to overview</Link>
      </div>
    );
  }

  const headerActions = (
    <>
      <StatusBadge status={partProgress?.complete ? "valid" : "warning"} label={`${partProgress?.completed}/${partProgress?.total} complete`} />
      <button onClick={fillDemoAnswer} className="inline-flex items-center gap-2 rounded border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
        <Sparkles size={16} /> Use demo answer
      </button>
    </>
  );

  return (
    <div>
      <PageHeader title={partLabels[partId]} eyebrow={`Entry test - part ${partIndex + 1} of 5`} actions={headerActions}>
        Answers are saved locally as you type. Reloading or moving between parts does not discard progress.
      </PageHeader>

      <div className="mb-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase text-slate-500">
          <span>Assessment progress</span>
          <span>{overallProgress.completedParts}/5 parts</span>
        </div>
        <ProgressBar value={(overallProgress.completedParts / 5) * 100} tone={overallProgress.complete ? "green" : "blue"} />
      </div>

      {assessmentError ? <p role="alert" className="mb-4 rounded border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">{assessmentError}</p> : null}
      {showValidation && partProgress && !partProgress.complete ? (
        <p role="alert" className="mb-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">{partProgress.message}</p>
      ) : null}

      {partId === "p1" ? (
        <div className="space-y-4">
          {p1Questions.map((question, index) => (
            <fieldset key={question.id} className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <legend className="sr-only">Question {index + 1}</legend>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge label={`Question ${index + 1}`} />
                <AxisBadge axis={question.axis} />
                <StatusBadge label={`Difficulty ${question.difficulty}`} />
              </div>
              <p className="mt-3 font-semibold text-slate-950">{question.stem}</p>
              {question.codeBlock ? <pre className="mt-3 overflow-x-auto rounded bg-slate-950 p-3 text-sm text-slate-100">{question.codeBlock}</pre> : null}
              <div className="mt-3 grid gap-2">
                {question.options.map((option) => (
                  <label key={option.key} className={`cursor-pointer rounded border p-3 text-sm ${assessmentAnswers.p1[question.id] === option.key ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-slate-50"}`}>
                    <input
                      className="mr-2"
                      type="radio"
                      name={question.id}
                      checked={assessmentAnswers.p1[question.id] === option.key}
                      onChange={() => setP1Answer(question.id, option.key)}
                    />
                    <span className="font-bold">{option.key}.</span> {option.text}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      ) : null}

      {partId === "p2" ? (
        <div className="min-w-0 grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]">
          <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <AxisBadge axis={p2AuditScenario.axis} />
              <StatusBadge label={`Difficulty ${p2AuditScenario.difficulty}`} />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">{p2AuditScenario.scenario}</p>
            <pre className="mt-4 overflow-x-auto rounded bg-slate-950 p-4 text-sm text-slate-100">{p2AuditScenario.codeBlock}</pre>
          </div>
          <div className="min-w-0 space-y-4">
            {assessmentAnswers.p2.map((finding, findingIndex) => (
              <div key={findingIndex} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="font-bold text-slate-950">Finding {findingIndex + 1}</h2>
                <div className="mt-3 grid gap-3">
                  {(p2AuditScenario.answerFields as Array<keyof AuditFinding>).map((field) => (
                    <label key={field} className="block">
                      <span className="text-xs font-bold uppercase text-slate-500">{field.replace(/_/g, " ")}</span>
                      <textarea
                        value={finding[field]}
                        onChange={(event) => setP2Finding(findingIndex, field, event.target.value)}
                        className="mt-1 min-h-16 w-full rounded border border-slate-300 p-2 text-sm"
                        placeholder={`Enter ${field.replace(/_/g, " ")}`}
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {(partId === "p3" || partId === "p4") && scenario ? (
        <div className="min-w-0 grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <AxisBadge axis={scenario.axis} />
              <StatusBadge label={`Difficulty ${scenario.difficulty}`} />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">{scenario.scenario}</p>
            {scenario.taskBrief ? <p className="mt-4 rounded bg-amber-50 p-3 text-sm font-semibold text-amber-900">{scenario.taskBrief}</p> : null}
            {scenario.stackTrace ? <pre className="mt-4 overflow-x-auto rounded bg-slate-950 p-4 text-sm text-slate-100">{scenario.stackTrace}</pre> : null}
          </div>
          <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="font-bold text-slate-950">Learner answer</h2>
            <div className="mt-3 space-y-3">
              {scenario.answerFields.map((field) => (
                <label key={field} className="block">
                  <span className="text-xs font-bold uppercase text-slate-500">{field.replace(/_/g, " ")}</span>
                  <textarea
                    value={assessmentAnswers[partId][field] ?? ""}
                    onChange={(event) => setArtifactAnswer(partId, field, event.target.value)}
                    className="mt-1 min-h-24 w-full rounded border border-slate-300 p-2 text-sm"
                  />
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500">Judge rubric ref: {scenario.rubricRef}</p>
          </div>
        </div>
      ) : null}

      {partId === "p5" ? (
        <div className="space-y-4">
          {p5VivaQuestions.map((question) => (
            <div key={question.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <AxisBadge axis={question.axis} />
              <p className="mt-3 font-semibold text-slate-950">{question.prompt}</p>
              <textarea
                value={assessmentAnswers.p5[question.id] ?? ""}
                onChange={(event) => setP5Answer(question.id, event.target.value)}
                className="mt-3 min-h-28 w-full rounded border border-slate-300 p-3 text-sm"
                placeholder="Write a concise answer with reasoning."
              />
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={() => navigate(partIndex === 0 ? "/entry-test" : `/entry-test/${orderedParts[partIndex - 1]}`)}
          className="inline-flex items-center justify-center gap-2 rounded border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft size={17} /> {partIndex === 0 ? "Overview" : `Back to ${partLabels[orderedParts[partIndex - 1]]}`}
        </button>
        {partId === "p5" ? (
          <button
            disabled={assessmentBusy}
            onClick={() => void submitAndScore()}
            className="inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {assessmentBusy ? "Submitting..." : "Submit Entry Test"} <CheckCircle2 size={17} />
          </button>
        ) : (
          <button
            onClick={continueToNext}
            className="inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"
          >
            Continue to {partLabels[orderedParts[partIndex + 1]]} <ArrowRight size={17} />
          </button>
        )}
      </div>
    </div>
  );
}
