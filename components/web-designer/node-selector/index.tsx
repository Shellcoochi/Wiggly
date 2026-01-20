import { useEffect, useRef } from "react";

export const NodeSelector: React.FC<{
  nodeId: string;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  isSelected?: boolean;
  zoom?: number;
}> = ({ nodeId, canvasRef, isSelected = false, zoom = 100 }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const prevZoomRef = useRef<number>(zoom);

  useEffect(() => {
    const update = () => {
      const canvas = canvasRef.current;
      const box = boxRef.current;
      if (!canvas || !box) return;

      const targetEl = canvas.querySelector<HTMLElement>(
        `[data-node-id="${nodeId}"]`
      );
      if (!targetEl) return;

      const canvasRect = canvas.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();

      const top = targetRect.top - canvasRect.top + canvas.scrollTop;
      const left = targetRect.left - canvasRect.left + canvas.scrollLeft;

      box.style.position = "absolute";
      box.style.top = `${top}px`;
      box.style.left = `${left}px`;
      box.style.width = `${targetRect.width}px`;
      box.style.height = `${targetRect.height}px`;
      box.style.border = isSelected ? "2px solid #1890ff" : "1px dashed #597ef7";
      box.style.borderRadius = "4px";
      box.style.pointerEvents = "none";
      box.style.zIndex = "1000";
      box.style.boxSizing = "border-box";
    };

    const canvas = canvasRef.current;
    if (!canvas) return;

    // 检测 zoom 是否变化
    const zoomChanged = prevZoomRef.current !== zoom;
    prevZoomRef.current = zoom;

    if (zoomChanged) {
      // zoom 变化时，持续更新 300ms（匹配 transition 时长）
      const startTime = Date.now();
      const continuousUpdate = () => {
        update();
        if (Date.now() - startTime < 300) {
          animationFrameRef.current = requestAnimationFrame(continuousUpdate);
        }
      };
      continuousUpdate();
    } else {
      // 没有缩放时，只更新一次
      update();
    }

    const targetEl = canvas.querySelector<HTMLElement>(
      `[data-node-id="${nodeId}"]`
    );

    const resizeObserver = new ResizeObserver(update);
    
    if (targetEl) {
      resizeObserver.observe(targetEl);
    }

    canvas.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      resizeObserver.disconnect();
      canvas.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [nodeId, isSelected, zoom, canvasRef]);

  return <div ref={boxRef} />;
};