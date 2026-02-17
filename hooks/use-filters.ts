"use client"

import { useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { FilterState, VenueZone } from "@/lib/types"
import { DEFAULT_FILTERS } from "@/lib/filters"

export function useFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const filters: FilterState = useMemo(() => ({
    query: searchParams.get("q") ?? DEFAULT_FILTERS.query,
    date: searchParams.get("date") ?? DEFAULT_FILTERS.date,
    venue: searchParams.get("venue") ?? DEFAULT_FILTERS.venue,
    zone: (searchParams.get("zone") as VenueZone | "") ?? DEFAULT_FILTERS.zone,
    tag: searchParams.get("tag") ?? DEFAULT_FILTERS.tag,
    timeSlot: searchParams.get("time") ?? DEFAULT_FILTERS.timeSlot,
    showPast: searchParams.get("past") !== "0",
  }), [searchParams])

  const updateFilters = useCallback(
    (updates: Partial<FilterState>) => {
      const params = new URLSearchParams(searchParams.toString())

      const merged = { ...filters, ...updates }

      const setOrDelete = (key: string, value: string) => {
        if (value) params.set(key, value)
        else params.delete(key)
      }

      setOrDelete("q", merged.query)
      setOrDelete("date", merged.date)
      setOrDelete("venue", merged.venue)
      setOrDelete("zone", merged.zone)
      setOrDelete("tag", merged.tag)
      setOrDelete("time", merged.timeSlot)

      if (!merged.showPast) params.set("past", "0")
      else params.delete("past")

      router.replace(`?${params.toString()}`, { scroll: false })
    },
    [searchParams, filters, router]
  )

  const clearFilters = useCallback(() => {
    router.replace("?", { scroll: false })
  }, [router])

  return { filters, updateFilters, clearFilters }
}
