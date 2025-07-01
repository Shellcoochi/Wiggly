import { FC, ReactNode } from "react";
import { Tooltip as Primitive } from "radix-ui";

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
}

export const Tooltip: FC<TooltipProps> = ({ children, content }) => {
  return (
    <Primitive.Provider>
      <Primitive.Root>
        <Primitive.Trigger>{children}</Primitive.Trigger>
        <Primitive.Portal>
          <Primitive.Content
            className="z-1005 select-none rounded bg-white px-[15px] py-2.5 text-[15px] leading-none text-violet11 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade"
            sideOffset={5}
          >
            {content}
            <Primitive.Arrow className="fill-white" />
          </Primitive.Content>
        </Primitive.Portal>
      </Primitive.Root>
    </Primitive.Provider>
  );
};
