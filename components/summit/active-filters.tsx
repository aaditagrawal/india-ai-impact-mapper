"use client"

import { X } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import type { FilterState, VenueZone } from "@/lib/types"
import { ZONE_LABELS } from "@/lib/auditorium-map"

interface ActiveFiltersProps {
  filters: FilterState
  onUpdate: (updates: Partial<FilterState>) => void
}

export function ActiveFilters({ filters, onUpdate }: ActiveFiltersProps) {
  const chips: { label: string; onRemove: () => void }[] = []

  if (filters.venue) {
    chips.push({
      label: `Venue: ${filters.venue}`,
      onRemove: () => onUpdate({ venue: "" }),
    })
  }
  if (filters.zone) {
    chips.push({
      label: `Zone: ${ZONE_LABELS[filters.zone as VenueZone]}`,
      onRemove: () => onUpdate({ zone: "" }),
    })
  }
  if (filters.tag) {
    chips.push({
      label: `Tag: ${filters.tag}`,
      onRemove: () => onUpdate({ tag: "" }),
    })
  }
  if (filters.timeSlot) {
    chips.push({
      label: `Time: ${filters.timeSlot}`,
      onRemove: () => onUpdate({ timeSlot: "" }),
    })
  }
  if (!filters.showPast) {
    chips.push({
      label: "Hiding past events",
      onRemove: () => onUpdate({ showPast: true }),
    })
  }

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5 px-4 sm:px-6">
      {chips.map((chip) => (
        <Badge
          key={chip.label}
          variant="outline"
          className="cursor-pointer gap-1 pr-1.5 transition-subtle hover:bg-accent/50"
          onClick={chip.onRemove}
        >
          {chip.label}
          <X className="size-3" />
        </Badge>
      ))}
    </div>
  )
}
