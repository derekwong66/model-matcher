export type GPUVendor = "nvidia" | "amd" | "intel" | "apple" | "unknown";
export type CompatibilityStatus = "optimal" | "slow" | "incompatible";
export type VramConfidence = "high" | "medium" | "low";
export type ModelInput = "text" | "text+image" | "text+image+audio";
export type ModelScenario =
  | "chat"
  | "reasoning"
  | "coding"
  | "math"
  | "multilingual"
  | "vision"
  | "creative"
  | "edge";

export interface HardwareSpecs {
  ram: number;
  cores: number;
  gpuVendor: GPUVendor;
  gpuRenderer: string;
  gpuModel: string;
  vramEstimate: number;
  vramConfidence: VramConfidence;
  isAppleSilicon: boolean;
  webgpuAvailable: boolean;
}

export interface ModelRequirement {
  vram: number;
  ram: number;
  quantization: string;
}

export interface LLMModel {
  id: string;
  name: string;
  family: string;
  parameterSize: string;
  description: string;
  tags: string[];
  requirements: ModelRequirement[];
  source: "ollama" | "static";
  inputType: ModelInput;
  scenarios: ModelScenario[];
  sizeBytes?: number;
  quantizationLevel?: string;
  modifiedAt?: string;
}

export interface FilterState {
  search: string;
  families: string[];
  compatibilities: CompatibilityStatus[];
  paramRanges: ParamRange[];
  quantTypes: string[];
  sortBy: SortField;
  sortDir: "asc" | "desc";
}

export type ParamRange = "small" | "medium" | "large" | "xlarge";
export type SortField =
  | "name"
  | "parameterSize"
  | "vramRequired"
  | "compatibility";

export const PARAM_RANGE_BOUNDS: Record<
  ParamRange,
  { label: string; min: number; max: number }
> = {
  small: { label: "< 7B", min: 0, max: 7 },
  medium: { label: "7B - 13B", min: 7, max: 13 },
  large: { label: "13B - 33B", min: 13, max: 33 },
  xlarge: { label: "> 33B", min: 33, max: Infinity },
};

export const INPUT_LABELS: Record<ModelInput, string> = {
  text: "Text",
  "text+image": "Text + Image",
  "text+image+audio": "Text + Image + Audio",
};

export const SCENARIO_LABELS: Record<ModelScenario, string> = {
  chat: "Chat",
  reasoning: "Reasoning",
  coding: "Coding",
  math: "Math",
  multilingual: "Multilingual",
  vision: "Vision",
  creative: "Creative",
  edge: "Edge / Lightweight",
};
