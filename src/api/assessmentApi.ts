import type {
  AssessmentStatusResponse,
  CreateAssessmentResponse,
  PartAnswer,
  ProfileResponse,
  SubmitAssessmentResponse
} from "./contracts";
import * as mockApi from "./mockApi";

const baseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "");
const demoToken = import.meta.env.VITE_DEMO_TOKEN as string | undefined;

export const assessmentApiMode = baseUrl ? "real" : "mock";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!baseUrl) {
    throw new Error("VITE_API_BASE_URL is not configured.");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(demoToken ? { Authorization: `Bearer ${demoToken}` } : {}),
      ...init?.headers
    }
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload?.error?.message ?? `Request failed with HTTP ${response.status}.`;
    throw new Error(message);
  }

  return payload as T;
}

export function createAssessment(): Promise<CreateAssessmentResponse> {
  if (assessmentApiMode === "mock") return mockApi.createAssessment();
  return request<CreateAssessmentResponse>("/v1/assessments", {
    method: "POST",
    body: JSON.stringify({})
  });
}

export function submitAssessment(assessmentId: string, partAnswers: PartAnswer[]): Promise<SubmitAssessmentResponse> {
  if (assessmentApiMode === "mock") return mockApi.submitAssessment(assessmentId, partAnswers);
  return request<SubmitAssessmentResponse>(`/v1/assessments/${assessmentId}/submit`, {
    method: "POST",
    body: JSON.stringify({ part_answers: partAnswers })
  });
}

export function getAssessmentStatus(assessmentId: string): Promise<AssessmentStatusResponse> {
  if (assessmentApiMode === "mock") return mockApi.getAssessmentStatus(assessmentId);
  return request<AssessmentStatusResponse>(`/v1/assessments/${assessmentId}/status`);
}

export function getProfile(learnerId: string): Promise<ProfileResponse> {
  if (assessmentApiMode === "mock") {
    throw new Error("Mock profile is produced from local demo data.");
  }
  return request<ProfileResponse>(`/v1/learners/${learnerId}/profile`);
}
