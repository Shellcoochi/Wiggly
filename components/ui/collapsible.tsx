"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { FC, ReactNode, useState } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { IconArrowBarDown, IconArrowBarUp } from "@tabler/icons-react";

function CollapsibleRoot({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  );
}

function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  );
}

interface CollapsibleProps {
  children: ReactNode;
  content: ReactNode;
  trigger?: ReactNode;
  className?: string;
}

const Collapsible: FC<CollapsibleProps> = ({
  children,
  content,
  trigger,
  className,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <CollapsibleRoot
      className={cn(className)}
      open={open}
      onOpenChange={setOpen}
    >
      <div className="flex items-center justify-between gap-1">
        <div className="flex-1">{children}</div>
        <CollapsibleTrigger asChild>
          {trigger || (
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-blue-500 hover:text-blue-700"
            >
              {open ? <IconArrowBarUp /> : <IconArrowBarDown />}
            </Button>
          )}
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent>{content}</CollapsibleContent>
    </CollapsibleRoot>
  );
};

export { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent };
export default Collapsible;
