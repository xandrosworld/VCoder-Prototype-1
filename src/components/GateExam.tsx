import { CheckCircle2, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import gateExam from "../data/gateExam.json";
import { evaluateGateExam } from "../domain/demoScoring";
import { Button, Panel, StatusPill } from "./ui";

export function GateExam({ onPassed, onBack }: { onPassed: () => void; onBack: () => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const answerKey = useMemo(() => gateExam.questions.map((question) => question.answer), []);
  const orderedAnswers = gateExam.questions.map((question) => answers[question.id] ?? "");
  const result = evaluateGateExam(answerKey, orderedAnswers);
  const canSubmit = Object.keys(answers).length === gateExam.questions.length;

  function submit() {
    setSubmitted(true);
    if (result.passed) {
      onPassed();
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <StatusPill tone="info">Level Gate Exam · MCQ · pass &gt;= {gateExam.passThreshold}%</StatusPill>
        <h1 className="mt-3 text-3xl font-black text-ink">Gate Exam for {gateExam.level}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-graphite">
          This is a real clickable MCQ gate in the prototype. Score is deterministic from local JSON answer keys.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Panel>
          <div className="space-y-4">
            {gateExam.questions.map((question, index) => (
              <div key={question.id} className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm font-bold text-ink">{index + 1}. {question.question}</p>
                <div className="mt-3 grid gap-2">
                  {question.options.map((option) => (
                    <label key={option} className="flex cursor-pointer gap-3 rounded-md border border-slate-200 p-3 text-sm hover:bg-mist">
                      <input
                        type="radio"
                        name={question.id}
                        checked={answers[question.id] === option}
                        onChange={() => setAnswers((current) => ({ ...current, [question.id]: option }))}
                        disabled={submitted}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <h2 className="text-xl font-bold text-ink">Attempt status</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Answered</span>
                <strong>{Object.keys(answers).length}/{gateExam.questions.length}</strong>
              </div>
              <div className="flex justify-between">
                <span>Pass rule</span>
                <strong>{gateExam.passThreshold}%</strong>
              </div>
              {submitted && (
                <>
                  <div className="flex justify-between">
                    <span>Score</span>
                    <strong>{result.score}%</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.passed ? <CheckCircle2 className="text-emerald-700" /> : <XCircle className="text-red-700" />}
                    <span className="font-bold">{result.passed ? "Passed" : "Not passed"}</span>
                  </div>
                </>
              )}
            </div>
            <div className="mt-5 flex flex-col gap-2">
              {!submitted ? <Button disabled={!canSubmit} onClick={submit}>Submit Gate Exam</Button> : <Button onClick={onBack}>Return to Learning Path</Button>}
              <Button variant="secondary" onClick={onBack}>Back</Button>
            </div>
          </Panel>
          <Panel>
            <p className="text-sm leading-6 text-graphite">
              Demo note: failing below 80% would keep the learner at the current level and suggest review nodes. Passing updates demo state
              used by Profile and Learning Path.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
