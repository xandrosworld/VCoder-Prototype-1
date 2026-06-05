import type { LearningNode } from "../types/domain";

export const learningNodes: LearningNode[] = [
  {
    id: "node-1",
    title: "Scoped Prompting & Plan-first Workflow",
    axis: 1,
    targetLevel: "L2",
    status: "available",
    estimatedTime: "55 min",
    targetEvidence: "A plan-first prompt with context, constraints, acceptance criteria, and off-limits boundaries.",
    lessonIds: ["lesson-1a", "lesson-1b"],
    labId: "lab-prompt-plan"
  },
  {
    id: "node-2",
    title: "Reviewing AI-generated Code",
    axis: 2,
    targetLevel: "L2",
    status: "available",
    estimatedTime: "70 min",
    targetEvidence: "A structured accept/revise/reject decision with security, logic, and test findings.",
    lessonIds: ["lesson-2a", "lesson-2b"],
    labId: "lab-audit-review"
  },
  {
    id: "node-3",
    title: "Recovery after AI Breaks the Build",
    axis: 3,
    targetLevel: "L1",
    status: "available",
    estimatedTime: "60 min",
    targetEvidence: "A recovery note that reads the stack trace, isolates the AI diff, and chooses rollback or fix-forward.",
    lessonIds: ["lesson-3a", "lesson-3b"],
    labId: "lab-recovery-stacktrace"
  },
  {
    id: "node-4",
    title: "Tests before Accepting AI Code",
    axis: 4,
    targetLevel: "L2",
    status: "available",
    estimatedTime: "65 min",
    targetEvidence: "A failing test that proves the requested behavior before accepting generated implementation.",
    lessonIds: ["lesson-4a", "lesson-4b"],
    labId: "lab-tests-before-ai"
  },
  {
    id: "node-5",
    title: "Secrets, Auth, and Input Validation",
    axis: 4,
    targetLevel: "L2",
    status: "locked",
    estimatedTime: "75 min",
    targetEvidence: "An auth/security audit that blocks hardcoded secrets, injection, and missing authorization checks.",
    lessonIds: ["lesson-5a", "lesson-5b"],
    labId: "lab-secrets-auth",
    prerequisites: ["node-2"],
    lockReason: "Locked until Reviewing AI-generated Code is completed."
  },
  {
    id: "node-6",
    title: "Agent Guardrails & Tool Boundaries",
    axis: 5,
    targetLevel: "L1",
    status: "locked",
    estimatedTime: "80 min",
    targetEvidence: "A guardrail plan for tool access, approval gates, observability, and human override.",
    lessonIds: ["lesson-6a", "lesson-6b"],
    labId: "lab-agent-guardrails",
    requiresAxisLevel: { axis: 5, level: "L1" },
    lockReason: "Locked until profile Axis 5 reaches L1."
  }
];
