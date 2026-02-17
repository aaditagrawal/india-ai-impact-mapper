"use client"

import { useMemo, useCallback, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SessionCard } from "./session-card"
import { SessionDetailDialog } from "./session-detail-dialog"
import type { Session, VenueZone } from "@/lib/types"
import { getSessionStatus } from "@/lib/time-utils"
import { normalizeAuditorium } from "@/lib/auditorium-map"

interface SessionListProps {
  sessions: Session[]
  now: Date
  hoveredZone: VenueZone | null
  onHoverSession: (zone: VenueZone | null) => void
}

interface TimeGroup {
  key: string
  label: string
  sessions: Session[]
}

function groupByStartTime(sessions: Session[]): TimeGroup[] {
  const groups = new Map<string, Session[]>()
  for (const session of sessions) {
    const key = session.formattedStartTime ?? "TBD"
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(session)
  }
  return Array.from(groups.entries()).map(([key, sessions]) => ({
    key,
    label: key,
    sessions,
  }))
}

export function SessionList({
  sessions,
  now,
  hoveredZone,
  onHoverSession,
}: SessionListProps) {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const groups = useMemo(() => groupByStartTime(sessions), [sessions])

  const handleCardClick = useCallback((session: Session) => {
    setSelectedSession(session)
    setDialogOpen(true)
  }, [])

  const selectedStatus = selectedSession
    ? getSessionStatus(selectedSession, now)
    : null

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm text-muted-foreground">No sessions match your filters.</p>
        <p className="mt-1 text-xs text-muted-foreground/70">Try adjusting your search or filters.</p>
      </div>
    )
  }

  return (
    <>
      <ScrollArea className="h-full">
        <div className="space-y-5 p-4 sm:p-6">
          {groups.map((group) => (
            <div key={group.key}>
              <div className="sticky top-0 z-10 -mx-4 bg-background/95 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur supports-backdrop-filter:bg-background/60 sm:-mx-6 sm:px-6">
                {group.label}
              </div>
              <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2 xl:grid-cols-3">
                {group.sessions.map((session) => {
                  const status = getSessionStatus(session, now)
                  const zone = normalizeAuditorium(session.auditorium)
                  const isHighlighted =
                    hoveredZone !== null && zone === hoveredZone
                  return (
                    <SessionCard
                      key={session.id}
                      session={session}
                      status={status}
                      isHighlighted={isHighlighted}
                      onClick={() => handleCardClick(session)}
                      onMouseEnter={() => onHoverSession(zone)}
                      onMouseLeave={() => onHoverSession(null)}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <SessionDetailDialog
        session={selectedSession}
        status={selectedStatus}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  )
}
