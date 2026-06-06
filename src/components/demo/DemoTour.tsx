import { CirclePlay, Loader2 } from "lucide-react";
import { lazy, Suspense, useState } from "react";

const GuidedTourLayer = lazy(async () => {
  const module = await import("./GuidedTourLayer");
  return { default: module.GuidedTourLayer };
});

export function DemoTour() {
  const [active, setActive] = useState(false);

  return (
    <>
      <div className="mx-auto flex w-full max-w-7xl justify-end px-4 pt-4">
        <button
          onClick={() => setActive(true)}
          className="inline-flex items-center gap-2 rounded border border-blue-200 bg-white px-3 py-2 text-sm font-bold text-blue-700 shadow-sm hover:bg-blue-50"
        >
          <CirclePlay size={18} />
          Start guided demo
        </button>
      </div>
      {active ? (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70">
              <div className="flex items-center gap-3 rounded-lg bg-white px-5 py-4 text-sm font-bold text-slate-700 shadow-xl">
                <Loader2 className="animate-spin text-blue-600" size={20} />
                Preparing guided demo...
              </div>
            </div>
          }
        >
          <GuidedTourLayer onDone={() => setActive(false)} />
        </Suspense>
      ) : null}
    </>
  );
}
