export type GPUVendor = "nvidia" | "amd" | "intel" | "apple" | "unknown";
export type CompatibilityStatus = "optimal" | "slow" | "incompatible";
export type VramConfidence = "high" | "medium" | "low";

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
  sizeBytes?: number;
  quantizationLevel?: string;
  modifiedAt?: string;
}

export interface OllamaModelDetail {
  parent_model: string;
  format: string;
  family: string;
  families: string[];
  parameter_size: string;
  quantization_level: string;
}

export interface OllamaModel {
  name: string;
  model: string;
  modified_at: string;
  size: number;
  digest: string;
  details: OllamaModelDetail;
}

export interface OllamaConnection {
  status: "connected" | "disconnected" | "checking";
  models: OllamaModel[];
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
