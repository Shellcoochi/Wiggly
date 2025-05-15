'use client';

import * as React from 'react';
import { clsx } from 'clsx';

interface CustomInputProps {
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    clearable?: boolean;
    onClear?: () => void;
    className?: string;
}

type InputProps = CustomInputProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      prefix,
      suffix,
      clearable = false,
      onClear,
      size = 'md',
      className,
      value,
      onChange,
      onBlur,
      disabled,
      ...props
    },
    ref
  ) => {
    const showClear = clearable && value && value.toString().length > 0 && !disabled;

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onClear) onClear();
      if (onChange) {
        const event = {
          ...e,
          target: { ...e.target, value: '' },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    };

    return (
      <div
        className={clsx(
          'flex items-center w-full border rounded-md bg-white transition focus-within:ring-1 focus-within:ring-[#1677ff] focus-within:border-[#1677ff]',
          'border-[#d9d9d9] hover:border-[#4096ff]',
          'disabled:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-60',
          {
            'h-8 text-sm px-2': size === 'sm',
            'h-10 text-base px-3': size === 'md',
            'h-12 text-lg px-4': size === 'lg',
          },
          className
        )}
      >
        {prefix && <span className="mr-2 text-[#bfbfbf] flex items-center">{prefix}</span>}
        <input
          ref={ref}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={clsx(
            'flex-1 bg-transparent outline-none placeholder:text-[#bfbfbf]',
            'disabled:cursor-not-allowed'
          )}
          {...props}
        />
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
        {suffix && <span className="ml-2 text-[#bfbfbf] flex items-center">{suffix}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
