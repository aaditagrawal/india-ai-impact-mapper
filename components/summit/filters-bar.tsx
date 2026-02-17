"use client"

import { memo, useState, useRef, useCallback, useEffect } from "react"
import { MagnifyingGlass, X, EyeSlash, Eye } from "@phosphor-icons/react"
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
import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"
import { DateTabs } from "./date-tabs"
import type { FilterState, Session } from "@/lib/types"

interface FiltersBarProps {
  filters: FilterState
  sessions: Session[]
  onUpdate: (updates: Partial<FilterState>) => void
  onClear: () => void
  hasActiveFilters: boolean
}

export const FiltersBar = memo(function FiltersBar({
  filters,
  sessions,
  onUpdate,
  onClear,
  hasActiveFilters,
}: FiltersBarProps) {
  const [localQuery, setLocalQuery] = useState(filters.query)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)
  // Track the last query value we sent to parent so we can distinguish
  // external changes (e.g. "Clear all") from our own debounced updates
  const lastSentRef = useRef(filters.query)

  // Sync from parent only when query changes externally
  if (filters.query !== lastSentRef.current) {
    lastSentRef.current = filters.query
    if (localQuery !== filters.query) {
      setLocalQuery(filters.query)
    }
  }

  // Cleanup debounce on unmount
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

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 sm:px-6">
      <InputGroup className="w-full sm:w-56">
        <InputGroupAddon>
          <MagnifyingGlass className="size-4" />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search sessions..."
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
        {/* Mobile date dropdown — hidden on sm+ where tab buttons show */}
        <div className="sm:hidden">
          <DateTabs
            sessions={sessions}
            activeDate={filters.date}
            onDateChange={(date) => onUpdate({ date })}
          />
        </div>

        <Select
          value={filters.venue || "all"}
          onValueChange={(v) => onUpdate({ venue: v === "all" ? "" : v })}
        >
          <SelectTrigger size="sm">
            <SelectValue placeholder="Venue" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Venues</SelectItem>
            <SelectItem value="Bharat Mandapam">Bharat Mandapam</SelectItem>
            <SelectItem value="Bharat Mandapam - Expo Area">Expo Area</SelectItem>
            <SelectItem value="Sushma Swaraj Bhawan">Sushma Swaraj Bhawan</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.timeSlot || "all"}
          onValueChange={(v) => onUpdate({ timeSlot: v === "all" ? "" : v })}
        >
          <SelectTrigger size="sm">
            <SelectValue placeholder="Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Times</SelectItem>
            <SelectItem value="morning">Morning</SelectItem>
            <SelectItem value="afternoon">Afternoon</SelectItem>
            <SelectItem value="evening">Evening</SelectItem>
          </SelectContent>
        </Select>

        <Toggle
          variant="outline"
          size="sm"
          pressed={!filters.showPast}
          onPressedChange={(pressed) => onUpdate({ showPast: !pressed })}
          aria-label="Hide past events"
        >
          {filters.showPast ? (
            <Eye className="size-3.5" />
          ) : (
            <EyeSlash className="size-3.5" />
          )}
          <span className="hidden sm:inline">Past</span>
        </Toggle>

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
