"use client"

import { useMemo, Suspense } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SummitHeader } from "./summit-header"
import { DateTabs } from "./date-tabs"
import { FiltersBar } from "./filters-bar"
import { ActiveFilters } from "./active-filters"
import { SessionList } from "./session-list"
import { VenueMap } from "./venue-map"
import { useFilters } from "@/hooks/use-filters"
import { useCurrentTime } from "@/hooks/use-current-time"
import { filterSessions, DEFAULT_FILTERS } from "@/lib/filters"
import { getSessionStatus } from "@/lib/time-utils"
import type { SummitData, VenueZone } from "@/lib/types"
import { useState } from "react"

interface SummitAppProps {
  data: SummitData
}

function SummitAppInner({ data }: SummitAppProps) {
  const { filters, updateFilters, clearFilters } = useFilters()
  const now = useCurrentTime()
  const [hoveredZone, setHoveredZone] = useState<VenueZone | null>(null)

  const filtered = useMemo(
    () => filterSessions(data.sessions, filters, now),
    [data.sessions, filters, now]
  )

  const hasLiveSessions = useMemo(
    () => data.sessions.some((s) => getSessionStatus(s, now) === "live"),
    [data.sessions, now]
  )

  const hasActiveFilters =
    filters.query !== DEFAULT_FILTERS.query ||
    filters.date !== DEFAULT_FILTERS.date ||
    filters.venue !== DEFAULT_FILTERS.venue ||
    filters.zone !== DEFAULT_FILTERS.zone ||
    filters.tag !== DEFAULT_FILTERS.tag ||
    filters.timeSlot !== DEFAULT_FILTERS.timeSlot ||
    filters.showPast !== DEFAULT_FILTERS.showPast

  const handleZoneClick = (zone: VenueZone) => {
    updateFilters({ zone: filters.zone === zone ? "" : zone })
  }

  return (
    <TooltipProvider>
      <div className="flex h-dvh flex-col">
        <SummitHeader
          totalSessions={data.totalSessions}
          filteredCount={filtered.length}
          hasLiveSessions={hasLiveSessions}
        />

        <div className="space-y-2 border-b py-2.5 sm:py-3">
          <div className="px-4 sm:px-6">
            <DateTabs
              sessions={data.sessions}
              activeDate={filters.date}
              onDateChange={(date) => updateFilters({ date })}
            />
          </div>
          <FiltersBar
            filters={filters}
            onUpdate={updateFilters}
            onClear={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
          <ActiveFilters filters={filters} onUpdate={updateFilters} />
        </div>

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          {/* Map panel — always visible, scrollable on mobile */}
          <div className="shrink-0 border-b lg:w-2/5 lg:border-r lg:border-b-0">
            <div className="overflow-y-auto p-4 sm:p-6">
              <VenueMap
                sessions={filtered}
                filters={filters}
                now={now}
                hoveredZone={hoveredZone}
                onZoneClick={handleZoneClick}
                onZoneHover={setHoveredZone}
              />
            </div>
          </div>

          {/* Session list panel */}
          <div className="min-h-0 flex-1">
            <SessionList
              sessions={filtered}
              now={now}
              hoveredZone={hoveredZone}
              onHoverSession={setHoveredZone}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export function SummitApp({ data }: SummitAppProps) {
  return (
    <Suspense>
      <SummitAppInner data={data} />
    </Suspense>
  )
}
