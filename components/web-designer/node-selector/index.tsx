import { useEffect, useRef } from "react";
import { useCanvasRelativeRect } from "../hooks/use-canvas-relative-rect";

export const NodeSelector: React.FC<{
  nodeId: string;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  isSelected?: boolean;
}> = ({ nodeId, canvasRef, isSelected = false }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const getRect = useCanvasRelativeRect(canvasRef);

  useEffect(() => {
    const update = () => {
      const canvas = canvasRef.current;
      const targetEl = canvas?.querySelector<HTMLElement>(
        `[data-node-id="${nodeId}"]`
      );
      const box = boxRef.current;
      if (!canvas || !targetEl || !box) return;

      const rect = getRect(targetEl);
      if (!rect) return;

      Object.assign(box.style, {
        position: "absolute",
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        border: isSelected ? "2px solid #1890ff" : "1px dashed #597ef7",
        borderRadius: "4px",
        pointerEvents: "none",
        zIndex: 1000,
        boxSizing: "border-box",
      });
    };
    update();

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    return () => {
      canvas.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [nodeId, isSelected, getRect, canvasRef]);

  return <div ref={boxRef} />;
};
