import { AlertTriangle, ArrowRight, CheckCircle2, Lightbulb, Quote } from "lucide-react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { AXES, LEVELS } from "../domain/constants";
import { getLevelValue, getReadinessStatus } from "../domain/demoScoring";
import type { Learner } from "../domain/types";
import { Button, Panel, StatusPill } from "./ui";

export function Profile({ learner, gatePassed, onLearning }: { learner: Learner; gatePassed: boolean; onLearning: () => void }) {
  const radarData = AXES.map((axis) => ({
    axis: `A${axis.id}`,
    fullName: axis.name,
    level: getLevelValue(learner.levels[axis.id]),
    target: axis.id === 3 ? 1 : axis.id === 5 ? 0 : 2
  }));
  const readiness = getReadinessStatus(learner.levels);
  const gaps = AXES.filter((axis) => {
    const required = axis.id === 3 ? 1 : axis.id === 5 ? 0 : 2;
    return getLevelValue(learner.levels[axis.id]) < required;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <StatusPill tone={readiness === "AI-Ready" || readiness === "Advanced" ? "good" : "warn"}>{readiness}</StatusPill>
          <h1 className="mt-3 text-3xl font-black text-ink">AI-Ready Profile F2</h1>
          <p className="mt-2 text-sm leading-6 text-graphite">
            Read-only profile generated from the simulated F1 assessment. Radar uses the canonical L0-L4 scale and highlights the L2
            graduation threshold.
          </p>
        </div>
        <Button onClick={onLearning}>
          Open Learning Path <ArrowRight size={18} />
        </Button>
      </div>

      {gatePassed && (
        <Panel className="border-emerald-200 bg-emerald-50">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 text-emerald-700" />
            <div>
              <h2 className="font-bold text-emerald-900">Profile update from Gate Exam</h2>
              <p className="mt-1 text-sm text-emerald-800">
                Demo state marks the Level Gate Exam as passed, so the profile is ready for the next level story beat.
              </p>
            </div>
          </div>
        </Panel>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <Panel>
          <h2 className="text-xl font-bold text-ink">5-axis radar</h2>
          <div className="mt-4 h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="72%">
                <PolarGrid />
                <PolarAngleAxis dataKey="axis" tick={{ fill: "#2f3b45", fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 4]} tickCount={5} tick={{ fontSize: 11 }} />
                <Radar name="Current level" dataKey="level" stroke="#0f8b8d" fill="#0f8b8d" fillOpacity={0.28} />
                <Radar name="Readiness threshold" dataKey="target" stroke="#f2a900" fill="#f2a900" fillOpacity={0.1} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {AXES.map((axis) => (
              <div key={axis.id} className="rounded-md bg-mist p-3">
                <p className="text-xs font-bold text-graphite">Axis {axis.id}</p>
                <p className="text-sm font-semibold text-ink">{axis.name}</p>
                <p className="mt-1 text-sm text-teal">{LEVELS.find((level) => level.id === learner.levels[axis.id])?.label}</p>
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel>
            <h2 className="text-xl font-bold text-ink">Gap analysis</h2>
            <div className="mt-4 space-y-3">
              {gaps.length === 0 ? (
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 size={18} /> Core readiness gates are met.
                </div>
              ) : (
                gaps.map((axis) => (
                  <div key={axis.id} className="rounded-md border border-amber-200 bg-amber-50 p-3">
                    <p className="text-sm font-bold text-amber-950">Axis {axis.id}: {axis.name}</p>
                    <p className="mt-1 text-sm text-amber-900">
                      Current {learner.levels[axis.id]}; needs {axis.id === 3 ? "L1" : "L2"} for readiness.
                    </p>
                  </div>
                ))
              )}
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center gap-3">
              <Lightbulb className="text-amber" />
              <h2 className="text-xl font-bold text-ink">3 quick wins</h2>
            </div>
            <div className="mt-4 space-y-3">
              {learner.quickWins.slice(0, 3).map((win) => (
                <p key={win} className="rounded-md bg-mist p-3 text-sm text-graphite">{win}</p>
              ))}
            </div>
          </Panel>

          <Panel>
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-coral" />
              <h2 className="text-xl font-bold text-ink">Red flag watch</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-graphite">
              No simulated secret leak detected. Missing authorization findings would be highlighted here separately from level scores.
            </p>
          </Panel>
        </div>
      </div>

      <Panel>
        <div className="flex items-center gap-3">
          <Quote className="text-teal" />
          <h2 className="text-xl font-bold text-ink">Evidence snippets from test answers</h2>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {learner.evidence.map((item) => (
            <div key={`${item.source}-${item.quote}`} className="rounded-md border border-slate-200 p-4">
              <StatusPill>Axis {item.axis} · {item.source}</StatusPill>
              <p className="mt-3 text-sm leading-6 text-graphite">{item.quote}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
