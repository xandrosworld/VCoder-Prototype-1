import type { AxisLevelMap, GateExam, SimulatedProfile } from "../types/domain";

export const simulatedScoringSteps = [
  "Parsing answers",
  "Matching MCQ answer key",
  "Evaluating artifacts against rubric anchors",
  "Extracting evidence",
  "Generating AI-Ready Profile"
];

const fixedAxisLevels: AxisLevelMap = {
  1: "L2",
  2: "L1",
  3: "L1",
  4: "L2",
  5: "L0"
};

export function getSimulatedProfile(learnerId: string): SimulatedProfile {
  return {
    learnerId,
    axisLevels: fixedAxisLevels,
    readiness: "developing",
    confidenceByAxis: { 1: 0.86, 2: 0.64, 3: 0.78, 4: 0.82, 5: 0.51 },
    evidence: [
      {
        axis: 2,
        source: "P2 Code Audit",
        quote: "Found hardcoded secret",
        interpretation: "Learner noticed credential exposure in AI-generated login code."
      },
      {
        axis: 2,
        source: "P2 Code Audit",
        quote: "Missed SQL injection",
        interpretation: "Critical injection issue was not included in the audit findings."
      },
      {
        axis: 3,
        source: "P3 Recovery",
        quote: "Proposed rollback path",
        interpretation: "Learner identified last known-good commit before applying a narrow fix."
      },
      {
        axis: 1,
        source: "P4 Prompt / Plan",
        quote: "Scoped prompt with constraints",
        interpretation: "Prompt included context, off-limits data, and acceptance criteria."
      },
      {
        axis: 5,
        source: "P5 Mini-viva",
        quote: "Weak architecture guardrail answer",
        interpretation: "Answer named guardrails but did not place approvals, logging, or tool boundaries concretely."
      }
    ],
    redFlags: ["missed critical SQL injection", "weak architecture reasoning", "needs stronger recovery discipline"],
    gaps: [
      { axis: 2, current: "L1", target: "L2", note: "Needs to catch SQL injection and logic bugs before accepting generated code." },
      { axis: 5, current: "L0", target: "L1", note: "Needs basic tool-boundary and approval reasoning for agentic systems." },
      { axis: 3, current: "L1", target: "L2", note: "Recovery path exists but needs stronger checkpoint and regression-test discipline." }
    ],
    quickWins: [
      "Learn to audit AI-generated code for security before accepting changes.",
      "Practice recovery workflow: inspect stack trace, isolate commit, rollback safely.",
      "Write prompts with explicit context, constraints, and acceptance criteria."
    ],
    updatedSource: "intake_test"
  };
}

export function scoreGateExam(answerKey: string[], answers: string[]): { score: number; correctCount: number; totalCount: number; passed: boolean } {
  const correctCount = answerKey.reduce((total, key, index) => total + (answers[index] === key ? 1 : 0), 0);
  const score = Math.round((correctCount / answerKey.length) * 100);
  return {
    score,
    correctCount,
    totalCount: answerKey.length,
    passed: score >= 80
  };
}

export function scoreGateExamFromSeed(exam: GateExam, answers: Record<string, string>) {
  return scoreGateExam(
    exam.questions.map((question) => question.correctKey),
    exam.questions.map((question) => answers[question.id] ?? "")
  );
}
