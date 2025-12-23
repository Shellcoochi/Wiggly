"use client";

import { ReactNode } from "react";
import { Draggable } from "./draggable";
import { DragOverlay } from "@dnd-kit/core";

interface MaterialItemProps {
  id: string;
  label?: string;
  icon?: ReactNode;
}

export const MaterialItem = ({ id }: MaterialItemProps) => {
  return (
    <Draggable id={id} overlay={true}>
      <div>
        <svg width="200" height="60" viewBox="0 0 200 60">
          <rect x="10" y="10" width="180" height="40" rx="10" fill="#6C63FF" />
          <text
            x="50%"
            y="50%"
            fontSize="20"
            fill="white"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            组件
          </text>
        </svg>
      </div>
    </Draggable>
  );
};
