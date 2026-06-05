import type { ReactNode } from "react";

export function PageHeader({ title, eyebrow, children, actions }: { title: string; eyebrow?: string; children?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow ? <p className="mb-2 text-xs font-bold uppercase tracking-wide text-blue-700">{eyebrow}</p> : null}
        <h1 className="text-3xl font-bold text-slate-950">{title}</h1>
        {children ? <div className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{children}</div> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
