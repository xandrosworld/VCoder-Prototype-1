import { NavLink } from "react-router-dom";

const groups = [
  {
    title: "Learner story",
    links: [
      ["/", "Landing"],
      ["/entry-test", "Entry Test"],
      ["/profile", "AI-Ready Profile"],
      ["/learning-path", "Learning Path"],
      ["/capstone", "Capstone"],
      ["/gate-exam", "Gate Exam"]
    ]
  },
  {
    title: "Operations",
    links: [
      ["/leaderboard", "Leaderboard"],
      ["/mentor", "Mentor Dashboard"],
      ["/admin", "Admin Dashboard"]
    ]
  }
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-32 space-y-4">
        {groups.map((group) => (
          <div key={group.title} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <p className="px-2 text-xs font-bold uppercase tracking-wide text-slate-500">{group.title}</p>
            <div className="mt-2 space-y-1">
              {group.links.map(([to, label]) => (
                <NavLink key={to} to={to} className={({ isActive }) => `block rounded px-2 py-2 text-sm font-medium ${isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}>
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
