import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import type { DraggableSyntheticListeners } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";

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
  renderItem(args: {
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
  React.forwardRef<any, Props>(
    (
      {
        dragOverlay,
        dragging,
        fadeIn,
        index,
        listeners,
        renderItem,
        sorting,
        style,
        transition,
        transform,
        value,
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

      return (
        <div
          ref={ref}
          className={cn(
            "flex box-border touch-manipulation will-change-transform transform-gpu",
            fadeIn && "animate-in fade-in duration-500",
            sorting && "relative z-10",
            dragOverlay && "z-999 cursor-grabbing"
          )}
          style={{
            transition: String(transition),
            transform: transform
              ? `translate3d(${Math.round(transform.x)}px, ${Math.round(
                  transform.y
                )}px, 0) scaleX(${transform.scaleX || 1}) scaleY(${
                  transform.scaleY || 1
                })`
              : undefined,
            transformOrigin: "0 0",
          }}
        >
          {renderItem({
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
          })}
        </div>
      );
    }
  )
);

Item.displayName = "Item";
