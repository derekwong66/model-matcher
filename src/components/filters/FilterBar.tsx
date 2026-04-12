import { FilterChip } from "./FilterChip.tsx";
import type {
  FilterState,
  CompatibilityStatus,
  ParamRange,
  SortField,
} from "../../types/index.ts";
import { PARAM_RANGE_BOUNDS } from "../../types/index.ts";
import "./FilterBar.css";

interface FilterBarProps {
  filter: FilterState;
  families: string[];
  quantTypes: string[];
  onUpdate: (patch: Partial<FilterState>) => void;
  onReset: () => void;
  resultCount: number;
}

const COMPAT_LABELS: Record<CompatibilityStatus, string> = {
  optimal: "Optimal",
  slow: "Can Run (Slow)",
  incompatible: "Incompatible",
};

const SORT_LABELS: Record<SortField, string> = {
  name: "Name",
  parameterSize: "Parameters",
  vramRequired: "VRAM",
  compatibility: "Compatibility",
};

export function FilterBar({
  filter,
  families,
  quantTypes,
  onUpdate,
  onReset,
  resultCount,
}: FilterBarProps) {
  const hasActiveFilter =
    filter.search ||
    filter.families.length > 0 ||
    filter.compatibilities.length > 0 ||
    filter.paramRanges.length > 0 ||
    filter.quantTypes.length > 0;

  const toggleInArray = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];

  return (
    <div className="filter-bar">
      <div className="filter-bar__search">
        <svg
          className="filter-bar__search-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className="filter-bar__input"
          type="text"
          placeholder="Search models..."
          value={filter.search}
          onChange={(e) => onUpdate({ search: e.target.value })}
        />
        {filter.search && (
          <button
            className="filter-bar__clear"
            onClick={() => onUpdate({ search: "" })}
          >
            ×
          </button>
        )}
      </div>

      <div className="filter-bar__row">
        <div className="filter-bar__group">
          <span className="filter-bar__label">Family</span>
          <div className="filter-bar__chips">
            {families.map((f) => (
              <FilterChip
                key={f}
                label={f}
                active={filter.families.includes(f)}
                onClick={() =>
                  onUpdate({ families: toggleInArray(filter.families, f) })
                }
              />
            ))}
          </div>
        </div>
      </div>

      <div className="filter-bar__row">
        <div className="filter-bar__group">
          <span className="filter-bar__label">Compatibility</span>
          <div className="filter-bar__chips">
            {(
              Object.entries(COMPAT_LABELS) as [CompatibilityStatus, string][]
            ).map(([key, label]) => (
              <FilterChip
                key={key}
                label={label}
                active={filter.compatibilities.includes(key)}
                onClick={() =>
                  onUpdate({
                    compatibilities: toggleInArray(
                      filter.compatibilities,
                      key
                    ),
                  })
                }
              />
            ))}
          </div>
        </div>
      </div>

      <div className="filter-bar__row">
        <div className="filter-bar__group">
          <span className="filter-bar__label">Size</span>
          <div className="filter-bar__chips">
            {(
              Object.entries(PARAM_RANGE_BOUNDS) as [ParamRange, typeof PARAM_RANGE_BOUNDS[ParamRange]][]
            ).map(([key, { label }]) => (
              <FilterChip
                key={key}
                label={label}
                active={filter.paramRanges.includes(key)}
                onClick={() =>
                  onUpdate({
                    paramRanges: toggleInArray(filter.paramRanges, key),
                  })
                }
              />
            ))}
          </div>
        </div>
      </div>

      {quantTypes.length > 1 && (
        <div className="filter-bar__row">
          <div className="filter-bar__group">
            <span className="filter-bar__label">Quantization</span>
            <div className="filter-bar__chips">
              {quantTypes.map((q) => (
                <FilterChip
                  key={q}
                  label={q}
                  active={filter.quantTypes.includes(q)}
                  onClick={() =>
                    onUpdate({
                      quantTypes: toggleInArray(filter.quantTypes, q),
                    })
                  }
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="filter-bar__footer">
        <div className="filter-bar__sort">
          <span className="filter-bar__label">Sort by</span>
          <select
            className="filter-bar__select"
            value={filter.sortBy}
            onChange={(e) =>
              onUpdate({ sortBy: e.target.value as SortField })
            }
          >
            {(
              Object.entries(SORT_LABELS) as [SortField, string][]
            ).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <button
            className="filter-bar__sort-dir"
            onClick={() =>
              onUpdate({
                sortDir: filter.sortDir === "asc" ? "desc" : "asc",
              })
            }
            title={
              filter.sortDir === "asc" ? "Ascending" : "Descending"
            }
          >
            {filter.sortDir === "asc" ? "↑" : "↓"}
          </button>
        </div>

        <div className="filter-bar__meta">
          <span className="filter-bar__count">
            {resultCount} model{resultCount !== 1 ? "s" : ""}
          </span>
          {hasActiveFilter && (
            <button className="filter-bar__reset" onClick={onReset}>
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
