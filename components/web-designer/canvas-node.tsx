"use client";

import { useDroppable } from "@dnd-kit/core";
import { DesignerNode } from "./types";
import { cn } from "@/lib/utils";

export function CanvasNode({
  node,
  parentId,
  onSelect,
}: {
  node: DesignerNode;
  parentId?: string;
  onSelect: (id: string) => void;
}) {
  const isContainer = node.type === "container";

  // 1️⃣ 普通节点 drop（用于 before / after）
  const nodeDrop = useDroppable({
    id: `node:${node.id}`,
    data: {
      kind: "node",
      nodeId: node.id,
      parentId,
    },
  });

  // 2️⃣ 容器本体 drop（用于 append）
  const containerDrop = useDroppable({
    id: `container:${node.id}`,
    disabled: !isContainer,
    data: {
      kind: "container",
      containerId: node.id,
    },
  });

  return (
    <div
      ref={isContainer ? containerDrop.setNodeRef : undefined}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
      className={cn(
        "p-3 border rounded bg-background",
        containerDrop.isOver && "ring-2 ring-primary",
        isContainer && "border-dashed"
      )}
    >
      {/* 节点自身 */}
      <div
        ref={nodeDrop.setNodeRef}
        className={cn(nodeDrop.isOver && "outline outline-2 outline-primary")}
      >
        {renderNode(node)}
      </div>

      {/* 子节点 */}
      {isContainer && node.children && (
        <div className="mt-3 space-y-2">
          {node.children.map((child) => (
            <CanvasNode
              key={child.id}
              node={child}
              parentId={node.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
function renderNode(node: DesignerNode) {
  switch (node.type) {
    case "text":
      return <div>{node.props?.text ?? "文本"}</div>;
    case "button":
      return (
        <button className="px-3 py-1 rounded bg-primary text-white">
          按钮
        </button>
      );
    case "container":
      return (
        <div className="text-xs text-muted-foreground select-none">
          容器
        </div>
      );
  }
}