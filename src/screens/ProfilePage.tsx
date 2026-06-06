import { AlertTriangle, ClipboardList, Info } from "lucide-react";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { toProfileResponse } from "../api/mockApi";
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
  const location = useLocation();
  const {
    apiMode,
    assessment,
    assessmentError,
    gatePassed,
    mainLearnerName,
    profile,
    profileSnapshot
  } = useDemo();
  const tourPreview = new URLSearchParams(location.search).get("tour") === "1";
  const previewSnapshot = useMemo(
    () => toProfileResponse(profile, "asm-guided-tour", gatePassed),
    [gatePassed, profile]
  );
  const visibleSnapshot = tourPreview ? previewSnapshot : profileSnapshot;
  const profileReady = tourPreview || assessment.profileReady;

  if (!profileReady || !visibleSnapshot) {
    return (
      <div>
        <PageHeader title="AI-Ready Profile" eyebrow="F2 - Profile">
          Profile is a read-only snapshot generated after the entry test has been scored.
        </PageHeader>
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <ClipboardList className="mx-auto text-slate-400" size={36} />
          <h2 className="mt-4 text-xl font-bold text-slate-950">
            {assessment.status === "scoring" ? "Assessment is still being scored" : "No Profile is available yet"}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
            {assessmentError
              ? assessmentError
              : assessment.status === "scoring"
                ? "Return to the scoring screen to continue polling. This page will not invent levels before the snapshot is ready."
                : "Complete all five entry-test parts to generate levels, evidence, gaps, quick wins and red flags."}
          </p>
          <Link
            to={assessment.status === "scoring" ? "/scoring" : "/entry-test"}
            className="mt-5 inline-flex rounded bg-blue-600 px-4 py-3 text-sm font-bold text-white"
          >
            {assessment.status === "scoring" ? "Return to scoring" : "Open entry test"}
          </Link>
        </div>
      </div>
    );
  }

  const axisLevels = visibleSnapshot.levels;
  const readiness = visibleSnapshot.readiness_status;

  return (
    <div>
      <PageHeader title="AI-Ready Profile" eyebrow="F2 - Profile">
        Read-only Profile snapshot generated from assessment {visibleSnapshot.source_assessment_id}. Gate Exam updates create a new learning-progress state without recalculating scores in this screen.
      </PageHeader>

      <div className="mb-4 flex flex-wrap gap-2">
        <StatusBadge status={apiMode === "mock" ? "warning" : "valid"} label={`${apiMode === "mock" ? "Mock" : "Real"} API`} />
        <StatusBadge label={`Source: ${visibleSnapshot.updated_source}`} />
        <StatusBadge status={readiness === "ai_ready" || readiness === "advanced" ? "valid" : "warning"} label={`Readiness: ${readinessLabel(readiness)}`} />
        <StatusBadge status="valid" label={`Graduation marker: ${visibleSnapshot.graduation_marker}`} />
        <StatusBadge label={`Rubric ${visibleSnapshot.rubric_version}`} />
        <StatusBadge label={`Confidence ${(visibleSnapshot.confidence * 100).toFixed(0)}%`} />
      </div>

      {assessment.status === "partial" ? (
        <div className="mb-5 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-950">
          <AlertTriangle className="mt-0.5 shrink-0" size={20} />
          <p className="text-sm">Some parts could not be scored. Missing evidence is shown as unavailable instead of assigning an invented level.</p>
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <div data-tour="profile-overview">
          <RadarProfileChart levels={axisLevels} />
        </div>
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
              <p className="mt-2 text-xs text-slate-500">
                {visibleSnapshot.axis_confidence?.[axis.id] === undefined
                  ? "Axis confidence unavailable"
                  : `Confidence ${(visibleSnapshot.axis_confidence[axis.id]! * 100).toFixed(0)}%`}
              </p>
              {axis.id === 5 ? <p className="mt-2 text-xs font-semibold text-blue-700">Measured and displayed, but not used to gate AI-Ready status.</p> : null}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-bold text-slate-950">What this means</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {mainLearnerName} is {readinessLabel(readiness).toLowerCase()}. The readiness rule checks Axis 1 and 2 at L2, Axis 3 at L1, and Axis 4 at L2; strong performance on another axis cannot hide a core gap.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-bold text-slate-950">Gap analysis</h2>
          <div className="mt-3 space-y-3">
            {visibleSnapshot.gaps.length > 0 ? visibleSnapshot.gaps.map((gap) => (
              <div key={gap.axis} className="text-sm">
                <AxisBadge axis={gap.axis} />
                <p className="mt-1 text-slate-600">{gap.current} -&gt; {gap.needed}: {gap.evidence}</p>
              </div>
            )) : <p className="text-sm text-slate-600">No readiness gaps in the latest snapshot.</p>}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-bold text-slate-950">Quick wins</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600">
            {visibleSnapshot.quick_wins.map((win) => <li key={win}>{win}</li>)}
          </ol>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px]">
        {visibleSnapshot.evidence ? (
          <EvidencePanel evidence={visibleSnapshot.evidence} />
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-bold text-slate-950">Evidence</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Detailed axis evidence is not included in the current Profile API response.</p>
          </div>
        )}
        <div className={`rounded-lg border p-4 ${visibleSnapshot.red_flags.length > 0 ? "border-rose-200 bg-rose-50" : "border-emerald-200 bg-emerald-50"}`}>
          <h2 className={`font-bold ${visibleSnapshot.red_flags.length > 0 ? "text-rose-950" : "text-emerald-950"}`}>Red flags</h2>
          {visibleSnapshot.red_flags.length > 0 ? (
            <ul className="mt-3 space-y-3 text-sm text-rose-900">
              {visibleSnapshot.red_flags.map((flag) => (
                <li key={`${flag.type}-${flag.part}`} className="rounded border border-rose-200 bg-white/60 p-3">
                  <strong>{flag.type}</strong>
                  <p className="mt-1">{flag.note}</p>
                  <p className="mt-1 text-xs uppercase">Source: {flag.part}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-emerald-900">No direct red flags in the latest assessment.</p>
          )}
          <Link to="/learning-path" className="mt-5 inline-flex rounded bg-slate-950 px-3 py-2 text-sm font-bold text-white">Open recommended path</Link>
        </div>
      </div>

      {visibleSnapshot.percentile === null ? (
        <div className="mt-5 flex gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <Info className="shrink-0 text-blue-600" size={20} />
          <p>Peer percentile is hidden because comparison is opt-in and the current learner has not enabled it.</p>
        </div>
      ) : null}
    </div>
  );
}
