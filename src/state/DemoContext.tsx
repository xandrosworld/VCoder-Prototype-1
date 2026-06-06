import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type {
  AssessmentAnswers,
  AssessmentStatus,
  AuditFinding,
  ProfileResponse
} from "../api/contracts";
import {
  assessmentApiMode,
  createAssessment,
  getAssessmentStatus,
  getProfile,
  submitAssessment
} from "../api/assessmentApi";
import { toProfileResponse } from "../api/mockApi";
import { mainLearner } from "../data/learners";
import type { ProblemItem, Role } from "../types/domain";
import { emptyAssessmentAnswers, toPartAnswers } from "../utils/assessment";
import { getSimulatedProfile } from "../utils/scoringSimulation";

type DemoAssessmentState = {
  assessmentId: string | null;
  status: "not_started" | AssessmentStatus;
  pollUrl: string | null;
  scoredParts: number;
  totalParts: number;
  profileReady: boolean;
};

type DemoContextValue = {
  role: Role;
  setRole: (role: Role) => void;
  mainLearnerId: string;
  mainLearnerName: string;
  profile: ReturnType<typeof getSimulatedProfile>;
  profileSnapshot: ProfileResponse | null;
  assessment: DemoAssessmentState;
  assessmentAnswers: AssessmentAnswers;
  assessmentBusy: boolean;
  assessmentError: string | null;
  apiMode: "mock" | "real";
  startAssessment: () => Promise<void>;
  submitEntryTest: () => Promise<boolean>;
  pollAssessmentStatus: () => Promise<void>;
  retryAssessment: () => void;
  setP1Answer: (questionId: string, answer: string) => void;
  setP2Finding: (index: number, field: keyof AuditFinding, value: string) => void;
  setArtifactAnswer: (partId: "p3" | "p4", field: string, value: string) => void;
  setP5Answer: (questionId: string, value: string) => void;
  replaceAssessmentAnswers: (answers: AssessmentAnswers) => void;
  completedNodeIds: string[];
  completeNode: (nodeId: string) => void;
  completeCoreNodes: () => void;
  capstonePassed: boolean;
  setCapstonePassed: (passed: boolean) => void;
  gatePassed: boolean;
  setGatePassed: (passed: boolean) => void;
  authoredItems: ProblemItem[];
  addAuthoredItem: (item: ProblemItem) => void;
  resetDemo: () => void;
};

const DemoContext = createContext<DemoContextValue | undefined>(undefined);
const storageKey = "vcoder-demo-state-v2";

type StoredState = {
  role: Role;
  assessment: DemoAssessmentState;
  assessmentAnswers: AssessmentAnswers;
  profileSnapshot: ProfileResponse | null;
  completedNodeIds: string[];
  capstonePassed: boolean;
  gatePassed: boolean;
  authoredItems: ProblemItem[];
};

const initialAssessment: DemoAssessmentState = {
  assessmentId: null,
  status: "not_started",
  pollUrl: null,
  scoredParts: 0,
  totalParts: 5,
  profileReady: false
};

function createInitialState(): StoredState {
  return {
    role: "learner",
    assessment: { ...initialAssessment },
    assessmentAnswers: emptyAssessmentAnswers(),
    profileSnapshot: null,
    completedNodeIds: ["node-1"],
    capstonePassed: false,
    gatePassed: false,
    authoredItems: []
  };
}

function readStoredState(): StoredState {
  const initial = createInitialState();
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return initial;
    const stored = JSON.parse(raw) as Partial<StoredState>;
    return {
      ...initial,
      ...stored,
      assessment: { ...initial.assessment, ...stored.assessment },
      assessmentAnswers: { ...initial.assessmentAnswers, ...stored.assessmentAnswers }
    };
  } catch {
    return initial;
  }
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredState>(readStoredState);
  const [assessmentBusy, setAssessmentBusy] = useState(false);
  const [assessmentError, setAssessmentError] = useState<string | null>(null);
  const mainLearnerId = mainLearner.id;
  const localProfile = useMemo(() => getSimulatedProfile(mainLearnerId), [mainLearnerId]);

  const persist = useCallback((next: StoredState | ((current: StoredState) => StoredState)) => {
    setState((current) => {
      const resolved = typeof next === "function" ? next(current) : next;
      localStorage.setItem(storageKey, JSON.stringify(resolved));
      return resolved;
    });
  }, []);

  const startAssessment = useCallback(async () => {
    if (state.assessment.assessmentId && state.assessment.status !== "not_started") return;
    setAssessmentBusy(true);
    setAssessmentError(null);
    try {
      const created = await createAssessment();
      persist((current) => ({
        ...current,
        assessment: {
          assessmentId: created.assessment_id,
          status: created.status,
          pollUrl: null,
          scoredParts: 0,
          totalParts: created.parts.length,
          profileReady: false
        },
        profileSnapshot: null
      }));
    } catch (error) {
      setAssessmentError(error instanceof Error ? error.message : "Could not start the assessment.");
    } finally {
      setAssessmentBusy(false);
    }
  }, [persist, state.assessment.assessmentId, state.assessment.status]);

  const submitEntryTest = useCallback(async () => {
    setAssessmentBusy(true);
    setAssessmentError(null);
    try {
      const assessmentId = state.assessment.assessmentId ?? (await createAssessment()).assessment_id;
      const submitted = await submitAssessment(assessmentId, toPartAnswers(state.assessmentAnswers));
      persist((current) => ({
        ...current,
        assessment: {
          assessmentId: submitted.assessment_id,
          status: submitted.status,
          pollUrl: submitted.poll,
          scoredParts: 0,
          totalParts: 5,
          profileReady: false
        },
        profileSnapshot: null
      }));
      return true;
    } catch (error) {
      setAssessmentError(error instanceof Error ? error.message : "Could not submit the assessment.");
      return false;
    } finally {
      setAssessmentBusy(false);
    }
  }, [persist, state.assessment.assessmentId, state.assessmentAnswers]);

  const pollAssessmentStatus = useCallback(async () => {
    if (!state.assessment.assessmentId || assessmentBusy) return;
    setAssessmentBusy(true);
    try {
      const status = await getAssessmentStatus(state.assessment.assessmentId);
      let snapshot = state.profileSnapshot;
      if (status.profile_ready && !snapshot) {
        snapshot = assessmentApiMode === "real"
          ? await getProfile(mainLearnerId)
          : toProfileResponse(localProfile, status.assessment_id, state.gatePassed);
      }
      persist((current) => ({
        ...current,
        assessment: {
          ...current.assessment,
          status: status.status,
          scoredParts: status.scored_parts,
          totalParts: status.total_parts,
          profileReady: status.profile_ready
        },
        profileSnapshot: snapshot
      }));
      setAssessmentError(null);
    } catch (error) {
      setAssessmentError(error instanceof Error ? error.message : "Could not refresh scoring status.");
    } finally {
      setAssessmentBusy(false);
    }
  }, [
    assessmentBusy,
    localProfile,
    mainLearnerId,
    persist,
    state.assessment.assessmentId,
    state.gatePassed,
    state.profileSnapshot
  ]);

  const setP1Answer = useCallback((questionId: string, answer: string) => {
    persist((current) => ({
      ...current,
      assessmentAnswers: {
        ...current.assessmentAnswers,
        p1: { ...current.assessmentAnswers.p1, [questionId]: answer }
      }
    }));
  }, [persist]);

  const setP2Finding = useCallback((index: number, field: keyof AuditFinding, value: string) => {
    persist((current) => ({
      ...current,
      assessmentAnswers: {
        ...current.assessmentAnswers,
        p2: current.assessmentAnswers.p2.map((finding, findingIndex) =>
          findingIndex === index ? { ...finding, [field]: value } : finding
        )
      }
    }));
  }, [persist]);

  const setArtifactAnswer = useCallback((partId: "p3" | "p4", field: string, value: string) => {
    persist((current) => ({
      ...current,
      assessmentAnswers: {
        ...current.assessmentAnswers,
        [partId]: { ...current.assessmentAnswers[partId], [field]: value }
      }
    }));
  }, [persist]);

  const setP5Answer = useCallback((questionId: string, value: string) => {
    persist((current) => ({
      ...current,
      assessmentAnswers: {
        ...current.assessmentAnswers,
        p5: { ...current.assessmentAnswers.p5, [questionId]: value }
      }
    }));
  }, [persist]);

  const value = useMemo<DemoContextValue>(
    () => ({
      role: state.role,
      setRole: (role) => persist((current) => ({ ...current, role })),
      mainLearnerId,
      mainLearnerName: mainLearner.fullName,
      profile: localProfile,
      profileSnapshot: state.profileSnapshot,
      assessment: state.assessment,
      assessmentAnswers: state.assessmentAnswers,
      assessmentBusy,
      assessmentError,
      apiMode: assessmentApiMode,
      startAssessment,
      submitEntryTest,
      pollAssessmentStatus,
      retryAssessment: () => setAssessmentError(null),
      setP1Answer,
      setP2Finding,
      setArtifactAnswer,
      setP5Answer,
      replaceAssessmentAnswers: (answers) => persist((current) => ({ ...current, assessmentAnswers: answers })),
      completedNodeIds: state.completedNodeIds,
      completeNode: (nodeId) =>
        persist((current) => ({
          ...current,
          completedNodeIds: Array.from(new Set([...current.completedNodeIds, nodeId]))
        })),
      completeCoreNodes: () =>
        persist((current) => ({
          ...current,
          completedNodeIds: Array.from(new Set([...current.completedNodeIds, "node-1", "node-2", "node-3", "node-4"]))
        })),
      capstonePassed: state.capstonePassed,
      setCapstonePassed: (passed) =>
        persist((current) => ({
          ...current,
          capstonePassed: passed
        })),
      gatePassed: state.gatePassed,
      setGatePassed: (passed) =>
        persist((current) => {
          const nextProfile = passed && current.profileSnapshot
            ? {
                ...current.profileSnapshot,
                levels: { ...current.profileSnapshot.levels, 2: "L2" as const },
                readiness_status: "ai_ready" as const,
                updated_source: "gate_exam" as const,
                gaps: current.profileSnapshot.gaps.filter((gap) => gap.axis !== 2)
              }
            : current.profileSnapshot;
          return {
            ...current,
            gatePassed: passed,
            profileSnapshot: nextProfile
          };
        }),
      authoredItems: state.authoredItems,
      addAuthoredItem: (item) =>
        persist((current) => ({ ...current, authoredItems: [item, ...current.authoredItems] })),
      resetDemo: () => {
        const initial = createInitialState();
        localStorage.removeItem(storageKey);
        setAssessmentError(null);
        setState(initial);
      }
    }),
    [
      assessmentBusy,
      assessmentError,
      localProfile,
      mainLearnerId,
      persist,
      pollAssessmentStatus,
      setArtifactAnswer,
      setP1Answer,
      setP2Finding,
      setP5Answer,
      startAssessment,
      state,
      submitEntryTest
    ]
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("useDemo must be used inside DemoProvider");
  return value;
}
