import { useEffect, useRef, useCallback } from "react";
import { useCanvasRelativeRect } from "../hooks/use-canvas-relative-rect";

export const NodeSelector: React.FC<{
  nodeId: string;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  isSelected?: boolean;
}> = ({ nodeId, canvasRef, isSelected = false }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const getRect = useCanvasRelativeRect(canvasRef);

  const update = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
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
    });
  }, [nodeId, isSelected, getRect, canvasRef]);

  useEffect(() => {
    update();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const targetEl = canvas.querySelector<HTMLElement>(
      `[data-node-id="${nodeId}"]`
    );
    
    if (targetEl) {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      
      resizeObserverRef.current = new ResizeObserver(update);
      resizeObserverRef.current.observe(targetEl);
    }

    canvas.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      canvas.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update, canvasRef]);

  return <div ref={boxRef} />;
};