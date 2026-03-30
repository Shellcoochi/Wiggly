import { FC } from "react";
import { useNodes, useReactFlow } from "@xyflow/react";

interface GuidelineProps {
  guides: any;
  currentNode: any;
}
const OFFSET = 2;
export const Guideline: FC<GuidelineProps> = ({ guides, currentNode }) => {
  const nodes = useNodes();
  const { getViewport } = useReactFlow();
  const { x: offsetX, y: offsetY, zoom } = getViewport();

  return (
    <>
      {guides.horizontal &&
        guides.horizontal.nodes.length > 0 &&
        (() => {
          const hNodes = guides.horizontal.nodes;
          const [baseNode] = hNodes;
          const allNodes = nodes.filter((node) =>
            [...hNodes, currentNode].some((n) => n?.id === node.id)
          );
          const minX = Math.min(...allNodes.map((n) => n.position.x));
          const maxX = Math.max(
            ...allNodes.map((n) => n.position.x + (n.width || 0))
          );
          const y = baseNode.position.y || guides.horizontal.y;

          return (
            <div
              className="bg-primary/70"
              style={{
                position: "absolute",
                top: y * zoom + offsetY - OFFSET,
                left: minX * zoom + offsetX,
                width: (maxX - minX) * zoom,
                height: 1,
                zIndex: 1,
              }}
            />
          );
        })()}
      {guides.vertical &&
        (() => {
          const vNodes = guides.vertical.nodes;
          const [baseNode] = vNodes;
          const minY = Math.min(...nodes.map((n) => n.position.y));
          const maxY = Math.max(
            ...nodes.map(
              (n) => n.position.y + (n.height || n.measured?.height || 50)
            )
          );

          const height = maxY - minY;
          if (!height || height < 1) return null;

          const x = baseNode.position.x || guides.vertical.x;

          return (
            <div
              className="bg-primary/70"
              style={{
                position: "absolute",
                left: x * zoom + offsetX - OFFSET,
                top: minY * zoom + offsetY,
                height: height * zoom,
                width: 1,
                zIndex: 10,
              }}
            />
          );
        })()}
    </>
  );
};
