export type Axis = 1 | 2 | 3 | 4 | 5;

export type Level = "L0" | "L1" | "L2" | "L3" | "L4";

export type AxisLevelMap = Record<Axis, Level>;

export type ReadinessStatus = "Foundation needed" | "Developing" | "AI-Ready" | "Advanced";

export interface EvidenceSnippet {
  axis: Axis;
  source: "P1 MCQ" | "P2 Code Audit" | "P3 Recovery" | "P4 Prompt / Plan" | "P5 Mini-viva" | "Gate Exam";
  quote: string;
}

export interface Learner {
  id: string;
  name: string;
  role: string;
  optedInLeaderboard: boolean;
  optedInPercentile: boolean;
  levels: AxisLevelMap;
  quickWins: string[];
  evidence: EvidenceSnippet[];
  currentNode: string;
  stuckDays: number;
}

export interface RankedLearner extends Learner {
  averageLevel: number;
  readyAxisCount: number;
}

export interface GateExamResult {
  score: number;
  correctCount: number;
  totalCount: number;
  passed: boolean;
}
