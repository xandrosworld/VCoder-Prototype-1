export function ProgressBar({ value, tone = "blue" }: { value: number; tone?: "blue" | "green" | "amber" | "red" }) {
  const toneClass = {
    blue: "bg-blue-600",
    green: "bg-emerald-600",
    amber: "bg-amber-500",
    red: "bg-rose-600"
  }[tone];

  return (
    <div className="h-2 w-full overflow-hidden rounded bg-slate-100">
      <div className={`h-full ${toneClass}`} style={{ width: `${Math.max(0, Math.min(value, 100))}%` }} />
    </div>
  );
}
