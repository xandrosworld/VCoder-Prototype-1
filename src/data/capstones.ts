import type { Capstone } from "../types/domain";

export const capstones: Capstone[] = [
  {
    id: "capstone-safe-feature",
    title: "Ship a Small AI-assisted Feature Safely",
    scenario: "The learner must use AI to plan, implement, review, test, and recover a small user data export feature without exposing other users' data or secrets.",
    expectedArtifact: ["plan", "prompt", "diff review notes", "test plan", "recovery note", "final decision"],
    checklist: [
      "Plan narrows export scope and names risky data.",
      "Prompt includes context, constraints, acceptance criteria, and off-limits data.",
      "Diff review catches auth, injection, and secret risks.",
      "Test plan includes negative authorization paths before accepting AI code.",
      "Recovery note explains rollback or fix-forward path.",
      "Final decision is accept, revise, or reject with evidence."
    ],
    rubricPreview: ["A1 plan-first control", "A2 output evaluation", "A3 recovery discipline", "A4 tests/security", "A5 basic guardrail awareness"],
    targetEvidence: ["Scoped prompt", "Security review notes", "Red-green test plan", "Rollback note", "Accept/revise/reject decision"],
    strongSample: "Plan and prompt scope export to authenticated user's own data; reject AI diff until SQL query is parameterized and auth test passes; add recovery checkpoint and rollback note; final decision revise before merge.",
    weakSample: "Ask AI to build export, run it locally, and merge if the UI button downloads a file."
  }
];
