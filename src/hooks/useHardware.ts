import { useState, useCallback } from "react";
import type { HardwareSpecs } from "../types/index.ts";
import { getHardwareSpecs } from "../services/hardware.ts";

export function useHardware(): {
  specs: HardwareSpecs | null;
  loading: boolean;
  detect: () => Promise<void>;
  refresh: () => Promise<void>;
} {
  const [specs, setSpecs] = useState<HardwareSpecs | null>(null);
  const [loading, setLoading] = useState(false);

  const run = useCallback(async () => {
    setLoading(true);
    const hardware = await getHardwareSpecs();
    setSpecs(hardware);
    setLoading(false);
  }, []);

  return { specs, loading, detect: run, refresh: run };
}
