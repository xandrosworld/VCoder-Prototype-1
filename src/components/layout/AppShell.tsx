import type { ReactNode } from "react";
import { DemoTour } from "../demo/DemoTour";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <TopNav />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <Sidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <DemoTour />
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-slate-500">
          Frontend-only stakeholder prototype. No backend, database, auth, telemetry, real LLM scoring, or external integrations.
        </div>
      </footer>
    </div>
  );
}
