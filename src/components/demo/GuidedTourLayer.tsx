import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useMemo } from "react";
import {
  EVENTS,
  Joyride,
  STATUS,
  type EventData,
  type Step,
  type TooltipRenderProps
} from "react-joyride";
import { useNavigate } from "react-router-dom";

type TourStop = {
  route: string;
  target: string;
  title: string;
  content: string;
  placement?: Step["placement"];
};

const tourStops: TourStop[] = [
  {
    route: "/",
    target: '[data-tour="landing-hero"]',
    title: "Why VCoder exists",
    content: "VCoder measures whether a learner can control AI in real software work, not merely generate code.",
    placement: "bottom"
  },
  {
    route: "/entry-test",
    target: '[data-tour="entry-test-parts"]',
    title: "Five-part entry test",
    content: "MCQ, code audit, recovery, prompt planning and mini-viva collect structured evidence across all five capability axes.",
    placement: "top"
  },
  {
    route: "/scoring?tour=1",
    target: '[data-tour="scoring-pipeline"]',
    title: "Asynchronous scoring",
    content: "The frontend submits once, polls status and waits for a complete Profile snapshot instead of inventing intermediate results.",
    placement: "left"
  },
  {
    route: "/profile?tour=1",
    target: '[data-tour="profile-overview"]',
    title: "AI-Ready Profile",
    content: "The radar and axis cards show level, confidence and readiness. Evidence, gaps and red flags stay separate and auditable.",
    placement: "bottom"
  },
  {
    route: "/learning-path",
    target: '[data-tour="learning-path-nodes"]',
    title: "Personalized learning path",
    content: "Nodes open from profile evidence and prerequisites. Locked content always explains what the learner must complete next.",
    placement: "right"
  },
  {
    route: "/lesson/lesson-2a",
    target: '[data-tour="lesson-and-lab"]',
    title: "Lesson and checkpoint",
    content: "Each lesson leads to an observable artifact. The learner then opens a lab or checkpoint to produce evidence, not just mark content as read.",
    placement: "top"
  },
  {
    route: "/capstone",
    target: '[data-tour="capstone-workspace"]',
    title: "Capstone before the gate",
    content: "The capstone tests an end-to-end safe workflow. Passing it is required, but it never silently completes missing learning nodes.",
    placement: "top"
  },
  {
    route: "/leaderboard",
    target: '[data-tour="leaderboard"]',
    title: "Privacy-aware leaderboard",
    content: "Only opted-in learners appear. Mentors can filter by axis or readiness without exposing learners who chose to stay private.",
    placement: "top"
  },
  {
    route: "/mentor",
    target: '[data-tour="mentor-dashboard"]',
    title: "Mentor operations",
    content: "Mentors see cohort health, at-risk learners and actionable interventions instead of a decorative analytics dashboard.",
    placement: "bottom"
  },
  {
    route: "/admin/authoring",
    target: '[data-tour="admin-authoring"]',
    title: "Admin content authoring",
    content: "Admins manage learning content and assessment items against the same evidence, rubric and validation contracts used by the learner flow.",
    placement: "top"
  }
];

function waitForTarget(selector: string, timeoutMs = 3500) {
  return new Promise<void>((resolve, reject) => {
    const startedAt = Date.now();

    function check() {
      if (document.querySelector(selector)) {
        window.setTimeout(resolve, 80);
        return;
      }
      if (Date.now() - startedAt >= timeoutMs) {
        reject(new Error(`Tour target not found: ${selector}`));
        return;
      }
      window.requestAnimationFrame(check);
    }

    check();
  });
}

function GuidedTooltip({
  backProps,
  closeProps,
  index,
  isLastStep,
  primaryProps,
  size,
  skipProps,
  step,
  tooltipProps
}: TooltipRenderProps) {
  const progress = ((index + 1) / size) * 100;

  return (
    <div
      {...tooltipProps}
      className="w-[min(390px,calc(100vw-24px))] overflow-hidden rounded-lg border border-slate-200 bg-white text-left shadow-2xl"
    >
      <div className="h-1 bg-slate-100">
        <div className="h-full bg-blue-600 transition-[width] duration-300" style={{ width: `${progress}%` }} />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase text-blue-700">Guided demo · {index + 1} of {size}</p>
            <h2 className="mt-2 text-xl font-bold text-slate-950">{step.title}</h2>
          </div>
          <button
            {...closeProps}
            className="shrink-0 rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-3 text-sm leading-6 text-slate-600">{step.content}</div>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <button {...skipProps} className="text-sm font-semibold text-slate-500 hover:text-slate-800">
            Skip tour
          </button>
          <div className="flex items-center gap-2">
            {index > 0 ? (
              <button
                {...backProps}
                className="inline-flex items-center gap-1 rounded border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                <ChevronLeft size={16} /> Back
              </button>
            ) : null}
            <button
              {...primaryProps}
              className="inline-flex items-center gap-1 rounded bg-blue-600 px-3 py-2 text-sm font-bold text-white hover:bg-blue-700"
            >
              {isLastStep ? <><Check size={16} /> Finish</> : <>Next <ChevronRight size={16} /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GuidedTourLayer({ onDone }: { onDone: () => void }) {
  const navigate = useNavigate();

  const steps = useMemo<Step[]>(
    () =>
      tourStops.map((stop) => ({
        id: stop.target,
        target: stop.target,
        title: stop.title,
        content: stop.content,
        placement: stop.placement,
        skipBeacon: true,
        before: async () => {
          const currentRoute = `${window.location.pathname}${window.location.search}`;
          if (currentRoute !== stop.route) {
            navigate(stop.route);
          }
          await waitForTarget(stop.target);
        }
      })),
    [navigate]
  );

  function handleEvent(event: EventData) {
    if (
      event.type === EVENTS.TOUR_END ||
      event.status === STATUS.FINISHED ||
      event.status === STATUS.SKIPPED
    ) {
      onDone();
    }
  }

  return (
    <Joyride
        run
        steps={steps}
        continuous
        scrollToFirstStep
        tooltipComponent={GuidedTooltip}
        onEvent={handleEvent}
        options={{
          blockTargetInteraction: true,
          buttons: ["back", "close", "primary", "skip"],
          closeButtonAction: "skip",
          dismissKeyAction: "next",
          offset: 14,
          overlayClickAction: false,
          overlayColor: "rgba(15, 23, 42, 0.72)",
          primaryColor: "#2563eb",
          scrollDuration: 420,
          scrollOffset: 120,
          showProgress: true,
          spotlightPadding: 8,
          spotlightRadius: 8,
          targetWaitTimeout: 4000,
          textColor: "#334155",
          width: 390,
          zIndex: 80
        }}
    />
  );
}
