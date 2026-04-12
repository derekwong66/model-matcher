import { useMemo, useState, useCallback } from "react";
import type {
  LLMModel,
  HardwareSpecs,
  FilterState,
  CompatibilityStatus,
  ParamRange,
} from "../types/index.ts";
import { PARAM_RANGE_BOUNDS } from "../types/index.ts";

function mergeModels(
  staticModels: LLMModel[],
  hfModels: LLMModel[]
): LLMModel[] {
  const seenNames = new Set<string>();
  const result: LLMModel[] = [];

  // Static built-in models first
  for (const m of staticModels) {
    const key = m.name.toLowerCase();
    if (!seenNames.has(key)) {
      result.push(m);
      seenNames.add(key);
    }
  }

  // HuggingFace models
  for (const m of hfModels) {
    const key = m.name.toLowerCase();
    if (!seenNames.has(key)) {
      result.push(m);
      seenNames.add(key);
    }
  }

  return result;
}

function getCompatibility(
  model: LLMModel,
  specs: HardwareSpecs | null
): CompatibilityStatus {
  if (!specs) return "incompatible";
  const minVram = Math.min(...model.requirements.map((r) => r.vram));
  if (specs.vramEstimate >= minVram) return "optimal";
  const minRam = Math.min(...model.requirements.map((r) => r.ram));
  if (specs.ram >= minRam) return "slow";
  return "incompatible";
}

function parseParamSize(size: string): number {
  const match = size.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

function matchesParamRange(size: string, ranges: ParamRange[]): boolean {
  if (ranges.length === 0) return true;
  const val = parseParamSize(size);
  return ranges.some((r) => {
    const bounds = PARAM_RANGE_BOUNDS[r];
    return val >= bounds.min && val < bounds.max;
  });
}

const DEFAULT_FILTER: FilterState = {
  search: "",
  families: [],
  compatibilities: [],
  paramRanges: [],
  quantTypes: [],
  sortBy: "name",
  sortDir: "asc",
};

export function useModels(
  staticModels: LLMModel[],
  hfModels: LLMModel[],
  specs: HardwareSpecs | null
) {
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);

  const allModels = useMemo(
    () => mergeModels(staticModels, hfModels),
    [staticModels, hfModels]
  );

  const families = useMemo(
    () => [...new Set(allModels.map((m) => m.family))].sort(),
    [allModels]
  );

  const quantTypes = useMemo(() => {
    const quants = new Set<string>();
    allModels.forEach((m) =>
      m.requirements.forEach((r) => quants.add(r.quantization))
    );
    return [...quants].sort();
  }, [allModels]);

  const filteredModels = useMemo(() => {
    let result = allModels;

    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q)) ||
          m.family.toLowerCase().includes(q)
      );
    }

    if (filter.families.length > 0) {
      result = result.filter((m) => filter.families.includes(m.family));
    }

    if (filter.compatibilities.length > 0) {
      result = result.filter((m) =>
        filter.compatibilities.includes(getCompatibility(m, specs))
      );
    }

    if (filter.paramRanges.length > 0) {
      result = result.filter((m) =>
        matchesParamRange(m.parameterSize, filter.paramRanges)
      );
    }

    if (filter.quantTypes.length > 0) {
      result = result.filter((m) =>
        m.requirements.some((r) => filter.quantTypes.includes(r.quantization))
      );
    }

    result = [...result].sort((a, b) => {
      let cmp = 0;
      switch (filter.sortBy) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "parameterSize":
          cmp =
            parseParamSize(a.parameterSize) - parseParamSize(b.parameterSize);
          break;
        case "vramRequired":
          cmp =
            Math.min(...a.requirements.map((r) => r.vram)) -
            Math.min(...b.requirements.map((r) => r.vram));
          break;
        case "compatibility": {
          const order: Record<CompatibilityStatus, number> = {
            optimal: 0,
            slow: 1,
            incompatible: 2,
          };
          cmp =
            order[getCompatibility(a, specs)] -
            order[getCompatibility(b, specs)];
          break;
        }
      }
      return filter.sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [allModels, filter, specs]);

  const getCompat = useCallback(
    (model: LLMModel): CompatibilityStatus => getCompatibility(model, specs),
    [specs]
  );

  const updateFilter = useCallback(
    (patch: Partial<FilterState>) =>
      setFilter((prev) => ({ ...prev, ...patch })),
    []
  );

  const resetFilter = useCallback(() => setFilter(DEFAULT_FILTER), []);

  return {
    models: filteredModels,
    allModels,
    families,
    quantTypes,
    filter,
    updateFilter,
    resetFilter,
    getCompat,
  };
}
