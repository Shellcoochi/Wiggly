"use client";

import { Toggle as Primitive } from "radix-ui";
import { ReactNode, forwardRef } from "react";
import { clsx } from "clsx";

type ToggleProps = {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
  size?: "small" | "medium" | "large";
  className?: string;
};

const sizeMap = {
  small: "h-[24px] px-2 text-xs",
  medium: "h-9 px-3 text-sm",
  large: "h-[40px] px-4 text-base",
};

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      pressed,
      defaultPressed,
      onPressedChange,
      disabled,
      icon,
      children,
      size = "medium",
      className,
    },
    ref
  ) => {
    return (
      <Primitive.Root
        ref={ref}
        pressed={pressed}
        defaultPressed={defaultPressed}
        onPressedChange={onPressedChange}
        disabled={disabled}
        aria-label="Toggle"
        className={clsx(
          "border-[#d9d9d9] inline-flex items-center justify-center rounded-[var(--radius)] border text-[var(--color-text-secondary)] bg-[var(--color-bg-base)]",
          "hover:bg-[var(--color-primary-light)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]",
          "data-[state=on]:bg-[var(--color-primary)] data-[state=on]:text-[var(--color-bg-base)] data-[state=on]:border-[var(--color-primary)]",
          "disabled:bg-[var(--color-border-secondary)] disabled:text-[var(--color-text-disabled)] disabled:cursor-not-allowed",
          "transition-all duration-150 shadow-sm",
          sizeMap[size],
          className
        )}
      >
        {icon && <span className="mr-1">{icon}</span>}
        {children}
      </Primitive.Root>
    );
  }
);
