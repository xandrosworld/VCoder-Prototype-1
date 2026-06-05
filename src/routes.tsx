import { Navigate, Route, Routes } from "react-router-dom";
import { AdminContentAuthoringPage } from "./screens/AdminContentAuthoringPage";
import { AdminDashboardPage } from "./screens/AdminDashboardPage";
import { AdminGateExamConfigPage } from "./screens/AdminGateExamConfigPage";
import { AdminItemBankPage } from "./screens/AdminItemBankPage";
import { AdminRubricPage } from "./screens/AdminRubricPage";
import { CapstonePage } from "./screens/CapstonePage";
import { EntryTestOverview } from "./screens/EntryTestOverview";
import { EntryTestPartPage } from "./screens/EntryTestPartPage";
import { GateExamPage } from "./screens/GateExamPage";
import { LabPage } from "./screens/LabPage";
import { LandingPage } from "./screens/LandingPage";
import { LeaderboardPage } from "./screens/LeaderboardPage";
import { LearnerDrilldownPage } from "./screens/LearnerDrilldownPage";
import { LearningPathPage } from "./screens/LearningPathPage";
import { LessonDetailPage } from "./screens/LessonDetailPage";
import { MentorDashboardPage } from "./screens/MentorDashboardPage";
import { ProfilePage } from "./screens/ProfilePage";
import { ScoringPage } from "./screens/ScoringPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/entry-test" element={<EntryTestOverview />} />
      <Route path="/entry-test/:partId" element={<EntryTestPartPage />} />
      <Route path="/scoring" element={<ScoringPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/learning-path" element={<LearningPathPage />} />
      <Route path="/lesson/:lessonId" element={<LessonDetailPage />} />
      <Route path="/lab/:labId" element={<LabPage />} />
      <Route path="/capstone" element={<CapstonePage />} />
      <Route path="/gate-exam" element={<GateExamPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/mentor" element={<MentorDashboardPage />} />
      <Route path="/mentor/learners/:learnerId" element={<LearnerDrilldownPage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/admin/authoring" element={<AdminContentAuthoringPage />} />
      <Route path="/admin/item-bank" element={<AdminItemBankPage />} />
      <Route path="/admin/rubric" element={<AdminRubricPage />} />
      <Route path="/admin/gate-config" element={<AdminGateExamConfigPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
