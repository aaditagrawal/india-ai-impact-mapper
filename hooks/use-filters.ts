"use client";

import { useState, useCallback, useEffect } from "react";
import type { FilterState } from "@/lib/types";
import { DEFAULT_FILTERS } from "@/lib/filters";
import { parseFiltersFromURL, filtersToSearchString } from "@/lib/filter-url";

export function useFilters() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [initialized, setInitialized] = useState(false);

  // Read URL params on mount (SSR-safe: only runs on client)
  useEffect(() => {
    setFilters(parseFiltersFromURL(window.location.search));
    setInitialized(true);
  }, []);

  // Sync filters → URL silently (no Next.js navigation, no re-render)
  useEffect(() => {
    if (!initialized) return;
    const search = filtersToSearchString(filters, window.location.search);
    const url = search || window.location.pathname;
    window.history.replaceState(null, "", url);
  }, [filters, initialized]);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => setFilters(parseFiltersFromURL(window.location.search));
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const updateFilters = useCallback((updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS });
  }, []);

  return { filters, updateFilters, clearFilters };
}
