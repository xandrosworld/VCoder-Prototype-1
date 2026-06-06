import { useState } from "react";
import { AuthoringForm } from "../components/admin/AuthoringForm";
import { PageHeader } from "../components/common/PageHeader";

const tabs = ["Learning Content", "Entry Test Items", "Lab / Checkpoint Items", "Capstone Items", "Gate Exam Items"];

export function AdminContentAuthoringPage() {
  const [tab, setTab] = useState(tabs[0]);

  return (
    <div>
      <PageHeader title="Admin Content Authoring" eyebrow="Content-in-DB semantics, local prototype state">
        Admins can view/create/edit a demo item locally. No persistence beyond localStorage is required.
      </PageHeader>
      <div data-tour="admin-authoring">
      <div className="mb-4 flex gap-2 overflow-x-auto">
        {tabs.map((item) => (
          <button key={item} onClick={() => setTab(item)} className={`shrink-0 rounded px-3 py-2 text-sm font-semibold ${tab === item ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"}`}>
            {item}
          </button>
        ))}
      </div>
      <AuthoringForm />
      </div>
    </div>
  );
}
