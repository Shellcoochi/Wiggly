"use client";

import {
  DndContext,
  DragOverlay,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { snapCenterToCursor } from "@dnd-kit/modifiers";

/* ================= 数据模型 ================= */

interface Node {
  id: UniqueIdentifier;
  componentName: string;
  isContainer?: boolean;
  children?: Node[];
}

const materials: Node[] = [
  { id: "a", componentName: "a" },
  { id: "b", componentName: "b" },
  { id: "c", componentName: "c" },
  {
    id: "box",
    componentName: "box",
    isContainer: true,
    children: [
      { id: "e", componentName: "e" },
      { id: "f", componentName: "f" },
    ],
  },
];

/* ================= Designer ================= */

export function Designer() {
  const [nodes, setNodes] = useState<Node[]>(materials);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const rootIds = useMemo(() => nodes.map((n) => n.id), [nodes]);

  const findNodeById = (id: UniqueIdentifier): Node | null => {
    for (const n of nodes) {
      if (n.id === id) return n;
      const child = n.children?.find((c) => c.id === id);
      if (child) return child;
    }
    return null;
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeParent = active.data.current?.parentId;
    const overParent = over.data.current?.parentId;

    /* ===== 根节点排序（a / b / c / box） ===== */
    if (!activeParent && !overParent) {
      const oldIndex = nodes.findIndex((n) => n.id === active.id);
      const newIndex = nodes.findIndex((n) => n.id === over.id);

      if (oldIndex !== newIndex) {
        setNodes(arrayMove(nodes, oldIndex, newIndex));
      }
    }

    /* ===== 容器内部排序 ===== */
    if (activeParent && activeParent === overParent) {
      setNodes((prev) =>
        prev.map((node) => {
          if (node.id !== activeParent) return node;

          const oldIndex = node.children!.findIndex(
            (c) => c.id === active.id
          );
          const newIndex = node.children!.findIndex(
            (c) => c.id === over.id
          );

          return {
            ...node,
            children: arrayMove(node.children!, oldIndex, newIndex),
          };
        })
      );
    }

    setActiveId(null);
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={rootIds}>
        <div className="flex space-x-4">
          {nodes.map((node) => (
            <SortableNode key={node.id} node={node} />
          ))}
        </div>
      </SortableContext>

      <DragOverlay dropAnimation={null} modifiers={[snapCenterToCursor]}>
        {activeId ? (
          <Button variant="secondary">
            {findNodeById(activeId)?.componentName}
          </Button>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

/* ================= 根节点（元素 / 容器） ================= */

function SortableNode({ node }: { node: Node }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    isSorting,
    over,
    active,
  } = useSortable({
    id: node.id,
  });

  const activeIndex = active?.data.current?.sortable.index;
  const overIndex = over?.data.current?.sortable.index;

  const insertPosition =
    activeIndex != null && overIndex != null && overIndex > activeIndex
      ? "right"
      : "left";

  const style = transform
    ? { transform: isSorting ? undefined : CSS.Translate.toString(transform) }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "relative rounded-md bg-accent p-2",
        over?.id === node.id &&
          active?.id !== node.id &&
          (insertPosition === "left"
            ? "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-blue-500"
            : "before:absolute before:right-0 before:top-0 before:h-full before:w-1 before:bg-blue-500")
      )}
    >
      {/* 节点本体 */}
      <div className="text-sm mb-2">{node.componentName}</div>

      {/* ⚠️ 只有 isContainer === true 才渲染 children */}
      {node.isContainer && (
        <SortableContext items={node.children?.map((c) => c.id) ?? []}>
          <div className="flex space-x-2">
            {node.children?.map((child) => (
              <ChildNode
                key={child.id}
                node={child}
                parentId={node.id}
              />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
}

/* ================= 容器内部节点 ================= */

function ChildNode({
  node,
  parentId,
}: {
  node: Node;
  parentId: UniqueIdentifier;
}) {
  const { setNodeRef, attributes, listeners, transform } = useSortable({
    id: node.id,
    data: { parentId },
  });

  return (
    <Button
      ref={setNodeRef}
      style={
        transform
          ? { transform: CSS.Translate.toString(transform) }
          : undefined
      }
      {...attributes}
      {...listeners}
    >
      {node.componentName}
    </Button>
  );
}
