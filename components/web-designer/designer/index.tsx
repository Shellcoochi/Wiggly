"use client";

import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useState } from "react";
import useMounted from "@/hooks/use-mounted";
import { Droppable } from "./droppable";
import { MaterialItem } from "./material-item";
import { MultipleContainers } from "./designer";
import { rectSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";

export function Designer() {
  const isMounted = useMounted();
  const [parent, setParent] = useState(null);

  if (!isMounted) {
    return null; // 在客户端渲染前不返回任何内容
  }

  return (
    <MultipleContainers
      columns={2}
      strategy={rectSortingStrategy}
      renderItem={({ listeners, ref, value }: any) => (
        <Button ref={ref} {...listeners}>
          {value}
        </Button>
      )}
      // wrapperStyle={() => ({
      //   width: 150,
      //   height: 150,
      // })}
    />
  );

  const draggable = <MaterialItem id="draggable" />;

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex">
        <div className="basis-3xs border border-l-border">
          {!parent ? draggable : null}
        </div>
        <div className="flex-1">
          <Droppable id="droppable">
            {parent === "droppable" ? draggable : "Drop here"}
          </Droppable>
        </div>
      </div>
      <DragOverlay>
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
      </DragOverlay>
    </DndContext>
  );

  function handleDragEnd({ over }: any) {
    setParent(over ? over.id : null);
  }
}
