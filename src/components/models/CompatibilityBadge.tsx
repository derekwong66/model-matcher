import type { CompatibilityStatus } from "../../types/index.ts";
import "./CompatibilityBadge.css";

interface CompatibilityBadgeProps {
  status: CompatibilityStatus;
}

const STATUS_CONFIG: Record<
  CompatibilityStatus,
  { label: string; className: string }
> = {
  optimal: { label: "Optimal", className: "compat-badge--optimal" },
  slow: { label: "Can Run", className: "compat-badge--slow" },
  incompatible: {
    label: "Incompatible",
    className: "compat-badge--incompatible",
  },
};

export function CompatibilityBadge({ status }: CompatibilityBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`compat-badge ${config.className}`}>{config.label}</span>
  );
}
