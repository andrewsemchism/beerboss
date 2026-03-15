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

        {/* How Beer Boss works */}
        <div>
          <h2 className="text-xl font-semibold text-zinc-800 mb-4">How Beer Boss works</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { step: "1", title: "Daily updates", body: "Beer Boss automatically pulls every product listing from the official The Beer Store website each morning." },
              { step: "2", title: "Calculate value", body: "Each listing is scored by cost per standard serving of alcohol ($/Drink) — a fair comparison across any beer, size, or pack." },
              { step: "3", title: "Find the best price", body: "Filter, sort, and browse to find the cheapest option for whatever you're drinking." },
            ].map(({ step, title, body }) => (
              <div key={step} className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="text-5xl font-bold text-amber-500 mb-2">{step}</div>
                <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
                <p className="mt-1 text-sm text-zinc-600">{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What can you do here */}
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
