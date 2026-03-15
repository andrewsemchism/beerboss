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
        />
        <StatCard label="On Sale Now" value={stats.onSaleCount.toLocaleString()} />
      </div>
      <p className="mt-3 text-right text-xs text-zinc-400">
        Data last updated: {updatedDate}
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 text-center shadow-sm">
      <p className="text-2xl font-bold text-zinc-900">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{label}</p>
    </div>
  );
}
