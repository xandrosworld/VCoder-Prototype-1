import { useState } from "react";
import { useDemo } from "../../state/DemoContext";
import type { AxisId, LevelId, PartType, ProblemItem, ProblemType } from "../../types/domain";

export function AuthoringForm() {
  const { addAuthoredItem } = useDemo();
  const [title, setTitle] = useState("Demo audit item: generated export endpoint");
  const [axis, setAxis] = useState<AxisId>(2);
  const [level, setLevel] = useState<LevelId>("L2");
  const [difficulty, setDifficulty] = useState(3);
  const [problemType, setProblemType] = useState<ProblemType>("audit");
  const [partType, setPartType] = useState<PartType>("audit");

  function save() {
    const item: ProblemItem = {
      id: `LOCAL-${Date.now()}`,
      title,
      axis,
      targetLevel: level,
      difficulty,
      problemType,
      partType,
      scoringMethod: problemType === "gate" || partType === "mcq" ? "deterministic" : "llm_judge",
      payload: { schema_version: "local-demo-v0.1", preview: "Local authoring payload preview" },
      answerKey: partType === "mcq" ? { schema_version: "local-key-v0.1", correct_keys: ["B"] } : undefined,
      groundTruth: partType !== "mcq" ? { schema_version: "gt-v0.1", gold_samples: [] } : undefined,
      judgeRubricRef: partType !== "mcq" ? `rubric://axis-${axis}/anchors#L0-L2` : undefined,
      validationStatus: "warning"
    };
    addAuthoredItem(item);
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="font-bold text-slate-950">Create / edit demo item locally</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="md:col-span-2">
          <span className="text-xs font-bold uppercase text-slate-500">Title</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} className="mt-1 w-full rounded border border-slate-300 p-2 text-sm" />
        </label>
        <label>
          <span className="text-xs font-bold uppercase text-slate-500">Axis</span>
          <select value={axis} onChange={(event) => setAxis(Number(event.target.value) as AxisId)} className="mt-1 w-full rounded border border-slate-300 p-2 text-sm">
            {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>Axis {value}</option>)}
          </select>
        </label>
        <label>
          <span className="text-xs font-bold uppercase text-slate-500">Target level</span>
          <select value={level} onChange={(event) => setLevel(event.target.value as LevelId)} className="mt-1 w-full rounded border border-slate-300 p-2 text-sm">
            {["L0", "L1", "L2", "L3", "L4"].map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label>
          <span className="text-xs font-bold uppercase text-slate-500">Difficulty</span>
          <input type="number" min={1} max={5} value={difficulty} onChange={(event) => setDifficulty(Number(event.target.value))} className="mt-1 w-full rounded border border-slate-300 p-2 text-sm" />
        </label>
        <label>
          <span className="text-xs font-bold uppercase text-slate-500">Problem type</span>
          <select value={problemType} onChange={(event) => setProblemType(event.target.value as ProblemType)} className="mt-1 w-full rounded border border-slate-300 p-2 text-sm">
            {["mcq", "audit", "recovery", "capstone", "gate"].map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label>
          <span className="text-xs font-bold uppercase text-slate-500">Part type</span>
          <select value={partType} onChange={(event) => setPartType(event.target.value as PartType)} className="mt-1 w-full rounded border border-slate-300 p-2 text-sm">
            {["mcq", "audit", "recovery", "prompt_plan", "viva"].map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <pre className="rounded bg-slate-950 p-3 text-xs text-slate-100">payload: schema_version local-demo-v0.1</pre>
        <pre className="rounded bg-slate-950 p-3 text-xs text-slate-100">answer_key: preview for MCQ</pre>
        <pre className="rounded bg-slate-950 p-3 text-xs text-slate-100">ground_truth: gt-v0.1 preview</pre>
      </div>
      <p className="mt-3 text-sm text-slate-600">Judge rubric ref: rubric://axis-{axis}/anchors#L0-L2</p>
      <button onClick={save} className="mt-4 rounded bg-blue-600 px-3 py-2 text-sm font-bold text-white">Save local demo item</button>
    </div>
  );
}
