import { AlertTriangle, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AXES } from "../domain/constants";
import { calculateAverageLevel, getLevelValue, getReadinessStatus } from "../domain/demoScoring";
import type { Learner, Level } from "../domain/types";
import { Panel, StatusPill } from "./ui";

const levels: Level[] = ["L0", "L1", "L2", "L3", "L4"];

export function MentorDashboard({ learners }: { learners: Learner[] }) {
  const atRisk = learners.filter((learner) => learner.levels[1] === "L0" || learner.levels[2] === "L0" || learner.levels[4] === "L0" || learner.stuckDays >= 5);
  const [selectedLearnerId, setSelectedLearnerId] = useState(atRisk[0]?.id ?? learners[0].id);
  const selectedLearner = learners.find((learner) => learner.id === selectedLearnerId) ?? learners[0];

  const distribution = useMemo(
    () =>
      levels.map((level) => ({
        level,
        learners: learners.filter((learner) => {
          const roundedAverage = Math.round(calculateAverageLevel(learner.levels));
          return roundedAverage === getLevelValue(level);
        }).length
      })),
    [learners]
  );

  const aiReadyCount = learners.filter((learner) => ["AI-Ready", "Advanced"].includes(getReadinessStatus(learner.levels))).length;

  return (
    <div className="space-y-5">
      <div>
        <StatusPill tone="info">F5 Mentor Dashboard · read-only cohort overview</StatusPill>
        <h1 className="mt-3 text-3xl font-black text-ink">Mentor Dashboard</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-graphite">
          Cohort overview, level distribution, at-risk learners, and a simple learner drill-down for intervention planning.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Panel>
          <p className="text-sm font-bold text-graphite">Cohort size</p>
          <p className="mt-2 text-3xl font-black text-ink">{learners.length}</p>
        </Panel>
        <Panel>
          <p className="text-sm font-bold text-graphite">AI-Ready or Advanced</p>
          <p className="mt-2 text-3xl font-black text-teal">{aiReadyCount}</p>
        </Panel>
        <Panel>
          <p className="text-sm font-bold text-graphite">At-risk</p>
          <p className="mt-2 text-3xl font-black text-coral">{atRisk.length}</p>
        </Panel>
        <Panel>
          <p className="text-sm font-bold text-graphite">Leaderboard opt-in</p>
          <p className="mt-2 text-3xl font-black text-amber">{learners.filter((learner) => learner.optedInLeaderboard).length}</p>
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <Panel>
          <div className="flex items-center gap-3">
            <Users className="text-teal" />
            <h2 className="text-xl font-bold text-ink">Level distribution</h2>
          </div>
          <div className="mt-5 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="learners" fill="#0f8b8d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-coral" />
            <h2 className="text-xl font-bold text-ink">At-risk learners</h2>
          </div>
          <div className="mt-4 space-y-3">
            {atRisk.map((learner) => (
              <button
                key={learner.id}
                onClick={() => setSelectedLearnerId(learner.id)}
                className={`focus-ring w-full rounded-md border p-3 text-left transition ${
                  selectedLearnerId === learner.id ? "border-teal bg-teal/5" : "border-slate-200 hover:bg-mist"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-bold text-ink">{learner.name}</span>
                  <StatusPill tone="bad">{learner.stuckDays >= 5 ? `${learner.stuckDays} days stuck` : "Core L0"}</StatusPill>
                </div>
                <p className="mt-1 text-sm text-graphite">{learner.currentNode}</p>
              </button>
            ))}
          </div>
        </Panel>
      </div>

      <Panel>
        <h2 className="text-xl font-bold text-ink">Learner drill-down: {selectedLearner.name}</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-lg bg-mist p-4">
            <p className="text-sm font-bold text-graphite">Readiness</p>
            <p className="mt-1 text-2xl font-black text-ink">{getReadinessStatus(selectedLearner.levels)}</p>
            <p className="mt-4 text-sm font-bold text-graphite">Current node</p>
            <p className="mt-1 text-sm text-ink">{selectedLearner.currentNode}</p>
            <p className="mt-4 text-sm font-bold text-graphite">Intervention note</p>
            <p className="mt-1 text-sm leading-6 text-graphite">
              Review recent evidence, assign one focused node, and ask for a short recovery or audit artifact before the next checkpoint.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-5">
            {AXES.map((axis) => (
              <div key={axis.id} className="rounded-md border border-slate-200 p-3">
                <p className="text-xs font-bold text-graphite">A{axis.id}</p>
                <p className="mt-1 text-xl font-black text-teal">{selectedLearner.levels[axis.id]}</p>
                <p className="mt-2 text-xs text-graphite">{axis.shortName}</p>
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
}
