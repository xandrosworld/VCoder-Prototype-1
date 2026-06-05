import type { Level } from "../types/domain";

export const levels: Level[] = [
  {
    id: "L0",
    label: "L0 AI-Curious",
    value: 0,
    description: "Can ask for snippets and run simple output when nothing breaks.",
    shipScope: "Personal demo"
  },
  {
    id: "L1",
    label: "L1 Vibe Coder",
    value: 1,
    description: "Can iterate with AI and debug simple failures, but still needs review structure.",
    shipScope: "Personal tool or prototype"
  },
  {
    id: "L2",
    label: "L2 AI-Ready Engineer",
    value: 2,
    description: "Uses plan-first workflows, reviews diffs, writes tests, and handles secrets safely.",
    shipScope: "Production feature with review"
  },
  {
    id: "L3",
    label: "L3 Context Engineer",
    value: 3,
    description: "Can configure context, skills, MCP/tool stacks, and CI/security gates.",
    shipScope: "Solo project or small team lead"
  },
  {
    id: "L4",
    label: "L4 Agentic Engineer",
    value: 4,
    description: "Can design multi-agent systems with evaluation, guardrails, and observability.",
    shipScope: "AI-native product"
  }
];
