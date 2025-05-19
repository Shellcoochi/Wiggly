import * as React from "react";
import { Switch as Primitive } from "radix-ui";

export const Switch = () => (
  <Primitive.Root
    className="relative h-[25px] w-[42px] cursor-default rounded-full bg-base border border-border outline-none  focus:border-border-focus data-[state=checked]:bg-primary"
  >
    <Primitive.Thumb className="block size-[21px] translate-x-0.5 rounded-full bg-white  border-border transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
  </Primitive.Root>
);
