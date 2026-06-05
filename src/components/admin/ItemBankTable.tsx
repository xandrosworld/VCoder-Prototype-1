import { itemBankItems } from "../../data/validation";
import { useDemo } from "../../state/DemoContext";
import { validateProblemItem } from "../../utils/validation";
import { ItemValidationBadge } from "../common/ItemValidationBadge";

export function ItemBankTable() {
  const { authoredItems } = useDemo();
  const rows = [...authoredItems, ...itemBankItems];

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[1000px] text-left text-sm">
        <thead className="bg-slate-100 text-xs uppercase text-slate-500">
          <tr>
            <th className="p-3">Item id</th>
            <th className="p-3">Title</th>
            <th className="p-3">Part</th>
            <th className="p-3">Problem</th>
            <th className="p-3">Axis</th>
            <th className="p-3">Level</th>
            <th className="p-3">Difficulty</th>
            <th className="p-3">Scoring</th>
            <th className="p-3">Keys / GT / Rubric</th>
            <th className="p-3">Validation</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => {
            const result = validateProblemItem(item);
            return (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="p-3 font-mono text-xs">{item.id}</td>
                <td className="p-3 font-semibold text-slate-950">{item.title}</td>
                <td className="p-3">{item.partType ?? "-"}</td>
                <td className="p-3">{item.problemType}</td>
                <td className="p-3">A{item.axis}</td>
                <td className="p-3">{item.targetLevel}</td>
                <td className="p-3">{item.difficulty}</td>
                <td className="p-3">{item.scoringMethod}</td>
                <td className="p-3 text-xs">
                  key {item.answerKey ? "yes" : "no"} · gt {item.groundTruth ? "yes" : "no"} · rubric {item.judgeRubricRef ? "yes" : "no"}
                </td>
                <td className="p-3"><ItemValidationBadge status={result.status} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
