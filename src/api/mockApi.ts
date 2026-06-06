import type {
  AssessmentStatusResponse,
  CreateAssessmentResponse,
  PartAnswer,
  ProfileResponse,
  SubmitAssessmentResponse
} from "./contracts";
import type { AxisId, SimulatedProfile } from "../types/domain";
import { getReadinessStatus } from "../utils/level";

const parts: CreateAssessmentResponse["parts"] = [
  { id: "p1", title: "P1 MCQ", scoring_method: "deterministic" },
  { id: "p2", title: "P2 Code Audit", scoring_method: "llm_judge" },
  { id: "p3", title: "P3 Recovery", scoring_method: "llm_judge" },
  { id: "p4", title: "P4 Prompt / Plan", scoring_method: "llm_judge" },
  { id: "p5", title: "P5 Mini-viva", scoring_method: "llm_judge" }
];

const pollCounts = new Map<string, number>();
const delay = (ms = 180) => new Promise((resolve) => globalThis.setTimeout(resolve, ms));

export async function createAssessment(): Promise<CreateAssessmentResponse> {
  await delay();
  const assessmentId = `asm-demo-${Date.now()}`;
  pollCounts.set(assessmentId, 0);
  return {
    assessment_id: assessmentId,
    status: "draft",
    parts
  };
}

export async function submitAssessment(assessmentId: string, _partAnswers: PartAnswer[]): Promise<SubmitAssessmentResponse> {
  await delay();
  pollCounts.set(assessmentId, 0);
  return {
    assessment_id: assessmentId,
    status: "scoring",
    poll: `/v1/assessments/${assessmentId}/status`
  };
}

export async function getAssessmentStatus(assessmentId: string): Promise<AssessmentStatusResponse> {
  await delay(260);
  const nextCount = (pollCounts.get(assessmentId) ?? 0) + 1;
  pollCounts.set(assessmentId, nextCount);

  const scoredParts = Math.min(nextCount, parts.length);
  const profileReady = scoredParts >= parts.length;

  return {
    assessment_id: assessmentId,
    status: profileReady ? "scored" : "scoring",
    scored_parts: scoredParts,
    total_parts: parts.length,
    profile_ready: profileReady
  };
}

export function toProfileResponse(profile: SimulatedProfile, sourceAssessmentId: string, gatePassed: boolean): ProfileResponse {
  const levels = gatePassed ? { ...profile.axisLevels, 2: "L2" as const } : profile.axisLevels;
  const confidenceValues = Object.values(profile.confidenceByAxis);
  const meanConfidence = confidenceValues.reduce((total, value) => total + value, 0) / confidenceValues.length;

  return {
    learner_id: profile.learnerId,
    source_assessment_id: sourceAssessmentId,
    levels,
    readiness_status: getReadinessStatus(levels),
    graduation_marker: "L2",
    updated_source: gatePassed ? "gate_exam" : profile.updatedSource,
    red_flags: profile.redFlags.map((flag, index) => ({
      type: flag.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""),
      part: index === 0 ? "p2" : index === 1 ? "p5" : "p3",
      note: flag
    })),
    gaps: profile.gaps.map((gap) => ({
      axis: gap.axis as AxisId,
      current: gap.current,
      needed: gap.target,
      evidence: gap.note
    })),
    quick_wins: profile.quickWins,
    percentile: null,
    scoring_method: "llm_judge",
    model_version: "mock-scoring-adapter",
    rubric_version: "v0.2",
    judge_prompt_version: "jp-v0.2-demo",
    confidence: Number(meanConfidence.toFixed(2)),
    axis_confidence: profile.confidenceByAxis,
    evidence: profile.evidence
  };
}
