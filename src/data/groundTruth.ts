export const groundTruthExamples = [
  {
    id: "GT-P2-001",
    item: "P2 login audit",
    zone: "clear_pass",
    goldLevel: "L2",
    studentArtifact: "Line 4 SQL injection via f-string; line 6 hardcoded secret; line 5 plaintext password compare; add parameterized query and hashing.",
    goldCriteria: ["Detected SQL injection", "Detected hardcoded secret", "Detected plaintext password comparison", "Proposed fix"],
    agreementStatus: "AI and mentor agree: exact-level match"
  },
  {
    id: "GT-P2-002",
    item: "P2 login audit",
    zone: "clear_fail",
    goldLevel: "L0",
    studentArtifact: "The code looks fine. Maybe add comments.",
    goldCriteria: ["No security findings", "Missed critical SQL injection", "Missed secret"],
    agreementStatus: "AI and mentor agree: exact-level match"
  },
  {
    id: "GT-P4-001",
    item: "P4 prompt plan",
    zone: "clear_pass",
    goldLevel: "L2",
    studentArtifact: "Plan export CSV for authenticated user's own data only; prompt asks AI to inspect export service, not touch billing, exclude secrets, and add tests for 403.",
    goldCriteria: ["Plan first", "Scoped prompt", "Constraints", "Acceptance criteria", "Off-limits"],
    agreementStatus: "AI and mentor agree: exact-level match"
  }
];
