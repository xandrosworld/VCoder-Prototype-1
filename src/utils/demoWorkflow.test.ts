import { describe, expect, it } from "vitest";
import type { AxisLevelMap, LearningNode, ProblemItem } from "../types/domain";
import { canAccessGateExam, isNodeAvailable } from "./gating";
import { getReadinessStatus, levelToNumber } from "./level";
import { getSimulatedProfile, scoreGateExam } from "./scoringSimulation";
import { validateProblemItem } from "./validation";

describe("VCoder demo workflow rules", () => {
  it("returns the fixed simulated profile required for the main learner", () => {
    const profile = getSimulatedProfile("learner-minh");

    expect(profile.readiness).toBe("developing");
    expect(profile.axisLevels).toEqual({
      1: "L2",
      2: "L1",
      3: "L1",
      4: "L2",
      5: "L0"
    });
    expect(profile.confidenceByAxis[1]).toBe(0.86);
    expect(profile.redFlags).toContain("missed critical SQL injection");
  });

  it("maps readiness from canonical axis thresholds", () => {
    const aiReady: AxisLevelMap = { 1: "L2", 2: "L2", 3: "L1", 4: "L2", 5: "L0" };
    const foundationNeeded: AxisLevelMap = { 1: "L2", 2: "L0", 3: "L2", 4: "L2", 5: "L2" };
    const advanced: AxisLevelMap = { 1: "L3", 2: "L3", 3: "L3", 4: "L3", 5: "L2" };

    expect(getReadinessStatus(aiReady)).toBe("ai_ready");
    expect(getReadinessStatus(foundationNeeded)).toBe("foundation_needed");
    expect(getReadinessStatus(advanced)).toBe("advanced");
    expect(levelToNumber("L4")).toBe(4);
  });

  it("locks node 5 until node 2 is complete and locks A5 guardrails until A5 reaches L1", () => {
    const node: LearningNode = {
      id: "node-5",
      title: "Secrets, Auth, and Input Validation",
      axis: 4,
      targetLevel: "L2",
      status: "locked",
      estimatedTime: "75 min",
      targetEvidence: "Audit auth and validation issues before merge",
      lessonIds: [],
      labId: "lab-audit",
      prerequisites: ["node-2"],
      lockReason: "Locked until Reviewing AI-generated Code is completed."
    };

    expect(isNodeAvailable(node, { completedNodeIds: [], axisLevels: { 1: "L2", 2: "L1", 3: "L1", 4: "L2", 5: "L0" } })).toBe(false);
    expect(isNodeAvailable(node, { completedNodeIds: ["node-2"], axisLevels: { 1: "L2", 2: "L1", 3: "L1", 4: "L2", 5: "L0" } })).toBe(true);

    const a5Node: LearningNode = { ...node, id: "node-6", axis: 5, prerequisites: [], requiresAxisLevel: { axis: 5, level: "L1" } };
    expect(isNodeAvailable(a5Node, { completedNodeIds: ["node-2"], axisLevels: { 1: "L2", 2: "L1", 3: "L1", 4: "L2", 5: "L0" } })).toBe(false);
  });

  it("unlocks gate exam only after required nodes and capstone pass, then scores at 80 percent", () => {
    expect(canAccessGateExam(["node-1", "node-2", "node-3", "node-4"], true).unlocked).toBe(true);
    expect(canAccessGateExam(["node-1", "node-2"], true).unlocked).toBe(false);
    expect(canAccessGateExam(["node-1", "node-2", "node-3", "node-4"], false).reason).toContain("Capstone");

    const result = scoreGateExam(["A", "B", "C", "D", "A"], ["A", "B", "C", "D", "B"]);
    expect(result.score).toBe(80);
    expect(result.passed).toBe(true);
  });

  it("validates item bank rules from the content authoring spec", () => {
    const validMcq: ProblemItem = {
      id: "gate-1",
      title: "Parameterized query check",
      problemType: "gate",
      partType: "mcq",
      axis: 4,
      targetLevel: "L2",
      difficulty: 3,
      scoringMethod: "deterministic",
      payload: { schema_version: "p1-mcq-v0.1", stem: "Which fix prevents SQL injection?" },
      answerKey: { schema_version: "p1-key-v0.1", correct_keys: ["B"] },
      validationStatus: "valid"
    };

    const invalidArtifact: ProblemItem = {
      ...validMcq,
      id: "p2-audit",
      problemType: "audit",
      partType: "audit",
      axis: 2,
      scoringMethod: "llm_judge",
      answerKey: undefined
    };

    expect(validateProblemItem(validMcq).errors).toEqual([]);
    expect(validateProblemItem(invalidArtifact).errors).toContain("Artifact items require ground_truth.");
    expect(validateProblemItem(invalidArtifact).errors).toContain("Artifact items require judge_rubric_ref.");
  });
});
