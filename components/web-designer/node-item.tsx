import { useCallback, useRef, useState } from "react";
import { DesignerNode, DragItem, DropResult } from "./types";
import { useDrag, useDrop } from "react-dnd";
import type { DropTargetMonitor } from "react-dnd";
import { findAsset } from "./utils/tools";

export const NodeItem: React.FC<{
  item: DesignerNode;
  depth: number;
  index: number;
  parentId: string | null;
  selectedNodeId: string | null;
  onSelect: (node: DesignerNode) => void;
  onDrop: (
    dragId: string,
    dropId: string,
    position: "before" | "after" | "inside",
    source: "panel" | "tree",
    nodeData?: DesignerNode
  ) => void;
  findItem: (id: string) => DesignerNode | undefined;
  moveItem: (
    dragId: string,
    hoverId: string,
    position: "before" | "after" | "inside"
  ) => void;
}> = ({
  item,
  depth,
  parentId,
  selectedNodeId,
  onSelect,
  onDrop,
  findItem,
  moveItem,
}) => {
  const { id, children, isContainer, title, componentName, props, style } =
    item;
  const [dropPosition, setDropPosition] = useState<
    "before" | "after" | "inside" | null
  >(null);
  const isSelected = selectedNodeId === id;
  const dragRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  // 使用 useDrag 实现拖拽
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

  // 使用 useDrop 实现放置区域
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ["tree-item", "component-panel-item"],
    canDrop: (dragItem: DragItem) => {
      // 从面板拖拽过来，总是允许
      if (dragItem.source === "panel") return true;

      // 树内拖拽的限制
      if (dragItem.id === id) return false;
      if (dragItem.parentId === id && dragItem.depth < depth) {
        return false;
      }
      return true;
    },
    hover: (dragItem: DragItem, monitor: DropTargetMonitor) => {
      if (!monitor.canDrop()) {
        setDropPosition(null);
        return;
      }

      // 如果是面板拖拽，不判断同元素
      if (dragItem.source !== "panel" && dragItem.id === id) return;

      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const hoverBoundingRect = dropRef.current?.getBoundingClientRect();
      if (!hoverBoundingRect) return;

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      let position: "before" | "after" | "inside";
      if (hoverClientY < hoverMiddleY / 3) {
        position = "before";
      } else if (hoverClientY > (hoverMiddleY * 2) / 3) {
        position = "after";
      } else {
        if (!isContainer) {
          position = hoverClientY < hoverMiddleY ? "before" : "after";
        } else {
          position = "inside";
        }
      }

      setDropPosition(position);

      if (dragItem.source === "tree" && monitor.canDrop()) {
        moveItem(dragItem.id, id, position);
      }
    },
    drop: (dragItem: DragItem, monitor): DropResult | undefined => {
      if (!monitor.canDrop()) return undefined;

      if (!isContainer && dropPosition === "inside") {
        return undefined;
      }

      const position = dropPosition || (isContainer ? "inside" : "before");
      onDrop(
        dragItem.id,
        id,
        position,
        dragItem.source || "tree",
        dragItem.nodeData
      );
      return { id, position };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  // 使用 callback refs 来连接 drag 和 drop
  const setDragRef = useCallback(
    (node: HTMLDivElement | null) => {
      dragRef.current = node;
      drag(node);
    },
    [drag]
  );

  const setDropRef = useCallback(
    (node: HTMLDivElement | null) => {
      dropRef.current = node;
      drop(node);
    },
    [drop]
  );

  // 合并 drag 和 drop refs
  const setRefs: any = useCallback(
    (node: HTMLDivElement | null) => {
      setDragRef(node);
      setDropRef(node);
    },
    [setDragRef, setDropRef]
  );

  // 修复点击事件冒泡问题
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
    // onSelect(item);
  };

  // 获取放置指示器样式
  const getDropIndicatorStyle = () => {
    if (!isOver || !dropPosition) return {};

    const styles: React.CSSProperties = {
      position: "absolute",
      left: 0,
      right: 0,
      height: "2px",
      backgroundColor: canDrop ? "blue" : "red",
    };

    switch (dropPosition) {
      case "before":
        return { ...styles, top: 0 };
      case "after":
        return { ...styles, bottom: 0 };
      case "inside":
        if (!isContainer) return {};
        return {
          ...styles,
          top: "50%",
          transform: "translateY(-50%)",
          height: "4px",
          backgroundColor: canDrop ? "green" : "red",
        };
      default:
        return {};
    }
  };

  // 获取容器样式
  const getContainerStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: "relative",
      marginLeft: `${depth * 20}px`,
      opacity: isDragging ? 0.5 : 1,
      padding: "8px",
      border: "1px solid #ddd",
      marginBottom: "4px",
      background: "#fff",
      cursor: "move",
      borderRadius: "4px",
    };

    if (isOver && !isSelected) {
      if (dropPosition === "inside" && isContainer) {
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
  };
  const asset = findAsset(componentName);
  if (componentName === "Button") {
    const Com = asset.library;
    return <Com {...props} ref={setRefs} data-node-id={id} />;
  }

  return (
    <div
      ref={setRefs}
      style={getContainerStyle()}
      data-node-id={id}
      onClick={handleClick}
    >
      {/* 拖拽指示器 */}
      {isOver && canDrop && dropPosition && (
        <div style={getDropIndicatorStyle()} />
      )}

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

      {/* 渲染子元素 */}
      {isContainer && children && children.length > 0 && (
        <div style={{ marginTop: "8px" }}>
          {children.map((child, childIndex) => (
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
            />
          ))}
        </div>
      )}

      {/* 空容器提示 */}
      {isContainer && (!children || children.length === 0) && (
        <div
          onClick={handleClick}
          style={{
            marginTop: "8px",
            padding: "12px",
            background: "#fafafa",
            border: "1px dashed #d9d9d9",
            borderRadius: "4px",
            fontSize: "12px",
            color: "#999",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          {isOver && dropPosition === "inside"
            ? "释放以添加到此容器"
            : "暂无子元素"}
        </div>
      )}
    </div>
  );
};
