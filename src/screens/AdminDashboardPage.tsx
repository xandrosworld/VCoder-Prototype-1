import { Link } from "react-router-dom";
import { MetricCard } from "../components/common/MetricCard";
import { PageHeader } from "../components/common/PageHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { itemBankItems } from "../data/validation";
import { groundTruthExamples } from "../data/groundTruth";
import { learners } from "../data/learners";
import { learningNodes } from "../data/learningNodes";

export function AdminDashboardPage() {
  return (
    <div>
      <PageHeader title="Admin Dashboard" eyebrow="Admin overview">
        Content, item bank, rubric, ground-truth, gate config, seed validation, and demo reset controls.
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-5">
        <MetricCard label="Learners" value={learners.length} />
        <MetricCard label="Content nodes" value={learningNodes.length} />
        <MetricCard label="Item bank items" value={itemBankItems.length} />
        <MetricCard label="Gate exams" value={1} />
        <MetricCard label="Ground-truth coverage" value={`${groundTruthExamples.length} examples`} />
      </div>
      <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <StatusBadge status="warning" label="Validation warnings" />
        <p className="mt-2 text-sm text-amber-900">Prototype gaps are intentionally shown: no backend persistence, no real LLM judge, no telemetry, no human review queue.</p>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Link to="/admin/authoring" className="rounded-lg border border-slate-200 bg-white p-4 font-bold text-slate-950 shadow-sm hover:bg-blue-50">Content Authoring</Link>
        <Link to="/admin/item-bank" className="rounded-lg border border-slate-200 bg-white p-4 font-bold text-slate-950 shadow-sm hover:bg-blue-50">Item Bank</Link>
        <Link to="/admin/rubric" className="rounded-lg border border-slate-200 bg-white p-4 font-bold text-slate-950 shadow-sm hover:bg-blue-50">Rubric & Ground-truth</Link>
        <Link to="/admin/gate-config" className="rounded-lg border border-slate-200 bg-white p-4 font-bold text-slate-950 shadow-sm hover:bg-blue-50">Gate Exam Config</Link>
      </div>
    </div>
  );
}
