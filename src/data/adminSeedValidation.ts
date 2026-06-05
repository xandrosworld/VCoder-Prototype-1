import type { ValidationResult } from "../types/domain";

export const adminSeedValidation: Array<{ id: string; label: string; result: ValidationResult }> = [
  {
    id: "seed-p2",
    label: "P2 audit item has bug_set, ground_truth, judge_rubric_ref",
    result: {
      status: "valid",
      checks: ["bug_set present", "ground_truth present", "judge_rubric_ref present", "payload schema_version present"],
      warnings: [],
      errors: []
    }
  },
  {
    id: "seed-gate",
    label: "Gate exam has answer keys",
    result: {
      status: "valid",
      checks: ["10 MCQ questions", "answer_key present for every question", "pass threshold 80%"],
      warnings: [],
      errors: []
    }
  },
  {
    id: "seed-capstone",
    label: "Capstone has target evidence",
    result: {
      status: "valid",
      checks: ["expected artifact fields present", "target evidence present", "rubric preview present"],
      warnings: [],
      errors: []
    }
  },
  {
    id: "seed-v1-gap",
    label: "Some V1+ features are intentionally not implemented",
    result: {
      status: "warning",
      checks: ["frontend-only route exists", "demo reset exists"],
      warnings: ["No telemetry, backend queue, real LLM call, auth, database, or human review queue in P0 prototype."],
      errors: []
    }
  },
  {
    id: "seed-example-error",
    label: "Example invalid artifact item",
    result: {
      status: "error",
      checks: ["axis checked", "difficulty checked"],
      warnings: [],
      errors: ["Artifact item missing ground_truth", "Artifact item missing judge_rubric_ref"]
    }
  }
];
