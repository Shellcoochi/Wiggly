import { useEffect, useRef } from "react";

export const NodeSelector: React.FC<{
  nodeId: string;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  isSelected?: boolean;
}> = ({ nodeId, canvasRef, isSelected = false }) => {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const targetEl = canvas?.querySelector(`[data-node-id="${nodeId}"]`);
    const box = boxRef.current;

    if (!targetEl || !box || !canvas) return;

    const rect = targetEl.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();

    const top = rect.top - canvasRect.top;
    const left = rect.left - canvasRect.left;

    box.style.cssText = `
      position: absolute;
      top: ${top}px;
      left: ${left}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      border: ${isSelected ? "2px solid #1890ff" : "1px dashed #597ef7"};
      border-radius: 4px;
      pointer-events: none;
      z-index: 1000;
      box-sizing: border-box;
    `;
  }, [nodeId, canvasRef, isSelected]);

  return <div ref={boxRef} />;
};
