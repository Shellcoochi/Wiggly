import { useCallback, useRef, useState, useMemo, useEffect } from "react";
import { DesignerNode, DragItem, DropResult } from "../types";
import { useDrag, useDrop } from "react-dnd";
import type { DropTargetMonitor } from "react-dnd";
import { findAsset } from "../utils/tools";
import { resolveNodeBindings } from "../renderer";
import { cn } from "@/lib/utils";

// 常量定义
const INDENT_SIZE = 20;
const HOVER_THROTTLE_MS = 32; // ~30fps throttle for better performance
const AUTO_SCROLL_SPEED = 10;
const AUTO_SCROLL_THRESHOLD = 50; // pixels from edge to trigger scroll
const BOUNDARY_THRESHOLD = 0.15; // 15% of element size for boundary detection

// 工具函数：计算距离（考虑滚动偏移）
const getDistance = (
  element: Element,
  point: { x: number; y: number },
): number => {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  return Math.sqrt((point.x - centerX) ** 2 + (point.y - centerY) ** 2);
};

// 工具函数：获取组件方向（从 componentName 判断）
const getComponentDirection = (componentName: string): "row" | "col" => {
  return componentName.toLowerCase() === "col" ? "col" : "row";
};

// 工具函数：获取容器边界信息
const getContainerBoundaryInfo = (
  containerElement: Element,
  clientPoint: { x: number; y: number },
  direction: "row" | "col",
  childrenCount: number,
): { isBoundary: boolean; boundaryType?: "start" | "middle" | "end" } => {
  if (childrenCount === 0) {
    return { isBoundary: true, boundaryType: "start" };
  }

  const rect = containerElement.getBoundingClientRect();
  const threshold =
    direction === "row"
      ? rect.width * BOUNDARY_THRESHOLD
      : rect.height * BOUNDARY_THRESHOLD;

  if (direction === "row") {
    const distFromLeft = clientPoint.x - rect.left;
    const distFromRight = rect.right - clientPoint.x;
    if (distFromLeft < threshold) return { isBoundary: true, boundaryType: "start" };
    if (distFromRight < threshold) return { isBoundary: true, boundaryType: "end" };
  } else {
    const distFromTop = clientPoint.y - rect.top;
    const distFromBottom = rect.bottom - clientPoint.y;
    if (distFromTop < threshold) return { isBoundary: true, boundaryType: "start" };
    if (distFromBottom < threshold) return { isBoundary: true, boundaryType: "end" };
  }

  return { isBoundary: false, boundaryType: "middle" };
};

// 工具函数：判断位置（改进的百分比计算）
const getPosition = (
  element: Element,
  point: { x: number; y: number },
  direction: "row" | "col",
  isContainer: boolean = false,
): "left" | "right" | "top" | "bottom" | "inside" => {
  const rect = element.getBoundingClientRect();
  const { x, y } = point;

  // 非容器元素：只能放在左/右或上/下
  if (!isContainer) {
    if (direction === "row") {
      const midX = rect.left + rect.width / 2;
      return x < midX ? "left" : "right";
    } else {
      const midY = rect.top + rect.height / 2;
      return y < midY ? "top" : "bottom";
    }
  }

  // 容器元素：可以放在里面
  if (direction === "row") {
    const midX = rect.left + rect.width / 2;
    return x < midX ? "left" : "right";
  } else {
    const midY = rect.top + rect.height / 2;
    return y < midY ? "top" : "bottom";
  }
};

// 工具函数：自动滚动
const autoScrollElement = (
  parentElement: Element | null,
  clientPoint: { x: number; y: number },
): void => {
  if (!parentElement) return;

  const rect = parentElement.getBoundingClientRect();
  let scrollX = 0;
  let scrollY = 0;

  // 检测水平滚动
  if (clientPoint.x - rect.left < AUTO_SCROLL_THRESHOLD) {
    scrollX = -AUTO_SCROLL_SPEED;
  } else if (rect.right - clientPoint.x < AUTO_SCROLL_THRESHOLD) {
    scrollX = AUTO_SCROLL_SPEED;
  }

  // 检测垂直滚动
  if (clientPoint.y - rect.top < AUTO_SCROLL_THRESHOLD) {
    scrollY = -AUTO_SCROLL_SPEED;
  } else if (rect.bottom - clientPoint.y < AUTO_SCROLL_THRESHOLD) {
    scrollY = AUTO_SCROLL_SPEED;
  }

  if (scrollX !== 0) {
    parentElement.scrollLeft += scrollX;
  }
  if (scrollY !== 0) {
    parentElement.scrollTop += scrollY;
  }
};

// 工具函数：检查是否应该节流 hover 回调
const shouldThrottleHover = (lastTime: number): boolean => {
  return Date.now() - lastTime < HOVER_THROTTLE_MS;
};

// 工具函数：更新 hover 时间
const updateHoverTime = (): number => {
  return Date.now();
};


interface NodeItemProps {
  item: DesignerNode;
  depth: number;
  index: number;
  parentId: string | null;
  selectedNodeId: string | null;
  onSelect: (node: DesignerNode) => void;
  onDrop: (
    dragId: string,
    position: DropResult,
    source: "panel" | "tree",
    nodeData?: DesignerNode,
  ) => void;
  findItem: (id: string) => DesignerNode | undefined;
  moveItem: (dragId: string, hoverId: string, position: DropResult) => void;
  bindingContext: {
    variables: Record<string, any>;
    dataSources: Record<string, any>;
  };
}

export const NodeItem: React.FC<NodeItemProps> = ({
  item,
  depth,
  parentId,
  selectedNodeId,
  onSelect,
  onDrop,
  findItem,
  moveItem,
  bindingContext,
}) => {
  const { id, children, isContainer, title, componentName, style } =
    item;
  const [dropPosition, setDropPosition] = useState<DropResult | null>(null);
  const isSelected = selectedNodeId === id;
  const dragRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const lastHoverTimeRef = useRef<number>(0);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 拖拽配置
  const [{ isDragging }, drag] = useDrag({
    type: "tree-item",
    item: (): DragItem => ({
      id,
      type: "tree-item",
      depth,
      parentId,
      isContainer,
      source: "tree",
      nodeData: item,
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // 放置配置
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ["tree-item", "component-panel-item"],
    canDrop: (dragItem: DragItem) => {
      if (dragItem.source === "panel") return true;
      if (dragItem.id === id) return false;
      if (dragItem.parentId === id && (dragItem.depth ?? 0) < depth) return false;
      return true;
    },
    hover: (dragItem: DragItem, monitor: DropTargetMonitor) => {
      if (!monitor.isOver({ shallow: true }) || !monitor.canDrop()) {
        setDropPosition(null);
        return;
      }

      if (dragItem.source !== "panel" && dragItem.id === id) return;

      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      // Optimization 5: 去抖处理 - 限制 hover 回调执行频率
      if (shouldThrottleHover(lastHoverTimeRef.current)) {
        return;
      }
      lastHoverTimeRef.current = updateHoverTime();

      // 计算放置位置
      const result = calculateDropPosition(clientOffset);
      setDropPosition(result);

      // 只通知位置变化，不执行实际移动
      moveItem(dragItem.id, id, result);

      // Optimization 7: 自动滚动
      if (dropRef.current) {
        autoScrollElement(dropRef.current.parentElement, clientOffset);
      }
    },
    drop: (dragItem: DragItem, monitor): DropResult | undefined => {
      if (!monitor.canDrop()) return undefined;
      if (!isContainer && dropPosition?.position === "inside") {
        return undefined;
      }

      const position = dropPosition || { id, position: "inside" };
      onDrop(
        dragItem.id,
        position,
        dragItem.source || "tree",
        dragItem.nodeData,
      );
      return position;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  // 在组件内解析绑定
  const resolvedProps = useMemo(
    () => resolveNodeBindings(item, bindingContext),
    [item, bindingContext],
  );

  // 计算放置位置
  const calculateDropPosition = useCallback(
    (clientOffset: { x: number; y: number }): DropResult => {
      // Optimization 1: 处理非容器元素的落点判断
      if (!isContainer) {
        return { id, position: "inside" };
      }

      // 容器为空时，返回 inside
      if (!children || children.length === 0) {
        return { id, position: "inside" };
      }

      // Optimization 4 & 7: 改进的方向检测（从 componentName 判断）
      const direction = getComponentDirection(componentName);

      // Optimization 8: 容器边界识别
      const containerEl = document.querySelector(`[data-node-id="${id}"]`);
      if (containerEl) {
        const boundaryInfo = getContainerBoundaryInfo(
          containerEl,
          clientOffset,
          direction,
          children.length,
        );

        // 边界情况下直接返回容器内放置
        if (boundaryInfo.isBoundary && boundaryInfo.boundaryType === "start") {
          if (children.length > 0) {
            const firstChild = children[0];
            return { id: firstChild.id, position: direction === "row" ? "left" : "top" };
          }
          return { id, position: "inside" };
        }

        if (boundaryInfo.isBoundary && boundaryInfo.boundaryType === "end") {
          if (children.length > 0) {
            const lastChild = children[children.length - 1];
            return { id: lastChild.id, position: direction === "row" ? "right" : "bottom" };
          }
          return { id, position: "inside" };
        }
      }

      // 找到最近的子元素
      type ClosestChildType = {
        id: string;
        distance: number;
        element: Element;
      };

      let closestChild: ClosestChildType | undefined;

      children.forEach((child) => {
        const childEl = document.querySelector(`[data-node-id="${child.id}"]`);
        if (!childEl) return;

        const distance = getDistance(childEl, clientOffset);
        if (closestChild === undefined || distance < closestChild.distance) {
          closestChild = { id: child.id, distance, element: childEl };
        }
      });

      if (closestChild !== undefined) {
        // Optimization 1: 修复非容器元素不能正确判断落点问题
        const position = getPosition(
          closestChild.element,
          clientOffset,
          direction,
          false, // 子元素不是容器时只能左右/上下
        );
        return { id: closestChild.id, position };
      }

      return { id, position: "inside" };
    },
    [id, isContainer, children, componentName],
  );

  // Optimization 7 & 8: 清理自动滚动定时器
  useEffect(() => {
    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    };
  }, []);

  // 合并 refs
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      dragRef.current = node;
      dropRef.current = node;
      drag(node);
      drop(node);
    },
    [drag, drop],
  );

  // 容器样式
  const containerStyle = useMemo((): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: "relative",
      marginLeft: `${depth * INDENT_SIZE}px`,
      opacity: isDragging ? 0.5 : 1,
      padding: "8px",
      border: "1px solid #ddd",
      marginBottom: "4px",
      background: "#fff",
      cursor: "move",
      borderRadius: "4px",
    };

    if (isOver && !isSelected) {
      if (dropPosition?.position === "inside" && isContainer) {
        baseStyle.background = "#f0f9ff";
        baseStyle.border = "2px dashed #1890ff";
      } else {
        baseStyle.background = "#f5f5f5";
      }
    }

    if (!canDrop && isOver) {
      baseStyle.border = "1px solid #ff4d4f";
      baseStyle.background = "#fff2f0";
    }

    return baseStyle;
  }, [
    depth,
    isDragging,
    isOver,
    isSelected,
    dropPosition,
    isContainer,
    canDrop,
  ]);

  // 渲染子元素
  const renderChildren = useCallback(() => {
    if (!isContainer || !children || children.length === 0) {
      return null;
    }

    return children.map((child, childIndex) => (
      <NodeItem
        key={child.id}
        item={child}
        depth={depth + 1}
        index={childIndex}
        parentId={id}
        selectedNodeId={selectedNodeId}
        onSelect={onSelect}
        onDrop={onDrop}
        findItem={findItem}
        moveItem={moveItem}
        bindingContext={bindingContext}
      />
    ));
  }, [
    isContainer,
    children,
    depth,
    id,
    selectedNodeId,
    onSelect,
    onDrop,
    findItem,
    moveItem,
    bindingContext,
  ]);

  // 空容器占位符
  const renderEmptyPlaceholder = useCallback(() => {
    if (!isContainer || (children && children.length > 0)) {
      return null;
    }

    return (
      <div
        className={cn(
          "flex items-center justify-center w-full",
          "min-h-12", // 👈 关键：撑开容器
          "m-2 p-3",
          "rounded-md border border-dashed",
          "text-xs text-muted-foreground",
          "transition-colors",
          isOver && dropPosition?.position === "inside"
            ? "bg-accent/50 border-primary text-foreground"
            : "bg-muted/30 border-border",
        )}
      >
        {isOver && dropPosition?.position === "inside"
          ? "释放以添加到此容器"
          : "拖拽组件到此容器"}
      </div>
    );
  }, [isContainer, children, isOver, dropPosition]);

  // 获取组件资源
  const asset = useMemo(() => findAsset(componentName), [componentName]);

  // ============================================
  // 核心改进：统一的组件渲染逻辑
  // ============================================

  // 如果找到了对应的组件库
  if (asset?.library) {
    const Com = asset.library;

    // 容器组件：需要渲染子元素
    if (isContainer) {
      return (
        <Com {...resolvedProps} ref={setRefs} data-node-id={id} style={style}>
          {renderChildren()}
          {renderEmptyPlaceholder()}
        </Com>
      );
    }

    // 非容器组件：直接渲染
    return (
      <Com {...resolvedProps} style={style} ref={setRefs} data-node-id={id} />
    );
  }

  // ============================================
  // 降级方案：树形视图展示（用于调试或未找到组件时）
  // ============================================

  return (
    <div
      ref={setRefs}
      style={containerStyle}
      data-node-id={id}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item);
      }}
    >
      {/* 节点信息 */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: isContainer ? "#1890ff" : "#52c41a",
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "bold" }}>{title || id}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>{componentName}</div>
        </div>
        {isContainer && (
          <span
            style={{
              fontSize: "12px",
              color: "#1890ff",
              background: "#e6f7ff",
              padding: "2px 8px",
              borderRadius: "3px",
            }}
          >
            容器
          </span>
        )}
      </div>

      {/* 子元素 */}
      {isContainer && children && children.length > 0 && (
        <div style={{ marginTop: "8px" }}>{renderChildren()}</div>
      )}

      {/* 空容器占位符 */}
      {renderEmptyPlaceholder()}
    </div>
  );
};
