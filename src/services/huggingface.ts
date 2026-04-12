import type {
  LLMModel,
  ModelRequirement,
  ModelInput,
  ModelScenario,
} from "../types/index.ts";

// /api/hf is proxied to https://huggingface.co/api
// - Dev: via vite.config.ts server.proxy
// - Prod: via vercel.json rewrites
const HF_API_BASE = "/api/hf/models";
const TIMEOUT_MS = 8000;

interface HFModel {
  id: string;
  modelId: string;
  tags: string[];
  downloads: number;
  pipeline_tag: string | null;
  siblings: { rfilename: string }[];
}

async function fetchWithTimeout(url: string, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

function parseQuantFromFilename(filename: string): string | null {
  const lower = filename.toLowerCase();
  const quants = [
    "q2_k", "q3_k_s", "q3_k_m", "q3_k_l",
    "q4_0", "q4_k_s", "q4_k_m",
    "q5_0", "q5_k_s", "q5_k_m",
    "q6_k", "q8_0", "fp16", "bf16",
  ];
  for (const q of quants) {
    if (lower.includes(q)) return q.toUpperCase();
  }
  return null;
}

function parseParamSizeFromId(modelId: string): string {
  const match = modelId.match(/(\d+(?:\.\d+)?)\s*b/i);
  return match ? `${match[1].toUpperCase()}B` : "";
}

function extractFamily(modelId: string, tags: string[]): string {
  const lower = (modelId + " " + tags.join(" ")).toLowerCase();
  if (lower.includes("llama")) return "Llama";
  if (lower.includes("qwen")) return "Qwen";
  if (lower.includes("mistral") || lower.includes("mixtral") || lower.includes("codestral")) return "Mistral";
  if (lower.includes("gemma")) return "Gemma";
  if (lower.includes("phi")) return "Phi";
  if (lower.includes("deepseek")) return "DeepSeek";
  if (lower.includes("chatglm") || lower.includes("glm-") || lower.includes("zhipu")) return "GLM";
  if (lower.includes("baichuan")) return "Baichuan";
  if (lower.includes("internlm")) return "InternLM";
  if (lower.includes("moonshot") || lower.includes("kimi")) return "Kimi";
  if (lower.includes("minimax")) return "MiniMax";
  if (lower.includes("yi-") || lower.includes("01.ai")) return "Yi";
  if (lower.includes("falcon")) return "Falcon";
  if (lower.includes("command")) return "Command";
  if (lower.includes("grok")) return "Grok";
  if (lower.includes("nemotron")) return "Nemotron";
  if (lower.includes("starcoder") || lower.includes("coder")) return "Code";
  return "Other";
}

function inferInputType(pipelineTag: string | null): ModelInput {
  if (pipelineTag === "image-text-to-text") return "text+image";
  return "text";
}

function inferScenarios(
  family: string,
  tags: string[],
  pipelineTag: string | null,
  paramNum: number
): ModelScenario[] {
  const scenarios: ModelScenario[] = [];
  const lower = tags.join(" ").toLowerCase();

  if (pipelineTag === "image-text-to-text" || lower.includes("vision")) scenarios.push("vision");
  if (lower.includes("code") || lower.includes("coder")) scenarios.push("coding");
  if (lower.includes("math")) scenarios.push("math");
  if (lower.includes("reason") || lower.includes("r1")) scenarios.push("reasoning");
  if (lower.includes("multilingual") || lower.includes("chinese") || lower.includes("bilingual")) {
    scenarios.push("multilingual");
  }
  if (lower.includes("creative") || lower.includes("story")) scenarios.push("creative");

  // Default scenarios based on family
  if (scenarios.length === 0) {
    scenarios.push("chat");
    if (["DeepSeek", "Qwen", "Llama"].includes(family)) scenarios.push("reasoning");
    if (["Qwen", "Code", "DeepSeek"].includes(family)) scenarios.push("coding");
  }

  if (paramNum <= 4) scenarios.push("edge");

  return [...new Set(scenarios)].slice(0, 4);
}

function estimateVramFromQuant(paramSizeB: number, quant: string): number {
  const quantMultipliers: Record<string, number> = {
    Q2_K: 0.5, Q3_K_S: 0.55, Q3_K_M: 0.6, Q3_K_L: 0.65,
    Q4_0: 0.6, Q4_K_S: 0.62, Q4_K_M: 0.65,
    Q5_0: 0.72, Q5_K_S: 0.74, Q5_K_M: 0.76,
    Q6_K: 0.85, Q8_0: 1.0, FP16: 2.0, BF16: 2.0,
  };
  const mult = quantMultipliers[quant] ?? 0.65;
  return Math.round(paramSizeB * mult * 10) / 10;
}

function hfModelToLLMModel(m: HFModel): LLMModel | null {
  const paramSize = parseParamSizeFromId(m.id);
  if (!paramSize) return null;

  const paramNum = parseFloat(paramSize);
  const family = extractFamily(m.id, m.tags);
  const shortName = m.id.split("/").pop() ?? m.id;
  const inputType = inferInputType(m.pipeline_tag);
  const scenarios = inferScenarios(family, m.tags, m.pipeline_tag, paramNum);

  // Collect available quantizations from GGUF filenames
  const quantSet = new Set<string>();
  for (const s of m.siblings) {
    if (s.rfilename.endsWith(".gguf")) {
      const q = parseQuantFromFilename(s.rfilename);
      if (q) quantSet.add(q);
    }
  }

  // Default popular quants if none found
  const quants = quantSet.size > 0 ? [...quantSet] : ["Q4_K_M", "Q8_0"];

  const requirements: ModelRequirement[] = quants.map((q) => ({
    quantization: q,
    vram: estimateVramFromQuant(paramNum, q),
    ram: Math.max(8, Math.round(estimateVramFromQuant(paramNum, q) * 2)),
  }));

  const tags = [family.toLowerCase()];
  if (m.downloads > 100000) tags.push("Popular");
  if (paramNum <= 7) tags.push("Efficient");
  if (paramNum >= 30) tags.push("Powerful");

  return {
    id: `hf-${m.id}`,
    name: shortName,
    family,
    parameterSize: paramSize,
    description: `HuggingFace GGUF model (${formatDownloads(m.downloads)} downloads)`,
    tags,
    requirements,
    source: "static",
    inputType,
    scenarios,
  };
}

function formatDownloads(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

export async function fetchHuggingFaceModels(): Promise<LLMModel[]> {
  try {
    const urls = [
      `${HF_API_BASE}?filter=gguf&sort=downloads&direction=-1&limit=30&pipeline_tag=text-generation`,
      `${HF_API_BASE}?filter=gguf&sort=downloads&direction=-1&limit=30&pipeline_tag=image-text-to-text`,
    ];

    const allResults = await Promise.all(
      urls.map(async (url) => {
        const response = await fetchWithTimeout(url, TIMEOUT_MS);
        if (!response.ok) return [] as HFModel[];
        return (await response.json()) as HFModel[];
      })
    );

    const seen = new Set<string>();
    const merged: HFModel[] = [];
    for (const list of allResults) {
      for (const m of list) {
        if (!seen.has(m.id)) {
          seen.add(m.id);
          merged.push(m);
        }
      }
    }

    const models: LLMModel[] = [];
    for (const m of merged) {
      const converted = hfModelToLLMModel(m);
      if (converted) models.push(converted);
    }
    return models;
  } catch {
    return [];
  }
}
