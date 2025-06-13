import { FC, ReactNode } from "react";
import { ScrollArea as Primitive } from "radix-ui";
import clsx from "clsx";

interface ScrollAreaProps {
  type?: "auto" | "always" | "scroll" | "hover";
  scrollHideDelay?: number;
  dir?: "ltr" | "rtl";
  nonce?: string;
  children?: ReactNode;
  className?: string;
  forceMount?: true | undefined;
  orientation?: "horizontal" | "vertical";
}

export const ScrollArea: FC<ScrollAreaProps> = ({
  type,
  scrollHideDelay,
  dir,
  nonce,
  children,
  className,
  forceMount,
  orientation,
}) => (
  <Primitive.Root
    className={clsx(className)}
    type={type}
    scrollHideDelay={scrollHideDelay}
    dir={dir}
    nonce={nonce}
  >
    <Primitive.Viewport className="size-full rounded">
      {children}
    </Primitive.Viewport>
    <Primitive.Scrollbar
      className="flex touch-none select-none bg-transparent p-0.5 transition-colors duration-[160ms] ease-out hover:bg-transparent data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
      forceMount={forceMount}
      orientation={orientation}
    >
      <Primitive.Thumb className="relative flex-1 rounded-[10px] bg-[#7C7A85] before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-11 before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2" />
    </Primitive.Scrollbar>
    <Primitive.Corner className="bg-transparent" />
  </Primitive.Root>
);
