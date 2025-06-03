import { FC, useState } from "react";
import { DropdownMenu as Primitive } from "radix-ui";
import { Icon } from "../icon";

type MenuItemBase = {
  type: "item" | "checkbox" | "radio" | "separator" | "label" | "submenu";
  label?: string;
  value?: string;
  shortcut?: string;
  disabled?: boolean;
};

type ItemOption = MenuItemBase & {
  type: "item";
  onSelect?: () => void;
};

type CheckboxOption = MenuItemBase & {
  type: "checkbox";
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
};

type RadioOption = MenuItemBase & {
  type: "radio";
  value: string;
};

type LabelOption = MenuItemBase & {
  type: "label";
};

type SeparatorOption = MenuItemBase & {
  type: "separator";
};

type SubmenuOption = MenuItemBase & {
  type: "submenu";
  children: DropdownOption[];
};

export type DropdownOption =
  | ItemOption
  | CheckboxOption
  | RadioOption
  | LabelOption
  | SeparatorOption
  | SubmenuOption;

interface DropdownMenuProps {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  dir?: "ltr" | "rtl";
  children?: React.ReactNode;
  options: DropdownOption[];
  onItemClick?: (val: DropdownOption) => void;
  radioGroup?: {
    value: string;
    onValueChange: (val: string) => void;
  };
}

export const DropdownMenu: FC<DropdownMenuProps> = ({
  defaultOpen,
  open,
  onOpenChange,
  modal,
  dir,
  children,
  options,
  radioGroup,
  onItemClick,
}) => {
  const renderOption = (option: DropdownOption, index: number) => {
    switch (option.type) {
      case "item":
        return (
          <Primitive.Item
            key={index}
            disabled={option.disabled}
            onSelect={option.onSelect}
            onClick={() => onItemClick?.(option)}
            className="group relative flex h-[25px] select-none items-center rounded px-2 text-sm text-gray-800 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-blue-500 data-[highlighted]:text-white data-[disabled]:text-gray-400"
          >
            {option.label}
            {option.shortcut && (
              <div className="ml-auto pl-5 text-gray-400 group-data-[highlighted]:text-white">
                {option.shortcut}
              </div>
            )}
          </Primitive.Item>
        );
      case "checkbox":
        return (
          <Primitive.CheckboxItem
            key={index}
            checked={option.checked}
            onCheckedChange={option.onCheckedChange}
            onClick={() => onItemClick?.(option)}
            className="group relative flex h-[25px] select-none items-center rounded px-2 text-sm pl-[25px] text-gray-800 outline-none data-[highlighted]:bg-blue-500 data-[highlighted]:text-white"
          >
            <Primitive.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
              <Icon name="ri-check-line" />
            </Primitive.ItemIndicator>
            {option.label}
          </Primitive.CheckboxItem>
        );
      case "radio":
        return (
          <Primitive.RadioItem
            key={index}
            value={option.value}
            onClick={() => onItemClick?.(option)}
            className="relative flex h-[25px] select-none items-center rounded px-2 text-sm pl-[25px] text-gray-800 outline-none data-[highlighted]:bg-blue-500 data-[highlighted]:text-white"
          >
            <Primitive.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
              <Icon name="dot" />
            </Primitive.ItemIndicator>
            {option.label}
          </Primitive.RadioItem>
        );
      case "separator":
        return (
          <Primitive.Separator key={index} className="m-1 h-px bg-gray-200" />
        );
      case "label":
        return (
          <Primitive.Label
            key={index}
            className="pl-[25px] text-xs leading-[25px] text-gray-500"
            onClick={() => onItemClick?.(option)}
          >
            {option.label}
          </Primitive.Label>
        );
      case "submenu":
        return (
          <Primitive.Sub key={index}>
            <Primitive.SubTrigger className="group relative flex h-[25px] select-none items-center rounded px-2 text-sm text-gray-800 outline-none data-[highlighted]:bg-blue-500 data-[highlighted]:text-white data-[state=open]:bg-gray-100 data-[state=open]:text-gray-800">
              {option.label}
              <div className="ml-auto pl-5 text-gray-400 group-data-[highlighted]:text-white">
                <Icon name="ri-arrow-right-s-line" />
              </div>
            </Primitive.SubTrigger>
            <Primitive.Portal>
              <Primitive.SubContent className="min-w-[220px] rounded-md bg-white p-1 shadow-lg ring-1 ring-black/10">
                {option.children.map(renderOption)}
              </Primitive.SubContent>
            </Primitive.Portal>
          </Primitive.Sub>
        );
      default:
        return null;
    }
  };

  return (
    <Primitive.Root
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      modal={modal}
      dir={dir}
    >
      <Primitive.Trigger asChild>
        {children ?? (
          <button
            className="inline-flex size-[35px] items-center justify-center rounded-full bg-white text-gray-800 shadow-md outline-none hover:bg-gray-100"
            aria-label="Customise options"
          >
            <Icon name="ri-menu-line" />
          </button>
        )}
      </Primitive.Trigger>

      <Primitive.Portal>
        <Primitive.Content
          className="rounded-md bg-white p-1 shadow-lg ring-1 ring-black/10"
          sideOffset={5}
        >
          {radioGroup ? (
            <Primitive.RadioGroup
              value={radioGroup.value}
              onValueChange={radioGroup.onValueChange}
            >
              {options.map(renderOption)}
            </Primitive.RadioGroup>
          ) : (
            options.map(renderOption)
          )}
          <Primitive.Arrow className="fill-white" />
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  );
};
