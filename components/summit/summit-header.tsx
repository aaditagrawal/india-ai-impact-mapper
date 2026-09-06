"use client";

import { classNames } from "@/app/ui.stylex";

import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Broadcast,
  MapPin,
  CalendarBlank,
  Moon,
  Sun,
  MagnifyingGlass,
  Command,
  Storefront,
  Presentation,
} from "@phosphor-icons/react/dist/ssr";
import { useTheme } from "@/hooks/use-theme";
import type { AppView } from "@/lib/types";

interface SummitHeaderProps {
  totalSessions: number;
  filteredCount: number;
  hasLiveSessions: boolean;
  onCommandOpen: () => void;
  view: AppView;
  onViewChange: (view: AppView) => void;
}

export function SummitHeader({
  totalSessions,
  filteredCount,
  hasLiveSessions,
  onCommandOpen,
  view,
  onViewChange,
}: SummitHeaderProps) {
  const { dark, toggle } = useTheme();

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onCommandOpen();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCommandOpen]);

  return (
    <header className={classNames.summitHeader101}>
      <div className={classNames.summitHeader102}>
        <div className={classNames.summitHeader103}>
          <h1 className={classNames.summitHeader104}>India AI Impact Summit 2026</h1>
          <div className={classNames.summitHeader105}>
            <span className={classNames.summitHeader106}>
              <CalendarBlank className={classNames.exhibitorFiltersBar58} weight="duotone" />
              Feb 16 – 20, 2026
            </span>
            <span className={classNames.summitHeader107}>
              <MapPin className={classNames.exhibitorFiltersBar58} weight="duotone" />
              Bharat Mandapam, New Delhi
            </span>
          </div>
        </div>

        <div className={classNames.summitHeader108}>
          {hasLiveSessions && view === "sessions" && (
            <Badge variant="destructive" className={classNames.summitHeader109}>
              <Broadcast className={classNames.sessionCard75} />
              LIVE
            </Badge>
          )}

          {/* View toggle */}
          <div className={classNames.summitHeader110}>
            <button
              onClick={() => onViewChange("sessions")}
              className={` ${classNames.summitHeader113} ${
                view === "sessions" ? classNames.summitHeader111 : classNames.summitHeader112
              }`}
            >
              <Presentation className={classNames.exhibitorFiltersBar58} />
              <span className={classNames.filtersBar67}>Sessions</span>
            </button>
            <button
              onClick={() => onViewChange("exhibitors")}
              className={` ${classNames.summitHeader114} ${
                view === "exhibitors" ? classNames.summitHeader111 : classNames.summitHeader112
              }`}
            >
              <Storefront className={classNames.exhibitorFiltersBar58} />
              <span className={classNames.filtersBar67}>Exhibitors</span>
            </button>
          </div>

          <span className={classNames.summitHeader115}>
            {filteredCount === totalSessions
              ? `${totalSessions} ${view === "sessions" ? "sessions" : "exhibitors"}`
              : `${filteredCount} of ${totalSessions}`}
          </span>
          <span className={classNames.summitHeader116}>
            {filteredCount}/{totalSessions}
          </span>
          <button onClick={onCommandOpen} className={classNames.summitHeader117}>
            <MagnifyingGlass className={classNames.exhibitorFiltersBar58} />
            <span>Search</span>
            <kbd className={classNames.summitHeader118}>
              <Command className={classNames.summitHeader119} />K
            </kbd>
          </button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onCommandOpen}
            aria-label="Search sessions"
            className={classNames.summitHeader120}
          >
            <MagnifyingGlass className={classNames.exhibitorFiltersBar56} />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={toggle}
            aria-label="Toggle dark mode"
            className={classNames.summitHeader121}
          >
            {dark ? (
              <Sun className={classNames.exhibitorFiltersBar56} />
            ) : (
              <Moon className={classNames.exhibitorFiltersBar56} />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
