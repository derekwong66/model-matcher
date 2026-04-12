import type { LLMModel } from "../types/index.ts";

export const staticModels: LLMModel[] = [
  {
    id: "static-llama3.1-8b",
    name: "Llama 3.1 8B",
    family: "Llama",
    parameterSize: "8B",
    description: "Meta's most capable small model to date.",
    tags: ["General", "Efficient"],
    requirements: [
      { quantization: "Q4_K_M (4-bit)", vram: 5.5, ram: 16 },
      { quantization: "Q8_0 (8-bit)", vram: 9, ram: 16 },
      { quantization: "FP16 (16-bit)", vram: 16, ram: 32 },
    ],
    source: "static",
  },
  {
    id: "static-llama3.1-70b",
    name: "Llama 3.1 70B",
    family: "Llama",
    parameterSize: "70B",
    description:
      "High-performance model for complex reasoning and creative tasks.",
    tags: ["Reasoning", "Knowledge"],
    requirements: [
      { quantization: "Q4_K_M (4-bit)", vram: 43, ram: 64 },
      { quantization: "Q8_0 (8-bit)", vram: 75, ram: 128 },
    ],
    source: "static",
  },
  {
    id: "static-mistral-7b",
    name: "Mistral 7B v0.3",
    family: "Mistral",
    parameterSize: "7B",
    description: "Popular and efficient base model for fine-tuning.",
    tags: ["Chat", "Creative"],
    requirements: [
      { quantization: "Q4_K_M (4-bit)", vram: 5.0, ram: 16 },
      { quantization: "Q8_0 (8-bit)", vram: 8.2, ram: 16 },
      { quantization: "FP16 (16-bit)", vram: 14, ram: 32 },
    ],
    source: "static",
  },
  {
    id: "static-qwen2.5-7b",
    name: "Qwen 2.5 7B",
    family: "Qwen",
    parameterSize: "7B",
    description:
      "Alibaba's highly capable model with strong Chinese support.",
    tags: ["Multilingual", "Coding"],
    requirements: [
      { quantization: "Q4_K_M (4-bit)", vram: 5.2, ram: 16 },
      { quantization: "Q8_0 (8-bit)", vram: 8.5, ram: 16 },
      { quantization: "FP16 (16-bit)", vram: 15, ram: 32 },
    ],
    source: "static",
  },
  {
    id: "static-qwen2.5-32b",
    name: "Qwen 2.5 32B",
    family: "Qwen",
    parameterSize: "32B",
    description: "Great balance of performance and size.",
    tags: ["Math", "Reasoning"],
    requirements: [
      { quantization: "Q4_K_M (4-bit)", vram: 20, ram: 64 },
      { quantization: "Q8_0 (8-bit)", vram: 35, ram: 128 },
    ],
    source: "static",
  },
  {
    id: "static-phi3-mini",
    name: "Phi-3 Mini",
    family: "Phi",
    parameterSize: "3.8B",
    description:
      "Microsoft's tiny but mighty model, perfect for lightweight devices.",
    tags: ["Fast", "Edge"],
    requirements: [
      { quantization: "Q4_K_M (4-bit)", vram: 2.2, ram: 8 },
      { quantization: "FP16 (16-bit)", vram: 8, ram: 16 },
    ],
    source: "static",
  },
];
