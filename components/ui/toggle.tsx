"use client";

import { classNames } from "@/app/ui.stylex";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Toggle as TogglePrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const toggleVariants = cva(classNames.toggle276, {
  variants: {
    variant: {
      default: classNames.toggle277,
      outline: classNames.toggle278,
    },
    size: {
      default: classNames.toggle279,
      sm: classNames.toggle280,
      lg: classNames.toggle281,
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
