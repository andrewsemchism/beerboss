import Link from "next/link";

const CARDS = [
  {
    icon: "🔍",
    title: "Browse All Beers",
    description:
      "Filter by container type, pack size, ABV range, or search by name. Sort by any column to find what you're looking for.",
    href: "/all",
    cta: "Browse all beers →",
  },
  {
    icon: "💰",
    title: "Best Value Analyzer",
    description:
      "Pick a beer and see all pack and size options color-coded by dollars per drink of pure alcohol.",
    href: "/value",
    cta: "Find best value →",
  },
  {
    icon: "ℹ️",
    title: "How It Works",
    description:
      "Prices scraped daily from The Beer Store. Value calculated as cost per standard serving of alcohol (17.75mL pure alcohol).",
    href: "/about",
    cta: "Learn more →",
  },
];

export default function HowToCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {CARDS.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="group rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md no-underline"
        >
          <div className="text-3xl">{card.icon}</div>
          <h3 className="mt-3 text-lg font-semibold text-zinc-900">{card.title}</h3>
          <p className="mt-1 text-sm text-zinc-600">{card.description}</p>
          <p className="mt-4 text-sm font-medium text-amber-600 group-hover:underline">
            {card.cta}
          </p>
        </Link>
      ))}
    </div>
  );
}
