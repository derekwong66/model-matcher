export interface GpuEntry {
  patterns: string[];
  vram: number;
  vendor: "nvidia" | "amd" | "intel";
}

const GPU_DATABASE: GpuEntry[] = [
  // NVIDIA GeForce RTX 50 Series
  { patterns: ["rtx 5090", "geforce rtx 5090"], vram: 32, vendor: "nvidia" },
  { patterns: ["rtx 5080", "geforce rtx 5080"], vram: 16, vendor: "nvidia" },
  { patterns: ["rtx 5070 ti", "geforce rtx 5070 ti"], vram: 16, vendor: "nvidia" },
  { patterns: ["rtx 5070", "geforce rtx 5070"], vram: 12, vendor: "nvidia" },

  // NVIDIA GeForce RTX 40 Series
  { patterns: ["rtx 4090", "geforce rtx 4090"], vram: 24, vendor: "nvidia" },
  { patterns: ["rtx 4080", "geforce rtx 4080"], vram: 16, vendor: "nvidia" },
  { patterns: ["rtx 4070 ti super", "geforce rtx 4070 ti super"], vram: 16, vendor: "nvidia" },
  { patterns: ["rtx 4070 ti", "geforce rtx 4070 ti"], vram: 12, vendor: "nvidia" },
  { patterns: ["rtx 4070 super", "geforce rtx 4070 super"], vram: 12, vendor: "nvidia" },
  { patterns: ["rtx 4070", "geforce rtx 4070"], vram: 12, vendor: "nvidia" },
  { patterns: ["rtx 4060 ti", "geforce rtx 4060 ti"], vram: 8, vendor: "nvidia" },
  { patterns: ["rtx 4060", "geforce rtx 4060"], vram: 8, vendor: "nvidia" },

  // NVIDIA GeForce RTX 30 Series
  { patterns: ["rtx 3090 ti", "geforce rtx 3090 ti"], vram: 24, vendor: "nvidia" },
  { patterns: ["rtx 3090", "geforce rtx 3090"], vram: 24, vendor: "nvidia" },
  { patterns: ["rtx 3080 ti", "geforce rtx 3080 ti"], vram: 12, vendor: "nvidia" },
  { patterns: ["rtx 3080", "geforce rtx 3080"], vram: 10, vendor: "nvidia" },
  { patterns: ["rtx 3070 ti", "geforce rtx 3070 ti"], vram: 8, vendor: "nvidia" },
  { patterns: ["rtx 3070", "geforce rtx 3070"], vram: 8, vendor: "nvidia" },
  { patterns: ["rtx 3060 ti", "geforce rtx 3060 ti"], vram: 8, vendor: "nvidia" },
  { patterns: ["rtx 3060", "geforce rtx 3060"], vram: 12, vendor: "nvidia" },

  // NVIDIA GeForce RTX 20 Series
  { patterns: ["rtx 2080 ti", "geforce rtx 2080 ti"], vram: 11, vendor: "nvidia" },
  { patterns: ["rtx 2080 super", "geforce rtx 2080 super"], vram: 8, vendor: "nvidia" },
  { patterns: ["rtx 2080", "geforce rtx 2080"], vram: 8, vendor: "nvidia" },
  { patterns: ["rtx 2070 super", "geforce rtx 2070 super"], vram: 8, vendor: "nvidia" },
  { patterns: ["rtx 2070", "geforce rtx 2070"], vram: 8, vendor: "nvidia" },
  { patterns: ["rtx 2060 super", "geforce rtx 2060 super"], vram: 8, vendor: "nvidia" },
  { patterns: ["rtx 2060", "geforce rtx 2060"], vram: 6, vendor: "nvidia" },

  // NVIDIA Titan
  { patterns: ["titan rtx", "nvidia titan rtx"], vram: 24, vendor: "nvidia" },
  { patterns: ["titan v", "nvidia titan v"], vram: 12, vendor: "nvidia" },

  // AMD Radeon RX 9000 Series
  { patterns: ["rx 9070 xt", "radeon rx 9070 xt"], vram: 16, vendor: "amd" },
  { patterns: ["rx 9070", "radeon rx 9070"], vram: 16, vendor: "amd" },

  // AMD Radeon RX 7000 Series
  { patterns: ["rx 7900 xtx", "radeon rx 7900 xtx"], vram: 24, vendor: "amd" },
  { patterns: ["rx 7900 xt", "radeon rx 7900 xt"], vram: 20, vendor: "amd" },
  { patterns: ["rx 7900 gre", "radeon rx 7900 gre"], vram: 16, vendor: "amd" },
  { patterns: ["rx 7800 xt", "radeon rx 7800 xt"], vram: 16, vendor: "amd" },
  { patterns: ["rx 7700 xt", "radeon rx 7700 xt"], vram: 12, vendor: "amd" },
  { patterns: ["rx 7600 xt", "radeon rx 7600 xt"], vram: 16, vendor: "amd" },
  { patterns: ["rx 7600", "radeon rx 7600"], vram: 8, vendor: "amd" },
  { patterns: ["rx 7500 xt", "radeon rx 7500 xt"], vram: 6, vendor: "amd" },

  // AMD Radeon RX 6000 Series
  { patterns: ["rx 6950 xt", "radeon rx 6950 xt"], vram: 16, vendor: "amd" },
  { patterns: ["rx 6900 xt", "radeon rx 6900 xt"], vram: 16, vendor: "amd" },
  { patterns: ["rx 6800 xt", "radeon rx 6800 xt"], vram: 16, vendor: "amd" },
  { patterns: ["rx 6800", "radeon rx 6800"], vram: 16, vendor: "amd" },
  { patterns: ["rx 6700 xt", "radeon rx 6700 xt"], vram: 12, vendor: "amd" },
  { patterns: ["rx 6700", "radeon rx 6700"], vram: 10, vendor: "amd" },
  { patterns: ["rx 6600 xt", "radeon rx 6600 xt"], vram: 8, vendor: "amd" },
  { patterns: ["rx 6600", "radeon rx 6600"], vram: 8, vendor: "amd" },
  { patterns: ["rx 6500 xt", "radeon rx 6500 xt"], vram: 4, vendor: "amd" },

  // Intel Arc Series
  { patterns: ["arc a770", "intel arc a770"], vram: 16, vendor: "intel" },
  { patterns: ["arc a750", "intel arc a750"], vram: 8, vendor: "intel" },
  { patterns: ["arc a580", "intel arc a580"], vram: 8, vendor: "intel" },
  { patterns: ["arc a380", "intel arc a380"], vram: 6, vendor: "intel" },
  { patterns: ["arc b580", "intel arc b580"], vram: 12, vendor: "intel" },
  { patterns: ["arc b570", "intel arc b570"], vram: 10, vendor: "intel" },
];

export function lookupGpu(renderer: string): GpuEntry | null {
  const lower = renderer.toLowerCase();
  for (const entry of GPU_DATABASE) {
    for (const pattern of entry.patterns) {
      if (lower.includes(pattern)) {
        return entry;
      }
    }
  }
  return null;
}
