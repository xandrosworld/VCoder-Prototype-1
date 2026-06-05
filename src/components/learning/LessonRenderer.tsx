import type { LearningContent } from "../../types/domain";

export function LessonRenderer({ lesson }: { lesson: LearningContent }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">{lesson.title}</h2>
      <p className="mt-2 text-sm font-semibold text-blue-700">Why this matters</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{lesson.why}</p>
      <div className="prose prose-sm mt-5 max-w-none whitespace-pre-line text-slate-700">{lesson.body}</div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded border border-emerald-200 bg-emerald-50 p-3">
          <h3 className="font-bold text-emerald-950">Worked example</h3>
          <p className="mt-2 text-sm text-emerald-900">{lesson.workedExample}</p>
        </div>
        <div className="rounded border border-rose-200 bg-rose-50 p-3">
          <h3 className="font-bold text-rose-950">Anti-pattern</h3>
          <p className="mt-2 text-sm text-rose-900">{lesson.antiPattern}</p>
        </div>
      </div>
      <div className="mt-5 rounded border border-slate-200 bg-slate-50 p-3">
        <h3 className="font-bold text-slate-950">Practice activity</h3>
        <p className="mt-2 text-sm text-slate-600">{lesson.practice}</p>
      </div>
      <div className="mt-5">
        <h3 className="font-bold text-slate-950">Checklist</h3>
        <ul className="mt-2 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
          {lesson.checklist.map((item) => <li key={item}>- {item}</li>)}
        </ul>
      </div>
    </div>
  );
}
