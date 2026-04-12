import type { VramConfidence } from "../../types/index.ts";
import "./HardwareCard.css";

interface HardwareCardProps {
  label: string;
  value: string;
  subtext: string;
  icon: "cpu" | "memory" | "gpu";
  confidence?: VramConfidence;
}

const CONFIDENCE_COLORS: Record<VramConfidence, string> = {
  high: "#30d158",
  medium: "#ffd60a",
  low: "#ff453a",
};

export function HardwareCard({
  label,
  value,
  subtext,
  icon,
  confidence,
}: HardwareCardProps) {
  return (
    <div className="hw-card">
      <div className="hw-card__icon">
        {icon === "cpu" && (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <rect x="9" y="9" width="6" height="6" />
            <line x1="9" y1="1" x2="9" y2="4" />
            <line x1="15" y1="1" x2="15" y2="4" />
            <line x1="9" y1="20" x2="9" y2="23" />
            <line x1="15" y1="20" x2="15" y2="23" />
            <line x1="20" y1="9" x2="23" y2="9" />
            <line x1="20" y1="14" x2="23" y2="14" />
            <line x1="1" y1="9" x2="4" y2="9" />
            <line x1="1" y1="14" x2="4" y2="14" />
          </svg>
        )}
        {icon === "memory" && (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <line x1="6" y1="10" x2="6" y2="14" />
            <line x1="10" y1="10" x2="10" y2="14" />
            <line x1="14" y1="10" x2="14" y2="14" />
            <line x1="18" y1="10" x2="18" y2="14" />
          </svg>
        )}
        {icon === "gpu" && (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <rect x="6" y="8" width="12" height="8" />
            <line x1="6" y1="1" x2="6" y2="4" />
            <line x1="18" y1="1" x2="18" y2="4" />
            <line x1="6" y1="20" x2="6" y2="23" />
            <line x1="18" y1="20" x2="18" y2="23" />
          </svg>
        )}
      </div>
      <p className="hw-card__label">{label}</p>
      <p className="hw-card__value">
        {value}
        {confidence && (
          <span
            className="hw-card__confidence"
            style={{ color: CONFIDENCE_COLORS[confidence] }}
          >
            {confidence}
          </span>
        )}
      </p>
      <p className="hw-card__subtext">{subtext}</p>
    </div>
  );
}
