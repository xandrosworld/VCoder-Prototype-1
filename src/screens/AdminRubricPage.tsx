import { PageHeader } from "../components/common/PageHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { groundTruthExamples } from "../data/groundTruth";
import { rubric } from "../data/rubric";

export function AdminRubricPage() {
  return (
    <div>
      <PageHeader title="Admin Rubric & Ground-truth" eyebrow="Rubric config preview">
        Shows axis weights, pass threshold, score-to-level mapping, sample anchors, gold labels, agreement status, and confidence/abstain note.
      </PageHeader>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-bold text-slate-950">Axis weights</h2>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            {rubric.axisWeights.map((item) => <p key={item.axis}>Axis {item.axis}: {item.label} - {item.weight}%</p>)}
          </div>
          <div className="mt-4"><StatusBadge status="valid" label={`Pass threshold ${rubric.passThreshold}%`} /></div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-bold text-slate-950">Score-to-level mapping</h2>
          <div className="mt-3 grid gap-2">
            {rubric.scoreToLevel.map((item) => <p key={item.range} className="rounded bg-slate-50 p-2 text-sm">{item.range}: {item.level} {item.label}</p>)}
          </div>
        </div>
      </div>
      <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="font-bold text-slate-950">Sample anchors</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {rubric.anchors.map((anchor) => <div key={`${anchor.axis}-${anchor.level}`} className="rounded bg-slate-50 p-3 text-sm">Axis {anchor.axis} {anchor.level}: {anchor.text}</div>)}
        </div>
      </div>
      <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="font-bold text-slate-950">Sample gold labels</h2>
        <div className="mt-3 grid gap-3">
          {groundTruthExamples.map((example) => (
            <div key={example.id} className="rounded border border-slate-200 bg-slate-50 p-3 text-sm">
              <p className="font-bold text-slate-950">{example.id} - {example.item} - {example.goldLevel}</p>
              <p className="mt-1 text-slate-600">{example.studentArtifact}</p>
              <p className="mt-1 text-emerald-700">{example.agreementStatus}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-600">{rubric.confidenceNote}</p>
      </div>
    </div>
  );
}
