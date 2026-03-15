"use client";

import { useMemo, useState } from "react";
import { useBeerData } from "@/lib/useBeerData";
import { formatDollarsPerDrink, formatPrice, formatSize } from "@/lib/beerUtils";
import BeerCombobox from "@/components/all/BeerCombobox";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// Returns inline styles for a row based on how far above the best $/drink it is.
// Gradient: green (best) → yellow → red → dark red (worst)
function getValueStyle(dpd: number | null, bestDpd: number): React.CSSProperties {
  if (dpd == null) {
    return { backgroundColor: "hsl(0,70%,88%)", color: "hsl(0,70%,22%)" };
  }

  const ratio = dpd / bestDpd;
  const t = Math.min(Math.max(ratio - 1, 0) / 0.35, 1); // 0 = best, 1 = 35%+ above

  let hue: number;
  let sat: number;
  let bgL: number;
  let fgL: number;

  if (t < 0.5) {
    // green → yellow
    hue = lerp(120, 50, t * 2);
    sat = lerp(55, 80, t * 2);
    bgL = 92;
    fgL = 25;
  } else {
    // yellow → dark red
    hue = lerp(50, 0, (t - 0.5) * 2);
    sat = lerp(80, 75, (t - 0.5) * 2);
    bgL = lerp(92, 80, (t - 0.5) * 2);
    fgL = lerp(25, 20, (t - 0.5) * 2);
  }

  return {
    backgroundColor: `hsl(${Math.round(hue)},${Math.round(sat)}%,${Math.round(bgL)}%)`,
    color: `hsl(${Math.round(hue)},${Math.round(sat)}%,${Math.round(fgL)}%)`,
  };
}

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

  const sortedVariants = variants
    .slice()
    .sort(
      (a, b) =>
        (a.dollars_per_serving_of_alcohol ?? Infinity) -
        (b.dollars_per_serving_of_alcohol ?? Infinity)
    );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Best Value Analyzer</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Select a beer to find the cheapest way to buy it across all available package sizes.
        </p>
      </div>

      {/* Beer selector */}
      <div className="w-full">
        <BeerCombobox
          allNames={allBeerNames}
          selected={selectedName ? [selectedName] : []}
          onChange={(names) => setSelectedName(names[0] ?? null)}
          placeholder="Search and select a beer..."
          multi={false}
        />
      </div>

      {/* Gradient legend */}
      {selectedName && variants.length > 0 && (
        <div className="space-y-1">
          <div
            className="h-3 rounded-full w-full"
            style={{
              background:
                "linear-gradient(to right, hsl(120,55%,60%), hsl(85,68%,60%), hsl(50,80%,60%), hsl(25,78%,60%), hsl(0,75%,55%), hsl(0,75%,38%))",
            }}
          />
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Best value</span>
            <span>+35%+</span>
          </div>
        </div>
      )}

      {/* Variants table */}
      {selectedName && sortedVariants.length > 0 && bestDpd != null && (
        <div className="overflow-x-auto rounded-lg border border-zinc-200">
          <table className="w-full text-sm min-w-[500px]">
            <thead className="bg-zinc-100 border-b border-zinc-200">
              <tr>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-zinc-600">Pack</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-zinc-600">Type</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-zinc-600">Price</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-zinc-600">$/Drink</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-zinc-600">ABV</th>
                <th className="px-3 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {sortedVariants.map((beer, i) => {
                const dpd = beer.dollars_per_serving_of_alcohol;
                const style = getValueStyle(dpd, bestDpd);
                const pctAbove =
                  i > 0 && dpd != null
                    ? Math.round(((dpd - bestDpd) / bestDpd) * 100)
                    : null;

                return (
                  <tr key={beer.id} style={style}>
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
                      {pctAbove != null && pctAbove > 0 && (
                        <span className="ml-1.5 text-xs font-normal opacity-70">
                          +{pctAbove}%
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">{beer.abv}%</td>
                    <td className="px-3 py-2.5">
                      <a
                        href={beer.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs underline opacity-60 hover:opacity-100 whitespace-nowrap"
                      >
                        View
                      </a>
                    </td>
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
          <p className="text-sm">Search for a beer above to compare its pack sizes.</p>
        </div>
      )}
    </div>
  );
}
