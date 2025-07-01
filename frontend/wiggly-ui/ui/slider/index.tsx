import { FC } from "react";
import { Slider as Primitive } from "radix-ui";
import clsx from "clsx";

interface SliderProps {
  className?: string;
  defaultValue?: number[];
  value?: number[];
  onValueChange?: (value: number[]) => void;
  onValueCommit?: (value: number[]) => void;
  name?: string;
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
  dir?: "ltr" | "rtl";
  inverted?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export const Slider: FC<SliderProps> = (props) => (
  <Primitive.Root
    className={clsx(
      "relative flex h-5 w-full touch-none select-none items-center"
    )}
    {...props}
  >
    <Primitive.Track className="relative h-[3px] grow rounded-full bg-text-disabled">
      <Primitive.Range className="absolute h-full rounded-full bg-primary" />
    </Primitive.Track>
    <Primitive.Thumb
      className="block size-5 rounded-[10px] bg-white shadow-[0_2px_4px] shadow-primary-active hover:bg-primary-light focus:shadow-[0_0_0_3px] focus:shadow-primary-active focus:outline-none"
      aria-label="Volume"
    />
  </Primitive.Root>
);
