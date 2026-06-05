import type { Axis, Level } from "./types";

export const AXES: Array<{ id: Axis; name: string; shortName: string }> = [
  { id: 1, name: "AI Direction & Context Engineering", shortName: "AI Direction" },
  { id: 2, name: "AI Output Evaluation & Critical Review", shortName: "Output Review" },
  { id: 3, name: "Recovery, Debug & Resilience", shortName: "Recovery" },
  { id: 4, name: "Engineering Foundations", shortName: "Foundations" },
  { id: 5, name: "AI Product & System Architecture", shortName: "Architecture" }
];

export const LEVELS: Array<{ id: Level; label: string; value: number }> = [
  { id: "L0", label: "L0 AI-Curious", value: 0 },
  { id: "L1", label: "L1 Vibe Coder", value: 1 },
  { id: "L2", label: "L2 AI-Ready Engineer", value: 2 },
  { id: "L3", label: "L3 Context Engineer", value: 3 },
  { id: "L4", label: "L4 Agentic Engineer", value: 4 }
];

export const PASS_THRESHOLD = 80;

export const PROTOTYPE_NOTE = "Prototype demo — scoring and data are simulated.";
