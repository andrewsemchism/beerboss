import { BeerStats, formatDollarsPerDrink } from "@/lib/beerUtils";

interface Props {
  stats: BeerStats;
  scrapedAt: string;
}

export default function HomeStats({ stats, scrapedAt }: Props) {
  const updatedDate = new Date(scrapedAt).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Toronto",
  });

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Listings" value={stats.totalCount.toLocaleString()} />
        <StatCard
          label="Cheapest $/Drink"
          value={formatDollarsPerDrink(stats.cheapestDollarsPerDrink)}
        />
        <StatCard
          label="Avg $/Drink"
          value={
            stats.averageDollarsPerDrink != null
              ? formatDollarsPerDrink(Math.round(stats.averageDollarsPerDrink * 100) / 100)
              : "N/A"
          }
          tooltip="Excludes non-alcoholic beers (<1% ABV)"
        />
        <StatCard label="On Sale Now" value={stats.onSaleCount.toLocaleString()} />
      </div>
      <p className="mt-3 text-right text-xs text-zinc-400">
        Data last updated: {updatedDate}
      </p>
    </div>
  );
}

function StatCard({ label, value, tooltip }: { label: string; value: string; tooltip?: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 text-center shadow-sm">
      <p className="text-2xl font-bold text-zinc-900">{value}</p>
      <p className="mt-1 text-xs text-zinc-500 flex items-center justify-center gap-1">
        {label}
        {tooltip && (
          <span className="group relative inline-flex">
            <span className="w-3.5 h-3.5 rounded-full bg-zinc-300 text-zinc-600 text-[9px] font-bold flex items-center justify-center cursor-default leading-none">
              i
            </span>
            <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-44 rounded bg-zinc-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {tooltip}
            </span>
          </span>
        )}
      </p>
    </div>
  );
}
