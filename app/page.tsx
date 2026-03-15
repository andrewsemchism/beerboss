"use client";

import { useBeerData } from "@/lib/useBeerData";
import { computeBeerStats } from "@/lib/beerUtils";
import Banner from "@/components/home/Banner";
import HomeStats from "@/components/home/HomeStats";
import HowToCards from "@/components/home/HowToCards";

export default function HomePage() {
  const { data, loading, error } = useBeerData();

  return (
    <>
      <Banner />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
        {/* Stats */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 rounded-full border-2 border-zinc-200 border-t-zinc-500 animate-spin" />
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

    </>
  );
}
