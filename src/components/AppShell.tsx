import { BarChart3, BookOpenCheck, ClipboardList, Gauge, LayoutDashboard, Trophy } from "lucide-react";
import type { ReactNode } from "react";
import { PROTOTYPE_NOTE } from "../domain/constants";
import { clsx } from "../utils/clsx";

export type Screen = "landing" | "test" | "scoring" | "profile" | "learning" | "gate" | "leaderboard" | "dashboard";

const navItems: Array<{ id: Screen; label: string; icon: ReactNode }> = [
  { id: "landing", label: "Landing", icon: <Gauge size={16} /> },
  { id: "test", label: "Entry Test F1", icon: <ClipboardList size={16} /> },
  { id: "profile", label: "Profile F2", icon: <BarChart3 size={16} /> },
  { id: "learning", label: "Learning Path F3", icon: <BookOpenCheck size={16} /> },
  { id: "leaderboard", label: "Leaderboard F4", icon: <Trophy size={16} /> },
  { id: "dashboard", label: "Dashboard F5", icon: <LayoutDashboard size={16} /> }
];

export function AppShell({
  children,
  currentScreen,
  onNavigate
}: {
  children: ReactNode;
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}) {
  return (
    <div className="min-h-screen bg-[#f7fafb]">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <button className="focus-ring flex w-fit items-center gap-3 rounded-md text-left" onClick={() => onNavigate("landing")}>
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-ink text-sm font-black text-white">VC</span>
            <span>
              <span className="block text-base font-bold text-ink">VCoder</span>
              <span className="block text-xs text-graphite">AI-Ready Developer story demo</span>
            </span>
          </button>
          <nav className="flex gap-2 overflow-x-auto pb-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={clsx(
                  "focus-ring inline-flex min-h-9 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-semibold transition",
                  currentScreen === item.id ? "bg-teal text-white" : "bg-mist text-graphite hover:bg-slate-200"
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-graphite sm:flex-row sm:items-center sm:justify-between">
          <span>{PROTOTYPE_NOTE}</span>
          <span>Frontend-only. Local seed JSON. No backend, auth, telemetry, or real LLM scoring.</span>
        </div>
      </footer>
    </div>
  );
}
