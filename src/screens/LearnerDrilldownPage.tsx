import { useParams } from "react-router-dom";
import { RadarProfileChart } from "../components/charts/RadarProfileChart";
import { EvidencePanel } from "../components/common/EvidencePanel";
import { PageHeader } from "../components/common/PageHeader";
import { ProgressBar } from "../components/common/ProgressBar";
import { StatusBadge } from "../components/common/StatusBadge";
import { learningNodes } from "../data/learningNodes";
import { learners } from "../data/learners";
import { readinessLabel } from "../utils/level";

export function LearnerDrilldownPage() {
  const { learnerId = "learner-minh" } = useParams();
  const learner = learners.find((item) => item.id === learnerId) ?? learners[0];

  return (
    <div>
      <PageHeader title={learner.fullName} eyebrow="Learner drill-down">
        {learner.roleLabel} · {learner.cohort}
      </PageHeader>
      <div className="mb-4 flex flex-wrap gap-2">
        <StatusBadge status={learner.readiness === "ai_ready" || learner.readiness === "advanced" ? "valid" : "warning"} label={readinessLabel(learner.readiness)} />
        {learner.redFlags.map((flag) => <StatusBadge key={flag} status="error" label={flag} />)}
      </div>
      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <RadarProfileChart levels={learner.levels} />
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-bold text-slate-950">Path progress</h2>
          <div className="mt-4 space-y-3">
            {learningNodes.map((node) => {
              const done = learner.completedNodeIds.includes(node.id);
              return (
                <div key={node.id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{node.title}</span>
                    <span>{done ? "Complete" : learner.currentNodeId === node.id ? "Current" : "Pending"}</span>
                  </div>
                  <ProgressBar value={done ? 100 : learner.currentNodeId === node.id ? 45 : 0} tone={done ? "green" : "amber"} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px]">
        <EvidencePanel evidence={learner.latestEvidence.length > 0 ? learner.latestEvidence : learners[0].latestEvidence} />
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="font-bold text-slate-950">Failed labs</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {learner.failedLabs.length ? learner.failedLabs.map((lab) => <li key={lab}>- {lab}</li>) : <li>No failed labs</li>}
            </ul>
          </div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h2 className="font-bold text-blue-950">Recommended mentor action</h2>
            <p className="mt-2 text-sm leading-6 text-blue-900">{learner.mentorAction}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
