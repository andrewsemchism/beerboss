import type { Metadata } from "next";
import AllBeersClient from "@/components/all/AllBeersClient";

export const metadata: Metadata = {
  title: "Browse All Beers",
  description:
    "Browse and filter all beers available at The Beer Store in Ontario. Sort by price, ABV, container type, and more.",
};

export default function AllBeersPage() {
  return <AllBeersClient />;
}
