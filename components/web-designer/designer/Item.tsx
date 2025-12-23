import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";
import { IconGripVertical, IconX } from "@tabler/icons-react";

export interface Props {
  dragOverlay?: boolean;
  color?: string;
  disabled?: boolean;
  dragging?: boolean;
  handle?: boolean;
  handleProps?: any;
  height?: number;
  index?: number;
  fadeIn?: boolean;
  transform?: Transform | null;
  listeners?: DraggableSyntheticListeners;
  sorting?: boolean;
  style?: React.CSSProperties;
  transition?: string | null;
  wrapperStyle?: React.CSSProperties;
  value: React.ReactNode;
  onRemove?(): void;
  renderItem?(args: {
    dragOverlay: boolean;
    dragging: boolean;
    sorting: boolean;
    index: number | undefined;
    fadeIn: boolean;
    listeners: DraggableSyntheticListeners;
    ref: React.Ref<HTMLElement>;
    style: React.CSSProperties | undefined;
    transform: Props["transform"];
    transition: Props["transition"];
    value: Props["value"];
  }): React.ReactElement;
}

export const Item = React.memo(
  React.forwardRef<HTMLLIElement, Props>(
    (
      {
        color,
        dragOverlay,
        dragging,
        disabled,
        fadeIn,
        handle,
        handleProps,
        height,
        index,
        listeners,
        onRemove,
        renderItem,
        sorting,
        style,
        transition,
        transform,
        value,
        wrapperStyle,
        ...props
      },
      ref
    ) => {
      useEffect(() => {
        if (!dragOverlay) {
          return;
        }

        document.body.style.cursor = "grabbing";

        return () => {
          document.body.style.cursor = "";
        };
      }, [dragOverlay]);

      return renderItem ? (
        // eslint-disable-next-line react-hooks/refs
        renderItem({
          dragOverlay: Boolean(dragOverlay),
          dragging: Boolean(dragging),
          sorting: Boolean(sorting),
          index,
          fadeIn: Boolean(fadeIn),
          listeners: listeners!,
          ref: ref as React.Ref<HTMLElement>,
          style,
          transform: transform || null,
          transition: transition || null,
          value,
        })
      ) : (
        <li
          className={cn(
            "flex box-border touch-manipulation will-change-transform transform-gpu",
            fadeIn && "animate-in fade-in duration-500",
            sorting && "relative z-10",
            dragOverlay && "z-[999] cursor-grabbing"
          )}
          style={{
            ...wrapperStyle,
            transition: [transition, wrapperStyle?.transition]
              .filter(Boolean)
              .join(", "),
            transform: transform
              ? `translate3d(${Math.round(transform.x)}px, ${Math.round(
                  transform.y
                )}px, 0) scaleX(${transform.scaleX || 1}) scaleY(${
                  transform.scaleY || 1
                })`
              : undefined,
            transformOrigin: "0 0",
            // "--index": index,
            // "--color": color,
          }}
          ref={ref}
        >
          <div
            className={cn(
              "relative flex flex-grow items-center px-5 py-4",
              "bg-white shadow-sm border rounded-md",
              "outline-none list-none whitespace-nowrap",
              "text-gray-800 text-base font-normal",
              "transition-shadow duration-200 ease-[cubic-bezier(0.18,0.67,0.6,1.22)]",
              "select-none",
              dragging && !dragOverlay && "opacity-50 z-0",
              dragOverlay && [
                "cursor-grabbing shadow-lg",
                "animate-in zoom-in-105 duration-200",
                "shadow-[0_0_0_calc(1px/var(--scale-x,1))_rgba(63,63,68,0.05),-1px_0_15px_0_rgba(34,33,81,0.01),0px_15px_15px_0_rgba(34,33,81,0.25)]",
              ],
              !handle && "cursor-grab",
              disabled && ["text-gray-400 bg-gray-100 cursor-not-allowed"],
              color && "pl-6" // 为颜色条留出空间
            )}
            style={{
              ...style,
              ...(dragOverlay && {
                boxShadow: "0 0px 6px 2px #4c9ffe",
              }),
            }}
            data-cypress="draggable-item"
            {...(!handle ? listeners : undefined)}
            {...props}
            tabIndex={!handle ? 0 : undefined}
          >
            {color && (
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-full rounded-l-md"
                style={{ backgroundColor: color }}
              />
            )}

            {value}

            <div className="flex ml-auto -mt-3 -mb-3 -mr-2">
              {onRemove ? (
                <button
                  onClick={onRemove}
                  className="p-1.5 -my-1.5 -mr-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-md opacity-0 hover:opacity-100 focus:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label="Remove item"
                >
                  <IconX className="w-4 h-4" />
                </button>
              ) : null}
              {handle ? (
                <button
                  className="p-2 -my-2 -ml-2 text-gray-400 hover:text-gray-600 transition-colors rounded-md cursor-grab touch-none opacity-0 hover:opacity-100 focus:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label="Drag handle"
                  {...handleProps}
                  {...listeners}
                >
                  <IconGripVertical className="w-4 h-4" />
                </button>
              ) : null}
            </div>
          </div>
        </li>
      );
    }
  )
);

Item.displayName = "Item";
