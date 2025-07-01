import { FC } from "react";
import { Switch as Primitive } from "radix-ui";

interface SwitchProps {
  defaultChecked?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
}

export const Switch: FC<SwitchProps> = (props) => (
  <Primitive.Root
    className="relative h-[25px] w-[42px] cursor-default rounded-full bg-text-disabled border border-border outline-none  focus:border-border-focus data-[state=checked]:bg-primary"
    {...props}
  >
    <Primitive.Thumb className="block size-[21px] translate-x-0.5 rounded-full bg-white  border-border transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
  </Primitive.Root>
);
