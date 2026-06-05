import { ArrowRight, BookOpenCheck, BrainCircuit, ClipboardCheck, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { axes } from "../data/axes";
import { levels } from "../data/levels";
import { PageHeader } from "../components/common/PageHeader";

export function LandingPage() {
  return (
    <div>
      <section className="rounded-lg bg-slate-950 p-8 text-white shadow-sm">
        <div className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-300">VCoder P0 stakeholder story demo</p>
          <h1 className="mt-3 text-4xl font-bold">Measure whether learners can control AI in real software work.</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            VCoder turns a short entry test into an AI-Ready Profile, opens a personalized test-gated path, and gives mentors/admins a practical view of cohort risk and content quality.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/entry-test" className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-500">
              Start Test <ArrowRight size={18} />
            </Link>
            <Link to="/mentor" className="inline-flex items-center gap-2 rounded border border-white/20 px-4 py-3 text-sm font-bold text-white hover:bg-white/10">
              Mentor view
            </Link>
          </div>
        </div>
      </section>

      <PageHeader title="Canonical Flow" eyebrow="Product story">
        Landing -&gt; Entry Test P1-P5 -&gt; Simulated AI Scoring -&gt; AI-Ready Profile -&gt; Learning Path -&gt; Gate Exam -&gt; Leaderboard -&gt; Dashboard.
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Entry test", "5 short parts produce structured evidence.", ClipboardCheck],
          ["Profile", "Radar, gaps, quick wins, confidence, and red flags.", BrainCircuit],
          ["Test-gated path", "Lessons, labs, capstone, and gate exam unlocks.", BookOpenCheck],
          ["Ops controls", "Mentor dashboards and admin authoring validation.", ShieldCheck]
        ].map(([title, text, Icon]) => (
          <div key={title as string} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <Icon className="text-blue-600" size={24} />
            <h2 className="mt-3 font-bold text-slate-950">{title as string}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{text as string}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Five axes</h2>
          <div className="mt-4 grid gap-3">
            {axes.map((axis) => (
              <div key={axis.id} className="rounded border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-bold text-slate-950">Axis {axis.id}: {axis.label}</p>
                <p className="mt-1 text-sm text-slate-600">{axis.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Five levels</h2>
          <div className="mt-4 grid gap-3">
            {levels.map((level) => (
              <div key={level.id} className="rounded border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-bold text-slate-950">{level.label}</p>
                <p className="mt-1 text-sm text-slate-600">{level.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
