import { ArrowRight, CheckCircle2, FileCode2, MessageSquareText, RotateCcw, Send } from "lucide-react";
import { useMemo, useState } from "react";
import entryTest from "../data/entryTest.json";
import { Button, Panel, StatusPill } from "./ui";

type Step = 0 | 1 | 2 | 3 | 4;

const stepLabels = ["P1 MCQ", "P2 Code Audit", "P3 Recovery", "P4 Prompt / Plan", "P5 Mini-viva"];

export function EntryTest({ onSubmit }: { onSubmit: () => void }) {
  const [step, setStep] = useState<Step>(0);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, string>>({});
  const [auditFinding, setAuditFinding] = useState("Line 2: high severity - add ownership check using req.user.id before returning project data.");
  const [recoveryChoice, setRecoveryChoice] = useState(entryTest.recovery.choices[0]);
  const [promptPlan, setPromptPlan] = useState(
    "Context files: src/auth/requireAdmin.ts and tests/auth/requireAdmin.test.ts\nConstraints: preserve route contracts and do not broaden admin access\nAcceptance criteria: expired or missing session returns 401/403 without 500\nPlan: read middleware, write regression test, patch null guard, run targeted tests\nVerification: npm test -- requireAdmin"
  );
  const [viva, setViva] = useState<Record<number, string>>({
    0: "Trust only after reading the diff, checking the requirement, and running the relevant verification.",
    1: "Unit tests check deterministic code paths; evals measure AI output quality and regression behavior.",
    2: "The engineer owns it because AI output is a tool-assisted artifact, not an accountable reviewer."
  });

  const mcqCount = entryTest.mcq.length;
  const answeredMcq = Object.keys(mcqAnswers).length;
  const canContinue = useMemo(() => {
    if (step === 0) return answeredMcq >= 5;
    if (step === 1) return auditFinding.trim().length > 40;
    if (step === 2) return Boolean(recoveryChoice);
    if (step === 3) return promptPlan.trim().length > 80;
    return Object.values(viva).filter((answer) => answer.trim().length > 20).length >= 2;
  }, [answeredMcq, auditFinding, promptPlan, recoveryChoice, step, viva]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <StatusPill tone="info">F1 Entry Test · simulated scoring after submit</StatusPill>
          <h1 className="mt-3 text-3xl font-black text-ink">Entry Test P1-P5</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-graphite">
            A compact 30-60 minute assessment with structured artifacts for AI Direction, Output Evaluation, Recovery,
            Engineering Foundations, and AI Product Architecture.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {stepLabels.map((label, index) => (
            <button
              key={label}
              onClick={() => setStep(index as Step)}
              className={`focus-ring rounded-md px-3 py-2 text-xs font-bold ${step === index ? "bg-teal text-white" : "bg-white text-graphite"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {step === 0 && (
        <Panel>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-ink">P1 MCQ phân loại</h2>
            <StatusPill tone={answeredMcq >= 5 ? "good" : "warn"}>
              {answeredMcq}/{mcqCount} answered
            </StatusPill>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {entryTest.mcq.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 p-4">
                <p className="text-sm font-bold text-ink">{item.question}</p>
                <div className="mt-3 space-y-2">
                  {item.options.map((option) => (
                    <label key={option} className="flex cursor-pointer gap-3 rounded-md border border-slate-200 p-3 text-sm hover:bg-mist">
                      <input
                        type="radio"
                        name={item.id}
                        checked={mcqAnswers[item.id] === option}
                        onChange={() => setMcqAnswers((answers) => ({ ...answers, [item.id]: option }))}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {step === 1 && (
        <Panel>
          <div className="flex items-center gap-3">
            <FileCode2 className="text-teal" />
            <h2 className="text-xl font-bold text-ink">{entryTest.audit.title}</h2>
          </div>
          <p className="mt-2 text-sm text-graphite">{entryTest.audit.prompt}</p>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <pre className="overflow-auto rounded-lg bg-ink p-4 text-sm leading-6 text-slate-100">{entryTest.audit.code}</pre>
            <div>
              <label className="text-sm font-bold text-ink">Finding template: location · severity · fix</label>
              <textarea
                className="focus-ring mt-2 min-h-64 w-full rounded-md border border-slate-300 p-3 text-sm"
                value={auditFinding}
                onChange={(event) => setAuditFinding(event.target.value)}
              />
              <div className="mt-3 space-y-2">
                {entryTest.audit.expectedFindings.map((finding) => (
                  <p key={finding} className="text-xs text-graphite">
                    Ground-truth anchor for demo: {finding}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      )}

      {step === 2 && (
        <Panel>
          <div className="flex items-center gap-3">
            <RotateCcw className="text-teal" />
            <h2 className="text-xl font-bold text-ink">{entryTest.recovery.title}</h2>
          </div>
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">{entryTest.recovery.scenario}</p>
          <div className="mt-5 grid gap-3">
            {entryTest.recovery.choices.map((choice) => (
              <label key={choice} className="flex cursor-pointer gap-3 rounded-md border border-slate-200 p-4 hover:bg-mist">
                <input type="radio" checked={recoveryChoice === choice} onChange={() => setRecoveryChoice(choice)} />
                <span className="text-sm">{choice}</span>
              </label>
            ))}
          </div>
        </Panel>
      )}

      {step === 3 && (
        <Panel>
          <div className="flex items-center gap-3">
            <MessageSquareText className="text-teal" />
            <h2 className="text-xl font-bold text-ink">{entryTest.promptPlan.title}</h2>
          </div>
          <p className="mt-2 text-sm text-graphite">{entryTest.promptPlan.task}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {entryTest.promptPlan.template.map((item) => (
              <StatusPill key={item}>{item}</StatusPill>
            ))}
          </div>
          <textarea
            className="focus-ring mt-5 min-h-80 w-full rounded-md border border-slate-300 p-3 text-sm leading-6"
            value={promptPlan}
            onChange={(event) => setPromptPlan(event.target.value)}
          />
        </Panel>
      )}

      {step === 4 && (
        <Panel>
          <h2 className="text-xl font-bold text-ink">{entryTest.viva.title}</h2>
          <div className="mt-5 space-y-4">
            {entryTest.viva.questions.map((question, index) => (
              <label key={question} className="block">
                <span className="text-sm font-bold text-ink">{question}</span>
                <textarea
                  className="focus-ring mt-2 min-h-24 w-full rounded-md border border-slate-300 p-3 text-sm"
                  value={viva[index] ?? ""}
                  onChange={(event) => setViva((answers) => ({ ...answers, [index]: event.target.value }))}
                />
              </label>
            ))}
          </div>
        </Panel>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-graphite">
          Prototype note: answers are captured locally in component state; no backend or real LLM judge is called.
        </p>
        {step < 4 ? (
          <Button disabled={!canContinue} onClick={() => setStep((step + 1) as Step)}>
            Continue <ArrowRight size={18} />
          </Button>
        ) : (
          <Button disabled={!canContinue} onClick={onSubmit}>
            Submit for simulated AI scoring <Send size={18} />
          </Button>
        )}
      </div>
      {canContinue && (
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
          <CheckCircle2 size={18} /> Current section has enough structured evidence for the demo.
        </div>
      )}
    </div>
  );
}
