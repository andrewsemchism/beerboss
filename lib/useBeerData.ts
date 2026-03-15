"use client";

import { useState, useEffect } from "react";
import { BeersData } from "./types";

interface UseBeerDataResult {
  data: BeersData | null;
  loading: boolean;
  error: string | null;
}

export function useBeerData(): UseBeerDataResult {
  const [data, setData] = useState<BeersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/beers.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load beer data (${res.status})`);
        return res.json() as Promise<BeersData>;
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
