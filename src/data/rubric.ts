import { axes } from "./axes";

export const rubric = {
  version: "v0.2",
  judgePromptVersion: "jp-v0.2-demo",
  passThreshold: 80,
  axisWeights: axes.map((axis) => ({ axis: axis.id, label: axis.label, weight: axis.weight })),
  scoreToLevel: [
    { range: "0-39", level: "L0", label: "AI-Curious" },
    { range: "40-59", level: "L1", label: "Vibe Coder" },
    { range: "60-79", level: "L2", label: "AI-Ready Engineer" },
    { range: "80-91", level: "L3", label: "Context Engineer" },
    { range: "92-100", level: "L4", label: "Agentic Engineer" }
  ],
  anchors: [
    {
      axis: 1,
      level: "L2",
      text: "Scoped prompt; constrained; plan-first; evidence includes structure, context, acceptance criteria, and off-limits boundaries."
    },
    {
      axis: 2,
      level: "L2",
      text: "Finds common security issues such as secrets and SQL injection, recognizes logic errors, and explains reasoning clearly."
    },
    {
      axis: 3,
      level: "L2",
      text: "Reads stack trace first, identifies rollback/checkpoint strategy, and gives safe recovery steps."
    },
    {
      axis: 4,
      level: "L2",
      text: "Uses tests, security basics, git hygiene, and secret management before accepting AI output."
    },
    {
      axis: 5,
      level: "L1",
      text: "Names basic agent risks and can place simple tool boundaries, but may lack full observability design."
    }
  ],
  confidenceNote: "Confidence below 0.65 is shown as needs review in the prototype. V1 would route low-confidence artifacts to human review."
};
