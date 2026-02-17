"use client"

import { useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Broadcast, MapPin, CalendarBlank, Moon, Sun, MagnifyingGlass, Command } from "@phosphor-icons/react"
import { useTheme } from "@/hooks/use-theme"

interface SummitHeaderProps {
  totalSessions: number
  filteredCount: number
  hasLiveSessions: boolean
  onCommandOpen: () => void
}

export function SummitHeader({
  totalSessions,
  filteredCount,
  hasLiveSessions,
  onCommandOpen,
}: SummitHeaderProps) {
  const { dark, toggle } = useTheme()

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        onCommandOpen()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onCommandOpen])

  return (
    <header className="border-b px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate font-serif text-lg tracking-tight sm:text-xl">
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
          <button
            onClick={onCommandOpen}
            className="hidden items-center gap-2 rounded-md border bg-muted/50 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground sm:flex"
          >
            <MagnifyingGlass className="size-3.5" />
            <span>Search</span>
            <kbd className="pointer-events-none inline-flex items-center gap-0.5 rounded border bg-background px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
              <Command className="size-2.5" />K
            </kbd>
          </button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onCommandOpen}
            aria-label="Search sessions"
            className="transition-subtle sm:hidden"
          >
            <MagnifyingGlass className="size-4" />
          </Button>
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
