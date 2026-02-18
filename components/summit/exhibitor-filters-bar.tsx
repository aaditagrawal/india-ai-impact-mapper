"use client"

import { memo, useState, useRef, useCallback, useEffect, useMemo } from "react"
import { MagnifyingGlass, X } from "@phosphor-icons/react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { Exhibitor, ExhibitorFilterState } from "@/lib/types"

interface ExhibitorFiltersBarProps {
  filters: ExhibitorFilterState
  exhibitors: Exhibitor[]
  onUpdate: (updates: Partial<ExhibitorFilterState>) => void
  onClear: () => void
  hasActiveFilters: boolean
}

export const ExhibitorFiltersBar = memo(function ExhibitorFiltersBar({
  filters,
  exhibitors,
  onUpdate,
  onClear,
  hasActiveFilters,
}: ExhibitorFiltersBarProps) {
  const [localQuery, setLocalQuery] = useState(filters.query)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)
  const lastSentRef = useRef(filters.query)

  if (filters.query !== lastSentRef.current) {
    lastSentRef.current = filters.query
    if (localQuery !== filters.query) {
      setLocalQuery(filters.query)
    }
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const handleQueryChange = useCallback(
    (value: string) => {
      setLocalQuery(value)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null
        lastSentRef.current = value
        onUpdate({ query: value })
      }, 300)
    },
    [onUpdate]
  )

  const handleQueryClear = useCallback(() => {
    setLocalQuery("")
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
      debounceRef.current = null
    }
    lastSentRef.current = ""
    onUpdate({ query: "" })
  }, [onUpdate])

  const uniqueTags = useMemo(() => {
    const tags = new Set(exhibitors.map((e) => e.tag))
    return Array.from(tags).sort()
  }, [exhibitors])

  const uniqueHalls = useMemo(() => {
    const halls = new Set<string>()
    for (const e of exhibitors) {
      halls.add(e.hall_number && e.hall_number !== "NA" ? e.hall_number : "Unassigned")
    }
    return Array.from(halls).sort((a, b) => {
      if (a === "Unassigned") return 1
      if (b === "Unassigned") return -1
      return parseInt(a) - parseInt(b)
    })
  }, [exhibitors])

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 sm:px-6">
      <InputGroup className="w-full sm:w-56">
        <InputGroupAddon>
          <MagnifyingGlass className="size-4" />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search exhibitors..."
          value={localQuery}
          onChange={(e) => handleQueryChange(e.target.value)}
        />
        {localQuery && (
          <InputGroupAddon align="inline-end">
            <button
              onClick={handleQueryClear}
              className="text-muted-foreground transition-subtle hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          </InputGroupAddon>
        )}
      </InputGroup>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={filters.tag || "all"}
          onValueChange={(v) => onUpdate({ tag: v === "all" ? "" : v })}
        >
          <SelectTrigger size="sm">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {uniqueTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.hall || "all"}
          onValueChange={(v) => onUpdate({ hall: v === "all" ? "" : v })}
        >
          <SelectTrigger size="sm">
            <SelectValue placeholder="Hall" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Halls</SelectItem>
            {uniqueHalls.map((hall) => (
              <SelectItem key={hall} value={hall}>
                {hall === "Unassigned" ? "Unassigned" : `Hall ${hall}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="xs" onClick={onClear}>
            <X className="size-3" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
})
