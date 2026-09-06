"use client";

import { classNames } from "@/app/ui.stylex";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  MapPin,
  User,
  ArrowSquareOut,
  Buildings,
  Tag,
  Handshake,
} from "@phosphor-icons/react/dist/ssr";
import type { Session, SessionStatus } from "@/lib/types";
import { formatTimeRange } from "@/lib/time-utils";

interface SessionDetailDialogProps {
  session: Session | null;
  status: SessionStatus | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SessionDetailDialog({
  session,
  status,
  open,
  onOpenChange,
}: SessionDetailDialogProps) {
  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={classNames.sessionDetailDialog79}>
        <DialogHeader>
          <div className={classNames.sessionDetailDialog80}>
            <DialogTitle className={classNames.exhibitorDetailDialog49}>
              {session.title}
            </DialogTitle>
            {status === "live" && (
              <Badge variant="destructive" className={classNames.sessionDetailDialog81}>
                LIVE
              </Badge>
            )}
            {status === "past" && (
              <Badge variant="secondary" className={classNames.sessionDetailDialog81}>
                Past
              </Badge>
            )}
          </div>
          {session.description && (
            <DialogDescription className={classNames.sessionDetailDialog82}>
              {session.description}
            </DialogDescription>
          )}
        </DialogHeader>

        <Separator className={classNames.exhibitorDetailDialog50} />

        <div className={classNames.exhibitorDetailDialog51}>
          <div className={classNames.exhibitorDetailDialog52}>
            <Clock className={classNames.commandSearch9} />
            <span>
              {session.formattedDate} &middot; {formatTimeRange(session)} (IST)
            </span>
          </div>

          <div className={classNames.exhibitorDetailDialog52}>
            <Buildings className={classNames.commandSearch9} />
            <span>{session.venue}</span>
          </div>

          <div className={classNames.exhibitorDetailDialog52}>
            <MapPin className={classNames.commandSearch9} />
            <span>{session.auditorium}</span>
          </div>

          {session.speakers.length > 0 && (
            <div className={classNames.sessionDetailDialog83}>
              <div className={classNames.sessionDetailDialog84}>
                <User className={classNames.commandSearch9} />
                Speakers
              </div>
              <ul className={classNames.sessionDetailDialog85}>
                {session.speakers.map((speaker) => (
                  <li key={speaker.id}>{speaker.name}</li>
                ))}
              </ul>
            </div>
          )}

          {session.knowledgePartners.length > 0 && (
            <div className={classNames.sessionDetailDialog83}>
              <div className={classNames.sessionDetailDialog84}>
                <Handshake className={classNames.commandSearch9} />
                Knowledge Partners
              </div>
              <ul className={classNames.sessionDetailDialog85}>
                {session.knowledgePartners.map((kp) => (
                  <li key={kp.id}>{kp.name}</li>
                ))}
              </ul>
            </div>
          )}

          {session.tags.length > 0 && (
            <div className={classNames.exhibitorDetailDialog53}>
              <Tag className={classNames.commandSearch9} />
              <div className={classNames.sessionDetailDialog86}>
                {session.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className={classNames.exhibitorCard47}>
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {session.watchLiveUrl && (
          <>
            <Separator className={classNames.exhibitorDetailDialog50} />
            <Button asChild variant="outline" className={classNames.sessionDetailDialog87}>
              <a href={session.watchLiveUrl} target="_blank" rel="noopener noreferrer">
                Watch Live
                <ArrowSquareOut
                  data-icon="inline-end"
                  className={classNames.exhibitorFiltersBar56}
                />
              </a>
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
