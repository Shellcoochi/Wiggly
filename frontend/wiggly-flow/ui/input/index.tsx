"use client";

import * as React from "react";
import { clsx } from "clsx";

interface CustomInputProps {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  clearable?: boolean;
  onClear?: () => void;
  inputType?: "text" | "password" | "textarea";
  className?: string;
}

export type InputChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement
>;

type InputProps = CustomInputProps &
  Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "type" | "onChange" | "onBlur"
  > & {
    onChange?: (
      e: InputChangeEvent
    ) => void;
    onBlur?: (
      e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
  };

export const Input = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>(
  (
    {
      prefix,
      suffix,
      clearable = false,
      onClear,
      size = "md",
      inputType = "text",
      className,
      value,
      onChange,
      onBlur,
      disabled,
      ...props
    },
    ref
  ) => {
    const showClear =
      clearable &&
      value &&
      value.toString().length > 0 &&
      !disabled &&
      inputType !== "textarea";

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onClear) onClear();
      if (onChange) {
        const event = {
          ...e,
          target: { ...e.target, value: "" },
        } as unknown as React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement
        >;
        onChange(event);
      }
    };

    const baseWrapperClass = clsx(
      "flex items-center w-full border rounded-md bg-white transition",
      "focus-within:ring-1 focus-within:ring-[#1677ff] focus-within:border-[#1677ff]",
      "border-[#d9d9d9] hover:border-[#4096ff]",
      "disabled:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-60",
      {
        "h-8 text-sm px-2": size === "sm" && inputType !== "textarea",
        "h-10 text-base px-3": size === "md" && inputType !== "textarea",
        "h-12 text-lg px-4": size === "lg" && inputType !== "textarea",
        "px-3 py-2": inputType === "textarea",
      },
      className
    );

    const sharedInputClass = clsx(
      "flex-1 bg-transparent outline-none resize-none placeholder:text-[#bfbfbf]",
      "disabled:cursor-not-allowed"
    );

    return (
      <div className={baseWrapperClass}>
        {prefix && (
          <span className="mr-2 text-[#bfbfbf] flex items-center">
            {prefix}
          </span>
        )}
        {inputType === "textarea" ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            value={value as string}
            onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
            onBlur={onBlur as React.FocusEventHandler<HTMLTextAreaElement>}
            disabled={disabled}
            className={sharedInputClass}
            rows={3}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            type={inputType}
            value={value as string}
            onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
            onBlur={onBlur as React.FocusEventHandler<HTMLInputElement>}
            disabled={disabled}
            className={sharedInputClass}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {showClear && (
          <button
            type="button"
            onClick={handleClear}
            tabIndex={-1}
            className="ml-2 text-[#bfbfbf] hover:text-[#595959]"
          >
            <i className="ri-close-line" />
          </button>
        )}
        {suffix && (
          <span className="ml-2 text-[#bfbfbf] flex items-center">
            {suffix}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
