import { Link } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { StatusBadge } from "../components/common/StatusBadge";

const parts = [
  ["P1", "MCQ Test", "8 deterministic MCQ questions covering all axes."],
  ["P2", "Code Audit", "Audit AI-generated login code before accepting a PR."],
  ["P3", "Recovery / Debug", "Triage a stack trace after accepting AI changes."],
  ["P4", "Prompt / Plan", "Scope the Vietnamese export-data task for an AI coding agent."],
  ["P5", "Mini-viva", "Explain security, testing, and agent guardrails."]
];

export function EntryTestOverview() {
  return (
    <div>
      <PageHeader title="Entry Test Overview" eyebrow="F1 - 30 to 60 minute intake">
        The entry test does not pass or fail the learner. It produces structured evidence for a simulated AI-Ready Profile in this frontend prototype.
      </PageHeader>
      <div className="mb-4">
        <StatusBadge status="warning" label="Prototype demo - scoring is simulated" />
      </div>
      <div className="grid gap-4">
        {parts.map(([id, title, text]) => (
          <div key={id} className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-blue-700">{id}</p>
              <h2 className="text-lg font-bold text-slate-950">{title}</h2>
              <p className="mt-1 text-sm text-slate-600">{text}</p>
            </div>
            <Link to={`/entry-test/${id.toLowerCase()}`} className="rounded bg-blue-600 px-4 py-2 text-center text-sm font-bold text-white hover:bg-blue-700">
              Open {id}
            </Link>
          </div>
        ))}
      </div>
      <Link to="/entry-test/p1" className="mt-6 inline-flex rounded bg-slate-950 px-4 py-3 text-sm font-bold text-white">
        Begin P1
      </Link>
    </div>
  );
}
