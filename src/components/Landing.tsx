import { ArrowRight, Clock, LockKeyhole, Radar, ShieldCheck } from "lucide-react";
import { AXES, LEVELS } from "../domain/constants";
import { Button, Panel, StatusPill } from "./ui";

export function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="flex min-h-[560px] flex-col justify-between rounded-xl bg-ink p-7 text-white shadow-sm">
        <div>
          <StatusPill tone="info">Test-gated learning platform</StatusPill>
          <h1 className="mt-8 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
            VCoder helps learners become AI-Ready Developers through evidence-based gates.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200">
            The entry test maps each learner across 5 capability axes, then opens a personalized Learning Path with checkpoints,
            Capstone status, and a Level Gate Exam.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-white/10 p-4">
            <Clock className="mb-3" size={24} />
            <p className="text-2xl font-bold">30-60 min</p>
            <p className="text-sm text-slate-200">Entry test P1-P5</p>
          </div>
          <div className="rounded-lg bg-white/10 p-4">
            <Radar className="mb-3" size={24} />
            <p className="text-2xl font-bold">5 axes</p>
            <p className="text-sm text-slate-200">Radar profile L0-L4</p>
          </div>
          <div className="rounded-lg bg-white/10 p-4">
            <LockKeyhole className="mb-3" size={24} />
            <p className="text-2xl font-bold">80%</p>
            <p className="text-sm text-slate-200">Gate Exam pass rule</p>
          </div>
        </div>
        <div className="mt-8">
          <Button onClick={onStart}>
            Bắt đầu bài test <ArrowRight size={18} />
          </Button>
        </div>
      </section>

      <div className="space-y-5">
        <Panel>
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-teal" size={24} />
            <div>
              <h2 className="text-xl font-bold text-ink">Canonical axes</h2>
              <p className="text-sm text-graphite">Aligned with PRD, Functional Spec, and Rubric.</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {AXES.map((axis) => (
              <div key={axis.id} className="rounded-md border border-slate-200 p-3">
                <p className="text-sm font-bold text-ink">Axis {axis.id}</p>
                <p className="text-sm text-graphite">{axis.name}</p>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 className="text-xl font-bold text-ink">Levels</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {LEVELS.map((level) => (
              <StatusPill key={level.id} tone={level.id === "L2" ? "good" : "neutral"}>
                {level.label}
              </StatusPill>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-graphite">
            AI-Ready threshold: A1&gt;=L2, A2&gt;=L2, A3&gt;=L1, A4&gt;=L2. Axis 5 is measured but not a readiness gate.
          </p>
        </Panel>
      </div>
    </div>
  );
}
