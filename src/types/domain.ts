export type Role = "learner" | "mentor" | "admin";

export type AxisId = 1 | 2 | 3 | 4 | 5;

export type LevelId = "L0" | "L1" | "L2" | "L3" | "L4";

export type Readiness = "foundation_needed" | "developing" | "ai_ready" | "advanced";

export type NodeStatus = "locked" | "available" | "in_progress" | "completed";

export type PartType = "mcq" | "audit" | "recovery" | "prompt_plan" | "viva";

export type ProblemType = "mcq" | "audit" | "recovery" | "capstone" | "gate";

export type ScoringMethod = "deterministic" | "llm_judge";

export type ContentType = "markdown" | "video_url" | "external_link";

export type ValidationStatus = "valid" | "warning" | "error";

export type AxisLevelMap = Record<AxisId, LevelId>;

export interface Axis {
  id: AxisId;
  label: string;
  shortLabel: string;
  description: string;
  weight: number;
}

export interface Level {
  id: LevelId;
  label: string;
  value: number;
  description: string;
  shipScope: string;
}

export interface Evidence {
  axis: AxisId;
  source: string;
  quote: string;
  interpretation: string;
}

export interface SimulatedProfile {
  learnerId: string;
  axisLevels: AxisLevelMap;
  readiness: Readiness;
  confidenceByAxis: Record<AxisId, number>;
  evidence: Evidence[];
  redFlags: string[];
  gaps: Array<{ axis: AxisId; current: LevelId; target: LevelId; note: string }>;
  quickWins: string[];
  updatedSource: "intake_test" | "gate_exam";
}

export interface Learner {
  id: string;
  fullName: string;
  email: string;
  cohort: string;
  roleLabel: string;
  optInLeaderboard: boolean;
  optInPercentile: boolean;
  readiness: Readiness;
  levels: AxisLevelMap;
  confidence: Record<AxisId, number>;
  currentNodeId: string;
  completedNodeIds: string[];
  failedLabs: string[];
  stuckDays: number;
  redFlags: string[];
  latestEvidence: Evidence[];
  mentorAction: string;
}

export interface MCQOption {
  key: "A" | "B" | "C" | "D";
  text: string;
}

export interface MCQQuestion {
  id: string;
  stem: string;
  options: MCQOption[];
  axis: AxisId;
  difficulty: number;
  codeBlock?: string;
  correctKey: string;
  rationale: string;
}

export interface ArtifactScenario {
  id: string;
  title: string;
  partType: Exclude<PartType, "mcq">;
  axis: AxisId;
  difficulty: number;
  scenario: string;
  codeBlock?: string;
  stackTrace?: string;
  taskBrief?: string;
  answerFields: string[];
  rubricRef: string;
}

export interface LearningNode {
  id: string;
  title: string;
  axis: AxisId;
  targetLevel: LevelId;
  status: NodeStatus;
  estimatedTime: string;
  targetEvidence: string;
  lessonIds: string[];
  labId: string;
  prerequisites?: string[];
  requiresAxisLevel?: { axis: AxisId; level: LevelId };
  lockReason?: string;
}

export interface LearningContent {
  id: string;
  nodeId: string;
  order: number;
  contentType: ContentType;
  title: string;
  why: string;
  body: string;
  workedExample: string;
  antiPattern: string;
  practice: string;
  checklist: string[];
  targetEvidence: string;
}

export interface Lab {
  id: string;
  nodeId: string;
  title: string;
  type: "mcq_checkpoint" | "audit_lab" | "recovery_lab" | "prompt_plan_lab";
  scenario: string;
  instructions: string;
  answerFields: string[];
  rubricPreview: string[];
  targetEvidence: string;
  strongSample: string;
  weakSample: string;
}

export interface Capstone {
  id: string;
  title: string;
  scenario: string;
  expectedArtifact: string[];
  checklist: string[];
  rubricPreview: string[];
  targetEvidence: string[];
  strongSample: string;
  weakSample: string;
}

export interface GateExam {
  id: string;
  level: LevelId;
  focusAxes: AxisId[];
  numberOfQuestions: number;
  passThreshold: number;
  difficultyDistribution: Record<number, number>;
  questions: MCQQuestion[];
}

export interface ProblemItem {
  id: string;
  title: string;
  problemType: ProblemType;
  partType?: PartType | null;
  axis: AxisId;
  targetLevel: LevelId;
  difficulty: number;
  scoringMethod: ScoringMethod;
  payload: Record<string, unknown>;
  answerKey?: Record<string, unknown>;
  groundTruth?: Record<string, unknown>;
  judgeRubricRef?: string;
  validationStatus: ValidationStatus;
}

export interface ValidationResult {
  status: ValidationStatus;
  checks: string[];
  warnings: string[];
  errors: string[];
}

export interface DashboardData {
  cohortName: string;
  cohortSize: number;
  completionRate: number;
  aiReadyCount: number;
  averageLevelByAxis: Record<AxisId, number>;
  levelDistribution: Array<{ level: LevelId; count: number }>;
  stuckNodes: Array<{ nodeId: string; title: string; learners: number }>;
  recentSubmissions: Array<{ learner: string; activity: string; result: string; time: string }>;
  redFlagSummary: Array<{ label: string; count: number; severity: "warning" | "danger" }>;
  recommendedInterventions: string[];
}
