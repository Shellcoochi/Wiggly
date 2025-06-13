import { useCallback, useState } from "react";
import type { Node, NodeChange, OnNodesChange } from "@xyflow/react";
import { applyNodeChanges, useNodes, useReactFlow } from "@xyflow/react";

const ALIGNMENT_THRESHOLD = 10;

export function useAlignGuides(onNodesChange: OnNodesChange<any>) {
  const [guides, setGuides] = useState<{
    horizontal: { y: number; nodes: Node[] } | null;
    vertical: { x: number; nodes: Node[] } | null;
  }>({ horizontal: null, vertical: null });
  const nodes = useNodes();

  const { setNodes } = useReactFlow();

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const updatedNodes = applyNodeChanges(changes, nodes);

      onNodesChange(changes);

      const positionChange = changes.find(
        (change) => change.type === "position"
      );

      if (!positionChange) {
        setGuides({ horizontal: null, vertical: null });
        return;
      }

      const draggedNode = updatedNodes.find((n) => n.id === positionChange.id);
      if (!draggedNode) return;

      const { x, y } = draggedNode.position;
      const width = draggedNode.width || 0;
      const centerX = x + width / 2;
      const isDragging = positionChange.dragging;

      let nearestHorizontal: Node | null = null;
      let nearestVertical: Node | null = null;

      for (const n of updatedNodes) {
        if (n.id === draggedNode.id) continue;

        if (Math.abs(n.position.y - y) < ALIGNMENT_THRESHOLD) {
          nearestHorizontal = n;
        }

        const nWidth = n.width || 0;
        const nCenterX = n.position.x + nWidth / 2;

        if (
          Math.abs(n.position.x - x) < ALIGNMENT_THRESHOLD ||
          Math.abs(n.position.x + nWidth - (x + width)) < ALIGNMENT_THRESHOLD ||
          Math.abs(nCenterX - centerX) < ALIGNMENT_THRESHOLD
        ) {
          nearestVertical = n;
        }
      }

      if (isDragging) {
        setGuides({
          horizontal: nearestHorizontal
            ? { y: nearestHorizontal.position.y, nodes: [nearestHorizontal] }
            : null,
          vertical: nearestVertical
            ? { x: nearestVertical.position.x, nodes: [nearestVertical] }
            : null,
        });
      } else {
        if (nearestHorizontal || nearestVertical) {
          setNodes((nds) =>
            nds.map((n) =>
              n.id === draggedNode.id
                ? {
                    ...n,
                    position: {
                      x: nearestVertical
                        ? nearestVertical.position.x
                        : n.position.x,
                      y: nearestHorizontal
                        ? nearestHorizontal.position.y
                        : n.position.y,
                    },
                  }
                : n
            )
          );
        }
        setGuides({ horizontal: null, vertical: null });
      }
    },
    [nodes, onNodesChange, setNodes]
  );

  return { guides, handleNodesChange };
}
