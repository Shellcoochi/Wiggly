"use client";

import {
  ComponentPropsWithoutRef,
  ComponentRef,
  FC,
  forwardRef,
  ReactNode,
} from "react";
import { Select as Primitive } from "radix-ui";
import { clsx } from "clsx";
import { Icon } from "../icon";

export interface SelectOptionItemProps {
  value: string;
  key?: string;
  label?: ReactNode;
  children?: SelectOptionItemProps[];
}

interface SelectProps {
  options: SelectOptionItemProps[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  dir?: "ltr" | "rtl";
  name?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
}

export const Select: FC<SelectProps> = ({
  placeholder,
  value,
  defaultValue,
  onValueChange,
  disabled,
  required,
  options,
}) => (
  <Primitive.Root
    value={value}
    defaultValue={defaultValue}
    onValueChange={onValueChange}
    disabled={disabled}
    required={required}
  >
    <Primitive.Trigger
      className={clsx(
        "inline-flex h-9 items-center justify-between gap-2",
        "px-3 rounded border border-border bg-white",
        "text-sm text-text-primary placeholder:text-text-disabled",
        "shadow-sm hover:border-border-hover hover:shadow focus:outline-none focus:border-border-focus focus:ring-1 focus:ring-ring",
        "transition-all"
      )}
    >
      <Primitive.Value placeholder={placeholder} />
      <Primitive.Icon>
        <Icon name="ri-arrow-down-s-line" />
      </Primitive.Icon>
    </Primitive.Trigger>

    <Primitive.Portal>
      <Primitive.Content
        className={clsx(
          "z-50 overflow-hidden rounded border border-border bg-white shadow-lg",
          "animate-in fade-in zoom-in-95"
        )}
      >
        <Primitive.ScrollUpButton className="flex h-[25px] cursor-default items-center justify-center bg-white text-violet11">
          <Icon name="ri-arrow-up-s-line" />
        </Primitive.ScrollUpButton>

        <Primitive.Viewport className="p-1">
          {options?.map((opt, i) => {
            const { label, value, children, key } = opt;
            if (children) {
              return (
                <div key={key ?? value}>
                  <Primitive.Group>
                    <Primitive.Label className="px-3 py-1 text-xs text-secondary">
                      {label ?? value}
                    </Primitive.Label>
                    {children.map((child) => (
                      <SelectItem
                        key={child.key ?? child.value}
                        value={child.value}
                      >
                        {child.label ?? child.value}
                      </SelectItem>
                    ))}
                  </Primitive.Group>
                  {i < options.length - 1 ? (
                    <Primitive.Separator className="my-1 h-px bg-border-secondary" />
                  ) : null}
                </div>
              );
            } else {
              return (
                <SelectItem key={opt.key ?? opt.value} value={opt.value}>
                  {opt.label ?? opt.value}
                </SelectItem>
              );
            }
          })}
        </Primitive.Viewport>

        <Primitive.ScrollDownButton className="flex h-8 items-center justify-center text-secondary bg-white">
          <Icon name="ri-arrow-down-s-line" />
        </Primitive.ScrollDownButton>
      </Primitive.Content>
    </Primitive.Portal>
  </Primitive.Root>
);

interface SelectItemProps
  extends ComponentPropsWithoutRef<typeof Primitive.Item> {
  children: ReactNode;
  className?: string;
}

const SelectItem = forwardRef<
  ComponentRef<typeof Primitive.Item>,
  SelectItemProps
>(({ children, className, ...props }, ref) => {
  return (
    <Primitive.Item
      ref={ref}
      {...props}
      className={clsx(
        "relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px]",
        "leading-none text-violet11 ",
        "data-[disabled]:pointer-events-none",
        "data-[highlighted]:bg-primary",
        "data-[disabled]:text-text-disabled",
        "data-[highlighted]:text-primary-light data-[highlighted]:outline-none",
        className
      )}
    >
      <Primitive.ItemText>{children}</Primitive.ItemText>
      <Primitive.ItemIndicator className="absolute left-1 flex w-4 items-center justify-center text-primary">
        <Icon name="ri-check-line" />
      </Primitive.ItemIndicator>
    </Primitive.Item>
  );
});
SelectItem.displayName = "SelectItem";
