import type { AssessmentAnswers, AssessmentPartId, AuditFinding, PartAnswer } from "../api/contracts";
import { p1Questions, p3RecoveryScenario, p4PromptPlanScenario, p5VivaQuestions } from "../data/entryTestItems";

export const emptyAuditFinding = (): AuditFinding => ({
  location: "",
  type: "",
  severity: "",
  why: "",
  proposed_fix: ""
});

export const emptyAssessmentAnswers = (): AssessmentAnswers => ({
  p1: {},
  p2: [emptyAuditFinding(), emptyAuditFinding(), emptyAuditFinding()],
  p3: {},
  p4: {},
  p5: {}
});

const hasText = (value: string | undefined, minimum = 1) => (value?.trim().length ?? 0) >= minimum;

export function getPartProgress(answers: AssessmentAnswers, partId: AssessmentPartId): { complete: boolean; completed: number; total: number; message: string } {
  if (partId === "p1") {
    const completed = p1Questions.filter((question) => hasText(answers.p1[question.id])).length;
    return {
      complete: completed === p1Questions.length,
      completed,
      total: p1Questions.length,
      message: completed === p1Questions.length ? "All MCQ answers are complete." : `Answer ${p1Questions.length - completed} remaining question(s).`
    };
  }

  if (partId === "p2") {
    const completeFindings = answers.p2.filter((finding) =>
      Object.values(finding).every((value) => hasText(value, 2))
    ).length;
    return {
      complete: completeFindings >= 3,
      completed: completeFindings,
      total: 3,
      message: completeFindings >= 3 ? "Three structured findings are complete." : `Complete ${3 - completeFindings} more finding(s).`
    };
  }

  if (partId === "p3") {
    const completed = p3RecoveryScenario.answerFields.filter((field) => hasText(answers.p3[field], 8)).length;
    return {
      complete: completed === p3RecoveryScenario.answerFields.length,
      completed,
      total: p3RecoveryScenario.answerFields.length,
      message: completed === p3RecoveryScenario.answerFields.length ? "Recovery response is complete." : "Complete every recovery field with a short explanation."
    };
  }

  if (partId === "p4") {
    const completed = p4PromptPlanScenario.answerFields.filter((field) => hasText(answers.p4[field], 8)).length;
    return {
      complete: completed === p4PromptPlanScenario.answerFields.length,
      completed,
      total: p4PromptPlanScenario.answerFields.length,
      message: completed === p4PromptPlanScenario.answerFields.length ? "Prompt and plan are complete." : "Complete every prompt/plan field."
    };
  }

  const completed = p5VivaQuestions.filter((question) => hasText(answers.p5[question.id], 12)).length;
  return {
    complete: completed === p5VivaQuestions.length,
    completed,
    total: p5VivaQuestions.length,
    message: completed === p5VivaQuestions.length ? "All viva answers are complete." : `Complete ${p5VivaQuestions.length - completed} more viva answer(s).`
  };
}

export function getAssessmentProgress(answers: AssessmentAnswers) {
  const parts: AssessmentPartId[] = ["p1", "p2", "p3", "p4", "p5"];
  const completedParts = parts.filter((partId) => getPartProgress(answers, partId).complete).length;
  return {
    complete: completedParts === parts.length,
    completedParts,
    totalParts: parts.length
  };
}

export function toPartAnswers(answers: AssessmentAnswers): PartAnswer[] {
  return (Object.entries(answers) as Array<[AssessmentPartId, AssessmentAnswers[AssessmentPartId]]>).map(([part_id, answer]) => ({
    part_id,
    answer
  }));
}
