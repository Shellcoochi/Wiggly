import { FC } from "react";
import { useNodes, useReactFlow } from "@xyflow/react";

interface GuidelineProps {
  guides: any;
}
export const Guideline: FC<GuidelineProps> = ({ guides }) => {
  const nodes = useNodes();
  const { getViewport } = useReactFlow();
  const { x: offsetX, y: offsetY, zoom } = getViewport();

  return (
    <>
      {guides.horizontal &&
        guides.horizontal.nodes.length > 0 &&
        (() => {
          const minX = Math.min(...nodes.map((n) => n.position.x));
          const maxX = Math.max(
            ...nodes.map((n) => n.position.x + (n.width || 0))
          );
          const y = guides.horizontal.y;

          return (
            <div
              className="bg-primary-hover"
              style={{
                position: "absolute",
                top: y * zoom + offsetY - 2,
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
          const minY = Math.min(...nodes.map((n) => n.position.y));
          const maxY = Math.max(
            ...nodes.map(
              (n) => n.position.y + (n.height || n.measured?.height || 50)
            )
          );

          const height = maxY - minY;
          if (!height || height < 1) return null;

          const x = guides.vertical.x;

          return (
            <div
              className="bg-primary-hover"
              style={{
                position: "absolute",
                left: x * zoom + offsetX,
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
