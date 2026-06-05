import { Link } from "react-router-dom";
import { AxisBadge } from "../common/AxisBadge";
import { LevelBadge } from "../common/LevelBadge";
import { StatusBadge } from "../common/StatusBadge";
import type { LearningNode } from "../../types/domain";

export function LearningNodeCard({ node, available, lockReason, completed }: { node: LearningNode; available: boolean; lockReason?: string; completed: boolean }) {
  return (
    <div className={`rounded-lg border p-4 shadow-sm ${available ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-100"}`}>
      <div className="flex flex-wrap items-center gap-2">
        <AxisBadge axis={node.axis} />
        <LevelBadge level={node.targetLevel} />
        <StatusBadge status={completed ? "valid" : available ? "info" : "warning"} label={completed ? "Completed" : available ? "Available" : "Locked"} />
      </div>
      <h2 className="mt-3 text-lg font-bold text-slate-950">{node.title}</h2>
      <p className="mt-2 text-sm text-slate-600">{node.targetEvidence}</p>
      <div className="mt-3 grid gap-2 text-xs text-slate-500 sm:grid-cols-3">
        <span>{node.estimatedTime}</span>
        <span>{node.lessonIds.length} lessons</span>
        <span>Lab/checkpoint: {node.labId}</span>
      </div>
      {!available ? <p className="mt-3 rounded bg-amber-50 p-2 text-sm text-amber-800">{lockReason}</p> : null}
      {available ? <Link to={`/lesson/${node.lessonIds[0]}`} className="mt-4 inline-flex rounded bg-blue-600 px-3 py-2 text-sm font-bold text-white">Open lesson</Link> : null}
    </div>
  );
}
