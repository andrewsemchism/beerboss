"use client";

import { FilterState, ContainerSubType } from "@/lib/types";
import { NAMED_PACK_SIZES } from "@/lib/beerUtils";
import AbvSlider from "./AbvSlider";
import BeerCombobox from "./BeerCombobox";

interface Props {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  allBeerNames: string[];
  resultCount: number;
}

const CONTAINER_OPTIONS: { key: ContainerSubType; label: string }[] = [
  { key: "can-regular", label: "Regular Can" },
  { key: "can-tallboy", label: "Tallboy Can" },
  { key: "bottle-regular", label: "Regular Bottle" },
  { key: "bottle-large", label: "Large Bottle" },
  { key: "keg-small", label: "Small Keg" },
  { key: "keg-large", label: "Large Keg" },
];

export default function FilterPanel({ filters, onChange, allBeerNames, resultCount }: Props) {
  function toggleContainer(key: ContainerSubType) {
    const has = filters.containerSubTypes.includes(key);
    onChange({
      ...filters,
      containerSubTypes: has
        ? filters.containerSubTypes.filter((c) => c !== key)
        : [...filters.containerSubTypes, key],
    });
  }

  function togglePackSize(size: number) {
    const has = filters.packSizes.includes(size);
    onChange({
      ...filters,
      packSizes: has
        ? filters.packSizes.filter((s) => s !== size)
        : [...filters.packSizes, size],
    });
  }

  function resetAll() {
    onChange({
      containerSubTypes: [],
      packSizes: [],
      onSaleOnly: false,
      abvRange: [0, 15],
      selectedNames: [],
    });
  }

  const hasActiveFilters =
    filters.containerSubTypes.length > 0 ||
    filters.packSizes.length > 0 ||
    filters.onSaleOnly ||
    filters.abvRange[0] !== 0 ||
    filters.abvRange[1] !== 15 ||
    filters.selectedNames.length > 0;

  return (
    <div className="bg-white rounded-lg border border-zinc-200 p-4 space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-zinc-700">
          Filters
          {hasActiveFilters && (
            <span className="ml-2 inline-flex items-center justify-center w-4 h-4 text-xs bg-amber-500 text-white rounded-full">
              !
            </span>
          )}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-400">{resultCount.toLocaleString()} results</span>
          {hasActiveFilters && (
            <button
              onClick={resetAll}
              className="text-xs text-amber-600 hover:underline"
            >
              Reset all
            </button>
          )}
        </div>
      </div>

      {/* Container type */}
      <div>
        <p className="text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">
          Container Type
        </p>
        <div className="flex flex-wrap gap-2">
          {CONTAINER_OPTIONS.map(({ key, label }) => {
            const active = filters.containerSubTypes.includes(key);
            return (
              <button
                key={key}
                onClick={() => toggleContainer(key)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  active
                    ? "bg-amber-500 border-amber-500 text-white"
                    : "border-zinc-300 text-zinc-600 hover:border-amber-400 hover:text-amber-700"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pack size */}
      <div>
        <p className="text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">
          Pack Size
        </p>
        <div className="flex flex-wrap gap-2">
          {[...NAMED_PACK_SIZES, -1].map((size) => {
            const active = filters.packSizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => togglePackSize(size)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  active
                    ? "bg-amber-500 border-amber-500 text-white"
                    : "border-zinc-300 text-zinc-600 hover:border-amber-400 hover:text-amber-700"
                }`}
              >
                {size === -1 ? "Other" : `×${size}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* ABV slider */}
      <AbvSlider
        value={filters.abvRange}
        onChange={(v) => onChange({ ...filters, abvRange: v })}
      />

      {/* On sale */}
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <div
          className={`relative w-9 h-5 rounded-full transition-colors ${
            filters.onSaleOnly ? "bg-amber-500" : "bg-zinc-300"
          }`}
          onClick={() => onChange({ ...filters, onSaleOnly: !filters.onSaleOnly })}
        >
          <div
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              filters.onSaleOnly ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </div>
        <span className="text-sm text-zinc-700">On sale only</span>
      </label>

      {/* Beer name search */}
      <div>
        <p className="text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">
          Beer Name
        </p>
        <BeerCombobox
          allNames={allBeerNames}
          selected={filters.selectedNames}
          onChange={(names) => onChange({ ...filters, selectedNames: names })}
          placeholder="Search beer names..."
          multi={true}
        />
      </div>
    </div>
  );
}
