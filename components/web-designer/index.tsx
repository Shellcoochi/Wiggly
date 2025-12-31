"use client";

import React, { useState, useCallback } from "react";
import { DndProvider, useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "../ui/button";
import { DesignerNode } from "./types";

interface DragItem {
  id: string;
  type: string;
  depth: number;
  parentId: string | null;
  isContainer?: boolean; // 增加 isContainer 字段
}

interface DropResult {
  id: string;
  position: "before" | "after" | "inside";
}

/** 初始数据 **/
const initialItems: DesignerNode[] = [
  {
    id: "Root",
    title: "",
    componentName: "",
    isContainer: true,
    children: [
      {
        id: "container1",
        title: "容器",
        componentName: "Container",
        isContainer: true,
      },
      {
        id: "container2",
        title: "容器",
        componentName: "Container",
        isContainer: true,
        children: [
          { id: "text1", title: "文本1", componentName: "Text", isContainer: false },
          { id: "text2", title: "文本2", componentName: "Text", isContainer: false },
          { id: "text3", title: "文本3", componentName: "Text", isContainer: false },
          { id: "text4", title: "文本4", componentName: "Text", isContainer: false },
        ],
      },
      {
        id: "container3",
        title: "容器",
        componentName: "Container",
        isContainer: true,
      },
      {
        id: "container4",
        title: "容器",
        componentName: "Container",
        isContainer: true,
        children: [
          { id: "button1", title: "按钮1", componentName: "Button", isContainer: false },
          { id: "button2", title: "按钮2", componentName: "Button", isContainer: false },
        ],
      },
    ],
  },
];

/** TreeItem 组件 - 可拖拽和放置 **/
const DraggableTreeItem: React.FC<{
  item: DesignerNode;
  depth: number;
  index: number;
  parentId: string | null;
  onDrop: (
    dragId: string,
    dropId: string,
    position: "before" | "after" | "inside"
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
  index,
  parentId,
  onDrop,
  findItem,
  moveItem,
}) => {
  const { id, children, isContainer } = item;
  const [dropPosition, setDropPosition] = useState<
    "before" | "after" | "inside" | null
  >(null);

  // 使用 useDrag 实现拖拽
  const [{ isDragging }, drag, preview] = useDrag({
    type: "tree-item",
    item: (): DragItem => ({
      id,
      type: "tree-item",
      depth,
      parentId,
      isContainer, // 传递 isContainer
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // 使用 useDrop 实现放置区域
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "tree-item",
    canDrop: (dragItem: DragItem) => {
      // 禁止将自己拖拽到自己内部
      if (dragItem.id === id) return false;
      
      // 如果目标不是容器，则不允许放置到内部
      if (dragItem.parentId === id && dragItem.depth < depth) {
        return false;
      }
      
      return true;
    },
    hover: (dragItem: DragItem, monitor: DropTargetMonitor) => {
      if (dragItem.id === id) return;
      
      if (!monitor.canDrop()) {
        setDropPosition(null);
        return;
      }

      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const hoverBoundingRect = (
        ref.current as unknown as HTMLElement
      )?.getBoundingClientRect();
      if (!hoverBoundingRect) return;

      // 计算鼠标在元素中的位置
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // 判断放置位置
      let position: "before" | "after" | "inside";
      if (hoverClientY < hoverMiddleY / 3) {
        position = "before";
      } else if (hoverClientY > (hoverMiddleY * 2) / 3) {
        position = "after";
      } else {
        // 如果目标不是容器，则不允许放置到内部
        if (!isContainer) {
          position = hoverClientY < hoverMiddleY ? "before" : "after";
        } else {
          position = "inside";
        }
      }

      setDropPosition(position);

      // 只在可以放置时才移动
      if (monitor.canDrop()) {
        moveItem(dragItem.id, id, position);
      }
    },
    drop: (dragItem: DragItem): DropResult | undefined => {
      if (!isContainer && dropPosition === "inside") {
        // 如果不是容器，不允许放置到内部
        console.warn(`元素 ${id} 不是容器，不能放置到内部`);
        return undefined;
      }
      
      const position = dropPosition || (isContainer ? "inside" : "before");
      onDrop(dragItem.id, id, position);
      return { id, position };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const ref = React.useRef(null);
  drag(drop(ref));

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
        if (!isContainer) return {}; // 非容器不显示内部指示器
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
    };

    if (isOver) {
      if (dropPosition === "inside" && isContainer) {
        baseStyle.background = "#e6f7ff";
        baseStyle.border = "2px dashed #1890ff";
      } else {
        baseStyle.background = "#f0f0f0";
      }
    }

    if (!canDrop && isOver) {
      baseStyle.border = "1px solid #ff4d4f";
      baseStyle.background = "#fff2f0";
    }

    return baseStyle;
  };

  return (
    <div
      ref={ref}
      style={getContainerStyle()}
    >
      {/* 拖拽指示器 */}
      {isOver && canDrop && dropPosition && (
        <div style={getDropIndicatorStyle()} />
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span>{id}</span>
        {isContainer && (
          <span style={{
            fontSize: "12px",
            color: "#666",
            background: "#f0f0f0",
            padding: "2px 6px",
            borderRadius: "3px"
          }}>
            容器
          </span>
        )}
        {!isContainer && (
          <span style={{
            fontSize: "12px",
            color: "#999",
            background: "#f9f9f9",
            padding: "2px 6px",
            borderRadius: "3px"
          }}>
            元素
          </span>
        )}
      </div>

      {/* 渲染子元素（如果存在且是容器） */}
      {isContainer && children && children.length > 0 && (
        <div style={{ marginTop: "8px" }}>
          {children.map((child, childIndex) => (
            <DraggableTreeItem
              key={child.id}
              item={child}
              depth={depth + 1}
              index={childIndex}
              parentId={id}
              onDrop={onDrop}
              findItem={findItem}
              moveItem={moveItem}
            />
          ))}
        </div>
      )}
      
      {/* 空容器提示 */}
      {isContainer && (!children || children.length === 0) && (
        <div style={{
          marginTop: "8px",
          padding: "8px",
          background: "#f9f9f9",
          border: "1px dashed #ddd",
          borderRadius: "4px",
          fontSize: "12px",
          color: "#999",
          textAlign: "center"
        }}>
          {isOver && dropPosition === "inside" ? 
            "可拖入元素到此容器" : "空容器"
          }
        </div>
      )}
    </div>
  );
};

/** 主组件 **/
export default function ReactDndTree() {
  const [items, setItems] = useState<DesignerNode[]>(initialItems);
  const [draggedItem, setDraggedItem] = useState<DesignerNode | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 查找树中的项目
  const findItem = useCallback(
    (id: string, tree: DesignerNode[] = items): DesignerNode | undefined => {
      for (const item of tree) {
        if (item.id === id) return item;
        if (item.isContainer && item.children) {
          const found = findItem(id, item.children);
          if (found) return found;
        }
      }
      return undefined;
    },
    [items]
  );

  // 从树中移除项目
  const removeItem = useCallback(
    (id: string, tree: DesignerNode[]): DesignerNode[] => {
      const removeRecursive = (
        id: string,
        tree: DesignerNode[]
      ): DesignerNode[] => {
        return tree.filter((item) => {
          if (item.id === id) return false;
          if (item.isContainer && item.children) {
            item.children = removeRecursive(id, item.children);
          }
          return true;
        });
      };
      return removeRecursive(id, tree);
    },
    []
  );

  // 向树中添加项目
  const insertItem = useCallback(
    (
      item: DesignerNode,
      targetId: string,
      position: "before" | "after" | "inside",
      tree: DesignerNode[]
    ): DesignerNode[] => {
      return tree.flatMap((node) => {
        if (node.id === targetId) {
          if (position === "inside") {
            // 只有容器才能有子元素
            if (!node.isContainer) {
              setErrorMessage(`元素 ${targetId} 不是容器，不能包含子元素`);
              return [node];
            }
            setErrorMessage(null);
            return [
              {
                ...node,
                children: [item, ...(node.children ?? [])],
              },
            ];
          } else if (position === "before") {
            setErrorMessage(null);
            return [item, node];
          } else {
            // after
            setErrorMessage(null);
            return [node, item];
          }
        }

        if (node.isContainer && node.children) {
          return [
            {
              ...node,
              children: insertItem(item, targetId, position, node.children),
            },
          ];
        }

        return [node];
      });
    },
    []
  );

  // 处理拖拽放置
  const handleDrop = useCallback(
    (
      dragId: string,
      dropId: string,
      position: "before" | "after" | "inside"
    ) => {
      if (dragId === dropId) {
        setErrorMessage("不能将元素拖拽到自身");
        return;
      }

      const draggedItem = findItem(dragId);
      if (!draggedItem) {
        setErrorMessage(`找不到拖拽的元素: ${dragId}`);
        return;
      }

      const dropItem = findItem(dropId);
      if (!dropItem) {
        setErrorMessage(`找不到目标元素: ${dropId}`);
        return;
      }

      // 检查是否尝试放置到自己的子节点中
      const isDescendant = (parentId: string, childId: string): boolean => {
        const item = findItem(parentId);
        if (!item) return false;
        if (item.children?.some((child) => child.id === childId)) return true;
        return !!item.children?.some((child) => isDescendant(child.id, childId));
      };

      if (position === "inside" && isDescendant(dragId, dropId)) {
        setErrorMessage("不能将父节点拖拽到子节点中");
        return;
      }

      // 检查目标是否是容器
      if (position === "inside" && !dropItem.isContainer) {
        setErrorMessage(`元素 ${dropId} 不是容器，不能包含子元素`);
        return;
      }

      setItems((prevItems) => {
        // 1. 移除拖拽的项目
        const withoutDragged = removeItem(dragId, prevItems);
        // 2. 插入到新位置
        return insertItem(draggedItem, dropId, position, withoutDragged);
      });
    },
    [findItem, removeItem, insertItem]
  );

  // 移动项目的即时反馈
  const moveItem = useCallback(
    (
      dragId: string,
      hoverId: string,
      position: "before" | "after" | "inside"
    ) => {
      // 这里可以实现即时视觉反馈
      console.log(`移动 ${dragId} 到 ${hoverId} 的 ${position} 位置`);
    },
    []
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ padding: "20px", maxWidth: "600px" }}>
        <h2>React DnD 树形拖拽</h2>
        
        {/* 错误提示 */}
        {errorMessage && (
          <div style={{
            padding: "10px",
            marginBottom: "10px",
            backgroundColor: "#fff2f0",
            border: "1px solid #ffccc7",
            borderRadius: "4px",
            color: "#ff4d4f"
          }}>
            {errorMessage}
          </div>
        )}

        <div style={{ marginBottom: "20px" }}>
          <p style={{ marginBottom: "8px" }}>
            <strong>使用说明：</strong>
          </p>
          <ul style={{ paddingLeft: "20px", margin: 0 }}>
            <li>容器（蓝色标签）可以包含子元素，可以拖拽元素到容器内部</li>
            <li>元素（灰色标签）不能包含子元素，只能拖拽到其他位置</li>
            <li>拖拽到目标元素上会出现指示线，表示放置位置</li>
            <li>蓝色线：可放置位置</li>
            <li>绿色线：可放置到内部（仅容器）</li>
            <li>红色线：不可放置</li>
          </ul>
        </div>

        {items.map((item, index) => (
          <DraggableTreeItem
            key={item.id}
            item={item}
            depth={0}
            index={index}
            parentId={null}
            onDrop={handleDrop}
            findItem={findItem}
            moveItem={moveItem}
          />
        ))}

        {/* 拖拽预览 */}
        {draggedItem && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              pointerEvents: "none",
              zIndex: 100,
              opacity: 0.8,
            }}
          >
            <div
              style={{
                padding: "8px",
                background: "#fff",
                border: "2px dashed #666",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <span>{draggedItem.id}</span>
              {draggedItem.isContainer && (
                <span style={{
                  fontSize: "10px",
                  color: "#666",
                  background: "#f0f0f0",
                  padding: "1px 4px",
                  borderRadius: "2px"
                }}>
                  容器
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
}