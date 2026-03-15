"use client";

import { useState, useMemo } from "react";
import { useBeerData } from "@/lib/useBeerData";
import { FilterState } from "@/lib/types";
import { getContainerSubType, isOtherPackSize } from "@/lib/beerUtils";
import FilterPanel from "./FilterPanel";
import BeerTable from "./BeerTable";

const DEFAULT_FILTERS: FilterState = {
  containerSubTypes: [],
  packSizes: [],
  onSaleOnly: false,
  abvRange: [0, 15],
  selectedNames: [],
};

export default function AllBeersClient() {
  const { data, loading, error } = useBeerData();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(true);

  const allBeerNames = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.beers.map((b) => b.beer_name))].sort();
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.beers.filter((beer) => {
      // Container type
      if (filters.containerSubTypes.length > 0) {
        if (!filters.containerSubTypes.includes(getContainerSubType(beer))) return false;
      }
      // Pack size
      if (filters.packSizes.length > 0) {
        const isOther = isOtherPackSize(beer.quantity);
        const matchesOther = filters.packSizes.includes(-1) && isOther;
        const matchesNamed = filters.packSizes.includes(beer.quantity);
        if (!matchesOther && !matchesNamed) return false;
      }
      // On sale
      if (filters.onSaleOnly && beer.original_price == null) return false;
      // ABV range
      if (beer.abv < filters.abvRange[0] || beer.abv > filters.abvRange[1]) return false;
      // Beer names
      if (filters.selectedNames.length > 0 && !filters.selectedNames.includes(beer.beer_name)) {
        return false;
      }
      return true;
    });
  }, [data, filters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-zinc-400">
        <div className="text-center space-y-2">
          <div className="text-3xl animate-bounce">🍺</div>
          <p className="text-sm">Loading beer data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
        Failed to load beer data: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile filter toggle */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">All Beers</h1>
        <button
          className="sm:hidden px-3 py-1.5 rounded-md border border-zinc-300 text-sm text-zinc-700 hover:bg-zinc-100"
          onClick={() => setShowFilters((v) => !v)}
        >
          {showFilters ? "Hide filters" : "Show filters"}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Filter panel */}
        <div className={`sm:block sm:w-64 flex-shrink-0 ${showFilters ? "block" : "hidden"}`}>
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            allBeerNames={allBeerNames}
            resultCount={filtered.length}
          />
        </div>

        {/* Table */}
        <div className="flex-1 min-w-0">
          <BeerTable data={filtered} />
        </div>
      </div>
    </div>
  );
}
