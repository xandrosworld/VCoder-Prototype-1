import type { AxisLevelMap, LearningNode } from "../types/domain";
import { levelToNumber } from "./level";

const requiredGateNodeIds = ["node-1", "node-2", "node-3", "node-4"];

export function isNodeAvailable(
  node: LearningNode,
  state: { completedNodeIds: string[]; axisLevels: AxisLevelMap }
): boolean {
  const prerequisitesMet = (node.prerequisites ?? []).every((id) => state.completedNodeIds.includes(id));
  const axisRequirementMet = node.requiresAxisLevel
    ? levelToNumber(state.axisLevels[node.requiresAxisLevel.axis]) >= levelToNumber(node.requiresAxisLevel.level)
    : true;

  return prerequisitesMet && axisRequirementMet;
}

export function getNodeLockReason(node: LearningNode, state: { completedNodeIds: string[]; axisLevels: AxisLevelMap }): string | undefined {
  if (isNodeAvailable(node, state)) return undefined;
  return node.lockReason ?? "Locked until prerequisite evidence is complete.";
}

export function canAccessGateExam(completedNodeIds: string[], capstonePassed: boolean): { unlocked: boolean; reason?: string } {
  const missingNodes = requiredGateNodeIds.filter((id) => !completedNodeIds.includes(id));
  if (missingNodes.length > 0) {
    return { unlocked: false, reason: `Complete required nodes first: ${missingNodes.join(", ")}.` };
  }

  if (!capstonePassed) {
    return { unlocked: false, reason: "Capstone must be passed before the Level Gate Exam unlocks." };
  }

  return { unlocked: true };
}
