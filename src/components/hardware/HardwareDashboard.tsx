import type { HardwareSpecs } from "../../types/index.ts";
import { HardwareCard } from "./HardwareCard.tsx";
import "./HardwareDashboard.css";

interface HardwareDashboardProps {
  specs: HardwareSpecs;
  onRefresh: () => void;
}

export function HardwareDashboard({
  specs,
  onRefresh,
}: HardwareDashboardProps) {
  return (
    <section className="hw-dashboard">
      <div className="hw-dashboard__header">
        <h2 className="hw-dashboard__title">Your Hardware</h2>
        <button className="hw-dashboard__refresh" onClick={onRefresh}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          Redetect
        </button>
      </div>
      <div className="hw-dashboard__grid">
        <HardwareCard
          label="Processor"
          value={`${specs.cores} Cores`}
          subtext={specs.gpuModel}
          icon="cpu"
        />
        <HardwareCard
          label="System RAM"
          value={`${specs.ram} GB`}
          subtext="Available for offloading"
          icon="memory"
        />
        <HardwareCard
          label="VRAM Estimate"
          value={`${specs.vramEstimate.toFixed(1)} GB`}
          subtext={
            specs.isAppleSilicon
              ? "Unified Memory"
              : `GPU Memory (${specs.vramConfidence} confidence)`
          }
          icon="gpu"
          confidence={specs.vramConfidence}
        />
      </div>
    </section>
  );
}
