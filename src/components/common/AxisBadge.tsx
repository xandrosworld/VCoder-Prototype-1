import type { AxisId } from "../../types/domain";
import { axisShortLabel } from "../../utils/format";

export function AxisBadge({ axis }: { axis: AxisId }) {
  return <span className="inline-flex items-center rounded bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">Axis {axis}: {axisShortLabel(axis)}</span>;
}
