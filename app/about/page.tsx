export default function AboutPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">About BeerBoss</h1>
        <p className="mt-2 text-zinc-600">
          BeerBoss is a free tool for comparing beer prices at The Beer Store in Ontario.
          It is not affiliated with or endorsed by The Beer Store.
        </p>
      </div>

      <div className="space-y-3">
        <FaqItem question="What does &quot;$/Drink&quot; mean?">
          <p>
            &ldquo;Dollars per drink&rdquo; is the cost per standard serving of pure alcohol.
            One standard serving is defined as 17.75mL of pure alcohol (equivalent to a 5% ABV, 355mL beer).
          </p>
          <p className="mt-2">
            This metric lets you compare the actual value of beers across different pack sizes, container
            types, and alcohol strengths on a level playing field.
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            Formula: <code className="bg-zinc-100 px-1 py-0.5 rounded text-xs">price ÷ ((size_ml × quantity × (abv / 100)) / 17.75)</code>
          </p>
        </FaqItem>

        <FaqItem question="Where does the data come from?">
          <p>
            Prices are scraped daily from{" "}
            <a
              href="https://www.thebeerstore.ca"
              className="text-amber-700 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              thebeerstore.ca
            </a>{" "}
            via their public Algolia search API, filtered to Ontario (store ID 3543).
          </p>
        </FaqItem>

        <FaqItem question="How often is the data updated?">
          <p>
            A GitHub Action runs the scraper every morning and commits updated data
            to the repository. Cloudflare Pages automatically deploys the update.
            You can see when the data was last updated on the{" "}
            <a href="/" className="text-amber-700 underline">home page</a>.
          </p>
        </FaqItem>

        <FaqItem question="Why are some beers missing a $/Drink value?">
          <p>
            Non-alcoholic beers (0% ABV) do not have a $/drink value since there is
            no alcohol content to calculate against. These will show &ldquo;N/A&rdquo;.
          </p>
        </FaqItem>

        <FaqItem question="What do the colours mean on the Best Value page?">
          <div className="space-y-1.5 mt-1">
            <p className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-green-400" />
              <strong className="text-green-800">Green</strong> — within 10% of the best $/drink option
            </p>
            <p className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-400" />
              <strong className="text-yellow-800">Yellow</strong> — 10–20% above the best option
            </p>
            <p className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-red-400" />
              <strong className="text-red-800">Red</strong> — more than 20% above the best option
            </p>
          </div>
        </FaqItem>

        <FaqItem question="Does this include bottle deposit?">
          <p>
            No. Prices shown are the shelf prices from The Beer Store&apos;s website and do not
            include bottle deposit fees. Deposit amounts vary by container type and size.
          </p>
        </FaqItem>

        <FaqItem question="Something is wrong / I have feedback">
          <p>
            Please open an issue on{" "}
            <a
              href="https://github.com/andrewsemchism/beerboss/issues"
              className="text-amber-700 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            .
          </p>
        </FaqItem>
      </div>
    </div>
  );
}

function FaqItem({
  question,
  children,
}: {
  question: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group rounded-lg border border-zinc-200 bg-white">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-medium text-zinc-800 hover:bg-zinc-50 select-none">
        {question}
        <span className="ml-2 text-zinc-400 transition-transform group-open:rotate-180">
          ↓
        </span>
      </summary>
      <div className="px-4 pb-4 pt-2 text-sm text-zinc-600 border-t border-zinc-100">
        {children}
      </div>
    </details>
  );
}
