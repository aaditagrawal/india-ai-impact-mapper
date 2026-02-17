"use client"

import { useMemo } from "react"
import { VenueMapSvg } from "./venue-map-svg"
import { VenueLegend } from "./venue-legend"
import type { Session, VenueZone, FilterState } from "@/lib/types"
import { ALL_ZONES, normalizeAuditorium } from "@/lib/auditorium-map"
import { getSessionStatus } from "@/lib/time-utils"

interface VenueMapProps {
  sessions: Session[]
  filters: FilterState
  now: Date
  hoveredZone: VenueZone | null
  onZoneClick: (zone: VenueZone) => void
  onZoneHover: (zone: VenueZone | null) => void
}

export function VenueMap({
  sessions,
  filters,
  now,
  hoveredZone,
  onZoneClick,
  onZoneHover,
}: VenueMapProps) {
  const zoneData = useMemo(() => {
    const data = {} as Record<VenueZone, { count: number; hasLive: boolean }>
    for (const zone of ALL_ZONES) {
      data[zone] = { count: 0, hasLive: false }
    }
    for (const session of sessions) {
      const zone = normalizeAuditorium(session.auditorium)
      if (!zone) continue
      data[zone].count++
      if (getSessionStatus(session, now) === "live") {
        data[zone].hasLive = true
      }
    }
    return data
  }, [sessions, now])

  const maxCount = useMemo(
    () => Math.max(...ALL_ZONES.map((z) => zoneData[z].count), 1),
    [zoneData]
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
      />
      <VenueLegend />
    </div>
  )
}
