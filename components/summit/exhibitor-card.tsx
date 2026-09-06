"use client";

import { classNames } from "@/app/ui.stylex";

import { memo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Hash } from "@phosphor-icons/react/dist/ssr";
import type { Exhibitor } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ExhibitorCardProps {
  exhibitor: Exhibitor;
  isHighlighted: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const ExhibitorCard = memo(function ExhibitorCard({
  exhibitor,
  isHighlighted,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: ExhibitorCardProps) {
  return (
    <Card
      size="sm"
      className={cn(classNames.exhibitorCard40, isHighlighted && classNames.exhibitorCard41)}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <CardHeader>
        <CardTitle className={classNames.exhibitorCard42}>{exhibitor.exhibitor}</CardTitle>
      </CardHeader>
      <CardContent className={classNames.exhibitorCard43}>
        {exhibitor.booth_number && (
          <div className={classNames.exhibitorCard44}>
            <Hash className={classNames.exhibitorCard45} />
            <span>Booth {exhibitor.booth_number}</span>
          </div>
        )}
        <div className={classNames.exhibitorCard44}>
          <MapPin className={classNames.exhibitorCard45} />
          <span>{exhibitor.hall_number ? `Hall ${exhibitor.hall_number}` : "Unassigned"}</span>
        </div>
        <div className={classNames.exhibitorCard46}>
          <Badge variant="secondary" className={classNames.exhibitorCard47}>
            {exhibitor.tag}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
});
