import { CheckCircle2, FlaskConical, LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";
import { LearningNodeCard } from "../components/learning/LearningNodeCard";
import { ProgressTimeline } from "../components/learning/ProgressTimeline";
import { PageHeader } from "../components/common/PageHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { learningNodes } from "../data/learningNodes";
import { useDemo } from "../state/DemoContext";
import { canAccessGateExam, getNodeLockReason, isNodeAvailable } from "../utils/gating";

export function LearningPathPage() {
  const { profile, completedNodeIds, capstonePassed, completeCoreNodes } = useDemo();
  const gate = canAccessGateExam(completedNodeIds, capstonePassed);
  const requiredNodes = learningNodes.filter((node) => ["node-1", "node-2", "node-3", "node-4"].includes(node.id));

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
          {learningNodes.map((node, index) => {
            const available = isNodeAvailable(node, { completedNodeIds, axisLevels: profile.axisLevels });
            return (
              <div key={node.id} data-tour={index === 0 ? "learning-path-nodes" : undefined}>
                <LearningNodeCard node={node} available={available} completed={completedNodeIds.includes(node.id)} lockReason={getNodeLockReason(node, { completedNodeIds, axisLevels: profile.axisLevels })} />
              </div>
            );
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
            <div className="mt-4 space-y-2">
              {requiredNodes.map((node) => {
                const done = completedNodeIds.includes(node.id);
                return (
                  <div key={node.id} className="flex items-start gap-2 text-sm">
                    {done ? <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={16} /> : <LockKeyhole className="mt-0.5 shrink-0 text-slate-400" size={16} />}
                    <span className={done ? "text-slate-700" : "text-slate-500"}>{node.title}</span>
                  </div>
                );
              })}
              <div className="flex items-start gap-2 text-sm">
                {capstonePassed ? <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={16} /> : <LockKeyhole className="mt-0.5 shrink-0 text-slate-400" size={16} />}
                <span className={capstonePassed ? "text-slate-700" : "text-slate-500"}>Level capstone passed</span>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Link to="/capstone" className="rounded bg-slate-950 px-3 py-2 text-center text-sm font-bold text-white">Open capstone</Link>
              <Link
                to="/gate-exam"
                aria-disabled={!gate.unlocked}
                className={`rounded px-3 py-2 text-center text-sm font-bold ${gate.unlocked ? "bg-blue-600 text-white hover:bg-blue-700" : "pointer-events-none bg-slate-200 text-slate-500"}`}
              >
                {gate.unlocked ? "Open Gate Exam" : "Gate Exam locked"}
              </Link>
            </div>
            {gate.missingNodeIds.length > 0 ? (
              <div className="mt-4 border-t border-slate-200 pt-4">
                <p className="text-xs leading-5 text-slate-500">Prototype helper: load completed-node evidence so the stakeholder demo can continue without opening every lab.</p>
                <button
                  onClick={completeCoreNodes}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  <FlaskConical size={16} /> Load demo node progress
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
