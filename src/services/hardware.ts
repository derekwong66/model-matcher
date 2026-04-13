import type {
  GPUVendor,
  HardwareSpecs,
  VramConfidence,
} from "../types/index.ts";
import { lookupGpu } from "../data/gpu-database.ts";

interface WebGPUAdapterInfo {
  vendor: string;
  architecture: string;
  device: string;
  description: string;
}

interface GPULimits {
  maxBufferSize: number;
  maxStorageBufferBindingSize: number;
  maxUniformBufferBindingSize: number;
}

async function tryWebGPU(): Promise<{
  adapterInfo: WebGPUAdapterInfo | null;
  limits: GPULimits | null;
}> {
  if (!navigator.gpu) {
    return { adapterInfo: null, limits: null };
  }

  try {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      return { adapterInfo: null, limits: null };
    }

    const info = (adapter as unknown as { requestAdapterInfo?: () => Promise<WebGPUAdapterInfo> }).requestAdapterInfo
      ? await (adapter as unknown as { requestAdapterInfo: () => Promise<WebGPUAdapterInfo> }).requestAdapterInfo()
      : (adapter.info as unknown as WebGPUAdapterInfo | undefined) ?? null;
    const limits = {
      maxBufferSize: adapter.limits.maxBufferSize,
      maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize,
      maxUniformBufferBindingSize: adapter.limits.maxUniformBufferBindingSize,
    };

    return { adapterInfo: info, limits };
  } catch {
    return { adapterInfo: null, limits: null };
  }
}

function tryWebGL(): { vendor: string; renderer: string } {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl") as WebGLRenderingContext | null;
    if (!gl) return { vendor: "Unknown", renderer: "Unknown" };

    const glCtx = gl as WebGLRenderingContext;
    const debugInfo = glCtx.getExtension("WEBGL_debug_renderer_info");
    if (!debugInfo) return { vendor: "Unknown", renderer: "Unknown" };

    return {
      vendor: glCtx.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "Unknown",
      renderer:
        glCtx.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "Unknown",
    };
  } catch {
    return { vendor: "Unknown", renderer: "Unknown" };
  }
}

function identifyVendor(renderer: string): GPUVendor {
  const lower = renderer.toLowerCase();
  if (
    lower.includes("apple") ||
    lower.includes("m1") ||
    lower.includes("m2") ||
    lower.includes("m3") ||
    lower.includes("m4")
  ) {
    return "apple";
  }
  if (
    lower.includes("nvidia") ||
    lower.includes("geforce") ||
    lower.includes("rtx") ||
    lower.includes("gtx") ||
    lower.includes("tegra") ||
    lower.includes("jetson") ||
    lower.includes("orin") ||
    lower.includes("xavier")
  ) {
    return "nvidia";
  }
  if (
    lower.includes("amd") ||
    lower.includes("radeon") ||
    lower.includes("rx ")
  ) {
    return "amd";
  }
  if (lower.includes("intel") || lower.includes("arc ")) {
    return "intel";
  }
  return "unknown";
}

function isAppleSilicon(renderer: string, vendor: string): boolean {
  const combined = (renderer + " " + vendor).toLowerCase();
  return (
    combined.includes("apple") ||
    combined.includes("m1") ||
    combined.includes("m2") ||
    combined.includes("m3") ||
    combined.includes("m4")
  );
}

function isJetson(renderer: string): boolean {
  const lower = renderer.toLowerCase();
  return (
    lower.includes("tegra") ||
    lower.includes("jetson") ||
    lower.includes("orin") ||
    lower.includes("xavier")
  );
}

function estimateVramFromWebGPULimits(limits: GPULimits): {
  vram: number;
  confidence: VramConfidence;
} {
  // maxBufferSize is typically a fraction of total VRAM
  // Usually the GPU can allocate buffers up to ~50-75% of total VRAM
  const maxBufGB = limits.maxBufferSize / (1024 * 1024 * 1024);
  const estimatedVram = maxBufGB * 1.5;
  return {
    vram: Math.round(estimatedVram * 10) / 10,
    confidence: "medium",
  };
}

function estimateUnifiedMemoryVram(
  ram: number,
  limits: GPULimits | null,
  osReserve: number
): { vram: number; confidence: VramConfidence } {
  if (limits) {
    const fromLimits = estimateVramFromWebGPULimits(limits);
    const fromRam = ram - osReserve;
    const vram = Math.min(fromLimits.vram, fromRam);
    return {
      vram: Math.max(Math.round(vram * 10) / 10, 2),
      confidence: "medium",
    };
  }
  return {
    vram: Math.max(Math.round((ram - osReserve) * 10) / 10, 2),
    confidence: "low",
  };
}

function extractGpuModel(renderer: string): string {
  // Try to extract a clean model name from the renderer string
  const lower = renderer.toLowerCase();

  // Apple Silicon
  const appleMatch = lower.match(/(apple\s*)?(m[1-4]\s*(pro|max|ultra)?)/i);
  if (appleMatch) {
    return appleMatch[2].toUpperCase().replace(/\s+/g, " ");
  }

  // Use the GPU database for known models
  const dbEntry = lookupGpu(renderer);
  if (dbEntry) {
    return dbEntry.patterns[0].toUpperCase();
  }

  // Return cleaned renderer as fallback
  return renderer.replace(/^(NVIDIA|AMD|Intel)\s*/i, "").trim() || renderer;
}

export async function getHardwareSpecs(): Promise<HardwareSpecs> {
  const ram =
    (navigator as unknown as { deviceMemory?: number }).deviceMemory || 8;
  const cores = navigator.hardwareConcurrency || 4;

  // Try WebGPU first
  const { adapterInfo, limits } = await tryWebGPU();
  const webgpuAvailable = adapterInfo !== null;

  // Fallback to WebGL for renderer info
  const webgl = tryWebGL();

  // Determine the best renderer string available
  const renderer =
    adapterInfo?.description || adapterInfo?.device || webgl.renderer;
  const vendorStr = adapterInfo?.vendor || webgl.vendor;

  const gpuVendor = identifyVendor(renderer);
  const appleSilicon = isAppleSilicon(renderer, vendorStr);
  const jetson = isJetson(renderer);
  const gpuModel = extractGpuModel(renderer);

  let vramEstimate = 0;
  let vramConfidence: VramConfidence = "low";

  // Jetson: unified memory like Apple Silicon, OS reserves ~4GB
  if (jetson) {
    const dbEntry = lookupGpu(renderer);
    if (dbEntry && dbEntry.vram > 0) {
      // Known Jetson model in database — but still cap by actual RAM
      vramEstimate = Math.min(dbEntry.vram, ram);
      vramConfidence = "high";
    } else {
      // Generic Tegra / unknown Jetson — use unified memory estimate
      const result = estimateUnifiedMemoryVram(ram, limits, 4);
      vramEstimate = result.vram;
      vramConfidence = result.confidence;
    }
  } else if (appleSilicon) {
    const result = estimateUnifiedMemoryVram(ram, limits, 6);
    vramEstimate = result.vram;
    vramConfidence = result.confidence;
  } else {
    // Try GPU database lookup first
    const dbEntry = lookupGpu(renderer);
    if (dbEntry) {
      vramEstimate = dbEntry.vram;
      vramConfidence = "high";
    } else if (limits) {
      // Use WebGPU limits as fallback
      const result = estimateVramFromWebGPULimits(limits);
      vramEstimate = result.vram;
      vramConfidence = result.confidence;
    } else {
      vramEstimate = 4;
      vramConfidence = "low";
    }
  }

  return {
    ram,
    cores,
    gpuVendor,
    gpuRenderer: renderer,
    gpuModel,
    vramEstimate,
    vramConfidence,
    isAppleSilicon: appleSilicon,
    isJetson: jetson,
    webgpuAvailable,
  };
}
