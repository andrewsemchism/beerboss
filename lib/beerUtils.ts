import { Beer, ContainerSubType } from "./types";

export function getContainerSubType(beer: Beer): ContainerSubType {
  const { case_type, size_ml } = beer;
  if (case_type === "Can") {
    return size_ml <= 355 ? "can-regular" : "can-tallboy";
  }
  if (case_type === "Bottle") {
    return size_ml < 400 ? "bottle-regular" : "bottle-large";
  }
  // Keg: size_ml is in milliliters (30L = 30000ml)
  return size_ml < 30000 ? "keg-small" : "keg-large";
}

export const NAMED_PACK_SIZES = [1, 6, 12, 15, 18, 20, 24, 28, 30, 48];

export function isOtherPackSize(quantity: number): boolean {
  return !NAMED_PACK_SIZES.includes(quantity);
}

export function formatDollarsPerDrink(value: number | null | undefined): string {
  if (value == null) return "N/A";
  return `$${value.toFixed(2)}`;
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function formatSize(beer: Beer): string {
  if (beer.case_type === "Keg") {
    return `${(beer.size_ml / 1000).toFixed(0)}L`;
  }
  return `${beer.size_ml}ml`;
}

export interface BeerStats {
  totalCount: number;
  uniqueBeerCount: number;
  cheapestDollarsPerDrink: number | null;
  averageDollarsPerDrink: number | null;
  onSaleCount: number;
}

export function computeBeerStats(beers: Beer[]): BeerStats {
  const dpd = beers
    .filter((b) => b.abv >= 1)
    .map((b) => b.dollars_per_serving_of_alcohol)
    .filter((v): v is number => v != null && v > 0);

  const cheapest = dpd.length > 0 ? Math.min(...dpd) : null;
  const average =
    dpd.length > 0 ? dpd.reduce((a, b) => a + b, 0) / dpd.length : null;

  return {
    totalCount: beers.length,
    uniqueBeerCount: new Set(beers.map((b) => b.beer_name)).size,
    cheapestDollarsPerDrink: cheapest,
    averageDollarsPerDrink: average,
    onSaleCount: beers.filter((b) => b.original_price != null).length,
  };
}

