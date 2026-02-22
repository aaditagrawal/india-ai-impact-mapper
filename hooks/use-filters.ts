"use client"

import { useState, useCallback, useEffect } from "react"
import type { FilterState, VenueZone } from "@/lib/types"
import { DEFAULT_FILTERS } from "@/lib/filters"

function parseFiltersFromURL(): FilterState {
  const params = new URLSearchParams(window.location.search)
  return {
    query: params.get("q") ?? DEFAULT_FILTERS.query,
    date: params.get("date") ?? DEFAULT_FILTERS.date,
    venue: params.get("venue") ?? DEFAULT_FILTERS.venue,
    zone: (params.get("zone") as VenueZone | "") ?? DEFAULT_FILTERS.zone,
    tag: params.get("tag") ?? DEFAULT_FILTERS.tag,
    timeSlot: params.get("time") ?? DEFAULT_FILTERS.timeSlot,
    showPast: params.get("past") !== "0",
  }
}

function filtersToSearchString(filters: FilterState): string {
  const params = new URLSearchParams()
  if (filters.query) params.set("q", filters.query)
  if (filters.date) params.set("date", filters.date)
  if (filters.venue) params.set("venue", filters.venue)
  if (filters.zone) params.set("zone", filters.zone)
  if (filters.tag) params.set("tag", filters.tag)
  if (filters.timeSlot) params.set("time", filters.timeSlot)
  if (filters.showPast) params.set("past", "1")
  const str = params.toString()
  return str ? `?${str}` : ""
}

export function useFilters() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  // Read URL params on mount (SSR-safe: only runs on client)
  useEffect(() => {
    setFilters(parseFiltersFromURL())
  }, [])

  // Sync filters → URL silently (no Next.js navigation, no re-render)
  useEffect(() => {
    const search = filtersToSearchString(filters)
    const url = search || window.location.pathname
    window.history.replaceState(null, "", url)
  }, [filters])

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => setFilters(parseFiltersFromURL())
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const updateFilters = useCallback(
    (updates: Partial<FilterState>) => {
      setFilters((prev) => ({ ...prev, ...updates }))
    },
    []
  )

  const clearFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS })
  }, [])

  return { filters, updateFilters, clearFilters }
}
