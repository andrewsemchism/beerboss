"use client";

import { useBeerData } from "@/lib/useBeerData";
import { computeBeerStats } from "@/lib/beerUtils";
import HomeStats from "@/components/home/HomeStats";
import HowToCards from "@/components/home/HowToCards";

export default function HomePage() {
  const { data, loading, error } = useBeerData();

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="text-center py-10 sm:py-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 tracking-tight">
          🍺 BeerBoss
        </h1>
        <p className="mt-4 text-lg text-zinc-600 max-w-2xl mx-auto">
          Compare beer prices at The Beer Store in Ontario.
          Find the best value by cost per drink of pure alcohol.
        </p>
      </div>

      {/* Stats */}
      {loading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-zinc-200 bg-white p-4 text-center shadow-sm animate-pulse"
            >
              <div className="h-8 bg-zinc-200 rounded mx-auto w-20 mb-2" />
              <div className="h-3 bg-zinc-100 rounded mx-auto w-16" />
            </div>
          ))}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
          Failed to load beer data: {error}
        </div>
      )}
      {data && (
        <HomeStats
          stats={computeBeerStats(data.beers)}
          scrapedAt={data.scraped_at}
        />
      )}

      {/* How to use */}
      <div>
        <h2 className="text-xl font-semibold text-zinc-800 mb-4">
          What can you do here?
        </h2>
        <HowToCards />
      </div>
    </div>
  );
}
