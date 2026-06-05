import type { ProblemItem } from "../types/domain";

export const itemBankItems: ProblemItem[] = [
  {
    id: "P1-001",
    title: "CI green is not enough",
    partType: "mcq",
    problemType: "mcq",
    axis: 2,
    targetLevel: "L1",
    difficulty: 2,
    scoringMethod: "deterministic",
    payload: { schema_version: "p1-mcq-v0.1", stem: "AI generated a login endpoint and all CI tests pass." },
    answerKey: { schema_version: "p1-key-v0.1", correct_keys: ["B"] },
    validationStatus: "valid"
  },
  {
    id: "P2-LOGIN-AUDIT",
    title: "Login API audit",
    partType: "audit",
    problemType: "audit",
    axis: 2,
    targetLevel: "L2",
    difficulty: 4,
    scoringMethod: "llm_judge",
    payload: { schema_version: "p2-audit-v0.1", scenario: "AI generated login code." },
    answerKey: { schema_version: "p2-bugset-v0.1", bugs: ["sql_injection", "hardcoded_secret", "plaintext_password", "missing_user_check"] },
    groundTruth: { schema_version: "gt-v0.1", gold_samples: ["GT-P2-001", "GT-P2-002"] },
    judgeRubricRef: "rubric://axis-2/anchors#L0-L2",
    validationStatus: "valid"
  },
  {
    id: "P3-RECOVERY",
    title: "Stack trace recovery note",
    partType: "recovery",
    problemType: "recovery",
    axis: 3,
    targetLevel: "L1",
    difficulty: 3,
    scoringMethod: "llm_judge",
    payload: { schema_version: "p3-recovery-v0.1", scenario: "Build fails after AI diff." },
    groundTruth: { schema_version: "gt-v0.1", gold_samples: ["GT-P3-001"] },
    judgeRubricRef: "rubric://axis-3/anchors#L0-L2",
    validationStatus: "valid"
  },
  {
    id: "P4-PROMPT",
    title: "Scoped export prompt",
    partType: "prompt_plan",
    problemType: "audit",
    axis: 1,
    targetLevel: "L2",
    difficulty: 3,
    scoringMethod: "llm_judge",
    payload: { schema_version: "p4-promptplan-v0.1", task_brief: "Thêm tính năng cho người dùng xuất dữ liệu của họ." },
    groundTruth: { schema_version: "gt-v0.1", gold_samples: ["GT-P4-001"] },
    judgeRubricRef: "rubric://axis-1/anchors#L0-L2",
    validationStatus: "valid"
  },
  {
    id: "CAPSTONE-001",
    title: "Ship a small AI-assisted feature safely",
    problemType: "capstone",
    partType: null,
    axis: 4,
    targetLevel: "L2",
    difficulty: 4,
    scoringMethod: "llm_judge",
    payload: { schema_version: "capstone-v0.1", expected_artifact: ["plan", "prompt", "diff_review", "test_plan", "recovery_note"] },
    groundTruth: { schema_version: "gt-v0.1", target_evidence: ["security review", "test plan", "final decision"] },
    judgeRubricRef: "rubric://capstone/l1-l2",
    validationStatus: "valid"
  },
  {
    id: "GATE-L1-001",
    title: "L1 Gate Exam MCQ pool",
    problemType: "gate",
    partType: "mcq",
    axis: 4,
    targetLevel: "L2",
    difficulty: 3,
    scoringMethod: "deterministic",
    payload: { schema_version: "gate-mcq-v0.1", question_count: 10 },
    answerKey: { schema_version: "gate-key-v0.1", pass_threshold: 80 },
    validationStatus: "valid"
  },
  {
    id: "BROKEN-ARTIFACT-DEMO",
    title: "Invalid artifact example",
    problemType: "audit",
    partType: "audit",
    axis: 2,
    targetLevel: "L2",
    difficulty: 3,
    scoringMethod: "llm_judge",
    payload: { schema_version: "p2-audit-v0.1" },
    validationStatus: "error"
  }
];
