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
            size = 'md',
            clearable = false,
            onClear,
            className,
            value,
            onChange,
            ...props
        },
        ref
    ) => {
        const showClear = clearable && value && value.toString().length > 0;

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
                    'flex items-center rounded-md border bg-white ring-offset-white focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2',
                    {
                        'h-8 px-2 text-sm': size === 'sm',
                        'h-10 px-3 text-base': size === 'md',
                        'h-12 px-4 text-lg': size === 'lg',
                    },
                    className
                )}
            >
                {prefix && <span className="mr-2 text-gray-500">{prefix}</span>}
                <input
                    ref={ref}
                    value={value}
                    onChange={onChange}
                    className="flex-1 bg-transparent outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                    {...props}
                />
                {showClear && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                        tabIndex={-1}
                    >
                        <i className="ri-close-line" />
                    </button>
                )}
                {suffix && <span className="ml-2 text-gray-500">{suffix}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';
