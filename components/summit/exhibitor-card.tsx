"use client"

import { memo } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Hash } from "@phosphor-icons/react"
import type { Exhibitor } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ExhibitorCardProps {
  exhibitor: Exhibitor
  isHighlighted: boolean
  onClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
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
      className={cn(
        "cursor-pointer transition-subtle hover:bg-accent/50",
        isHighlighted && "bg-accent/50 ring-1 ring-primary/30"
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <CardHeader>
        <CardTitle className="line-clamp-2 font-serif text-xs leading-snug">
          {exhibitor.exhibitor}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {exhibitor.booth_number && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Hash className="size-3 shrink-0" />
            <span>Booth {exhibitor.booth_number}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3 shrink-0" />
          <span>{exhibitor.hall_number ? `Hall ${exhibitor.hall_number}` : "Unassigned"}</span>
        </div>
        <div className="pt-0.5">
          <Badge variant="secondary" className="text-[10px]">
            {exhibitor.tag}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
})
