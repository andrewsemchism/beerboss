import httpx
import json
from datetime import datetime, timezone


ALGOLIA_HEADERS = {
    "x-algolia-api-key": "15059df4edbf16c0ee2a3e505014a096",
    "x-algolia-application-id": "QAHT1LY72O",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"
}

SEARCH_URL = (
    "https://qaht1ly72o-dsn.algolia.net/1/indexes/*/queries"
    "?x-algolia-agent=Algolia%20for%20JavaScript%20(4.25.2)%3B%20Browser%3B%20instantsearch.js"
    "%20(4.79.2)%3B%20react%20(18.3.0-canary-60a927d04-20240113)%3B%20react-instantsearch"
    "%20(7.16.2)%3B%20react-instantsearch-core%20(7.16.2)%3B%20next.js%20(14.1.1)%3B%20JS%20Helper%20(3.26.0)"
)

BASE_PARAMS = (
    "hitsPerPage=1000"
    "&filters=storeId%3A3543"
    "&analytics=true"
    "&restrictSearchableAttributes=%5B%22searchableTags%22%2C%22displayName%22%2C%22label%22"
    "%2C%22brewer%22%2C%22country%22%2C%22beerCategory%22%2C%22beerType%22%2C%22beerStyle%22"
    "%2C%22attributes%22%2C%22abv%22%2C%22format%22%5D"
)


def build_request(page: int) -> dict:
    return {
        "requests": [
            {
                "indexName": "Ecomm_Listing_Prod_sale",
                "query": "",
                "params": BASE_PARAMS + f"&page={page}",
            }
        ]
    }


def calculate_dollars_per_serving_of_alcohol(price: float, size_ml: int, quantity: int, abv: float) -> float:
    """Dollars per serving of alcohol (1 serving = 17.75 mL of pure alcohol)."""
    if abv == 0:
        return None
    return round(price / ((size_ml * quantity * (abv / 100)) / 17.75), 4)


def scrape_all_beers() -> list[dict]:
    beers = []
    page = 0
    beer_id = 1

    while True:
        response = httpx.post(SEARCH_URL, headers=ALGOLIA_HEADERS, json=build_request(page))
        response.raise_for_status()
        hits = response.json()["results"][0]["hits"]

        if not hits:
            break

        for beer in hits:
            # Container type
            case_type = beer["format"].capitalize().rstrip("s")

            # Quantity and size
            label_parts = beer["label"].split(" ")
            quantity = int(label_parts[0])
            size_ml = int(float(label_parts[3]) * 1000) if case_type == "Keg" else int(label_parts[3])

            # Pricing
            price = float(beer["salePrice"])
            raw_original = float(beer["price"])
            original_price = round(raw_original, 2) if raw_original != price else None

            # Beer details
            abv = float(beer["abv"])
            country = beer["country"]
            category = beer["beerCategory"][0]
            beer_type = beer["beerType"][0]
            beer_name = beer["displayName"].title()

            # URL
            label_slug = "".join("-" if c == " " else c for c in beer["label"])
            url = f"https://www.thebeerstore.ca/beers/{beer['pageSlug']}_{label_slug}"

            dollars_per_serving_of_alcohol = calculate_dollars_per_serving_of_alcohol(price, size_ml, quantity, abv)

            beers.append({
                "id": beer_id,
                "beer_name": beer_name,
                "quantity": quantity,
                "case_type": case_type,
                "size_ml": size_ml,
                "price": round(price, 2),
                "original_price": original_price,
                "abv": abv,
                "country": country,
                "category": category,
                "beer_type": beer_type,
                "url": url,
                "dollars_per_serving_of_alcohol": dollars_per_serving_of_alcohol,
            })
            beer_id += 1

        page += 1

    return beers


def main():
    print("Scraping beers...")
    beers = scrape_all_beers()
    print(f"Found {len(beers)} listings.")

    output = {
        "scraped_at": datetime.now(timezone.utc).isoformat(),
        "count": len(beers),
        "beers": beers,
    }

    filename = "beers.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"Saved to {filename}")


if __name__ == "__main__":
    main()
