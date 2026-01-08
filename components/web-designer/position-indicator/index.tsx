import { useEffect, useRef } from "react";
import { Positon } from "../types";

const getStyles = (position: Positon, targetRect: DOMRect, canvasRect: DOMRect) => {
  const top = targetRect.top - canvasRect.top;
  const left = targetRect.left - canvasRect.left;
  const width = targetRect.width;
  const height = targetRect.height;

  const baseStyles: React.CSSProperties = {
    position: "absolute",
    pointerEvents: "none",
    zIndex: 1000,
    boxSizing: "border-box",
  };

  const positionConfigs = {
    left: {
      top: `${top}px`,
      left: `${left - 4}px`,
      width: "4px",
      height: `${height}px`,
      borderLeft: "2px solid #1890ff",
      borderRight: "2px solid #1890ff",
      backgroundColor: "#1890ff33",
    },
    right: {
      top: `${top}px`,
      left: `${left + width}px`,
      width: "4px",
      height: `${height}px`,
      borderLeft: "2px solid #1890ff",
      borderRight: "2px solid #1890ff",
      backgroundColor: "#1890ff33",
    },
    top: {
      top: `${top - 4}px`,
      left: `${left}px`,
      width: `${width}px`,
      height: "4px",
      borderTop: "2px solid #1890ff",
      borderBottom: "2px solid #1890ff",
      backgroundColor: "#1890ff33",
    },
    bottom: {
      top: `${top + height}px`,
      left: `${left}px`,
      width: `${width}px`,
      height: "4px",
      borderTop: "2px solid #1890ff",
      borderBottom: "2px solid #1890ff",
      backgroundColor: "#1890ff33",
    },
    inside: {
      top: `${top}px`,
      left: `${left}px`,
      width: `${width}px`,
      height: `${height}px`,
      border: "2px solid #1890ff",
      backgroundColor: "#1890ff11",
    },
  };

  return {
    ...baseStyles,
    ...(positionConfigs[position] || {}),
  };
};

export const PositionIndicator: React.FC<{
  nodeId: string;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  position: Positon;
}> = ({ nodeId, canvasRef, position }) => {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      const canvas = canvasRef.current;
      const targetEl = canvas?.querySelector<HTMLElement>(`[data-node-id="${nodeId}"]`);
      const box = boxRef.current;

      if (!targetEl || !box || !canvas) return;

      const targetRect = targetEl.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      const styles = getStyles(position, targetRect, canvasRect);

      Object.assign(box.style, styles);
    };

    updatePosition();

    // 监听滚动和窗口大小变化
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('scroll', updatePosition);
      }
      window.removeEventListener('resize', updatePosition);
    };
  }, [nodeId, position, canvasRef]);

  return <div ref={boxRef} />;
};