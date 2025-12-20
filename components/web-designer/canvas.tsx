"use client";

import { useDroppable } from "@dnd-kit/core";
import { DesignerNode } from "./types";
import { CanvasNode } from "./canvas-node";

export function Canvas({
  schema,
  onSelect,
}: {
  schema: DesignerNode[];
  onSelect: (id: string | null) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas-root",
  });

  return (
    <div
      ref={setNodeRef}
      onClick={() => onSelect(null)}
      className={`flex-1 p-6 bg-muted/40 overflow-auto ${
        isOver ? "ring-2 ring-primary" : ""
      }`}
    >
      <div className="space-y-3">
        {schema.map((node) => (
          <CanvasNode
            key={node.id}
            node={node}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
