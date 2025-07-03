"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { clsx } from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "default",
      size = "md",
      asChild = false,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={clsx(
          "cursor-pointer inline-flex items-center justify-center font-medium transition-all select-none whitespace-nowrap outline-none disabled:opacity-60 disabled:cursor-not-allowed rounded-md",
          {
            "bg-primary text-white hover:bg-[#4096ff] active:bg-[#0958d9]":
              variant === "default",
            "border border-[#d9d9d9] bg-white text-black hover:border-[#4096ff] hover:text-[#1677ff] hover:bg-[#e6f4ff]":
              variant === "outline",
            "bg-transparent text-black hover:bg-[#f5f5f5] active:bg-[#e6f4ff]":
              variant === "ghost",
            "bg-[#ff4d4f] text-white hover:bg-[#ff7875] active:bg-[#d9363e]":
              variant === "destructive",
          },
          {
            "h-7 px-3 text-xs": size === "sm",
            "h-9 px-4 text-sm": size === "md",
            "h-11 px-5 text-base": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";
