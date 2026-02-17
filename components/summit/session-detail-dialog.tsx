"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Clock,
  MapPin,
  User,
  ArrowSquareOut,
  Buildings,
  Tag,
  Handshake,
} from "@phosphor-icons/react"
import type { Session, SessionStatus } from "@/lib/types"
import { formatTimeRange } from "@/lib/time-utils"

interface SessionDetailDialogProps {
  session: Session | null
  status: SessionStatus | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SessionDetailDialog({
  session,
  status,
  open,
  onOpenChange,
}: SessionDetailDialogProps) {
  if (!session) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-start gap-2">
            <DialogTitle className="font-serif text-lg leading-snug">
              {session.title}
            </DialogTitle>
            {status === "live" && (
              <Badge variant="destructive" className="shrink-0 text-[10px]">
                LIVE
              </Badge>
            )}
            {status === "past" && (
              <Badge variant="secondary" className="shrink-0 text-[10px]">
                Past
              </Badge>
            )}
          </div>
          {session.description && (
            <DialogDescription className="mt-1.5">
              {session.description}
            </DialogDescription>
          )}
        </DialogHeader>

        <Separator className="my-1" />

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="size-4 shrink-0 text-muted-foreground" />
            <span>
              {session.formattedDate} &middot; {formatTimeRange(session)} (IST)
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Buildings className="size-4 shrink-0 text-muted-foreground" />
            <span>{session.venue}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <MapPin className="size-4 shrink-0 text-muted-foreground" />
            <span>{session.auditorium}</span>
          </div>

          {session.speakers.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <User className="size-4 shrink-0 text-muted-foreground" />
                Speakers
              </div>
              <ul className="space-y-1 pl-6 text-sm text-muted-foreground">
                {session.speakers.map((speaker) => (
                  <li key={speaker.id}>{speaker.name}</li>
                ))}
              </ul>
            </div>
          )}

          {session.knowledgePartners.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Handshake className="size-4 shrink-0 text-muted-foreground" />
                Knowledge Partners
              </div>
              <ul className="space-y-1 pl-6 text-sm text-muted-foreground">
                {session.knowledgePartners.map((kp) => (
                  <li key={kp.id}>{kp.name}</li>
                ))}
              </ul>
            </div>
          )}

          {session.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag className="size-4 shrink-0 text-muted-foreground" />
              <div className="flex flex-wrap gap-1">
                {session.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px]">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {session.watchLiveUrl && (
          <>
            <Separator className="my-1" />
            <Button asChild variant="outline" className="w-full">
              <a
                href={session.watchLiveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch Live
                <ArrowSquareOut data-icon="inline-end" className="size-4" />
              </a>
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
