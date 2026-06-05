import { describe, expect, it } from "vitest";
import {
  calculateAverageLevel,
  evaluateGateExam,
  getReadinessStatus,
  rankLeaderboard
} from "./demoScoring";
import type { AxisLevelMap, Learner } from "./types";

describe("demo scoring rules", () => {
  it("marks AI-Ready only when A1, A2, A4 reach L2 and A3 reaches L1", () => {
    const levels: AxisLevelMap = {
      1: "L2",
      2: "L2",
      3: "L1",
      4: "L2",
      5: "L0"
    };

    expect(getReadinessStatus(levels)).toBe("AI-Ready");
  });

  it("keeps learners with a core L0 in Foundation needed", () => {
    const levels: AxisLevelMap = {
      1: "L2",
      2: "L0",
      3: "L2",
      4: "L2",
      5: "L3"
    };

    expect(getReadinessStatus(levels)).toBe("Foundation needed");
  });

  it("passes gate exams at 80 percent and fails below 80 percent", () => {
    expect(evaluateGateExam(["a", "b", "c", "d"], ["a", "b", "c", "d"]).passed).toBe(true);
    expect(evaluateGateExam(["a", "b", "c", "d", "e"], ["a", "b", "x", "y", "z"]).passed).toBe(false);
    expect(evaluateGateExam(["a", "b", "c", "d", "e"], ["a", "b", "c", "d", "z"]).score).toBe(80);
  });

  it("ranks only opted-in learners by average level, then L2-ready axis count", () => {
    const learners: Learner[] = [
      {
        id: "hidden",
        name: "Hidden Learner",
        role: "Backend",
        optedInLeaderboard: false,
        optedInPercentile: false,
        levels: { 1: "L4", 2: "L4", 3: "L4", 4: "L4", 5: "L4" },
        quickWins: [],
        evidence: [],
        currentNode: "Prompt Reliability",
        stuckDays: 0
      },
      {
        id: "an",
        name: "Nguyen An",
        role: "Student",
        optedInLeaderboard: true,
        optedInPercentile: true,
        levels: { 1: "L2", 2: "L2", 3: "L2", 4: "L2", 5: "L0" },
        quickWins: [],
        evidence: [],
        currentNode: "Prompt Reliability",
        stuckDays: 0
      },
      {
        id: "mai",
        name: "Tran Mai",
        role: "Frontend",
        optedInLeaderboard: true,
        optedInPercentile: true,
        levels: { 1: "L3", 2: "L1", 3: "L2", 4: "L2", 5: "L0" },
        quickWins: [],
        evidence: [],
        currentNode: "Code Audit Basics",
        stuckDays: 1
      }
    ];

    const ranked = rankLeaderboard(learners);

    expect(ranked.map((learner) => learner.id)).toEqual(["an", "mai"]);
    expect(calculateAverageLevel(ranked[0].levels)).toBe(1.6);
  });
});
