import * as React from "react";
import { Dialog as RadixDialog } from "radix-ui";
import { clsx } from 'clsx';

interface DialogProps {
  triggerText: string;
  title: string;
  icon?: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
  saveText?: string;
  className?: string;
}

export function Dialog({
  triggerText,
  title,
  icon,
  description,
  children,
  className,
}: DialogProps) {
  return (
    <RadixDialog.Root>
      <RadixDialog.Trigger asChild>
        <button className={clsx("Button violet", className)}>{triggerText}</button>
      </RadixDialog.Trigger>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="DialogOverlay" />
        <RadixDialog.Content className="DialogContent">
          <div className="flex items-center gap-2 mb-2">
            {icon && <div className="text-violet-600">{icon}</div>}
            <RadixDialog.Title className="DialogTitle text-black">{title}</RadixDialog.Title>
          </div>
          {description && (
            <RadixDialog.Description className="DialogDescription mb-4">
              {description}
            </RadixDialog.Description>
          )}
          <div className="space-y-4">{children}</div>
          <RadixDialog.Close asChild>
            <button className="IconButton absolute top-4 right-4" aria-label="Close">
              <i className="ri-close-line" />
            </button>
          </RadixDialog.Close>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}