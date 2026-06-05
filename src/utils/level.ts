import type { AxisLevelMap, LevelId, Readiness } from "../types/domain";

const levelValue: Record<LevelId, number> = {
  L0: 0,
  L1: 1,
  L2: 2,
  L3: 3,
  L4: 4
};

export function levelToNumber(level: LevelId): number {
  return levelValue[level];
}

export function getReadinessStatus(levels: AxisLevelMap): Readiness {
  const advanced = levelToNumber(levels[1]) >= 3 && levelToNumber(levels[2]) >= 3 && levelToNumber(levels[3]) >= 3 && levelToNumber(levels[4]) >= 3 && levelToNumber(levels[5]) >= 2;
  const aiReady = levelToNumber(levels[1]) >= 2 && levelToNumber(levels[2]) >= 2 && levelToNumber(levels[3]) >= 1 && levelToNumber(levels[4]) >= 2;
  const coreL0 = levels[1] === "L0" || levels[2] === "L0" || levels[4] === "L0";

  if (advanced) return "advanced";
  if (aiReady) return "ai_ready";
  if (coreL0) return "foundation_needed";
  return "developing";
}

export function averageLevel(levels: AxisLevelMap): number {
  return Number((Object.values(levels).reduce((total, level) => total + levelToNumber(level), 0) / 5).toFixed(1));
}

export function readinessLabel(readiness: Readiness): string {
  return {
    foundation_needed: "Foundation needed",
    developing: "Developing",
    ai_ready: "AI-Ready",
    advanced: "Advanced"
  }[readiness];
}
