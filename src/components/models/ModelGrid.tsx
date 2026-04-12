import type { LLMModel, HardwareSpecs, CompatibilityStatus } from "../../types/index.ts";
import { ModelCard } from "./ModelCard.tsx";
import "./ModelGrid.css";

interface ModelGridProps {
  models: LLMModel[];
  specs: HardwareSpecs | null;
  getCompat: (model: LLMModel) => CompatibilityStatus;
}

export function ModelGrid({ models, specs, getCompat }: ModelGridProps) {
  if (models.length === 0) {
    return (
      <div className="model-grid__empty">
        <p>No models match your filters.</p>
      </div>
    );
  }

  return (
    <div className="model-grid">
      {models.map((model) => (
        <ModelCard
          key={model.id}
          model={model}
          specs={specs}
          compatStatus={getCompat(model)}
        />
      ))}
    </div>
  );
}
