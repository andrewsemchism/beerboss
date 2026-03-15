"use client";

import { useMemo, useState } from "react";
import { useBeerData } from "@/lib/useBeerData";
import { getValueColor, formatDollarsPerDrink, formatPrice, formatSize } from "@/lib/beerUtils";
import BeerCombobox from "@/components/all/BeerCombobox";

const VALUE_COLOR_STYLES: Record<string, string> = {
  green: "bg-green-50 text-green-800",
  yellow: "bg-yellow-50 text-yellow-800",
  red: "bg-red-50 text-red-800",
};

const VALUE_COLOR_LABELS: Record<string, string> = {
  green: "Best value (within 10%)",
  yellow: "Moderate (10–20% above best)",
  red: "Poor value (>20% above best)",
};

export default function ValueClient() {
  const { data, loading, error } = useBeerData();
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const allBeerNames = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.beers.map((b) => b.beer_name))].sort();
  }, [data]);

  const variants = useMemo(() => {
    if (!data || !selectedName) return [];
    return data.beers.filter((b) => b.beer_name === selectedName);
  }, [data, selectedName]);

  const bestDpd = useMemo(() => {
    const dpds = variants
      .map((b) => b.dollars_per_serving_of_alcohol)
      .filter((v): v is number => v != null && v > 0);
    return dpds.length > 0 ? Math.min(...dpds) : null;
  }, [variants]);

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
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Best Value Analyzer</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Select a beer to compare all pack sizes by cost per drink of pure alcohol.
        </p>
      </div>

      {/* Beer selector */}
      <div className="max-w-md">
        <BeerCombobox
          allNames={allBeerNames}
          selected={selectedName ? [selectedName] : []}
          onChange={(names) => setSelectedName(names[0] ?? null)}
          placeholder="Search and select a beer..."
          multi={false}
        />
      </div>

      {/* Color legend */}
      {selectedName && variants.length > 0 && (
        <div className="flex flex-wrap gap-3 text-xs">
          {Object.entries(VALUE_COLOR_LABELS).map(([color, label]) => (
            <span
              key={color}
              className={`px-2.5 py-1 rounded-full font-medium ${VALUE_COLOR_STYLES[color]}`}
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Variants table */}
      {selectedName && variants.length > 0 && bestDpd != null && (
        <div className="overflow-x-auto rounded-lg border border-zinc-200">
          <table className="w-full text-sm min-w-[500px]">
            <thead className="bg-zinc-100 border-b border-zinc-200">
              <tr>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-zinc-600">Pack</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-zinc-600">Type</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-zinc-600">Price</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-zinc-600">$/Drink</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-zinc-600">ABV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {variants
                .slice()
                .sort(
                  (a, b) =>
                    (a.dollars_per_serving_of_alcohol ?? Infinity) -
                    (b.dollars_per_serving_of_alcohol ?? Infinity)
                )
                .map((beer) => {
                  const dpd = beer.dollars_per_serving_of_alcohol;
                  const color = getValueColor(dpd, bestDpd);
                  return (
                    <tr key={beer.id} className={VALUE_COLOR_STYLES[color]}>
                      <td className="px-3 py-2.5 font-medium">
                        {beer.quantity} × {formatSize(beer)}
                      </td>
                      <td className="px-3 py-2.5">{beer.case_type}</td>
                      <td className="px-3 py-2.5">
                        {beer.original_price != null ? (
                          <span>
                            <span className="font-medium">{formatPrice(beer.price)}</span>
                            <span className="ml-1 text-xs opacity-60 line-through">
                              {formatPrice(beer.original_price)}
                            </span>
                          </span>
                        ) : (
                          formatPrice(beer.price)
                        )}
                      </td>
                      <td className="px-3 py-2.5 font-semibold">
                        {formatDollarsPerDrink(dpd)}
                      </td>
                      <td className="px-3 py-2.5">{beer.abv}%</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {selectedName && variants.length === 0 && (
        <p className="text-sm text-zinc-400">No variants found for {selectedName}.</p>
      )}

      {!selectedName && (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center text-zinc-400">
          <p className="text-4xl mb-3">🍺</p>
          <p className="text-sm">Search for a beer above to compare its pack sizes.</p>
        </div>
      )}
    </div>
  );
}
