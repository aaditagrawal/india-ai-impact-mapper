import { classNames } from "@/app/ui.stylex";
import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea data-slot="textarea" className={cn(classNames.textarea275, className)} {...props} />
  );
}

export { Textarea };
