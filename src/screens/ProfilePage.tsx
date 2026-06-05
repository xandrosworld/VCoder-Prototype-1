import { Link } from "react-router-dom";
import { RadarProfileChart } from "../components/charts/RadarProfileChart";
import { AxisBadge } from "../components/common/AxisBadge";
import { EvidencePanel } from "../components/common/EvidencePanel";
import { LevelBadge } from "../components/common/LevelBadge";
import { PageHeader } from "../components/common/PageHeader";
import { ProgressBar } from "../components/common/ProgressBar";
import { StatusBadge } from "../components/common/StatusBadge";
import { axes } from "../data/axes";
import { useDemo } from "../state/DemoContext";
import { levelToNumber, readinessLabel } from "../utils/level";

export function ProfilePage() {
  const { profile, gatePassed } = useDemo();
  const axisLevels = gatePassed ? { ...profile.axisLevels, 2: "L2" as const } : profile.axisLevels;

  return (
    <div>
      <PageHeader title="AI-Ready Profile" eyebrow="F2 - Profile">
        Profile will update after Gate Exam and Capstone. This prototype shows fixed simulated scoring evidence for Đặng Văn Minh.
      </PageHeader>
      <div className="mb-4 flex flex-wrap gap-2">
        <StatusBadge status="warning" label="Simulated scoring" />
        <StatusBadge status={profile.readiness === "ai_ready" ? "valid" : "warning"} label={`Readiness: ${readinessLabel(gatePassed ? "ai_ready" : profile.readiness)}`} />
        <StatusBadge status="valid" label="Graduation marker: L2" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <RadarProfileChart levels={axisLevels} />
        <div className="grid gap-3 sm:grid-cols-2">
          {axes.map((axis) => (
            <div key={axis.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <AxisBadge axis={axis.id} />
                <LevelBadge level={axisLevels[axis.id]} />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-950">{axis.label}</p>
              <div className="mt-3">
                <ProgressBar value={(levelToNumber(axisLevels[axis.id]) / 4) * 100} tone={levelToNumber(axisLevels[axis.id]) >= 2 ? "green" : "amber"} />
              </div>
              <p className="mt-2 text-xs text-slate-500">Confidence {(profile.confidenceByAxis[axis.id] * 100).toFixed(0)}%</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-bold text-slate-950">What this means</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Minh is developing: strong enough to scope prompts and understand foundations, but not yet AI-Ready because Axis 2 remains below L2 and Axis 5 has weak guardrail evidence.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-bold text-slate-950">Gap analysis</h2>
          <div className="mt-3 space-y-3">
            {profile.gaps.map((gap) => (
              <div key={gap.axis} className="text-sm">
                <AxisBadge axis={gap.axis} />
                <p className="mt-1 text-slate-600">{gap.current} -&gt; {gap.target}: {gap.note}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-bold text-slate-950">Quick wins</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600">
            {profile.quickWins.map((win) => <li key={win}>{win}</li>)}
          </ol>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px]">
        <EvidencePanel evidence={profile.evidence} />
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
          <h2 className="font-bold text-rose-950">Red flags</h2>
          <ul className="mt-3 space-y-2 text-sm text-rose-900">
            {profile.redFlags.map((flag) => <li key={flag}>- {flag}</li>)}
          </ul>
          <Link to="/learning-path" className="mt-5 inline-flex rounded bg-rose-700 px-3 py-2 text-sm font-bold text-white">Open recommended path</Link>
        </div>
      </div>
    </div>
  );
}
