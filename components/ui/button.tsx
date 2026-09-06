import { classNames } from "@/app/ui.stylex";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(classNames.button165, {
  variants: {
    variant: {
      default: classNames.badge159,
      outline: classNames.button166,
      secondary: classNames.button167,
      ghost: classNames.button168,
      destructive: classNames.button169,
      link: classNames.badge164,
    },
    size: {
      default: classNames.button170,
      xs: classNames.button171,
      sm: classNames.button172,
      lg: classNames.button173,
      icon: classNames.button174,
      "icon-xs": classNames.button175,
      "icon-sm": classNames.button176,
      "icon-lg": classNames.button177,
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
