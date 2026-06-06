import { AlertTriangle, CheckCircle2, GraduationCap, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { LevelDistributionChart } from "../components/charts/LevelDistributionChart";
import { MetricCard } from "../components/common/MetricCard";
import { PageHeader } from "../components/common/PageHeader";
import { ProgressBar } from "../components/common/ProgressBar";
import { StatusBadge } from "../components/common/StatusBadge";
import { axes } from "../data/axes";
import { dashboardData } from "../data/dashboard";
import { learners } from "../data/learners";
import { axisShortLabel } from "../utils/format";

export function MentorDashboardPage() {
  const atRisk = learners.filter((learner) => learner.redFlags.length > 0 || learner.stuckDays >= 4);

  return (
    <div>
      <PageHeader title="Mentor Dashboard" eyebrow="F5 - cohort operations">
        Cohort overview, progress distribution, at-risk learners, stuck nodes, red flags, and recommended interventions.
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-4">
        <div data-tour="mentor-dashboard">
          <MetricCard label="Cohort size" value={dashboardData.cohortSize} icon={<Users size={20} />} />
        </div>
        <MetricCard label="Completion rate" value={`${dashboardData.completionRate}%`} icon={<CheckCircle2 size={20} />} />
        <MetricCard label="AI-ready count" value={dashboardData.aiReadyCount} icon={<GraduationCap size={20} />} />
        <MetricCard label="At-risk learners" value={atRisk.length} icon={<AlertTriangle size={20} />} detail="Simulated risk logic" />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
        <LevelDistributionChart data={dashboardData.levelDistribution} />
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-bold text-slate-950">Average level by axis</h2>
          <div className="mt-4 space-y-3">
            {axes.map((axis) => (
              <div key={axis.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{axisShortLabel(axis.id)}</span>
                  <span>{dashboardData.averageLevelByAxis[axis.id].toFixed(1)}</span>
                </div>
                <ProgressBar value={(dashboardData.averageLevelByAxis[axis.id] / 4) * 100} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-bold text-slate-950">At-risk learners</h2>
          <div className="mt-3 space-y-3">
            {atRisk.slice(0, 5).map((learner) => (
              <Link key={learner.id} to={`/mentor/learners/${learner.id}`} className="block rounded border border-slate-200 bg-slate-50 p-3 hover:bg-blue-50">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-slate-950">{learner.fullName}</span>
                  <StatusBadge status="error" label={`${learner.stuckDays} stuck days`} />
                </div>
                <p className="mt-1 text-sm text-slate-600">{learner.redFlags.join(", ")}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-bold text-slate-950">Recent submissions</h2>
          <div className="mt-3 space-y-3">
            {dashboardData.recentSubmissions.map((submission) => (
              <div key={`${submission.learner}-${submission.activity}`} className="rounded border border-slate-200 bg-slate-50 p-3 text-sm">
                <p className="font-semibold text-slate-950">{submission.learner} - {submission.activity}</p>
                <p className="mt-1 text-slate-600">{submission.result} · {submission.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-bold text-slate-950">Stuck nodes</h2>
          <div className="mt-3 space-y-2">
            {dashboardData.stuckNodes.map((node) => <p key={node.nodeId} className="text-sm text-slate-600">{node.title}: <strong>{node.learners}</strong> learners</p>)}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-bold text-slate-950">Recommended interventions</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {dashboardData.recommendedInterventions.map((item) => <li key={item}>- {item}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
