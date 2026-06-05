import type { AxisId } from "../types/domain";
import { axes } from "../data/axes";

export function axisLabel(axisId: AxisId): string {
  return axes.find((axis) => axis.id === axisId)?.label ?? `Axis ${axisId}`;
}

export function axisShortLabel(axisId: AxisId): string {
  return axes.find((axis) => axis.id === axisId)?.shortLabel ?? `A${axisId}`;
}
