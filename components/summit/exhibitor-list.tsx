"use client";

import { classNames } from "@/app/ui.stylex";

import { useMemo, useCallback, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExhibitorCard } from "./exhibitor-card";
import { ExhibitorDetailDialog } from "./exhibitor-detail-dialog";
import type { Exhibitor, VenueZone } from "@/lib/types";
import { hallNumberToZone } from "@/lib/auditorium-map";

interface ExhibitorListProps {
  exhibitors: Exhibitor[];
  hoveredZone: VenueZone | null;
  onHoverExhibitor: (zone: VenueZone | null) => void;
}

interface HallGroup {
  hall: string;
  label: string;
  exhibitors: Exhibitor[];
}

const HALL_SORT_ORDER = new Map<string, number>([
  ["1", 1],
  ["2", 2],
  ["3", 3],
  ["4", 4],
  ["5", 5],
  ["6", 6],
  ["7", 7],
  ["8", 8],
  ["14", 14],
  ["Unassigned", 99],
]);

function groupByHall(exhibitors: Exhibitor[]): HallGroup[] {
  const groups = new Map<string, Exhibitor[]>();

  for (const ex of exhibitors) {
    const hall = ex.hall_number && ex.hall_number !== "NA" ? ex.hall_number : "Unassigned";
    if (!groups.has(hall)) groups.set(hall, []);
    groups.get(hall)!.push(ex);
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => (HALL_SORT_ORDER.get(a) ?? 50) - (HALL_SORT_ORDER.get(b) ?? 50))
    .map(([hall, exs]) => ({
      hall,
      label: hall === "Unassigned" ? "Unassigned" : `Hall ${hall}`,
      exhibitors: exs.sort((a, b) => a.exhibitor.localeCompare(b.exhibitor)),
    }));
}

export function ExhibitorList({ exhibitors, hoveredZone, onHoverExhibitor }: ExhibitorListProps) {
  const [selectedExhibitor, setSelectedExhibitor] = useState<Exhibitor | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const groups = useMemo(() => groupByHall(exhibitors), [exhibitors]);

  const handleCardClick = useCallback((exhibitor: Exhibitor) => {
    setSelectedExhibitor(exhibitor);
    setDialogOpen(true);
  }, []);

  if (exhibitors.length === 0) {
    return (
      <div className={classNames.exhibitorList60}>
        <p className={classNames.exhibitorList61}>No exhibitors match your filters.</p>
        <p className={classNames.exhibitorList62}>Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className={classNames.exhibitorList63}>
        <div className={classNames.exhibitorList64}>
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
  );
}

function ExhibitorHallGroup({
  group,
  hoveredZone,
  onCardClick,
  onHoverExhibitor,
}: {
  group: HallGroup;
  hoveredZone: VenueZone | null;
  onCardClick: (exhibitor: Exhibitor) => void;
  onHoverExhibitor: (zone: VenueZone | null) => void;
}) {
  return (
    <div>
      <div className={classNames.exhibitorList65}>
        {group.label} ({group.exhibitors.length})
      </div>
      <div className={classNames.exhibitorList66}>
        {group.exhibitors.map((exhibitor) => {
          const zone = hallNumberToZone(exhibitor.hall_number);
          const isHighlighted = hoveredZone !== null && zone === hoveredZone;
          return (
            <ExhibitorCard
              key={exhibitor.sno}
              exhibitor={exhibitor}
              isHighlighted={isHighlighted}
              onClick={() => onCardClick(exhibitor)}
              onMouseEnter={() => onHoverExhibitor(zone)}
              onMouseLeave={() => onHoverExhibitor(null)}
            />
          );
        })}
      </div>
    </div>
  );
}
