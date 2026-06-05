import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AxisBadge } from "../components/common/AxisBadge";
import { PageHeader } from "../components/common/PageHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { p1Questions, p2AuditScenario, p3RecoveryScenario, p4PromptPlanScenario, p5VivaQuestions } from "../data/entryTestItems";
import type { ArtifactScenario } from "../types/domain";

const nextPart: Record<string, string> = {
  p1: "/entry-test/p2",
  p2: "/entry-test/p3",
  p3: "/entry-test/p4",
  p4: "/entry-test/p5",
  p5: "/scoring"
};

export function EntryTestPartPage() {
  const { partId = "p1" } = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Record<string, string>>({});
  const scenario = useMemo<ArtifactScenario | undefined>(() => {
    if (partId === "p2") return p2AuditScenario;
    if (partId === "p3") return p3RecoveryScenario;
    if (partId === "p4") return p4PromptPlanScenario;
    return undefined;
  }, [partId]);

  if (partId === "p1") {
    return (
      <div>
        <PageHeader title="P1 MCQ Test" eyebrow="Entry test">
          Eight deterministic MCQ questions. The answer key is local seed data for this prototype.
        </PageHeader>
        <div className="space-y-4">
          {p1Questions.map((question, index) => (
            <div key={question.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge label={`Question ${index + 1}`} />
                <AxisBadge axis={question.axis} />
                <StatusBadge label={`Difficulty ${question.difficulty}`} />
              </div>
              <p className="mt-3 font-semibold text-slate-950">{question.stem}</p>
              {question.codeBlock ? <pre className="mt-3 overflow-x-auto rounded bg-slate-950 p-3 text-sm text-slate-100">{question.codeBlock}</pre> : null}
              <div className="mt-3 grid gap-2">
                {question.options.map((option) => (
                  <label key={option.key} className={`cursor-pointer rounded border p-3 text-sm ${selected[question.id] === option.key ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-slate-50"}`}>
                    <input className="mr-2" type="radio" name={question.id} checked={selected[question.id] === option.key} onChange={() => setSelected({ ...selected, [question.id]: option.key })} />
                    <span className="font-bold">{option.key}.</span> {option.text}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => navigate(nextPart.p1)} className="mt-6 rounded bg-blue-600 px-4 py-3 text-sm font-bold text-white">Continue to P2</button>
      </div>
    );
  }

  if (partId === "p5") {
    return (
      <div>
        <PageHeader title="P5 Mini-viva Test" eyebrow="Entry test">
          Short answers cross-check security, tests, and AI product architecture reasoning.
        </PageHeader>
        <div className="space-y-4">
          {p5VivaQuestions.map((question) => (
            <div key={question.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <AxisBadge axis={question.axis} />
              <p className="mt-3 font-semibold text-slate-950">{question.prompt}</p>
              <textarea className="mt-3 min-h-28 w-full rounded border border-slate-300 p-3 text-sm" placeholder="Write a concise answer with reasoning." />
            </div>
          ))}
        </div>
        <button onClick={() => navigate("/scoring")} className="mt-6 rounded bg-blue-600 px-4 py-3 text-sm font-bold text-white">Submit Entry Test</button>
      </div>
    );
  }

  if (!scenario) {
    return <Link to="/entry-test">Return to overview</Link>;
  }

  return (
    <div>
      <PageHeader title={scenario.title} eyebrow="Entry test">
        {scenario.scenario}
      </PageHeader>
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <AxisBadge axis={scenario.axis} />
            <StatusBadge label={`Difficulty ${scenario.difficulty}`} />
          </div>
          {scenario.taskBrief ? <p className="mt-4 rounded bg-amber-50 p-3 text-sm font-semibold text-amber-900">{scenario.taskBrief}</p> : null}
          {scenario.codeBlock ? <pre className="mt-4 overflow-x-auto rounded bg-slate-950 p-4 text-sm text-slate-100">{scenario.codeBlock}</pre> : null}
          {scenario.stackTrace ? <pre className="mt-4 overflow-x-auto rounded bg-slate-950 p-4 text-sm text-slate-100">{scenario.stackTrace}</pre> : null}
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-bold text-slate-950">Learner answer template</h2>
          <div className="mt-3 space-y-3">
            {scenario.answerFields.map((field) => (
              <label key={field} className="block">
                <span className="text-xs font-bold uppercase text-slate-500">{field.replace(/_/g, " ")}</span>
                <textarea className="mt-1 min-h-20 w-full rounded border border-slate-300 p-2 text-sm" />
              </label>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">Judge rubric ref: {scenario.rubricRef}</p>
        </div>
      </div>
      <button onClick={() => navigate(nextPart[partId])} className="mt-6 rounded bg-blue-600 px-4 py-3 text-sm font-bold text-white">
        {partId === "p4" ? "Continue to P5" : `Continue to ${partId === "p2" ? "P3" : "P4"}`}
      </button>
    </div>
  );
}
