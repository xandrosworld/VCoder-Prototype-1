import type { Role } from "../../types/domain";

export function RoleSwitcher({ role, onChange }: { role: Role; onChange: (role: Role) => void }) {
  const roles: Role[] = ["learner", "mentor", "admin"];
  return (
    <div className="inline-flex rounded-md border border-slate-200 bg-white p-1">
      {roles.map((item) => (
        <button
          key={item}
          onClick={() => onChange(item)}
          className={`rounded px-3 py-1.5 text-sm font-semibold capitalize ${role === item ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
