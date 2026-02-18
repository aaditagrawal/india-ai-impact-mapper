"use client"

import { useMemo, useCallback, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ExhibitorCard } from "./exhibitor-card"
import { ExhibitorDetailDialog } from "./exhibitor-detail-dialog"
import type { Exhibitor, VenueZone } from "@/lib/types"
import { hallNumberToZone } from "@/lib/auditorium-map"

interface ExhibitorListProps {
  exhibitors: Exhibitor[]
  hoveredZone: VenueZone | null
  onHoverExhibitor: (zone: VenueZone | null) => void
}

interface HallGroup {
  hall: string
  label: string
  exhibitors: Exhibitor[]
}

const HALL_SORT_ORDER: Record<string, number> = {
  "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "14": 14, "Unassigned": 99,
}

function groupByHall(exhibitors: Exhibitor[]): HallGroup[] {
  const groups = new Map<string, Exhibitor[]>()

  for (const ex of exhibitors) {
    const hall = ex.hall_number && ex.hall_number !== "NA" ? ex.hall_number : "Unassigned"
    if (!groups.has(hall)) groups.set(hall, [])
    groups.get(hall)!.push(ex)
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => (HALL_SORT_ORDER[a] ?? 50) - (HALL_SORT_ORDER[b] ?? 50))
    .map(([hall, exs]) => ({
      hall,
      label: hall === "Unassigned" ? "Unassigned" : `Hall ${hall}`,
      exhibitors: exs.sort((a, b) => a.exhibitor.localeCompare(b.exhibitor)),
    }))
}

export function ExhibitorList({
  exhibitors,
  hoveredZone,
  onHoverExhibitor,
}: ExhibitorListProps) {
  const [selectedExhibitor, setSelectedExhibitor] = useState<Exhibitor | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const groups = useMemo(() => groupByHall(exhibitors), [exhibitors])

  const handleCardClick = useCallback((exhibitor: Exhibitor) => {
    setSelectedExhibitor(exhibitor)
    setDialogOpen(true)
  }, [])

  if (exhibitors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm text-muted-foreground">No exhibitors match your filters.</p>
        <p className="mt-1 text-xs text-muted-foreground/70">Try adjusting your search or filters.</p>
      </div>
    )
  }

  return (
    <>
      <ScrollArea className="h-full">
        <div className="space-y-5 p-4 sm:p-6">
          {groups.map((group) => (
            <ExhibitorHallGroup
              key={group.hall}
              group={group}
              hoveredZone={hoveredZone}
              onCardClick={handleCardClick}
              onHoverExhibitor={onHoverExhibitor}
            />
          ))}
        </div>
      </ScrollArea>

      <ExhibitorDetailDialog
        exhibitor={selectedExhibitor}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}

function ExhibitorHallGroup({
  group,
  hoveredZone,
  onCardClick,
  onHoverExhibitor,
}: {
  group: HallGroup
  hoveredZone: VenueZone | null
  onCardClick: (exhibitor: Exhibitor) => void
  onHoverExhibitor: (zone: VenueZone | null) => void
}) {
  return (
    <div>
      <div className="sticky top-0 z-10 -mx-4 bg-background/95 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur supports-backdrop-filter:bg-background/60 sm:-mx-6 sm:px-6">
        {group.label} ({group.exhibitors.length})
      </div>
      <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2 xl:grid-cols-3">
        {group.exhibitors.map((exhibitor) => {
          const zone = hallNumberToZone(exhibitor.hall_number)
          const isHighlighted = hoveredZone !== null && zone === hoveredZone
          return (
            <ExhibitorCard
              key={exhibitor.sno}
              exhibitor={exhibitor}
              isHighlighted={isHighlighted}
              onClick={() => onCardClick(exhibitor)}
              onMouseEnter={() => onHoverExhibitor(zone)}
              onMouseLeave={() => onHoverExhibitor(null)}
            />
          )
        })}
      </div>
    </div>
  )
}
