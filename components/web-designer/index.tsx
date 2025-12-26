"use client";

import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import type { UniqueIdentifier, DragStartEvent } from "@dnd-kit/core";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface Node {
  id: UniqueIdentifier;
  componentName: string;
}

const meterials: Node[] = [
  { id: "a", componentName: "a" },
  { id: "b", componentName: "b" },
  { id: "c", componentName: "c" },
];

export function Designer() {
  const [activeId, setActiveId] = useState<UniqueIdentifier>();
  const [nodes, setNodes] = useState<Node[]>(meterials);

  const nodeIds: UniqueIdentifier[] = useMemo(() => {
    return nodes.map((node) => node.id);
  }, [nodes]);

  const activeIndex = activeId != null ? nodeIds.indexOf(activeId) : -1;

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id);
  };

  const handleDragEnd = () => {
    setActiveId(undefined);
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <SortableContext items={nodeIds}>
        <div className="flex space-x-2">
          {/* <Droppable id="box">
            <Draggable id="e">e</Draggable>
            <Draggable id="f">f</Draggable>
          </Droppable> */}
          {nodes.map((node, index) => (
            <Draggable
              key={node.id}
              index={index}
              activeIndex={activeIndex}
              id={node.id}
            >
              {node.componentName}
            </Draggable>
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeId ? (
         <Button>组件</Button>
        ): null}
      </DragOverlay>
    </DndContext>
  );
}

function Droppable(props: { id: string; children: React.ReactNode }) {
  const { id, children } = props;
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id,
  });

  const style = transform
    ? {
        transform: `translate3d(${Math.round(transform.x)}px, ${Math.round(
          transform.y
        )}px, 0)`,
        transformOrigin: "0 0",
        transition: "transform 0.2s ease",
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="w-25 h-40 bg-accent"
    >
      <SortableContext items={["e", "f"]}>{children}</SortableContext>
    </div>
  );
}

function Draggable(props: {
  id: UniqueIdentifier;
  index?: number;
  activeIndex?: number;
  children: React.ReactNode;
}) {
  const { id, children } = props;
  const { attributes, listeners, setNodeRef, over, transform, isSorting } =
    useSortable({
      id,
    });

  const isOver = over?.id === id;

  const style = transform
    ? {
        transform: isSorting ? undefined : CSS.Translate.toString(transform),
      }
    : undefined;

  // overIndex > activeIndex
  //         ? Position.After
  //         : Position.Before
  return (
    <Button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "relative m-2 ",
        {
          "before:content-[''] before:absolute before:-left-0.5 before:h-full before:w-1 before:bg-blue-500 before:rounded-sm":
            isOver,
        }
        // "before:content-[''] before:absolute before:-right-0.5  before:h-full before:w-1 before:bg-blue-500 before:rounded-sm",
        // "before:content-[''] before:absolute before:-top-0.5 before:h-1 before:w-full before:bg-blue-500 before:rounded-sm",
        // "before:content-[''] before:absolute before:-bottom-0.5 before:h-1 before:w-full before:bg-blue-500 before:rounded-sm"
      )}
    >
      {children}
    </Button>
  );
}
