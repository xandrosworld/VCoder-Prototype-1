import { adminSeedValidation } from "../../data/adminSeedValidation";
import { ItemValidationBadge } from "../common/ItemValidationBadge";

export function SeedValidationPanel() {
  return (
    <div className="grid gap-3">
      {adminSeedValidation.map((item) => (
        <div key={item.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold text-slate-950">{item.label}</h2>
            <ItemValidationBadge status={item.result.status} />
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">Green checks</p>
              <ul className="mt-1 text-sm text-slate-600">{item.result.checks.map((check) => <li key={check}>- {check}</li>)}</ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">Warnings</p>
              <ul className="mt-1 text-sm text-amber-700">{item.result.warnings.map((warning) => <li key={warning}>- {warning}</li>)}</ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-500">Errors</p>
              <ul className="mt-1 text-sm text-rose-700">{item.result.errors.map((error) => <li key={error}>- {error}</li>)}</ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
