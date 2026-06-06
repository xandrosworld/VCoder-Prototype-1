import { AlertCircle, CheckCircle2, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AxisBadge } from "../components/common/AxisBadge";
import { PageHeader } from "../components/common/PageHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { gateExam } from "../data/gateExamItems";
import { useDemo } from "../state/DemoContext";
import { learningNodes } from "../data/learningNodes";
import { canAccessGateExam } from "../utils/gating";
import { scoreGateExamFromSeed } from "../utils/scoringSimulation";

export function GateExamPage() {
  const { completedNodeIds, capstonePassed, setGatePassed } = useDemo();
  const gate = canAccessGateExam(completedNodeIds, capstonePassed);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ReturnType<typeof scoreGateExamFromSeed> | null>(null);
  const [validationError, setValidationError] = useState("");
  const unansweredCount = gateExam.questions.filter((question) => !answers[question.id]).length;

  function fillPassingAnswers() {
    const next: Record<string, string> = {};
    gateExam.questions.forEach((question, index) => {
      next[question.id] = index < 8 ? question.correctKey : "A";
    });
    setAnswers(next);
    setValidationError("");
  }

  function submit() {
    if (unansweredCount > 0) {
      setValidationError(`Answer all questions before submitting. ${unansweredCount} remaining.`);
      return;
    }
    const next = scoreGateExamFromSeed(gateExam, answers);
    setResult(next);
    setGatePassed(next.passed);
    setValidationError("");
  }

  return (
    <div>
      <PageHeader title="Level Gate Exam" eyebrow="FR-06 - MCQ-based gate">
        Locked until required nodes and capstone are complete. Pass threshold is 80%; cooldown is shown but not enforced in this prototype.
      </PageHeader>
      {!gate.unlocked ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
          <StatusBadge status="warning" label="Locked" />
          <p className="mt-3 text-sm text-amber-900">{gate.reason}</p>
          <div className="mt-4 space-y-2">
            {gate.missingNodeIds.map((nodeId) => {
              const node = learningNodes.find((item) => item.id === nodeId);
              return (
                <div key={nodeId} className="flex items-start gap-2 text-sm text-amber-950">
                  <LockKeyhole className="mt-0.5 shrink-0" size={16} />
                  <span>{node?.title ?? nodeId}</span>
                </div>
              );
            })}
            {!gate.capstonePassed ? (
              <div className="flex items-start gap-2 text-sm text-amber-950">
                <LockKeyhole className="mt-0.5 shrink-0" size={16} />
                <span>Level capstone</span>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-sm text-emerald-800">
                <CheckCircle2 className="mt-0.5 shrink-0" size={16} />
                <span>Level capstone passed</span>
              </div>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <Link to="/learning-path" className="rounded bg-slate-950 px-3 py-2 text-sm font-bold text-white">Back to path</Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            <StatusBadge status="valid" label={`${gateExam.numberOfQuestions} questions`} />
            <StatusBadge status="valid" label="Pass >= 80%" />
            {gateExam.focusAxes.map((axis) => <AxisBadge key={axis} axis={axis} />)}
          </div>
          <div className="space-y-4">
            {gateExam.questions.map((question, index) => (
              <div key={question.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap gap-2">
                  <StatusBadge label={`Question ${index + 1}`} />
                  <AxisBadge axis={question.axis} />
                  <StatusBadge label={`Difficulty ${question.difficulty}`} />
                </div>
                <p className="mt-3 font-semibold text-slate-950">{question.stem}</p>
                <div className="mt-3 grid gap-2">
                  {question.options.map((option) => (
                    <label key={option.key} className={`cursor-pointer rounded border p-3 text-sm ${answers[question.id] === option.key ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-slate-50"}`}>
                      <input className="mr-2" type="radio" name={question.id} checked={answers[question.id] === option.key} onChange={() => setAnswers({ ...answers, [question.id]: option.key })} />
                      <span className="font-bold">{option.key}.</span> {option.text}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={fillPassingAnswers} className="rounded bg-emerald-600 px-3 py-2 text-sm font-bold text-white">Use passing sample answers</button>
            <button onClick={submit} className="rounded bg-blue-600 px-3 py-2 text-sm font-bold text-white">Submit Gate Exam</button>
          </div>
          {validationError ? (
            <p role="alert" className="mt-4 flex items-start gap-2 rounded border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
              <AlertCircle className="mt-0.5 shrink-0" size={17} /> {validationError}
            </p>
          ) : null}
        </>
      )}
      {result ? (
        <div className={`mt-5 rounded-lg border p-4 ${result.passed ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
          <h2 className={`font-bold ${result.passed ? "text-emerald-950" : "text-rose-950"}`}>{result.passed ? "Level unlocked" : "Gate Exam failed"}</h2>
          <p className="mt-2 text-sm">Score: {result.score}% ({result.correctCount}/{result.totalCount})</p>
          <p className="mt-1 text-sm">{result.passed ? "Profile progress updates Axis 2 toward L2 and the next learning path state is unlocked." : "Cooldown shown: retry after reviewing recommended nodes. Time is not enforced in the prototype."}</p>
        </div>
      ) : null}
    </div>
  );
}
