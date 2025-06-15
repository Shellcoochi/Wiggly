"use client";

import * as React from "react";
import { Popover as RadixPopover } from "radix-ui";
import { clsx } from "clsx";

interface PopoverProps {
  trigger?: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  showArrow?: boolean;
  contentRef?: React.Ref<HTMLDivElement>;
  contentStyle?: React.CSSProperties;
  onOpenAutoFocus?: (event: Event) => void;
  sideOffset?: number;
}

export function Popover({
  trigger,
  children,
  side,
  align = "center",
  className,
  defaultOpen,
  open,
  onOpenChange,
  modal,
  showArrow = true,
  contentRef,
  contentStyle,
  onOpenAutoFocus,
  sideOffset = 0,
}: PopoverProps) {
  return (
    <RadixPopover.Root
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      modal={modal}
    >
      <RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          ref={contentRef}
          style={contentStyle}
          onOpenAutoFocus={onOpenAutoFocus}
          className={clsx("rounded-md bg-white p-4 shadow-md z-50", className)}
        >
          {children}
          {showArrow ? <RadixPopover.Arrow className="fill-white" /> : null}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
}
