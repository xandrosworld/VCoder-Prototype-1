import type { ProblemItem, ValidationResult } from "../types/domain";

export function validateProblemItem(item: ProblemItem): ValidationResult {
  const checks: string[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  if (item.axis < 1 || item.axis > 5) {
    errors.push("Axis must be 1..5.");
  } else {
    checks.push("axis is 1..5");
  }

  if (item.difficulty < 1 || item.difficulty > 5) {
    errors.push("Difficulty must be 1..5.");
  } else {
    checks.push("difficulty is 1..5");
  }

  if (!item.payload.schema_version) {
    errors.push("payload.schema_version is required.");
  } else {
    checks.push("payload schema_version present");
  }

  const needsAnswerKey = item.problemType === "mcq" || item.problemType === "gate" || item.problemType === "capstone";
  const isArtifact = item.partType === "audit" || item.partType === "recovery" || item.partType === "prompt_plan" || item.partType === "viva" || (item.problemType === "capstone" && item.scoringMethod === "llm_judge");

  if (needsAnswerKey && item.scoringMethod === "deterministic") {
    if (!item.answerKey) {
      errors.push("MCQ/gate/capstone-MCQ items require answer_key.");
    } else {
      checks.push("answer_key present");
    }
  }

  if (isArtifact) {
    if (!item.groundTruth) {
      errors.push("Artifact items require ground_truth.");
    } else {
      checks.push("ground_truth present");
    }

    if (!item.judgeRubricRef) {
      errors.push("Artifact items require judge_rubric_ref.");
    } else {
      checks.push("judge_rubric_ref present");
    }
  }

  if (item.validationStatus === "warning") {
    warnings.push("Prototype validation warning is intentionally seeded for demo review.");
  }

  return {
    status: errors.length > 0 ? "error" : warnings.length > 0 ? "warning" : "valid",
    checks,
    warnings,
    errors
  };
}
