import type { Axis } from "../types/domain";

export const axes: Axis[] = [
  {
    id: 1,
    label: "AI Direction & Context Engineering",
    shortLabel: "AI Direction",
    description: "Scoped prompts, plan-first workflows, context files, and constraints for AI coding agents.",
    weight: 25
  },
  {
    id: 2,
    label: "AI Output Evaluation & Critical Review",
    shortLabel: "Output Review",
    description: "Reviewing AI-generated code, reading diffs, rejecting unsafe output, and explaining findings.",
    weight: 25
  },
  {
    id: 3,
    label: "Recovery, Debug & Resilience",
    shortLabel: "Recovery",
    description: "Stack trace triage, rollback, fix-forward decisions, and safe recovery after AI changes.",
    weight: 20
  },
  {
    id: 4,
    label: "Engineering Foundations",
    shortLabel: "Foundations",
    description: "Testing, security basics, git hygiene, authentication, validation, and secret management.",
    weight: 20
  },
  {
    id: 5,
    label: "AI Product & System Architecture",
    shortLabel: "Architecture",
    description: "Agent guardrails, tool boundaries, evaluation pipelines, observability, and human-in-the-loop design.",
    weight: 10
  }
];
