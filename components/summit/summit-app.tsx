"use client";

import { classNames } from "@/app/ui.stylex";

import { useMemo, useDeferredValue, useCallback, useState, useEffect } from "react";
import { CaretDown, CaretUp, MapTrifold } from "@phosphor-icons/react/dist/ssr";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SummitHeader } from "./summit-header";
import { DateTabs } from "./date-tabs";
import { FiltersBar } from "./filters-bar";
import { ActiveFilters } from "./active-filters";
import { SessionList } from "./session-list";
import { ExhibitorList } from "./exhibitor-list";
import { ExhibitorFiltersBar } from "./exhibitor-filters-bar";
import { VenueMap } from "./venue-map";
import { CommandSearch } from "./command-search";
import { SessionDetailDialog } from "./session-detail-dialog";
import { ExhibitorDetailDialog } from "./exhibitor-detail-dialog";
import { useFilters } from "@/hooks/use-filters";
import { useCurrentTime } from "@/hooks/use-current-time";
import { filterSessions, DEFAULT_FILTERS } from "@/lib/filters";
import { filterExhibitors, DEFAULT_EXHIBITOR_FILTERS } from "@/lib/exhibitor-filters";
import { getSessionStatus } from "@/lib/time-utils";
import { zoneToHallNumber } from "@/lib/auditorium-map";
import type {
  Session,
  SummitData,
  VenueZone,
  Exhibitor,
  AppView,
  ExhibitorFilterState,
} from "@/lib/types";

interface SummitAppProps {
  data: SummitData;
  exhibitors: Exhibitor[];
}

function SummitAppInner({ data, exhibitors }: SummitAppProps) {
  const { filters, updateFilters, clearFilters } = useFilters();
  const now = useCurrentTime();
  const [view, setView] = useState<AppView>("sessions");
  const [mapHoveredZone, setMapHoveredZone] = useState<VenueZone | null>(null);
  const [cardHoveredZone, setCardHoveredZone] = useState<VenueZone | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedExhibitor, setSelectedExhibitor] = useState<Exhibitor | null>(null);
  const [exhibitorDetailOpen, setExhibitorDetailOpen] = useState(false);
  const [mapExpanded, setMapExpanded] = useState(false);

  // Exhibitor filters
  const [exFilters, setExFilters] = useState<ExhibitorFilterState>(DEFAULT_EXHIBITOR_FILTERS);

  const updateExFilters = useCallback((updates: Partial<ExhibitorFilterState>) => {
    setExFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  const clearExFilters = useCallback(() => {
    setExFilters({ ...DEFAULT_EXHIBITOR_FILTERS });
  }, []);

  // Sync view to URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("view") === "exhibitors") {
      setView("exhibitors");
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (view === "exhibitors") {
      params.set("view", "exhibitors");
    } else {
      params.delete("view");
    }
    const search = params.toString();
    const url = search ? `?${search}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, [view]);

  // Defer the query so filtering doesn't block input
  const deferredQuery = useDeferredValue(filters.query);
  const deferredFilters = useMemo(
    () => ({ ...filters, query: deferredQuery }),
    [filters, deferredQuery],
  );

  const filtered = useMemo(
    () => filterSessions(data.sessions, deferredFilters, now),
    [data.sessions, deferredFilters, now],
  );

  // Exhibitor filtering
  const deferredExQuery = useDeferredValue(exFilters.query);
  const deferredExFilters = useMemo(
    () => ({ ...exFilters, query: deferredExQuery }),
    [exFilters, deferredExQuery],
  );

  const filteredExhibitors = useMemo(
    () => filterExhibitors(exhibitors, deferredExFilters),
    [exhibitors, deferredExFilters],
  );

  const hasLiveSessions = useMemo(
    () => data.sessions.some((s) => getSessionStatus(s, now) === "live"),
    [data.sessions, now],
  );

  const hasActiveFilters =
    filters.query !== DEFAULT_FILTERS.query ||
    filters.date !== DEFAULT_FILTERS.date ||
    filters.venue !== DEFAULT_FILTERS.venue ||
    filters.zone !== DEFAULT_FILTERS.zone ||
    filters.tag !== DEFAULT_FILTERS.tag ||
    filters.timeSlot !== DEFAULT_FILTERS.timeSlot ||
    filters.showPast !== DEFAULT_FILTERS.showPast;

  const hasActiveExFilters =
    exFilters.query !== DEFAULT_EXHIBITOR_FILTERS.query ||
    exFilters.tag !== DEFAULT_EXHIBITOR_FILTERS.tag ||
    exFilters.hall !== DEFAULT_EXHIBITOR_FILTERS.hall;

  const handleZoneClick = useCallback(
    (zone: VenueZone) => {
      if (view === "exhibitors") {
        const hall = zoneToHallNumber(zone);
        if (hall) {
          updateExFilters({ hall: exFilters.hall === hall ? "" : hall });
        }
      } else {
        updateFilters({ zone: filters.zone === zone ? "" : zone });
      }
    },
    [view, filters.zone, exFilters.hall, updateFilters, updateExFilters],
  );

  const handleCommandSelectSession = useCallback((session: Session) => {
    setSelectedSession(session);
    setDetailOpen(true);
  }, []);

  const handleCommandSelectExhibitor = useCallback((exhibitor: Exhibitor) => {
    setSelectedExhibitor(exhibitor);
    setExhibitorDetailOpen(true);
  }, []);

  const handleViewChange = useCallback((newView: AppView) => {
    setView(newView);
    setMapHoveredZone(null);
    setCardHoveredZone(null);
  }, []);

  const selectedStatus = selectedSession ? getSessionStatus(selectedSession, now) : null;

  // For the header counts
  const totalCount = view === "sessions" ? data.totalSessions : exhibitors.length;
  const filteredCount = view === "sessions" ? filtered.length : filteredExhibitors.length;

  // Exhibitor active filter chips
  const exFilterChips: { label: string; onRemove: () => void }[] = [];
  if (exFilters.tag) {
    exFilterChips.push({
      label: `Category: ${exFilters.tag}`,
      onRemove: () => updateExFilters({ tag: "" }),
    });
  }
  if (exFilters.hall) {
    exFilterChips.push({
      label: `Hall: ${exFilters.hall === "Unassigned" ? "Unassigned" : `Hall ${exFilters.hall}`}`,
      onRemove: () => updateExFilters({ hall: "" }),
    });
  }

  return (
    <TooltipProvider>
      <div className={classNames.summitApp88}>
        <SummitHeader
          totalSessions={totalCount}
          filteredCount={filteredCount}
          hasLiveSessions={hasLiveSessions}
          onCommandOpen={() => setCommandOpen(true)}
          view={view}
          onViewChange={handleViewChange}
        />

        <div className={classNames.summitApp89}>
          {view === "sessions" ? (
            <>
              <div className={classNames.summitApp90}>
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
            </>
          ) : (
            <>
              <ExhibitorFiltersBar
                filters={exFilters}
                exhibitors={exhibitors}
                onUpdate={updateExFilters}
                onClear={clearExFilters}
                hasActiveFilters={hasActiveExFilters}
              />
              {exFilterChips.length > 0 && (
                <div className={classNames.activeFilters1}>
                  {exFilterChips.map((chip) => (
                    <button
                      key={chip.label}
                      onClick={chip.onRemove}
                      className={classNames.summitApp91}
                    >
                      {chip.label}
                      <span className={classNames.exhibitorCard47}>&times;</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className={classNames.summitApp92}>
          {/* Map panel */}
          <div
            className={` ${classNames.summitApp94} ${mapExpanded ? classNames.summitApp93 : ""}`}
          >
            <button onClick={() => setMapExpanded((v) => !v)} className={classNames.summitApp95}>
              <span className={classNames.summitApp96}>
                <MapTrifold className={classNames.exhibitorFiltersBar58} />
                Venue Map
              </span>
              {mapExpanded ? (
                <CaretUp className={classNames.exhibitorFiltersBar58} />
              ) : (
                <CaretDown className={classNames.exhibitorFiltersBar58} />
              )}
            </button>
            <div
              className={` ${classNames.summitApp99} ${mapExpanded ? classNames.summitApp97 : classNames.summitApp98}`}
            >
              <VenueMap
                sessions={filtered}
                exhibitors={view === "exhibitors" ? filteredExhibitors : undefined}
                filters={filters}
                now={now}
                hoveredZone={mapHoveredZone ?? cardHoveredZone}
                onZoneClick={handleZoneClick}
                onZoneHover={setMapHoveredZone}
                view={view}
              />
            </div>
          </div>

          {/* List panel */}
          <div className={classNames.summitApp100}>
            {view === "sessions" ? (
              <SessionList
                sessions={filtered}
                now={now}
                hoveredZone={mapHoveredZone}
                onHoverSession={setCardHoveredZone}
              />
            ) : (
              <ExhibitorList
                exhibitors={filteredExhibitors}
                hoveredZone={mapHoveredZone}
                onHoverExhibitor={setCardHoveredZone}
              />
            )}
          </div>
        </div>
      </div>

      {/* Cmd+K command palette */}
      <CommandSearch
        sessions={data.sessions}
        exhibitors={exhibitors}
        now={now}
        open={commandOpen}
        onOpenChange={setCommandOpen}
        onSelectSession={handleCommandSelectSession}
        onSelectExhibitor={handleCommandSelectExhibitor}
        view={view}
      />

      {/* Session detail dialog */}
      <SessionDetailDialog
        session={selectedSession}
        status={selectedStatus}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      {/* Exhibitor detail dialog */}
      <ExhibitorDetailDialog
        exhibitor={selectedExhibitor}
        open={exhibitorDetailOpen}
        onOpenChange={setExhibitorDetailOpen}
      />
    </TooltipProvider>
  );
}

export function SummitApp({ data, exhibitors }: SummitAppProps) {
  return <SummitAppInner data={data} exhibitors={exhibitors} />;
}
