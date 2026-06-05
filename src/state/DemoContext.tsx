import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Capstone, ProblemItem, Role } from "../types/domain";
import { getSimulatedProfile } from "../utils/scoringSimulation";

type DemoContextValue = {
  role: Role;
  setRole: (role: Role) => void;
  mainLearnerId: string;
  profile: ReturnType<typeof getSimulatedProfile>;
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

const storageKey = "vcoder-demo-state-v1";

type StoredState = {
  role: Role;
  completedNodeIds: string[];
  capstonePassed: boolean;
  gatePassed: boolean;
  authoredItems: ProblemItem[];
};

const initialState: StoredState = {
  role: "learner",
  completedNodeIds: ["node-1"],
  capstonePassed: false,
  gatePassed: false,
  authoredItems: []
};

function readStoredState(): StoredState {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? { ...initialState, ...JSON.parse(raw) } : initialState;
  } catch {
    return initialState;
  }
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredState>(readStoredState);
  const mainLearnerId = "learner-minh";

  function persist(next: StoredState) {
    setState(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  const value = useMemo<DemoContextValue>(
    () => ({
      role: state.role,
      setRole: (role) => persist({ ...state, role }),
      mainLearnerId,
      profile: getSimulatedProfile(mainLearnerId),
      completedNodeIds: state.completedNodeIds,
      completeNode: (nodeId) =>
        persist({
          ...state,
          completedNodeIds: Array.from(new Set([...state.completedNodeIds, nodeId]))
        }),
      completeCoreNodes: () =>
        persist({
          ...state,
          completedNodeIds: Array.from(new Set([...state.completedNodeIds, "node-1", "node-2", "node-3", "node-4"]))
        }),
      capstonePassed: state.capstonePassed,
      setCapstonePassed: (passed) =>
        persist({
          ...state,
          capstonePassed: passed,
          completedNodeIds: passed ? Array.from(new Set([...state.completedNodeIds, "node-1", "node-2", "node-3", "node-4"])) : state.completedNodeIds
        }),
      gatePassed: state.gatePassed,
      setGatePassed: (passed) => persist({ ...state, gatePassed: passed, completedNodeIds: passed ? ["node-1", "node-2", "node-3", "node-4"] : state.completedNodeIds }),
      authoredItems: state.authoredItems,
      addAuthoredItem: (item) => persist({ ...state, authoredItems: [item, ...state.authoredItems] }),
      resetDemo: () => {
        localStorage.removeItem(storageKey);
        setState(initialState);
      }
    }),
    [state]
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) {
    throw new Error("useDemo must be used inside DemoProvider");
  }
  return value;
}
