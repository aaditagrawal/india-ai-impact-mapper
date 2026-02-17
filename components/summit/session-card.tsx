"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, User, Broadcast } from "@phosphor-icons/react"
import type { Session, SessionStatus } from "@/lib/types"
import { formatTimeRange } from "@/lib/time-utils"
import { cn } from "@/lib/utils"

interface SessionCardProps {
  session: Session
  status: SessionStatus
  isHighlighted: boolean
  onClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export function SessionCard({
  session,
  status,
  isHighlighted,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: SessionCardProps) {
  return (
    <Card
      size="sm"
      className={cn(
        "cursor-pointer transition-subtle hover:bg-accent/50",
        status === "past" && "opacity-50",
        status === "live" && "border-l-2 border-l-primary",
        isHighlighted && "bg-accent/50 ring-1 ring-primary/30"
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-[13px] leading-snug">
            {session.title}
          </CardTitle>
          {status === "live" && (
            <Badge variant="destructive" className="shrink-0 gap-1 text-[10px]">
              <Broadcast className="size-3 animate-pulse" />
              LIVE
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3 shrink-0" />
          <span>{formatTimeRange(session)} (IST)</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3 shrink-0" />
          <span className="truncate">{session.auditorium}</span>
        </div>
        {session.speakers.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <User className="size-3 shrink-0" />
            <span className="truncate">
              {session.speakers
                .slice(0, 2)
                .map((s) => s.name.split(",")[0])
                .join(", ")}
              {session.speakers.length > 2 &&
                ` +${session.speakers.length - 2}`}
            </span>
          </div>
        )}
        {session.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {session.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
