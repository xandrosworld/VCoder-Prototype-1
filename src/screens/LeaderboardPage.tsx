import { useMemo, useState } from "react";
import { AxisBadge } from "../components/common/AxisBadge";
import { LevelBadge } from "../components/common/LevelBadge";
import { PageHeader } from "../components/common/PageHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { axes } from "../data/axes";
import { leaderboardLearners } from "../data/leaderboard";
import type { AxisId, Readiness } from "../types/domain";
import { averageLevel, levelToNumber, readinessLabel } from "../utils/level";

export function LeaderboardPage() {
  const [axisFilter, setAxisFilter] = useState<"all" | AxisId>("all");
  const [readinessFilter, setReadinessFilter] = useState<"all" | Readiness>("all");

  const rows = useMemo(() => {
    return leaderboardLearners
      .filter((learner) => learner.optInLeaderboard)
      .filter((learner) => readinessFilter === "all" || learner.readiness === readinessFilter)
      .sort((a, b) => {
        const primary = axisFilter === "all" ? averageLevel(b.levels) - averageLevel(a.levels) : levelToNumber(b.levels[axisFilter]) - levelToNumber(a.levels[axisFilter]);
        return primary || Object.values(b.levels).filter((level) => levelToNumber(level) >= 2).length - Object.values(a.levels).filter((level) => levelToNumber(level) >= 2).length;
      });
  }, [axisFilter, readinessFilter]);

  return (
    <div>
      <PageHeader title="Leaderboard" eyebrow="F4 - opt-in cohort ranking">
        Leaderboard is opt-in to avoid exposing sensitive learner data by default.
      </PageHeader>
      <div data-tour="leaderboard">
      <div className="mb-4 flex flex-wrap gap-2">
        <select value={axisFilter} onChange={(event) => setAxisFilter(event.target.value === "all" ? "all" : Number(event.target.value) as AxisId)} className="rounded border border-slate-300 bg-white px-3 py-2 text-sm">
          <option value="all">Average level</option>
          {axes.map((axis) => <option key={axis.id} value={axis.id}>Axis {axis.id}: {axis.shortLabel}</option>)}
        </select>
        <select value={readinessFilter} onChange={(event) => setReadinessFilter(event.target.value as "all" | Readiness)} className="rounded border border-slate-300 bg-white px-3 py-2 text-sm">
          <option value="all">All readiness</option>
          <option value="foundation_needed">Foundation needed</option>
          <option value="developing">Developing</option>
          <option value="ai_ready">AI-Ready</option>
          <option value="advanced">Advanced</option>
        </select>
        <StatusBadge status="warning" label={`${leaderboardLearners.filter((learner) => !learner.optInLeaderboard).length} learners hidden by opt-out`} />
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase text-slate-500">
            <tr>
              <th className="p-3">Rank</th>
              <th className="p-3">Learner</th>
              <th className="p-3">Cohort</th>
              <th className="p-3">Average</th>
              <th className="p-3">Axis levels</th>
              <th className="p-3">Readiness</th>
              <th className="p-3">Opt-in</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((learner, index) => (
              <tr key={learner.id} className={learner.id === "learner-minh" ? "bg-blue-50" : "border-t border-slate-100"}>
                <td className="p-3 font-bold">{index + 1}</td>
                <td className="p-3 font-semibold text-slate-950">{learner.fullName}</td>
                <td className="p-3 text-slate-600">{learner.cohort}</td>
                <td className="p-3">{averageLevel(learner.levels)}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {axes.map((axis) => <span key={axis.id} className="rounded bg-slate-100 px-2 py-1 text-xs">A{axis.id} {learner.levels[axis.id]}</span>)}
                  </div>
                </td>
                <td className="p-3"><StatusBadge status={learner.readiness === "ai_ready" || learner.readiness === "advanced" ? "valid" : "warning"} label={readinessLabel(learner.readiness)} /></td>
                <td className="p-3">Visible</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {axisFilter !== "all" ? <AxisBadge axis={axisFilter} /> : null}
        {axisFilter !== "all" ? <LevelBadge level="L2" /> : null}
      </div>
      </div>
    </div>
  );
}
