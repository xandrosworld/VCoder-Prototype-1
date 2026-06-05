import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { simulatedScoringSteps } from "../utils/scoringSimulation";

export function ScoringPage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = window.setInterval(() => {
      setStep((current) => {
        if (current >= simulatedScoringSteps.length) {
          window.clearInterval(interval);
          window.setTimeout(() => navigate("/profile"), 500);
          return current;
        }
        return current + 1;
      });
    }, 700);

    return () => window.clearInterval(interval);
  }, [navigate]);

  return (
    <div>
      <PageHeader title="Simulated AI Scoring" eyebrow="Prototype scoring pipeline">
        This screen demonstrates the scoring story only. No model is called and no score is validated in this frontend prototype.
      </PageHeader>
      <StatusBadge status="warning" label="Prototype demo - this scoring is simulated" />
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-4">
          {simulatedScoringSteps.map((label, index) => {
            const done = step > index;
            const active = step === index;
            return (
              <div key={label} className="flex items-center gap-3 rounded border border-slate-200 bg-slate-50 p-3">
                {done ? <CheckCircle2 className="text-emerald-600" /> : active ? <Loader2 className="animate-spin text-blue-600" /> : <span className="h-6 w-6 rounded-full border border-slate-300" />}
                <span className={`font-semibold ${done || active ? "text-slate-950" : "text-slate-500"}`}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
