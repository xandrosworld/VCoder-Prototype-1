import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import type { AxisLevelMap } from "../../types/domain";
import { axes } from "../../data/axes";
import { levelToNumber } from "../../utils/level";

export function RadarProfileChart({ levels }: { levels: AxisLevelMap }) {
  const data = axes.map((axis) => ({
    axis: `A${axis.id}`,
    level: levelToNumber(levels[axis.id]),
    threshold: axis.id === 3 ? 1 : axis.id === 5 ? 0 : 2
  }));

  return (
    <div className="h-80 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="axis" tick={{ fill: "#0f172a", fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 4]} tickCount={5} />
          <Radar name="Current" dataKey="level" stroke="#2563eb" fill="#2563eb" fillOpacity={0.3} />
          <Radar name="Graduation marker" dataKey="threshold" stroke="#10b981" fill="#10b981" fillOpacity={0.12} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
