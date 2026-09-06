"use client";

import { classNames } from "@/app/ui.stylex";

import { X } from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/badge";
import type { FilterState } from "@/lib/types";
import { ZONE_LABELS } from "@/lib/auditorium-map";

interface ActiveFiltersProps {
  filters: FilterState;
  onUpdate: (updates: Partial<FilterState>) => void;
}

export function ActiveFilters({ filters, onUpdate }: ActiveFiltersProps) {
  const chips: { label: string; onRemove: () => void }[] = [];

  if (filters.venue) {
    chips.push({
      label: `Venue: ${filters.venue}`,
      onRemove: () => onUpdate({ venue: "" }),
    });
  }
  if (filters.zone) {
    chips.push({
      label: `Zone: ${ZONE_LABELS[filters.zone]}`,
      onRemove: () => onUpdate({ zone: "" }),
    });
  }
  if (filters.tag) {
    chips.push({
      label: `Tag: ${filters.tag}`,
      onRemove: () => onUpdate({ tag: "" }),
    });
  }
  if (filters.timeSlot) {
    chips.push({
      label: `Time: ${filters.timeSlot}`,
      onRemove: () => onUpdate({ timeSlot: "" }),
    });
  }
  if (filters.showPast) {
    chips.push({
      label: "Showing past events",
      onRemove: () => onUpdate({ showPast: false }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className={classNames.activeFilters1}>
      {chips.map((chip) => (
        <Badge
          key={chip.label}
          variant="outline"
          className={classNames.activeFilters2}
          onClick={chip.onRemove}
        >
          {chip.label}
          <X className={classNames.activeFilters3} />
        </Badge>
      ))}
    </div>
  );
}
