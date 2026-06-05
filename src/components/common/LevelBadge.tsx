import type { LevelId } from "../../types/domain";

export function LevelBadge({ level }: { level: LevelId }) {
  return <span className="inline-flex items-center rounded bg-slate-900 px-2 py-1 text-xs font-bold text-white">{level}</span>;
}
