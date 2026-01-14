import { useCallback, useRef, useState } from "react";
import { DesignerNode, DragItem, DropResult } from "./types";
import { useDrag, useDrop } from "react-dnd";
import type { DropTargetMonitor } from "react-dnd";
import { findAsset } from "./utils/tools";

const getDistance = (dom: any, point: any) => {
  const rect = dom.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  return Math.sqrt((point.x - centerX) ** 2 + (point.y - centerY) ** 2);
};

const getPosition = (dom: any, point: any, direction: any) => {
  const rect = dom.getBoundingClientRect();
  const { x, y } = point;

  // 根据方向判断
  if (direction === "row") {
    // 判断左右
    const distanceToLeft = Math.abs(x - rect.left); // 距离左边的距离
    const distanceToRight = Math.abs(x - rect.right); // 距离右边的距离

    if (distanceToLeft < distanceToRight) {
      return "left"; // 鼠标靠左边更近
    } else {
      return "right"; // 鼠标靠右边更近
    }
  } else if (direction === "col") {
    // 判断上下
    const distanceToTop = Math.abs(y - rect.top); // 距离上边的距离
    const distanceToBottom = Math.abs(y - rect.bottom); // 距离下边的距离

    if (distanceToTop < distanceToBottom) {
      return "top"; // 鼠标靠上边更近
    } else {
      return "bottom"; // 鼠标靠下边更近
    }
  }

  // 如果 direction 不是 'row' 或 'col'，返回 null
  return null;
};

export const NodeItem: React.FC<{
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
    nodeData?: DesignerNode
  ) => void;
  findItem: (id: string) => DesignerNode | undefined;
  moveItem: (dragId: string, hoverId: string, position: DropResult) => void;
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
  const [dropPosition, setDropPosition] = useState<DropResult | null>(null);
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
      if (!monitor.isOver({ shallow: true })) {
        return;
      }
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

      let result: DropResult = { id, position: "inside" };
      if (isContainer) {
        // 如果在容器内，首先获取容器的布局方式，默认值为横向布局
        const direction = props?.direction ?? "row";
        // 如果没有子元素则直接返回 inside
        if (children?.length === 0) {
          result = { id, position: "inside" };
        } else {
          // 获取距离拖拽节点最近的子元素
          let shortest: any = undefined;
          children?.forEach((child) => {
            const childEl = document.querySelector(
              `[data-node-id="${child.id}"]`
            );
            const distance = getDistance(childEl, clientOffset);
            if (shortest === undefined || distance < shortest) {
              shortest = distance;
              // 如果是横向布局，判断离最近的元素左侧近还是右侧近
              // 如果是纵向布局，判断离最近的元素上侧近还是下侧近
              const position =
                getPosition(childEl, clientOffset, direction) ?? "inside";
              result = { id: child.id, position };
            }
          });
        }
      }
      setDropPosition(result);
      onSelect(item);
      moveItem(dragItem.id, id, result);
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
        dragItem.nodeData
      );
      return position;
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

  const asset = findAsset(componentName);
  if (componentName === "Button") {
    const Com = asset.library;
    return <Com {...props} ref={setRefs} data-node-id={id} />;
  }
  if (componentName === "Container") {
    const Com = asset.library;
    return (
      <Com {...props} style={style} ref={setRefs} data-node-id={id}>
        {/* 渲染子元素 */}
        {isContainer && children && children.length > 0 && (
          <>
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
          </>
        )}

        {/* 空容器提示 */}
        {isContainer && (!children || children.length === 0) && (
          <div className="flex items-center justify-center absolute top-0 left-0 right-0 bottom-0 bg-muted m-2 p-3 border rounded text-muted-foreground text-xs">
            {isOver && dropPosition?.position === "inside"
              ? "释放以添加到此容器"
              : "拖拽组件到此容器"}
          </div>
        )}
      </Com>
    );
  }
  if (componentName === "Text" && asset?.library) {
    const Com = asset.library;
    return <Com {...props} ref={setRefs} data-node-id={id} />;
  }
  if (componentName === "Image" && asset?.library) {
    const Com = asset.library;
    return <Com {...props} ref={setRefs} data-node-id={id} />;
  }
};
