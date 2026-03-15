import type { Metadata } from "next";
import ValueClient from "@/components/value/ValueClient";

export const metadata: Metadata = {
  title: "Best Value Analyzer",
  description:
    "Find the best value option for any beer at The Beer Store in Ontario. Compare cost per drink across pack sizes and container types.",
};

export default function ValuePage() {
  return <ValueClient />;
}
