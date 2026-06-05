import type { ValidationStatus } from "../../types/domain";
import { StatusBadge } from "./StatusBadge";

export function ItemValidationBadge({ status }: { status: ValidationStatus }) {
  const label = status === "valid" ? "Valid" : status === "warning" ? "Warning" : "Error";
  return <StatusBadge status={status} label={label} />;
}
