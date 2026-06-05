import { BrainCircuit } from "lucide-react";
import { useEffect } from "react";
import { Panel, StatusPill } from "./ui";

export function ScoringTransition({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timeout = window.setTimeout(onComplete, 3800);
    return () => window.clearTimeout(timeout);
  }, [onComplete]);

  return (
    <div className="flex min-h-[560px] items-center justify-center">
      <Panel className="max-w-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal/10 text-teal">
          <BrainCircuit size={34} />
        </div>
        <StatusPill tone="warn">Prototype simulation</StatusPill>
        <h1 className="mt-5 text-3xl font-black text-ink">Đang chấm bằng AI</h1>
        <p className="mt-3 text-sm leading-6 text-graphite">
          Demo is simulating an LLM-as-judge workflow with structured output, rubric anchors, and evidence snippets. No real model is
          being called and these scores are not validated.
        </p>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-teal" />
        </div>
      </Panel>
    </div>
  );
}
