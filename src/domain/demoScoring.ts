import { PASS_THRESHOLD } from "./constants";
import type { Axis, AxisLevelMap, GateExamResult, Learner, RankedLearner, ReadinessStatus } from "./types";

const levelValue: Record<AxisLevelMap[Axis], number> = {
  L0: 0,
  L1: 1,
  L2: 2,
  L3: 3,
  L4: 4
};

export function getLevelValue(level: AxisLevelMap[Axis]): number {
  return levelValue[level];
}

export function calculateAverageLevel(levels: AxisLevelMap): number {
  const average = Object.values(levels).reduce((total, level) => total + getLevelValue(level), 0) / 5;
  return Number(average.toFixed(1));
}

export function countReadyAxes(levels: AxisLevelMap): number {
  return Object.values(levels).filter((level) => getLevelValue(level) >= 2).length;
}

export function getReadinessStatus(levels: AxisLevelMap): ReadinessStatus {
  const hasCoreL0 = levels[1] === "L0" || levels[2] === "L0" || levels[4] === "L0";
  const isAiReady = getLevelValue(levels[1]) >= 2 && getLevelValue(levels[2]) >= 2 && getLevelValue(levels[3]) >= 1 && getLevelValue(levels[4]) >= 2;
  const isAdvanced = getLevelValue(levels[1]) >= 3 && getLevelValue(levels[2]) >= 3 && getLevelValue(levels[3]) >= 3 && getLevelValue(levels[4]) >= 3 && getLevelValue(levels[5]) >= 2;

  if (isAdvanced) {
    return "Advanced";
  }

  if (isAiReady) {
    return "AI-Ready";
  }

  if (hasCoreL0) {
    return "Foundation needed";
  }

  return "Developing";
}

export function evaluateGateExam(answerKey: string[], answers: string[]): GateExamResult {
  const correctCount = answerKey.reduce((total, correctAnswer, index) => total + (answers[index] === correctAnswer ? 1 : 0), 0);
  const score = Math.round((correctCount / answerKey.length) * 100);

  return {
    score,
    correctCount,
    totalCount: answerKey.length,
    passed: score >= PASS_THRESHOLD
  };
}

export function rankLeaderboard(learners: Learner[], axis?: Axis): RankedLearner[] {
  return learners
    .filter((learner) => learner.optedInLeaderboard)
    .map((learner) => ({
      ...learner,
      averageLevel: calculateAverageLevel(learner.levels),
      readyAxisCount: countReadyAxes(learner.levels)
    }))
    .sort((a, b) => {
      const primary = axis ? getLevelValue(b.levels[axis]) - getLevelValue(a.levels[axis]) : b.averageLevel - a.averageLevel;

      if (primary !== 0) {
        return primary;
      }

      return b.readyAxisCount - a.readyAxisCount;
    });
}
