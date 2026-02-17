"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Broadcast, MapPin, CalendarBlank, Moon, Sun } from "@phosphor-icons/react"
import { useTheme } from "@/hooks/use-theme"

interface SummitHeaderProps {
  totalSessions: number
  filteredCount: number
  hasLiveSessions: boolean
}

export function SummitHeader({
  totalSessions,
  filteredCount,
  hasLiveSessions,
}: SummitHeaderProps) {
  const { dark, toggle } = useTheme()

  return (
    <header className="border-b px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">
            India AI Impact Summit 2026
          </h1>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarBlank className="size-3.5" weight="duotone" />
              Feb 17 – 20, 2026
            </span>
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <MapPin className="size-3.5" weight="duotone" />
              Bharat Mandapam, New Delhi
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {hasLiveSessions && (
            <Badge variant="destructive" className="gap-1">
              <Broadcast className="size-3 animate-pulse" />
              LIVE
            </Badge>
          )}
          <span className="hidden text-xs tabular-nums text-muted-foreground sm:inline">
            {filteredCount === totalSessions
              ? `${totalSessions} sessions`
              : `${filteredCount} of ${totalSessions}`}
          </span>
          <span className="text-xs tabular-nums text-muted-foreground sm:hidden">
            {filteredCount}/{totalSessions}
          </span>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="transition-subtle"
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        </div>
      </div>
    </header>
  )
}
