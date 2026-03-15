import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how Beer Boss calculates cost per drink and how beer prices are sourced from The Beer Store in Ontario.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">About Beer Boss</h1>
        <p className="mt-2 text-zinc-600">
          Beer Boss is a free tool for comparing beer prices at The Beer Store in Ontario.
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

        <FaqItem question="How often is the data updated?">
          <p>Daily.</p>
        </FaqItem>

        <FaqItem question="Why are some beers missing a $/Drink value?">
          <p>
            Non-alcoholic beers (0% ABV) do not have a $/drink value since there is
            no alcohol content to calculate against. These will show &ldquo;N/A&rdquo;.
          </p>
        </FaqItem>


        <FaqItem question="Does this include bottle deposit?">
          <p>
            No — prices shown are the shelf prices from The Beer Store&apos;s website and do not
            include taxes or bottle deposit fees. As long as you&apos;re returning your bottles and
            cans, and kegs, the deposit doesn&apos;t change the relative value between options.
          </p>
        </FaqItem>

        <FaqItem question="Something is wrong / I have feedback / I have a suggestion">
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

      <p className="text-sm text-zinc-500">
        Made by{" "}
        <a
          href="https://semchism.me"
          className="underline hover:text-zinc-800"
          target="_blank"
          rel="noopener noreferrer"
        >
          Andrew Semchism
        </a>
      </p>
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
