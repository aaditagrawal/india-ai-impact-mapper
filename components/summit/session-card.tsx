"use client";

import { classNames } from "@/app/ui.stylex";

import { memo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, User, Broadcast } from "@phosphor-icons/react/dist/ssr";
import type { Session, SessionStatus } from "@/lib/types";
import { formatTimeRange } from "@/lib/time-utils";
import { cn } from "@/lib/utils";

interface SessionCardProps {
  session: Session;
  status: SessionStatus;
  isHighlighted: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const SessionCard = memo(function SessionCard({
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
        classNames.sessionCard68,
        classNames.sessionCard69,

        status === "live" && classNames.sessionCard70,
        isHighlighted && classNames.exhibitorCard41,
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <CardHeader className={classNames.sessionCard71}>
        <div className={classNames.sessionCard72}>
          <CardTitle className={classNames.sessionCard73}>{session.title}</CardTitle>
          {status === "live" && (
            <Badge variant="destructive" className={classNames.sessionCard74}>
              <Broadcast className={classNames.sessionCard75} />
              LIVE
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className={classNames.sessionCard76}>
        <div className={classNames.sessionCard77}>
          <Clock className={classNames.exhibitorCard45} />
          <span>{formatTimeRange(session)} (IST)</span>
        </div>
        <div className={classNames.sessionCard77}>
          <MapPin className={classNames.exhibitorCard45} />
          <span className={classNames.commandSearch30}>{session.auditorium}</span>
        </div>
        {session.speakers.length > 0 && (
          <div className={classNames.sessionCard77}>
            <User className={classNames.exhibitorCard45} />
            <span className={classNames.commandSearch30}>
              {session.speakers
                .slice(0, 2)
                .map((s) => s.name.split(",")[0])
                .join(", ")}
              {session.speakers.length > 2 && ` +${session.speakers.length - 2}`}
            </span>
          </div>
        )}
        {session.tags.length > 0 && (
          <div className={classNames.sessionCard78}>
            {session.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className={classNames.exhibitorCard47}>
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});
