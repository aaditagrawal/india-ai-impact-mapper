"use client";

import { classNames } from "@/app/ui.stylex";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Hash, Tag, NumberSquareOne } from "@phosphor-icons/react/dist/ssr";
import type { Exhibitor } from "@/lib/types";

interface ExhibitorDetailDialogProps {
  exhibitor: Exhibitor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExhibitorDetailDialog({
  exhibitor,
  open,
  onOpenChange,
}: ExhibitorDetailDialogProps) {
  if (!exhibitor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={classNames.exhibitorDetailDialog48}>
        <DialogHeader>
          <DialogTitle className={classNames.exhibitorDetailDialog49}>
            {exhibitor.exhibitor}
          </DialogTitle>
        </DialogHeader>

        <Separator className={classNames.exhibitorDetailDialog50} />

        <div className={classNames.exhibitorDetailDialog51}>
          <div className={classNames.exhibitorDetailDialog52}>
            <NumberSquareOne className={classNames.commandSearch9} />
            <span>#{exhibitor.sno}</span>
          </div>

          {exhibitor.booth_number && (
            <div className={classNames.exhibitorDetailDialog52}>
              <Hash className={classNames.commandSearch9} />
              <span>Booth {exhibitor.booth_number}</span>
            </div>
          )}

          <div className={classNames.exhibitorDetailDialog52}>
            <MapPin className={classNames.commandSearch9} />
            <span>
              {exhibitor.hall_number ? `Hall ${exhibitor.hall_number}` : "Hall not assigned"}
            </span>
          </div>

          <div className={classNames.exhibitorDetailDialog53}>
            <Tag className={classNames.commandSearch9} />
            <Badge variant="secondary">{exhibitor.tag}</Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
