import type { Evidence } from "../../types/domain";
import { AxisBadge } from "./AxisBadge";

export function EvidencePanel({ evidence }: { evidence: Evidence[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-bold text-slate-950">Evidence</h2>
      <div className="mt-4 space-y-3">
        {evidence.map((item, index) => (
          <div key={`${item.source}-${index}`} className="rounded border border-slate-200 bg-slate-50 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <AxisBadge axis={item.axis} />
              <span className="text-xs font-semibold text-slate-500">{item.source}</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-900">"{item.quote}"</p>
            <p className="mt-1 text-sm text-slate-600">{item.interpretation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
