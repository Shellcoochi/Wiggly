import React, { useEffect, useRef, useState, useCallback } from 'react';

type ResizeHandle = 
  | 'top' | 'right' | 'bottom' | 'left'
  | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface ResizeHandlesProps {
  nodeId: string;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  isSelected?: boolean;
  zoom?: number;
  onResize?: (nodeId: string, width: number, height: number) => void;
  maintainAspectRatio?: boolean;
}

export const ResizeHandles: React.FC<ResizeHandlesProps> = ({
  nodeId,
  canvasRef,
  isSelected = false,
  zoom = 100,
  onResize,
  maintainAspectRatio = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const resizeDataRef = useRef<{
    handle: ResizeHandle;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startTop: number;
    startLeft: number;
    aspectRatio: number;
  } | null>(null);

  const updatePosition = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const targetEl = canvas.querySelector<HTMLElement>(
      `[data-node-id="${nodeId}"]`
    );
    if (!targetEl) return;

    const canvasRect = canvas.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    const top = targetRect.top - canvasRect.top + canvas.scrollTop;
    const left = targetRect.left - canvasRect.left + canvas.scrollLeft;

    container.style.position = 'absolute';
    container.style.top = `${top}px`;
    container.style.left = `${left}px`;
    container.style.width = `${targetRect.width}px`;
    container.style.height = `${targetRect.height}px`;
    container.style.pointerEvents = isSelected && !isResizing ? 'auto' : 'none';
  }, [nodeId, canvasRef, isSelected, isResizing]);

  const handleMouseDown = useCallback((handle: ResizeHandle, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const targetEl = canvas.querySelector<HTMLElement>(
      `[data-node-id="${nodeId}"]`
    );
    if (!targetEl) return;

    const rect = targetEl.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();

    resizeDataRef.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: rect.width,
      startHeight: rect.height,
      startTop: rect.top - canvasRect.top + canvas.scrollTop,
      startLeft: rect.left - canvasRect.left + canvas.scrollLeft,
      aspectRatio: rect.width / rect.height,
    };

    setIsResizing(true);
  }, [nodeId, canvasRef]);

  useEffect(() => {
    if (!isResizing || !resizeDataRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeDataRef.current) return;

      const {
        handle,
        startX,
        startY,
        startWidth,
        startHeight,
        startTop,
        startLeft,
        aspectRatio,
      } = resizeDataRef.current;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      const scale = zoom / 100;
      const scaledDeltaX = deltaX / scale;
      const scaledDeltaY = deltaY / scale;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newTop = startTop;
      let newLeft = startLeft;

      switch (handle) {
        case 'right':
          newWidth = Math.max(20, startWidth + scaledDeltaX);
          if (maintainAspectRatio) {
            newHeight = newWidth / aspectRatio;
          }
          break;

        case 'left':
          newWidth = Math.max(20, startWidth - scaledDeltaX);
          newLeft = startLeft + (startWidth - newWidth);
          if (maintainAspectRatio) {
            newHeight = newWidth / aspectRatio;
          }
          break;

        case 'bottom':
          newHeight = Math.max(20, startHeight + scaledDeltaY);
          if (maintainAspectRatio) {
            newWidth = newHeight * aspectRatio;
          }
          break;

        case 'top':
          newHeight = Math.max(20, startHeight - scaledDeltaY);
          newTop = startTop + (startHeight - newHeight);
          if (maintainAspectRatio) {
            newWidth = newHeight * aspectRatio;
          }
          break;

        case 'top-left':
          newWidth = Math.max(20, startWidth - scaledDeltaX);
          newHeight = maintainAspectRatio 
            ? newWidth / aspectRatio 
            : Math.max(20, startHeight - scaledDeltaY);
          newLeft = startLeft + (startWidth - newWidth);
          newTop = startTop + (startHeight - newHeight);
          break;

        case 'top-right':
          newWidth = Math.max(20, startWidth + scaledDeltaX);
          newHeight = maintainAspectRatio 
            ? newWidth / aspectRatio 
            : Math.max(20, startHeight - scaledDeltaY);
          newTop = startTop + (startHeight - newHeight);
          break;

        case 'bottom-left':
          newWidth = Math.max(20, startWidth - scaledDeltaX);
          newHeight = maintainAspectRatio 
            ? newWidth / aspectRatio 
            : Math.max(20, startHeight + scaledDeltaY);
          newLeft = startLeft + (startWidth - newWidth);
          break;

        case 'bottom-right':
          newWidth = Math.max(20, startWidth + scaledDeltaX);
          newHeight = maintainAspectRatio 
            ? newWidth / aspectRatio 
            : Math.max(20, startHeight + scaledDeltaY);
          break;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;

      const targetEl = canvas.querySelector<HTMLElement>(
        `[data-node-id="${nodeId}"]`
      );
      if (!targetEl) return;

      targetEl.style.width = `${newWidth}px`;
      targetEl.style.height = `${newHeight}px`;

      const container = containerRef.current;
      if (container) {
        container.style.width = `${newWidth}px`;
        container.style.height = `${newHeight}px`;
        container.style.top = `${newTop}px`;
        container.style.left = `${newLeft}px`;
      }
    };

    const handleMouseUp = () => {
      if (!resizeDataRef.current) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const targetEl = canvas.querySelector<HTMLElement>(
        `[data-node-id="${nodeId}"]`
      );
      if (!targetEl) return;

      const rect = targetEl.getBoundingClientRect();
      
      onResize?.(nodeId, rect.width, rect.height);

      resizeDataRef.current = null;
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, nodeId, canvasRef, zoom, onResize, maintainAspectRatio]);

  useEffect(() => {
    updatePosition();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const targetEl = canvas.querySelector<HTMLElement>(
      `[data-node-id="${nodeId}"]`
    );

    const resizeObserver = new ResizeObserver(updatePosition);
    if (targetEl) {
      resizeObserver.observe(targetEl);
    }

    canvas.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      resizeObserver.disconnect();
      canvas.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [nodeId, canvasRef, updatePosition]);

  if (!isSelected) return null;

  return (
    <div ref={containerRef} style={{ zIndex: 1001 }}>
      <Handle position="top" onMouseDown={(e) => handleMouseDown('top', e)} />
      <Handle position="right" onMouseDown={(e) => handleMouseDown('right', e)} />
      <Handle position="bottom" onMouseDown={(e) => handleMouseDown('bottom', e)} />
      <Handle position="left" onMouseDown={(e) => handleMouseDown('left', e)} />
      <Handle position="top-left" onMouseDown={(e) => handleMouseDown('top-left', e)} />
      <Handle position="top-right" onMouseDown={(e) => handleMouseDown('top-right', e)} />
      <Handle position="bottom-left" onMouseDown={(e) => handleMouseDown('bottom-left', e)} />
      <Handle position="bottom-right" onMouseDown={(e) => handleMouseDown('bottom-right', e)} />
    </div>
  );
};

const Handle: React.FC<{
  position: ResizeHandle;
  onMouseDown: (e: React.MouseEvent) => void;
}> = ({ position, onMouseDown }) => {
  const isCorner = position.includes('-');
  const cursors: Record<ResizeHandle, string> = {
    'top': 'ns-resize',
    'right': 'ew-resize',
    'bottom': 'ns-resize',
    'left': 'ew-resize',
    'top-left': 'nwse-resize',
    'top-right': 'nesw-resize',
    'bottom-left': 'nesw-resize',
    'bottom-right': 'nwse-resize',
  };

  const positions: Record<ResizeHandle, React.CSSProperties> = {
    'top': { top: '-4px', left: '50%', transform: 'translateX(-50%)', width: '100%', height: '8px' },
    'right': { right: '-4px', top: '50%', transform: 'translateY(-50%)', width: '8px', height: '100%' },
    'bottom': { bottom: '-4px', left: '50%', transform: 'translateX(-50%)', width: '100%', height: '8px' },
    'left': { left: '-4px', top: '50%', transform: 'translateY(-50%)', width: '8px', height: '100%' },
    'top-left': { top: '-4px', left: '-4px', width: '8px', height: '8px' },
    'top-right': { top: '-4px', right: '-4px', width: '8px', height: '8px' },
    'bottom-left': { bottom: '-4px', left: '-4px', width: '8px', height: '8px' },
    'bottom-right': { bottom: '-4px', right: '-4px', width: '8px', height: '8px' },
  };

  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        position: 'absolute',
        ...positions[position],
        cursor: cursors[position],
        pointerEvents: 'auto',
        zIndex: 1002,
        ...(isCorner ? {
          backgroundColor: '#1890ff',
          border: '1px solid white',
          borderRadius: '50%',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
        } : {
          backgroundColor: 'transparent',
        }),
      }}
    />
  );
};

// ============================================
// 集成到 Designer 的修改
// ============================================

/*
在 index.tsx 中的修改:

1. 导入组件:
import { ResizeHandles } from "../resize-handles";

2. 添加状态:
const [maintainAspectRatio, setMaintainAspectRatio] = useState(false);

3. 添加调整大小回调:
const handleResize = useCallback((nodeId: string, width: number, height: number) => {
  updateNode(nodeId, {
    style: {
      ...findNode(nodeId, items)?.style,
      width: `${width}px`,
      height: `${height}px`,
    },
  });
}, [updateNode, items]);

4. 在工具栏添加保持宽高比开关:
<div className="h-4 w-px bg-border mx-2" />
<label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
  <input
    type="checkbox"
    checked={maintainAspectRatio}
    onChange={(e) => setMaintainAspectRatio(e.target.checked)}
    className="w-3 h-3"
  />
  保持宽高比
</label>

5. 在 Overlay 层添加调整大小句柄:
{selectedNode && (
  <>
    <NodeSelector
      nodeId={selectedNode.id}
      canvasRef={canvasRef}
      zoom={zoom}
      isSelected
    />
    <ResizeHandles
      nodeId={selectedNode.id}
      canvasRef={canvasRef}
      isSelected
      zoom={zoom}
      onResize={handleResize}
      maintainAspectRatio={maintainAspectRatio}
    />
  </>
)}
*/