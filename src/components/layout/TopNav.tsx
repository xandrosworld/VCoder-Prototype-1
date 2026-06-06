import { BookOpenCheck, ClipboardList, Gauge, LayoutDashboard, RotateCcw, Settings, Trophy, UserRound } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useDemo } from "../../state/DemoContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { RoleSwitcher } from "./RoleSwitcher";

const links = [
  { to: "/entry-test", label: "Test", icon: ClipboardList },
  { to: "/profile", label: "Profile", icon: UserRound },
  { to: "/learning-path", label: "Path", icon: BookOpenCheck },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/mentor", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin", label: "Admin", icon: Settings }
];

export function TopNav() {
  const { role, setRole, resetDemo } = useDemo();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <Link to="/" className="flex w-fit items-center gap-3 rounded-md">
          <span className="flex h-10 w-10 items-center justify-center rounded bg-slate-950 text-sm font-black text-white">VC</span>
          <span>
            <span className="block text-base font-bold text-slate-950">VCoder</span>
            <span className="block text-xs text-slate-500">Prototype demo - simulated scoring</span>
          </span>
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200">
            <Gauge size={14} /> Demo mode
          </span>
          <LanguageSwitcher />
          <RoleSwitcher role={role} onChange={setRole} />
          <button onClick={resetDemo} className="inline-flex items-center gap-1 rounded border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            <RotateCcw size={15} /> Reset
          </button>
        </div>
      </div>
      <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `inline-flex shrink-0 items-center gap-2 rounded px-3 py-2 text-sm font-semibold ${isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`
            }
          >
            <Icon size={15} /> {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
