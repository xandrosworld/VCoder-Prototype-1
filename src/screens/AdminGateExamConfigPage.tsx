import { PageHeader } from "../components/common/PageHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { gateExam } from "../data/gateExamItems";

export function AdminGateExamConfigPage() {
  return (
    <div>
      <PageHeader title="Admin Gate Exam Config" eyebrow="Level gate configuration">
        Configuration preview for the L1 to L2 Gate Exam.
      </PageHeader>
      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-bold text-slate-950">Config</h2>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <p>Level: {gateExam.level}</p>
            <p>Focus axes: {gateExam.focusAxes.map((axis) => `A${axis}`).join(", ")}</p>
            <p>Number of questions: {gateExam.numberOfQuestions}</p>
            <p>Pass threshold: {gateExam.passThreshold}%</p>
          </div>
          <div className="mt-4">
            <StatusBadge status="valid" label="MCQ-based V0 gate" />
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-bold text-slate-950">Difficulty distribution</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(gateExam.difficultyDistribution).map(([difficulty, count]) => <span key={difficulty} className="rounded bg-slate-100 px-3 py-2 text-sm">Difficulty {difficulty}: {count}</span>)}
          </div>
          <h2 className="mt-5 font-bold text-slate-950">Sample question pool</h2>
          <div className="mt-3 grid gap-2">
            {gateExam.questions.map((question) => <p key={question.id} className="rounded border border-slate-200 bg-slate-50 p-3 text-sm">{question.id}: {question.stem}</p>)}
          </div>
        </div>
      </div>
    </div>
  );
}
