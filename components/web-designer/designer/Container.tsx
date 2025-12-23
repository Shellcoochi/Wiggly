import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { IconGripVertical, IconX } from '@tabler/icons-react';

export interface Props {
  children: React.ReactNode;
  columns?: number;
  label?: string;
  style?: React.CSSProperties;
  horizontal?: boolean;
  hover?: boolean;
  handleProps?: React.HTMLAttributes<any>;
  scrollable?: boolean;
  shadow?: boolean;
  placeholder?: boolean;
  unstyled?: boolean;
  onClick?(): void;
  onRemove?(): void;
}

export const Container = forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      columns = 1,
      handleProps,
      horizontal,
      hover,
      onClick,
      onRemove,
      label,
      placeholder,
      style,
      scrollable,
      shadow,
      unstyled,
      ...props
    }: Props,
    ref:any
  ) => {
    const Component = onClick ? 'button' : 'div';

    return (
      <Component
        {...props}
        ref={ref}
        style={
          {
            ...style,
            '--columns': columns,
          } as React.CSSProperties
        }
        className={cn(
          'p-2.5 border border-gray-200 rounded-md bg-white/50 min-h-16',
          !unstyled && [
            'transition-shadow duration-200',
            horizontal ? 'inline-flex' : 'flex flex-col',
            scrollable && 'overflow-auto',
            shadow && 'shadow-md',
            hover && 'hover:bg-gray-50 hover:border-gray-300',
            placeholder && 'border-dashed bg-gray-50 border-2 border-gray-300',
          ],
          onClick && 'cursor-pointer hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
        )}
        onClick={onClick}
        tabIndex={onClick ? 0 : undefined}
      >
        {label ? (
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <div className="flex items-center gap-1">
              {onRemove && (
                <button
                  onClick={onRemove}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  aria-label="Remove container"
                >
                  <IconX className="w-4 h-4" />
                </button>
              )}
              <button
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded cursor-grab touch-none hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Drag container"
                {...handleProps}
              >
                <IconGripVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : null}
        {placeholder ? (
          children
        ) : (
          <ul className={cn(
            'flex flex-col gap-2 p-0 m-0 list-none',
            horizontal && 'flex-row',
            scrollable && 'flex-1 overflow-auto',
            'grid-cols-[--columns]',
            horizontal ? 'grid grid-rows-1 auto-cols-max' : 'grid',
            horizontal ? 'grid-flow-col' : 'grid-flow-row',
            horizontal && scrollable && 'overflow-x-auto',
            !horizontal && scrollable && 'overflow-y-auto'
          )}>
            {children}
          </ul>
        )}
      </Component>
    );
  }
);

Container.displayName = 'Container';