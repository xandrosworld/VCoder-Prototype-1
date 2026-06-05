import { X } from "lucide-react";
import { useState } from "react";

const steps = [
  ["Why VCoder exists", "AI can generate artifacts, so VCoder measures whether learners can control AI in real software work."],
  ["Entry test", "The learner completes five short parts: MCQ, audit, recovery, prompt/plan, and mini-viva."],
  ["AI scoring simulation", "This prototype shows the scoring pipeline locally. It does not call an LLM."],
  ["AI-Ready Profile", "The profile shows five axis levels, confidence, evidence, red flags, gaps, and quick wins."],
  ["Learning Path", "Nodes open based on profile evidence and test-gated progress."],
  ["Lesson + Lab", "Learners study targeted content, then submit structured evidence in checkpoints."],
  ["Capstone + Gate Exam", "A capstone proves end-to-end AI-assisted workflow safety; the gate exam unlocks the next level at 80%."],
  ["Leaderboard", "Ranking is opt-in to avoid exposing sensitive learner data by default."],
  ["Mentor Dashboard", "Mentors inspect cohort health, at-risk signals, stuck nodes, and interventions."],
  ["Admin Authoring", "Admins manage content, item bank, rubric/ground-truth, gate config, and seed validation."]
];

export function DemoTour() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [title, note] = steps[index];

  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed bottom-5 right-5 z-30 rounded bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-700">
        Start 5-minute demo tour
      </button>
      {open ? (
        <div className="fixed inset-0 z-40 bg-slate-950/40 p-4">
          <div className="ml-auto mt-16 max-w-md rounded-lg bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-blue-700">Step {index + 1} of {steps.length}</p>
                <h2 className="mt-1 text-xl font-bold text-slate-950">{title}</h2>
              </div>
              <button onClick={() => setOpen(false)} className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="Close tour">
                <X size={20} />
              </button>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{note}</p>
            <div className="mt-5 flex justify-between gap-2">
              <button disabled={index === 0} onClick={() => setIndex((value) => Math.max(0, value - 1))} className="rounded border border-slate-200 px-3 py-2 text-sm font-semibold disabled:opacity-40">
                Back
              </button>
              <button
                onClick={() => (index === steps.length - 1 ? setOpen(false) : setIndex((value) => value + 1))}
                className="rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
              >
                {index === steps.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
