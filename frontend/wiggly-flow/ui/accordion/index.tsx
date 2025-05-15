"use client";

import * as React from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { clsx } from "clsx";

type BaseProps = {
  className?: string;
  bordered?: boolean;
  ghost?: boolean;
  children: React.ReactNode;
};

interface AccordionItemProps
  extends AccordionPrimitive.AccordionItemProps {
  className?: string;
  header: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
}

type AccordionSingleProps = {
  type: "single";
} & AccordionPrimitive.AccordionSingleProps &
  BaseProps;

type AccordionMultipleProps = {
  type: "multiple";
} & AccordionPrimitive.AccordionMultipleProps &
  BaseProps;

type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

export const Accordion = (props: AccordionProps) => {
  const {
    className,
    bordered = true,
    ghost = false,
    children,
    ...rest
  } = props;

  const baseClass = clsx(
    "w-full rounded-md",
    bordered && "border border-[#f0f0f0]",
    ghost && "bg-transparent",
    className
  );

  if (props.type === "single") {
    const { type, ...singleProps } = rest as AccordionSingleProps;
    return (
      <AccordionPrimitive.Root
        type="single"
        className={baseClass}
        {...singleProps}
      >
        {children}
      </AccordionPrimitive.Root>
    );
  } else {
    const { type, ...multipleProps } = rest as AccordionMultipleProps;
    return (
      <AccordionPrimitive.Root
        type="multiple"
        className={baseClass}
        {...multipleProps}
      >
        {children}
      </AccordionPrimitive.Root>
    );
  }
};

export const AccordionItem = React.forwardRef<
  HTMLDivElement,
  AccordionItemProps
>(({ className, header, children, disabled = false, ...props }, ref) => {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      disabled={disabled}
      className={clsx(
        "border-b border-[#f0f0f0] last:border-none",
        "bg-white",
        className
      )}
      {...props}
    >
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger
          className={clsx(
            "group w-full px-4 py-3 flex items-center justify-between text-left",
            "text-[16px] text-[#1f1f1f] font-medium hover:bg-[#f5f5f5]",
            "transition-all disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          <span>{header}</span>
          <i className="ri-arrow-down-s-line ml-2 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content
        className={clsx(
          "px-4 pb-4 text-[#595959] text-sm leading-relaxed",
          "data-[state=closed]:animate-accordion-up",
          "data-[state=open]:animate-accordion-down"
        )}
      >
        {children}
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
});
AccordionItem.displayName = "AccordionItem";
