import type { DashboardData } from "../types/domain";

export const dashboardData: DashboardData = {
  cohortName: "Cohort 2 - AI Practical Builders",
  cohortSize: 12,
  completionRate: 68,
  aiReadyCount: 4,
  averageLevelByAxis: { 1: 1.8, 2: 1.7, 3: 1.5, 4: 1.9, 5: 0.7 },
  levelDistribution: [
    { level: "L0", count: 2 },
    { level: "L1", count: 4 },
    { level: "L2", count: 4 },
    { level: "L3", count: 2 },
    { level: "L4", count: 0 }
  ],
  stuckNodes: [
    { nodeId: "node-2", title: "Reviewing AI-generated Code", learners: 4 },
    { nodeId: "node-3", title: "Recovery after AI Breaks the Build", learners: 3 },
    { nodeId: "node-4", title: "Tests before Accepting AI Code", learners: 2 }
  ],
  recentSubmissions: [
    { learner: "Đặng Văn Minh", activity: "P2 Audit Lab", result: "Needs review - missed SQL injection", time: "12 min ago" },
    { learner: "Nguyễn Hoài An", activity: "Gate Exam L1", result: "Passed 90%", time: "28 min ago" },
    { learner: "Vũ Minh Tuấn", activity: "Recovery Lab", result: "Failed 62%", time: "1 hr ago" },
    { learner: "Lê Thanh Mai", activity: "Capstone", result: "Passed 88%", time: "2 hr ago" }
  ],
  redFlagSummary: [
    { label: "Missed security issues", count: 4, severity: "danger" },
    { label: "Stuck on recovery lab", count: 3, severity: "warning" },
    { label: "Gate Exam failed twice", count: 1, severity: "danger" },
    { label: "Low confidence / needs review", count: 2, severity: "warning" }
  ],
  recommendedInterventions: [
    "Run a 30-minute guided audit clinic for learners below L2 on Axis 2.",
    "Pair at-risk learners with a mentor for one rollback drill.",
    "Require a written accept/revise/reject note before capstone submission.",
    "Use ground-truth examples to calibrate mentor feedback on artifact scoring."
  ]
};
