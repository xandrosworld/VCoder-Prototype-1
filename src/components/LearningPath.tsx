import { BookOpenCheck, CheckCircle2, LockKeyhole, Play, Trophy } from "lucide-react";
import learningPath from "../data/learningPath.json";
import { AXES } from "../domain/constants";
import { Button, Panel, StatusPill } from "./ui";

export function LearningPath({ gatePassed, onGateExam, onLeaderboard }: { gatePassed: boolean; onGateExam: () => void; onLeaderboard: () => void }) {
  const allRequiredCapstonesPassed = false;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <StatusPill tone="info">F3 Learning Path · test-gated</StatusPill>
          <h1 className="mt-3 text-3xl font-black text-ink">Learning Path</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-graphite">
            Nodes in the current level are available in parallel. Checkpoints and Capstones use the demo 80% pass rule; the Level Gate
            Exam is a real clickable MCQ in this prototype.
          </p>
        </div>
        <Button onClick={onLeaderboard}>Open Leaderboard</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {learningPath.map((node) => {
          const axis = AXES.find((item) => item.id === node.axis);
          const locked = node.status === "locked";
          return (
            <Panel key={node.id} className={locked ? "opacity-70" : ""}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-mist text-teal">
                  {locked ? <LockKeyhole size={20} /> : <BookOpenCheck size={20} />}
                </div>
                <StatusPill tone={node.status === "completed" ? "good" : locked ? "neutral" : "warn"}>{node.status}</StatusPill>
              </div>
              <h2 className="mt-4 text-lg font-bold text-ink">{node.title}</h2>
              <p className="mt-1 text-xs font-semibold text-teal">Axis {node.axis}: {axis?.shortName}</p>
              <p className="mt-3 min-h-24 text-sm leading-6 text-graphite">{node.description}</p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Checkpoint</span>
                  <StatusPill tone={node.checkpoint === "passed" ? "good" : node.checkpoint === "locked" ? "neutral" : "warn"}>{node.checkpoint}</StatusPill>
                </div>
                <div className="flex items-center justify-between">
                  <span>Capstone</span>
                  <StatusPill tone={node.capstone === "passed" ? "good" : node.capstone === "locked" ? "neutral" : "warn"}>{node.capstone}</StatusPill>
                </div>
              </div>
            </Panel>
          );
        })}
      </div>

      <Panel className="border-teal/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-teal text-white">
              <Trophy />
            </div>
            <div>
              <h2 className="text-xl font-bold text-ink">Level Gate Exam · L1</h2>
              <p className="mt-1 text-sm leading-6 text-graphite">
                Demo override: stakeholders can open the exam now. In production logic, this unlocks after all level Capstones pass.
              </p>
              {!allRequiredCapstonesPassed && !gatePassed && (
                <p className="mt-2 text-sm font-semibold text-amber-800">Locked condition shown: Code Audit, Recovery, and Foundations capstones still need pass status.</p>
              )}
              {gatePassed && (
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 size={18} /> Gate Exam passed in this demo session.
                </p>
              )}
            </div>
          </div>
          <Button onClick={onGateExam}>
            <Play size={18} /> Take Gate Exam
          </Button>
        </div>
      </Panel>
    </div>
  );
}
