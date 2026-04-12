import type { LLMModel, HardwareSpecs, CompatibilityStatus } from "../../types/index.ts";
import { CompatibilityBadge } from "./CompatibilityBadge.tsx";
import "./ModelCard.css";

interface ModelCardProps {
  model: LLMModel;
  specs: HardwareSpecs | null;
  compatStatus: CompatibilityStatus;
}

function getSuitability(
  vram: number,
  specs: HardwareSpecs
): CompatibilityStatus {
  if (specs.vramEstimate >= vram) return "optimal";
  if (specs.ram >= vram * 1.5) return "slow";
  return "incompatible";
}

export function ModelCard({ model, specs, compatStatus }: ModelCardProps) {
  return (
    <div className="model-card">
      <div className="model-card__header">
        <h3 className="model-card__name">{model.name}</h3>
        <div className="model-card__badges">
          <span className="model-card__family">{model.family}</span>
          <span className="model-card__source">
            {model.source === "ollama" ? "Ollama" : "Built-in"}
          </span>
        </div>
      </div>

      <p className="model-card__desc">{model.description}</p>

      <div className="model-card__tags">
        {model.tags.map((tag) => (
          <span key={tag} className="model-card__tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="model-card__requirements">
        {model.requirements.map((req, i) => {
          const status = specs ? getSuitability(req.vram, specs) : "incompatible";
          return (
            <div key={i} className="model-card__req">
              <div className="model-card__req-info">
                <span className="model-card__quant">{req.quantization}</span>
                <span className="model-card__vram">{req.vram} GB VRAM</span>
              </div>
              <CompatibilityBadge status={status} />
            </div>
          );
        })}
      </div>

      <div className="model-card__overall">
        <span className="model-card__overall-label">Overall</span>
        <CompatibilityBadge status={compatStatus} />
      </div>
    </div>
  );
}
