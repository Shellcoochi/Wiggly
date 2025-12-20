"use client";

import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";
import { nanoid } from "nanoid";
import { MaterialPanel } from "./material-panel";
import { Canvas } from "./canvas";
import { DesignerNode } from "./types";

export function Designer() {
  const [schema, setSchema] = useState<DesignerNode[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event;
  if (!over) return;

  const type = active.data.current?.type;
  if (!type) return;

  const newNode: DesignerNode = {
    id: nanoid(),
    type,
    props: type === "text" ? { text: "文本" } : {},
    children: type === "container" ? [] : undefined,
  };

  // 根画布
  if (over.id === "canvas-root") {
    setSchema((prev) => [...prev, newNode]);
    return;
  }

  const data = over.data.current;

  // ✅ drop 到容器本体 → append
  if (data?.kind === "container") {
    setSchema((prev) =>
      appendToContainer(prev, data.containerId, newNode)
    );
    return;
  }

  // ✅ drop 到节点 → 同级插入
  if (data?.kind === "node") {
    setSchema((prev) =>
      insertAfter(prev, {
        targetId: data.nodeId,
        parentId: data.parentId,
        newNode,
      })
    );
  }
}
function appendToContainer(
  nodes: DesignerNode[],
  containerId: string,
  newNode: DesignerNode
): DesignerNode[] {
  return nodes.map((node) => {
    if (node.id === containerId && node.children) {
      return {
        ...node,
        children: [...node.children, newNode],
      };
    }

    if (node.children) {
      return {
        ...node,
        children: appendToContainer(node.children, containerId, newNode),
      };
    }

    return node;
  });
}


  function insertAfter(
    nodes: DesignerNode[],
    payload: {
      targetId: string;
      parentId?: string;
      newNode: DesignerNode;
    }
  ): DesignerNode[] {
    const { targetId, parentId, newNode } = payload;

    // 根级插入
    if (!parentId) {
      const index = nodes.findIndex((n) => n.id === targetId);
      if (index === -1) return nodes;

      const copy = [...nodes];
      copy.splice(index + 1, 0, newNode);
      return copy;
    }

    return nodes.map((node) => {
      if (node.id === parentId && node.children) {
        const index = node.children.findIndex((c) => c.id === targetId);
        if (index === -1) return node;

        const children = [...node.children];
        children.splice(index + 1, 0, newNode);

        return { ...node, children };
      }

      if (node.children) {
        return {
          ...node,
          children: insertAfter(node.children, payload),
        };
      }

      return node;
    });
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex h-screen">
        <MaterialPanel />
        <Canvas schema={schema} onSelect={setSelectedId} />
        <div className="w-64 border-l p-3 text-sm">
          {selectedId ? `选中：${selectedId}` : "未选中"}
        </div>
      </div>
    </DndContext>
  );
}
