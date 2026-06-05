export function ProgressTimeline({ steps }: { steps: Array<{ label: string; done: boolean }> }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="font-bold text-slate-950">Progress timeline</h2>
      <div className="mt-4 space-y-3">
        {steps.map((step) => (
          <div key={step.label} className="flex items-center gap-3">
            <span className={`h-3 w-3 rounded-full ${step.done ? "bg-emerald-600" : "bg-slate-300"}`} />
            <span className={`text-sm ${step.done ? "font-semibold text-slate-950" : "text-slate-500"}`}>{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
