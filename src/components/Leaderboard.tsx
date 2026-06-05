import { Filter, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import { AXES } from "../domain/constants";
import { getLevelValue, rankLeaderboard } from "../domain/demoScoring";
import type { Axis, Learner } from "../domain/types";
import { Button, Panel, StatusPill } from "./ui";

export function Leaderboard({ learners, onDashboard }: { learners: Learner[]; onDashboard: () => void }) {
  const [axisFilter, setAxisFilter] = useState<"all" | Axis>("all");
  const ranked = useMemo(() => rankLeaderboard(learners, axisFilter === "all" ? undefined : axisFilter), [axisFilter, learners]);
  const hiddenCount = learners.filter((learner) => !learner.optedInLeaderboard).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <StatusPill tone="info">F4 Leaderboard · opt-in only</StatusPill>
          <h1 className="mt-3 text-3xl font-black text-ink">Cohort Leaderboard</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-graphite">
            Ranking uses average level across 5 axes. Axis filters re-rank by that axis. Learners who did not opt in are excluded.
          </p>
        </div>
        <Button onClick={onDashboard}>Open Mentor Dashboard</Button>
      </div>

      <Panel>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Filter className="text-teal" />
            <h2 className="text-xl font-bold text-ink">Filter by axis</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <Button variant={axisFilter === "all" ? "primary" : "secondary"} onClick={() => setAxisFilter("all")}>Average</Button>
            {AXES.map((axis) => (
              <Button key={axis.id} variant={axisFilter === axis.id ? "primary" : "secondary"} onClick={() => setAxisFilter(axis.id)}>
                A{axis.id}
              </Button>
            ))}
          </div>
        </div>
        <p className="mt-3 text-sm text-graphite">{hiddenCount} learner is hidden because leaderboard opt-in is false.</p>
      </Panel>

      <div className="grid gap-3">
        {ranked.map((learner, index) => (
          <Panel key={learner.id} className={learner.id === "minh" ? "border-teal/40 bg-teal/5" : ""}>
            <div className="grid gap-4 lg:grid-cols-[80px_1fr_180px_180px] lg:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-ink text-lg font-black text-white">#{index + 1}</div>
                {index < 3 && <Trophy className="text-amber" />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-ink">{learner.name}</h2>
                <p className="text-sm text-graphite">{learner.role}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-graphite">Average level</p>
                <p className="text-2xl font-black text-teal">{learner.averageLevel.toFixed(1)}</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {AXES.map((axis) => (
                  <StatusPill key={axis.id} tone={getLevelValue(learner.levels[axis.id]) >= 2 ? "good" : "warn"}>
                    A{axis.id} {learner.levels[axis.id]}
                  </StatusPill>
                ))}
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
