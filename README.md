# BeerBoss.ca

[Beerboss.ca](http://beerboss.ca/) is a tool to make buying beer from The Beer Store easier. Since alcohol
sales are regulated by the government in Ontario, there are very few options when buying beer. The official
Beer Store website does not give you the information needed to make educated choices when buying beer.

Beer Boss can help you find the cheapest beers in Ontario without the hassle of searching through hundreds
of beers on the Beer Store website manually. If you already have a particular beer in mind, Beer Boss can
easily determine the cheapest package size to buy.

## How does it work

A Python script scrapes every product on The Beer Store website and outputs it to a JSON file. A GitHub
Action runs the scraper daily and commits the updated data to the repository.

## Running locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Built With

- Next.js
- TypeScript
- Tailwind CSS
- Python (httpx)
