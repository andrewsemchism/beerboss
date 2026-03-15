export interface Beer {
  id: number;
  beer_name: string;
  quantity: number;
  case_type: "Can" | "Bottle" | "Keg";
  size_ml: number;
  price: number;
  original_price: number | null;
  abv: number;
  country: string;
  category: string;
  beer_type: string;
  url: string;
  dollars_per_serving_of_alcohol: number | null;
}

export interface BeersData {
  scraped_at: string;
  count: number;
  beers: Beer[];
}

export type ContainerSubType =
  | "can-regular"
  | "can-tallboy"
  | "bottle-regular"
  | "bottle-large"
  | "keg-small"
  | "keg-large";

export interface FilterState {
  containerSubTypes: ContainerSubType[];
  packSizes: number[]; // empty = show all; -1 = "Other"
  onSaleOnly: boolean;
  abvRange: [number, number];
  selectedNames: string[]; // empty = show all
}

export type SortField =
  | "beer_name"
  | "price"
  | "dollars_per_serving_of_alcohol"
  | "quantity"
  | "abv"
  | "size_ml";

export type SortDirection = "asc" | "desc";
