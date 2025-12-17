import { useCallback, useState } from "react";
import type { Node, NodeChange, OnNodesChange } from "@xyflow/react";
import { applyNodeChanges, useNodes, useReactFlow } from "@xyflow/react";

const ALIGNMENT_THRESHOLD = 5;

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

      const positionChange = changes.find((c) => c.type === "position");
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

      const horizontalNodes: Node[] = [];
      const verticalNodes: Node[] = [];

      for (const n of updatedNodes) {
        if (n.id === draggedNode.id) continue;

        if (Math.abs(n.position.y - y) < ALIGNMENT_THRESHOLD) {
          horizontalNodes.push(n);
        }

        const nWidth = n.width || 0;
        const nCenterX = n.position.x + nWidth / 2;

        if (
          Math.abs(n.position.x - x) < ALIGNMENT_THRESHOLD ||
          Math.abs(n.position.x + nWidth - (x + width)) < ALIGNMENT_THRESHOLD ||
          Math.abs(nCenterX - centerX) < ALIGNMENT_THRESHOLD
        ) {
          verticalNodes.push(n);
        }
      }

      if (isDragging) {
        setGuides({
          horizontal: horizontalNodes.length
            ? { y, nodes: horizontalNodes }
            : null,
          vertical: verticalNodes.length
            ? { x, nodes: verticalNodes }
            : null,
        });
      } else {
        const snapX =
          verticalNodes[0]?.position.x ??
          draggedNode.position.x;

        const snapY =
          horizontalNodes[0]?.position.y ??
          draggedNode.position.y;

        if (horizontalNodes.length || verticalNodes.length) {
          setNodes((nds) =>
            nds.map((n) =>
              n.id === draggedNode.id
                ? { ...n, position: { x: snapX, y: snapY } }
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
