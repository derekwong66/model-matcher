import type { LLMModel } from "../types/index.ts";

export const staticModels: LLMModel[] = [
  // === Meta Llama ===
  {
    id: "static-llama3.1-8b",
    name: "Llama 3.1 8B",
    family: "Llama",
    parameterSize: "8B",
    description: "Meta's most capable small model. Great general-purpose assistant.",
    tags: ["General", "Efficient"],
    inputType: "text",
    scenarios: ["chat", "reasoning", "creative"],
    requirements: [
      { quantization: "Q4_K_M", vram: 5.5, ram: 16 },
      { quantization: "Q8_0", vram: 9, ram: 16 },
      { quantization: "FP16", vram: 16, ram: 32 },
    ],
    source: "static",
  },
  {
    id: "static-llama3.1-70b",
    name: "Llama 3.1 70B",
    family: "Llama",
    parameterSize: "70B",
    description:
      "Meta's flagship model for complex reasoning, knowledge-intensive tasks, and creative writing.",
    tags: ["Reasoning", "Knowledge"],
    inputType: "text",
    scenarios: ["reasoning", "chat", "creative", "coding"],
    requirements: [
      { quantization: "Q4_K_M", vram: 43, ram: 64 },
      { quantization: "Q8_0", vram: 75, ram: 128 },
    ],
    source: "static",
  },

  // === Alibaba Qwen ===
  {
    id: "static-qwen2.5-7b",
    name: "Qwen 2.5 7B",
    family: "Qwen",
    parameterSize: "7B",
    description:
      "Alibaba's highly capable multilingual model with best-in-class Chinese and coding support.",
    tags: ["Multilingual", "Coding"],
    inputType: "text",
    scenarios: ["chat", "coding", "multilingual", "math"],
    requirements: [
      { quantization: "Q4_K_M", vram: 5.2, ram: 16 },
      { quantization: "Q8_0", vram: 8.5, ram: 16 },
    ],
    source: "static",
  },
  {
    id: "static-qwen2.5-32b",
    name: "Qwen 2.5 32B",
    family: "Qwen",
    parameterSize: "32B",
    description:
      "Best balance of performance and size. Excels at math, coding, and multilingual reasoning.",
    tags: ["Math", "Reasoning"],
    inputType: "text",
    scenarios: ["reasoning", "math", "coding", "multilingual"],
    requirements: [
      { quantization: "Q4_K_M", vram: 20, ram: 64 },
      { quantization: "Q8_0", vram: 35, ram: 128 },
    ],
    source: "static",
  },
  {
    id: "static-qwen2.5-coder-7b",
    name: "Qwen 2.5 Coder 7B",
    family: "Qwen",
    parameterSize: "7B",
    description:
      "Specialized coding model. Supports 90+ programming languages with strong debugging ability.",
    tags: ["Coding", "Efficient"],
    inputType: "text",
    scenarios: ["coding"],
    requirements: [
      { quantization: "Q4_K_M", vram: 5.2, ram: 16 },
      { quantization: "Q8_0", vram: 8.5, ram: 16 },
    ],
    source: "static",
  },

  // === DeepSeek ===
  {
    id: "static-deepseek-r1-8b",
    name: "DeepSeek R1 8B",
    family: "DeepSeek",
    parameterSize: "8B",
    description:
      "DeepSeek's distilled reasoning model. Strong chain-of-thought for math and logic problems.",
    tags: ["Reasoning", "Math"],
    inputType: "text",
    scenarios: ["reasoning", "math", "coding"],
    requirements: [
      { quantization: "Q4_K_M", vram: 5.5, ram: 16 },
      { quantization: "Q8_0", vram: 9, ram: 16 },
    ],
    source: "static",
  },
  {
    id: "static-deepseek-r1-32b",
    name: "DeepSeek R1 32B",
    family: "DeepSeek",
    parameterSize: "32B",
    description:
      "High-performance reasoning model rivaling much larger models on math and science benchmarks.",
    tags: ["Reasoning", "Science"],
    inputType: "text",
    scenarios: ["reasoning", "math", "coding"],
    requirements: [
      { quantization: "Q4_K_M", vram: 20, ram: 64 },
      { quantization: "Q8_0", vram: 35, ram: 128 },
    ],
    source: "static",
  },
  {
    id: "static-deepseek-v3",
    name: "DeepSeek V3 671B (MoE)",
    family: "DeepSeek",
    parameterSize: "671B",
    description:
      "Mixture-of-experts architecture. 37B active parameters, top-tier coding and reasoning. Requires heavy hardware.",
    tags: ["MoE", "Reasoning"],
    inputType: "text",
    scenarios: ["reasoning", "coding", "chat", "math"],
    requirements: [
      { quantization: "Q4_K_M", vram: 160, ram: 256 },
    ],
    source: "static",
  },

  // === Google Gemma ===
  {
    id: "static-gemma3-4b",
    name: "Gemma 3 4B",
    family: "Gemma",
    parameterSize: "4B",
    description:
      "Google's lightweight multimodal model. Accepts text and images, ideal for on-device use.",
    tags: ["Vision", "Edge"],
    inputType: "text+image",
    scenarios: ["vision", "chat", "edge"],
    requirements: [
      { quantization: "Q4_K_M", vram: 3.2, ram: 8 },
      { quantization: "Q8_0", vram: 5.5, ram: 16 },
    ],
    source: "static",
  },
  {
    id: "static-gemma3-12b",
    name: "Gemma 3 12B",
    family: "Gemma",
    parameterSize: "12B",
    description:
      "Google's mid-size multimodal model. Strong vision + text understanding with good multilingual support.",
    tags: ["Vision", "Multilingual"],
    inputType: "text+image",
    scenarios: ["vision", "chat", "multilingual", "creative"],
    requirements: [
      { quantization: "Q4_K_M", vram: 8, ram: 16 },
      { quantization: "Q8_0", vram: 14, ram: 32 },
    ],
    source: "static",
  },
  {
    id: "static-gemma3-27b",
    name: "Gemma 3 27B",
    family: "Gemma",
    parameterSize: "27B",
    description:
      "Google's most capable open multimodal model. State-of-the-art vision and reasoning.",
    tags: ["Vision", "Reasoning"],
    inputType: "text+image",
    scenarios: ["vision", "reasoning", "chat", "creative"],
    requirements: [
      { quantization: "Q4_K_M", vram: 17, ram: 32 },
      { quantization: "Q8_0", vram: 30, ram: 64 },
    ],
    source: "static",
  },

  // === Zhipu GLM ===
  {
    id: "static-glm4-9b",
    name: "GLM-4 9B",
    family: "GLM",
    parameterSize: "9B",
    description:
      "Zhipu AI's bilingual (Chinese/English) model. Strong on Chinese NLP tasks and tool use.",
    tags: ["Multilingual", "Tool Use"],
    inputType: "text",
    scenarios: ["chat", "multilingual", "reasoning"],
    requirements: [
      { quantization: "Q4_K_M", vram: 6, ram: 16 },
      { quantization: "Q8_0", vram: 10, ram: 16 },
    ],
    source: "static",
  },

  // === Mistral ===
  {
    id: "static-mistral-7b",
    name: "Mistral 7B v0.3",
    family: "Mistral",
    parameterSize: "7B",
    description:
      "Popular efficient base model. Great for fine-tuning and general chat applications.",
    tags: ["Chat", "Creative"],
    inputType: "text",
    scenarios: ["chat", "creative", "edge"],
    requirements: [
      { quantization: "Q4_K_M", vram: 5.0, ram: 16 },
      { quantization: "Q8_0", vram: 8.2, ram: 16 },
    ],
    source: "static",
  },
  {
    id: "static-mixtral-8x7b",
    name: "Mixtral 8x7B (MoE)",
    family: "Mistral",
    parameterSize: "47B",
    description:
      "Mixture-of-experts model. Only 13B active params per token — great efficiency for its size.",
    tags: ["MoE", "Efficient"],
    inputType: "text",
    scenarios: ["chat", "reasoning", "coding", "multilingual"],
    requirements: [
      { quantization: "Q4_K_M", vram: 26, ram: 48 },
      { quantization: "Q8_0", vram: 50, ram: 96 },
    ],
    source: "static",
  },

  // === Microsoft Phi ===
  {
    id: "static-phi3-mini",
    name: "Phi-3 Mini 3.8B",
    family: "Phi",
    parameterSize: "3.8B",
    description:
      "Microsoft's tiny but mighty model. Perfect for resource-constrained edge devices.",
    tags: ["Fast", "Edge"],
    inputType: "text",
    scenarios: ["chat", "edge", "reasoning"],
    requirements: [
      { quantization: "Q4_K_M", vram: 2.2, ram: 8 },
      { quantization: "FP16", vram: 8, ram: 16 },
    ],
    source: "static",
  },
  {
    id: "static-phi4-mini",
    name: "Phi-4 Mini 3.8B",
    family: "Phi",
    parameterSize: "3.8B",
    description:
      "Microsoft's latest compact model. Improved reasoning and coding over Phi-3.",
    tags: ["Fast", "Coding"],
    inputType: "text",
    scenarios: ["chat", "coding", "reasoning", "edge"],
    requirements: [
      { quantization: "Q4_K_M", vram: 2.5, ram: 8 },
      { quantization: "Q8_0", vram: 4.2, ram: 8 },
    ],
    source: "static",
  },

  // === 01.AI Yi ===
  {
    id: "static-yi-1.5-9b",
    name: "Yi-1.5 9B",
    family: "Yi",
    parameterSize: "9B",
    description:
      "01.AI's strong bilingual model with excellent Chinese and English capabilities.",
    tags: ["Multilingual", "Chat"],
    inputType: "text",
    scenarios: ["chat", "multilingual", "creative"],
    requirements: [
      { quantization: "Q4_K_M", vram: 6, ram: 16 },
      { quantization: "Q8_0", vram: 10, ram: 16 },
    ],
    source: "static",
  },

  // === InternLM ===
  {
    id: "static-internlm3-8b",
    name: "InternLM 3 8B",
    family: "InternLM",
    parameterSize: "8B",
    description:
      "Shanghai AI Lab's model with strong tool-use and reasoning. Excellent Chinese understanding.",
    tags: ["Tool Use", "Reasoning"],
    inputType: "text",
    scenarios: ["chat", "reasoning", "multilingual", "coding"],
    requirements: [
      { quantization: "Q4_K_M", vram: 5.5, ram: 16 },
      { quantization: "Q8_0", vram: 9, ram: 16 },
    ],
    source: "static",
  },
];
