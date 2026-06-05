import { Link } from "react-router-dom";
import { LearningNodeCard } from "../components/learning/LearningNodeCard";
import { ProgressTimeline } from "../components/learning/ProgressTimeline";
import { PageHeader } from "../components/common/PageHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { learningNodes } from "../data/learningNodes";
import { useDemo } from "../state/DemoContext";
import { canAccessGateExam, getNodeLockReason, isNodeAvailable } from "../utils/gating";

export function LearningPathPage() {
  const { profile, completedNodeIds, capstonePassed } = useDemo();
  const gate = canAccessGateExam(completedNodeIds, capstonePassed);

  return (
    <div>
      <PageHeader title="Learning Path" eyebrow="F3 - Test-gated path">
        Nodes are grouped by target axis and level. Gate Exam stays locked until required node evidence and capstone are complete.
      </PageHeader>
      <div className="mb-5 flex flex-wrap gap-2">
        <StatusBadge status="warning" label="Local demo progress" />
        <StatusBadge status={gate.unlocked ? "valid" : "warning"} label={gate.unlocked ? "Gate Exam unlocked" : "Gate Exam locked"} />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="grid gap-4">
          {learningNodes.map((node) => {
            const available = isNodeAvailable(node, { completedNodeIds, axisLevels: profile.axisLevels });
            return <LearningNodeCard key={node.id} node={node} available={available} completed={completedNodeIds.includes(node.id)} lockReason={getNodeLockReason(node, { completedNodeIds, axisLevels: profile.axisLevels })} />;
          })}
        </div>
        <div className="space-y-4">
          <ProgressTimeline
            steps={[
              { label: "Entry Test scored", done: true },
              { label: "Core nodes completed", done: completedNodeIds.length >= 4 },
              { label: "Capstone passed", done: capstonePassed },
              { label: "Gate Exam unlocked", done: gate.unlocked }
            ]}
          />
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="font-bold text-slate-950">Gate status</h2>
            <p className="mt-2 text-sm text-slate-600">{gate.unlocked ? "Learner can attempt the L1 -> L2 Gate Exam." : gate.reason}</p>
            <div className="mt-4 flex flex-col gap-2">
              <Link to="/capstone" className="rounded bg-slate-950 px-3 py-2 text-center text-sm font-bold text-white">Open capstone</Link>
              <Link to="/gate-exam" className="rounded bg-blue-600 px-3 py-2 text-center text-sm font-bold text-white">Open Gate Exam</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
