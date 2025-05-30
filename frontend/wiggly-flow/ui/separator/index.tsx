import { FC } from "react";
import { Separator as Primitive } from "radix-ui";
import clsx from "clsx";

interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
  className?: string;
}

export const Separator: FC<SeparatorProps> = ({
  orientation = "horizontal",
  decorative = false,
  className = "",
}) => (
  <Primitive.Root
    className={clsx(
      "bg-primary-disabled",
      "data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full",
      "data-[orientation=vertical]:w-px data-[orientation=vertical]:h-full",
      "data-[orientation=vertical]:min-h-2",
      className
    )}
    decorative={decorative}
    orientation={orientation}
  />
);
