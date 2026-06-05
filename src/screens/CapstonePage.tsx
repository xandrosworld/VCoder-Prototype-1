import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { RubricPreview } from "../components/common/RubricPreview";
import { StatusBadge } from "../components/common/StatusBadge";
import { capstones } from "../data/capstones";
import { useDemo } from "../state/DemoContext";

export function CapstonePage() {
  const capstone = capstones[0];
  const { setCapstonePassed } = useDemo();
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<"pass" | "fail" | null>(null);

  function submit() {
    const pass = answer === capstone.strongSample;
    setResult(pass ? "pass" : "fail");
    setCapstonePassed(pass);
  }

  return (
    <div>
      <PageHeader title={capstone.title} eyebrow="Capstone Detail">
        {capstone.scenario}
      </PageHeader>
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-bold text-slate-950">Expected artifact</h2>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {capstone.expectedArtifact.map((item) => <div key={item} className="rounded bg-slate-50 p-2 text-sm font-semibold text-slate-700">{item}</div>)}
          </div>
          <h2 className="mt-5 font-bold text-slate-950">Checklist</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {capstone.checklist.map((item) => <li key={item}>- {item}</li>)}
          </ul>
          <textarea value={answer} onChange={(event) => setAnswer(event.target.value)} className="mt-5 min-h-44 w-full rounded border border-slate-300 p-3 text-sm" placeholder="Submission area" />
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={() => setAnswer(capstone.strongSample)} className="rounded bg-emerald-600 px-3 py-2 text-sm font-bold text-white">Use strong sample answer</button>
            <button onClick={() => setAnswer(capstone.weakSample)} className="rounded bg-amber-500 px-3 py-2 text-sm font-bold text-white">Use weak sample answer</button>
            <button onClick={submit} className="rounded bg-blue-600 px-3 py-2 text-sm font-bold text-white">Submit capstone</button>
          </div>
          {result ? (
            <div className={`mt-4 rounded p-3 text-sm ${result === "pass" ? "bg-emerald-50 text-emerald-900" : "bg-rose-50 text-rose-900"}`}>
              <strong>{result === "pass" ? "Pass - 88%" : "Fail - 57%"}</strong>
              <p className="mt-1">{result === "pass" ? "Gate Exam can unlock once required nodes are complete." : "Feedback: capstone lacks safety evidence and final decision rationale."}</p>
            </div>
          ) : null}
        </div>
        <div className="space-y-4">
          <RubricPreview items={capstone.rubricPreview} />
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <StatusBadge status="warning" label="Simulated scoring" />
            <h3 className="mt-3 font-bold text-slate-950">Evidence generated</h3>
            <ul className="mt-2 space-y-2 text-sm text-slate-600">
              {capstone.targetEvidence.map((item) => <li key={item}>- {item}</li>)}
            </ul>
            <Link to="/gate-exam" className="mt-4 inline-flex rounded bg-slate-950 px-3 py-2 text-sm font-bold text-white">Open Gate Exam</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
