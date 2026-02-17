"use client"

import { useMemo, useDeferredValue, useCallback, useState } from "react"
import { CaretDown, CaretUp, MapTrifold } from "@phosphor-icons/react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SummitHeader } from "./summit-header"
import { DateTabs } from "./date-tabs"
import { FiltersBar } from "./filters-bar"
import { ActiveFilters } from "./active-filters"
import { SessionList } from "./session-list"
import { VenueMap } from "./venue-map"
import { CommandSearch } from "./command-search"
import { SessionDetailDialog } from "./session-detail-dialog"
import { useFilters } from "@/hooks/use-filters"
import { useCurrentTime } from "@/hooks/use-current-time"
import { filterSessions, DEFAULT_FILTERS } from "@/lib/filters"
import { getSessionStatus } from "@/lib/time-utils"
import type { Session, SummitData, VenueZone } from "@/lib/types"

interface SummitAppProps {
  data: SummitData
}

function SummitAppInner({ data }: SummitAppProps) {
  const { filters, updateFilters, clearFilters } = useFilters()
  const now = useCurrentTime()
  // Separate hover sources so card→card highlighting doesn't happen
  const [mapHoveredZone, setMapHoveredZone] = useState<VenueZone | null>(null)
  const [cardHoveredZone, setCardHoveredZone] = useState<VenueZone | null>(null)
  const [commandOpen, setCommandOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [mapExpanded, setMapExpanded] = useState(false)

  // Defer the query so filtering doesn't block input
  const deferredQuery = useDeferredValue(filters.query)
  const deferredFilters = useMemo(
    () => ({ ...filters, query: deferredQuery }),
    [filters, deferredQuery]
  )

  const filtered = useMemo(
    () => filterSessions(data.sessions, deferredFilters, now),
    [data.sessions, deferredFilters, now]
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

  const handleZoneClick = useCallback(
    (zone: VenueZone) => {
      updateFilters({ zone: filters.zone === zone ? "" : zone })
    },
    [filters.zone, updateFilters]
  )

  // Cmd+K listener
  const handleCommandSelect = useCallback((session: Session) => {
    setSelectedSession(session)
    setDetailOpen(true)
  }, [])

  const selectedStatus = selectedSession
    ? getSessionStatus(selectedSession, now)
    : null

  return (
    <TooltipProvider>
      <div className="flex h-dvh flex-col">
        <SummitHeader
          totalSessions={data.totalSessions}
          filteredCount={filtered.length}
          hasLiveSessions={hasLiveSessions}
          onCommandOpen={() => setCommandOpen(true)}
        />

        <div className="space-y-2 border-b py-2.5 sm:py-3">
          {/* Desktop date tabs */}
          <div className="hidden px-4 sm:block sm:px-6">
            <DateTabs
              sessions={data.sessions}
              activeDate={filters.date}
              onDateChange={(date) => updateFilters({ date })}
            />
          </div>
          <FiltersBar
            filters={filters}
            sessions={data.sessions}
            onUpdate={updateFilters}
            onClear={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
          <ActiveFilters filters={filters} onUpdate={updateFilters} />
        </div>

        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          {/* Map panel — collapsible on mobile, always visible on desktop */}
          <div className="shrink-0 border-b lg:w-2/5 lg:border-r lg:border-b-0">
            {/* Mobile toggle */}
            <button
              onClick={() => setMapExpanded((v) => !v)}
              className="flex w-full items-center justify-between px-4 py-2 text-xs text-muted-foreground transition-colors hover:bg-accent/50 lg:hidden"
            >
              <span className="inline-flex items-center gap-1.5 font-medium">
                <MapTrifold className="size-3.5" />
                Venue Map
              </span>
              {mapExpanded ? <CaretUp className="size-3.5" /> : <CaretDown className="size-3.5" />}
            </button>
            {/* Map content — hidden on mobile unless expanded, always shown on lg+ */}
            <div className={`overflow-y-auto p-4 sm:p-6 ${mapExpanded ? "block" : "hidden"} lg:block`}>
              <VenueMap
                sessions={filtered}
                filters={filters}
                now={now}
                hoveredZone={mapHoveredZone ?? cardHoveredZone}
                onZoneClick={handleZoneClick}
                onZoneHover={setMapHoveredZone}
              />
            </div>
          </div>

          {/* Session list panel */}
          <div className="min-h-0 flex-1">
            <SessionList
              sessions={filtered}
              now={now}
              hoveredZone={mapHoveredZone}
              onHoverSession={setCardHoveredZone}
            />
          </div>
        </div>
      </div>

      {/* Cmd+K command palette */}
      <CommandSearch
        sessions={data.sessions}
        now={now}
        open={commandOpen}
        onOpenChange={setCommandOpen}
        onSelectSession={handleCommandSelect}
      />

      {/* Detail dialog for Cmd+K selections */}
      <SessionDetailDialog
        session={selectedSession}
        status={selectedStatus}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </TooltipProvider>
  )
}

export function SummitApp({ data }: SummitAppProps) {
  return <SummitAppInner data={data} />
}
