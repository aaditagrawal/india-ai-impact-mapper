"use client"

import { useMemo } from "react"
import { VenueMapSvg } from "./venue-map-svg"
import { VenueLegend } from "./venue-legend"
import type { Session, Exhibitor, VenueZone, FilterState, AppView } from "@/lib/types"
import { ALL_ZONES, EXPO_HALL_ZONES, normalizeAuditorium, hallNumberToZone } from "@/lib/auditorium-map"
import { getSessionStatus } from "@/lib/time-utils"

interface VenueMapProps {
  sessions: Session[]
  exhibitors?: Exhibitor[]
  filters: FilterState
  now: Date
  hoveredZone: VenueZone | null
  onZoneClick: (zone: VenueZone) => void
  onZoneHover: (zone: VenueZone | null) => void
  view: AppView
}

export function VenueMap({
  sessions,
  exhibitors,
  filters,
  now,
  hoveredZone,
  onZoneClick,
  onZoneHover,
  view,
}: VenueMapProps) {
  const zoneData = useMemo(() => {
    const data = {} as Record<VenueZone, { count: number; hasLive: boolean }>
    for (const zone of ALL_ZONES) {
      data[zone] = { count: 0, hasLive: false }
    }

    if (view === "exhibitors" && exhibitors) {
      for (const ex of exhibitors) {
        const zone = hallNumberToZone(ex.hall_number)
        if (!zone) continue
        data[zone].count++
      }
    } else {
      for (const session of sessions) {
        const zone = normalizeAuditorium(session.auditorium)
        if (!zone) continue
        data[zone].count++
        if (getSessionStatus(session, now) === "live") {
          data[zone].hasLive = true
        }
      }
    }
    return data
  }, [sessions, exhibitors, now, view])

  const zones = view === "exhibitors" ? EXPO_HALL_ZONES : ALL_ZONES
  const maxCount = useMemo(
    () => Math.max(...zones.map((z) => zoneData[z].count), 1),
    [zoneData, zones]
  )

  return (
    <div className="space-y-1">
      <VenueMapSvg
        zoneData={zoneData}
        activeZone={filters.zone as VenueZone | ""}
        hoveredZone={hoveredZone}
        onZoneClick={onZoneClick}
        onZoneHover={onZoneHover}
        maxCount={maxCount}
        view={view}
      />
      <VenueLegend view={view} />
    </div>
  )
}
