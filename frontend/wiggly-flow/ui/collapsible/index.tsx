import { FC, ReactNode, useState } from "react";
import { Collapsible as Primitive } from "radix-ui";
import { Button, Icon } from "..";
import clsx from "clsx";

interface CollapsibleProps {
  children: ReactNode;
  content: ReactNode;
  trigger?: ReactNode;
  className?: string;
}

export const Collapsible: FC<CollapsibleProps> = ({
  children,
  content,
  trigger,
  className,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Primitive.Root
      className={clsx(className)}
      open={open}
      onOpenChange={setOpen}
    >
      <div className="flex items-center justify-between gap-1">
        <div className="flex-1">{children}</div>
        <Primitive.Trigger asChild>
          {trigger || (
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-500 hover:text-blue-700"
            >
              {open ? (
                <Icon name="ri-contract-up-down-fill" />
              ) : (
                <Icon name="ri-expand-up-down-fill" />
              )}
            </Button>
          )}
        </Primitive.Trigger>
      </div>

      <Primitive.Content>{content}</Primitive.Content>
    </Primitive.Root>
  );
};
