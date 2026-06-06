import type { AxisId, AxisLevelMap, Evidence, LevelId, Readiness, ScoringMethod } from "../types/domain";

export type AssessmentStatus = "draft" | "submitted" | "scoring" | "scored" | "partial";

export type AssessmentPartId = "p1" | "p2" | "p3" | "p4" | "p5";

export type AuditFinding = {
  location: string;
  type: string;
  severity: string;
  why: string;
  proposed_fix: string;
};

export type AssessmentAnswers = {
  p1: Record<string, string>;
  p2: AuditFinding[];
  p3: Record<string, string>;
  p4: Record<string, string>;
  p5: Record<string, string>;
};

export type AssessmentPart = {
  id: AssessmentPartId;
  title: string;
  scoring_method: ScoringMethod;
};

export type PartAnswer = {
  part_id: AssessmentPartId;
  answer: unknown;
};

export type CreateAssessmentResponse = {
  assessment_id: string;
  status: "draft";
  parts: AssessmentPart[];
};

export type SubmitAssessmentResponse = {
  assessment_id: string;
  status: "scoring";
  poll: string;
};

export type AssessmentStatusResponse = {
  assessment_id: string;
  status: Extract<AssessmentStatus, "scoring" | "scored" | "partial">;
  scored_parts: number;
  total_parts: number;
  profile_ready: boolean;
};

export type ProfileGap = {
  axis: AxisId;
  current: LevelId;
  needed: LevelId;
  evidence: string;
};

export type ProfileRedFlag = {
  type: string;
  part: AssessmentPartId | "gate_exam";
  note: string;
};

export type ProfileResponse = {
  learner_id: string;
  source_assessment_id: string;
  levels: AxisLevelMap;
  readiness_status: Readiness;
  graduation_marker: "L2";
  updated_source: "intake_test" | "gate_exam";
  red_flags: ProfileRedFlag[];
  gaps: ProfileGap[];
  quick_wins: string[];
  percentile: number | null;
  scoring_method: ScoringMethod;
  model_version: string;
  rubric_version: string;
  judge_prompt_version: string;
  confidence: number;
  axis_confidence?: Partial<Record<AxisId, number>>;
  evidence?: Evidence[];
};
