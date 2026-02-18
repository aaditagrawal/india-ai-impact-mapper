"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Hash, Tag, NumberSquareOne } from "@phosphor-icons/react"
import type { Exhibitor } from "@/lib/types"

interface ExhibitorDetailDialogProps {
  exhibitor: Exhibitor | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExhibitorDetailDialog({
  exhibitor,
  open,
  onOpenChange,
}: ExhibitorDetailDialogProps) {
  if (!exhibitor) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg leading-snug">
            {exhibitor.exhibitor}
          </DialogTitle>
        </DialogHeader>

        <Separator className="my-1" />

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <NumberSquareOne className="size-4 shrink-0 text-muted-foreground" />
            <span>#{exhibitor.sno}</span>
          </div>

          {exhibitor.booth_number && (
            <div className="flex items-center gap-2 text-sm">
              <Hash className="size-4 shrink-0 text-muted-foreground" />
              <span>Booth {exhibitor.booth_number}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <MapPin className="size-4 shrink-0 text-muted-foreground" />
            <span>
              {exhibitor.hall_number
                ? `Hall ${exhibitor.hall_number}`
                : "Hall not assigned"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Tag className="size-4 shrink-0 text-muted-foreground" />
            <Badge variant="secondary">{exhibitor.tag}</Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
