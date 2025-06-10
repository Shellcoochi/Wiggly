import { customAlphabet, nanoid } from "nanoid";
import { type Node, type Edge } from "@xyflow/react";
import ELK from "elkjs";
const elk = new ELK();

export const numericId = customAlphabet("1234567890", 13);

export const charId = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  12
);

export const newId = nanoid;

export async function layoutNewNode({
  existingNodes,
  newNode,
  newEdge,
}: {
  existingNodes: Node[];
  newNode: Node;
  newEdge: Edge;
}) {
  const sourceNode = existingNodes.find((n) => n.id === newEdge.source);
  if (!sourceNode) throw new Error("Source node not found");

  const sourceWidth = sourceNode.width || 150;

  const baseX = sourceNode.position.x + sourceWidth + 80;
  const baseY = sourceNode.position.y;

  const occupiedRects = existingNodes.map((n) => ({
    x: n.position.x,
    y: n.position.y,
    w: n.width || 150,
    h: n.height || n.measured?.height || 50,
  }));

  const newW = newNode.width || 150;
  const newH = newNode.height || 50;

  let position = { x: baseX, y: baseY };
  const stepY = 50;
  for (let i = 0; i < 20; i++) {
    const tryY = baseY + i * stepY;
    const overlap = occupiedRects.some((r) => {
      return !(
        baseX + newW < r.x ||
        baseX > r.x + r.w ||
        tryY + newH < r.y ||
        tryY > r.y + r.h
      );
    });
    if (!overlap) {
      position = { x: baseX, y: tryY };
      break;
    }
  }

  const positionedNode = {
    ...newNode,
    position,
  };

  return { newNode: positionedNode };
}
