import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { RubricPreview } from "../components/common/RubricPreview";
import { StatusBadge } from "../components/common/StatusBadge";
import { labs } from "../data/labs";
import { useDemo } from "../state/DemoContext";
import { useLanguage } from "../i18n/LanguageContext";

export function LabPage() {
  const { labId = "lab-audit-review" } = useParams();
  const lab = labs.find((item) => item.id === labId) ?? labs[1];
  const { completeNode } = useDemo();
  const [answer, setAnswer] = useState("");
  const { language, t } = useLanguage();
  const [result, setResult] = useState<"pass" | "fail" | null>(null);

  function submit() {
    const pass = answer === lab.strongSample || answer === t(lab.strongSample);
    setResult(pass ? "pass" : "fail");
    if (pass) completeNode(lab.nodeId);
  }

  useEffect(() => {
    setAnswer((current) => t(current));
  }, [language, t]);

  return (
    <div>
      <PageHeader title={lab.title} eyebrow="Lab / Checkpoint Detail">
        {lab.scenario}
      </PageHeader>
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-bold text-slate-950">Task instructions</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{lab.instructions}</p>
          <div className="mt-4 grid gap-3">
            {lab.answerFields.map((field) => (
              <label key={field}>
                <span className="text-xs font-bold uppercase text-slate-500">{field.replace(/_/g, " ")}</span>
                <input className="mt-1 w-full rounded border border-slate-300 p-2 text-sm" />
              </label>
            ))}
          </div>
          <textarea value={answer} onChange={(event) => setAnswer(event.target.value)} className="mt-4 min-h-40 w-full rounded border border-slate-300 p-3 text-sm" placeholder="Submission area" />
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={() => setAnswer(t(lab.strongSample))} className="rounded bg-emerald-600 px-3 py-2 text-sm font-bold text-white">Use strong sample answer</button>
            <button onClick={() => setAnswer(t(lab.weakSample))} className="rounded bg-amber-500 px-3 py-2 text-sm font-bold text-white">Use weak sample answer</button>
            <button onClick={submit} className="rounded bg-blue-600 px-3 py-2 text-sm font-bold text-white">Submit</button>
          </div>
          {result ? (
            <div className={`mt-4 rounded p-3 text-sm ${result === "pass" ? "bg-emerald-50 text-emerald-900" : "bg-rose-50 text-rose-900"}`}>
              <strong>{result === "pass" ? "Pass - 86%" : "Fail - 54%"}</strong>
              <p className="mt-1">{result === "pass" ? "Evidence meets the 80% prototype threshold." : "Feedback: answer lacks concrete evidence, tests, or guardrails. Review the lesson and retry."}</p>
            </div>
          ) : null}
        </div>
        <div className="space-y-4">
          <RubricPreview items={lab.rubricPreview} />
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <StatusBadge status="valid" label="Pass threshold 80%" />
            <p className="mt-3 text-sm text-slate-600">Target evidence: {lab.targetEvidence}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
