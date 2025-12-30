"use client";

import React, { useState, useCallback } from "react";
import { DndProvider, useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "../ui/button";

/** Types **/
interface TreeItem {
  id: string;
  children: TreeItem[];
  collapsed?: boolean;
  parentId?: string | null;
  depth?: number;
}

interface DragItem {
  id: string;
  type: string;
  depth: number;
  parentId: string | null;
}

interface DropResult {
  id: string;
  position: 'before' | 'after' | 'inside';
}

/** 初始数据 **/
const initialItems: TreeItem[] = [
  { id: "Home", children: [] },
  {
    id: "Collections",
    children: [
      { id: "Spring", children: [] },
      { id: "Summer", children: [] },
      { id: "Fall", children: [] },
      { id: "Winter", children: [] },
    ],
    collapsed: false,
  },
  { id: "About Us", children: [] },
  {
    id: "My Account",
    children: [
      { id: "Addresses", children: [] },
      { id: "Order History", children: [] },
    ],
    collapsed: false,
  },
];

/** TreeItem 组件 - 可拖拽和放置 **/
const DraggableTreeItem: React.FC<{
  item: TreeItem;
  depth: number;
  index: number;
  parentId: string | null;
  onDrop: (dragId: string, dropId: string, position: 'before' | 'after' | 'inside') => void;
  onToggle: (id: string) => void;
  findItem: (id: string) => TreeItem | undefined;
  moveItem: (dragId: string, hoverId: string, position: 'before' | 'after' | 'inside') => void;
}> = ({ item, depth, index, parentId, onDrop, onToggle, findItem, moveItem }) => {
  const { id, children, collapsed = false } = item;
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | 'inside' | null>(null);

  // 使用 useDrag 实现拖拽
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'tree-item',
    item: (): DragItem => ({
      id,
      type: 'tree-item',
      depth,
      parentId,
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // 使用 useDrop 实现放置区域
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'tree-item',
    hover: (dragItem: DragItem, monitor: DropTargetMonitor) => {
      if (dragItem.id === id) return;
      
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      
      const hoverBoundingRect = (ref.current as HTMLElement)?.getBoundingClientRect();
      if (!hoverBoundingRect) return;
      
      // 计算鼠标在元素中的位置
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      
      // 判断放置位置
      let position: 'before' | 'after' | 'inside';
      if (hoverClientY < hoverMiddleY / 3) {
        position = 'before';
      } else if (hoverClientY > hoverMiddleY * 2 / 3) {
        position = 'after';
      } else {
        position = 'inside';
      }
      
      setDropPosition(position);
      
      // 立即移动（可选，或者可以在 drop 时移动）
      moveItem(dragItem.id, id, position);
    },
    drop: (dragItem: DragItem): DropResult => {
      const position = dropPosition || 'inside';
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

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggle(id);
  };

  // 渲染样式
  const getDropIndicatorStyle = () => {
    if (!isOver || !dropPosition) return {};
    
    const styles: React.CSSProperties = {
      position: 'absolute',
      left: 0,
      right: 0,
      height: '2px',
      backgroundColor: 'blue',
    };
    
    switch (dropPosition) {
      case 'before':
        return { ...styles, top: 0 };
      case 'after':
        return { ...styles, bottom: 0 };
      case 'inside':
        return {
          ...styles,
          top: '50%',
          transform: 'translateY(-50%)',
          height: '4px',
        };
      default:
        return {};
    }
  };

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        marginLeft: `${depth * 20}px`,
        opacity: isDragging ? 0.5 : 1,
        padding: '8px',
        border: '1px solid #ddd',
        marginBottom: '4px',
        background: isOver ? '#f0f0f0' : '#fff',
        cursor: 'move',
      }}
    >
      {/* 拖拽指示器 */}
      {isOver && <div style={getDropIndicatorStyle()} />}
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {children.length > 0 && (
          <button
            onClick={handleToggle}
            style={{
              marginRight: '8px',
              padding: '2px 6px',
              border: 'none',
              background: '#eee',
              cursor: 'pointer',
            }}
          >
            {collapsed ? '+' : '-'}
          </button>
        )}
        <span>{id}</span>
      </div>
      
      {/* 渲染子元素（如果没有折叠） */}
      {!collapsed && children.length > 0 && (
        <div style={{ marginTop: '8px' }}>
          {children.map((child, childIndex) => (
            <DraggableTreeItem
              key={child.id}
              item={child}
              depth={depth + 1}
              index={childIndex}
              parentId={id}
              onDrop={onDrop}
              onToggle={onToggle}
              findItem={findItem}
              moveItem={moveItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/** 主组件 **/
export default function ReactDndTree() {
  const [items, setItems] = useState<TreeItem[]>(initialItems);
  const [draggedItem, setDraggedItem] = useState<TreeItem | null>(null);

  // 查找树中的项目
  const findItem = useCallback((id: string, tree: TreeItem[] = items): TreeItem | undefined => {
    for (const item of tree) {
      if (item.id === id) return item;
      if (item.children.length > 0) {
        const found = findItem(id, item.children);
        if (found) return found;
      }
    }
    return undefined;
  }, [items]);

  // 从树中移除项目
  const removeItem = useCallback((id: string, tree: TreeItem[]): TreeItem[] => {
    return tree.filter(item => {
      if (item.id === id) return false;
      if (item.children.length > 0) {
        item.children = removeItem(id, item.children);
      }
      return true;
    });
  }, []);

  // 向树中添加项目
  const insertItem = useCallback((
    item: TreeItem,
    targetId: string,
    position: 'before' | 'after' | 'inside',
    tree: TreeItem[]
  ): TreeItem[] => {
    return tree.flatMap(node => {
      if (node.id === targetId) {
        if (position === 'inside') {
          return [{
            ...node,
            children: [item, ...node.children]
          }];
        } else if (position === 'before') {
          return [item, node];
        } else { // after
          return [node, item];
        }
      }
      
      if (node.children.length > 0) {
        return [{
          ...node,
          children: insertItem(item, targetId, position, node.children)
        }];
      }
      
      return [node];
    });
  }, []);

  // 处理拖拽放置
  const handleDrop = useCallback((dragId: string, dropId: string, position: 'before' | 'after' | 'inside') => {
    if (dragId === dropId) return;
    
    const draggedItem = findItem(dragId);
    if (!draggedItem) return;
    
    // 检查是否尝试放置到自己的子节点中
    const isDescendant = (parentId: string, childId: string): boolean => {
      const item = findItem(parentId);
      if (!item) return false;
      if (item.children.some(child => child.id === childId)) return true;
      return item.children.some(child => isDescendant(child.id, childId));
    };
    
    if (position === 'inside' && isDescendant(dragId, dropId)) {
      console.warn('不能将父节点拖拽到子节点中');
      return;
    }
    
    setItems(prevItems => {
      // 1. 移除拖拽的项目
      const withoutDragged = removeItem(dragId, prevItems);
      // 2. 插入到新位置
      return insertItem(draggedItem, dropId, position, withoutDragged);
    });
  }, [findItem, removeItem, insertItem]);

  // 移动项目的即时反馈
  const moveItem = useCallback((dragId: string, hoverId: string, position: 'before' | 'after' | 'inside') => {
    // 这里可以实现即时视觉反馈
    console.log(`移动 ${dragId} 到 ${hoverId} 的 ${position} 位置`);
  }, []);

  // 切换折叠状态
  const handleToggle = useCallback((id: string) => {
    setItems(prevItems => {
      const toggle = (tree: TreeItem[]): TreeItem[] => {
        return tree.map(item => {
          if (item.id === id) {
            return { ...item, collapsed: !item.collapsed };
          }
          if (item.children.length > 0) {
            return { ...item, children: toggle(item.children) };
          }
          return item;
        });
      };
      return toggle(prevItems);
    });
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ padding: '20px', maxWidth: '600px' }}>
        <h2>React DnD 树形拖拽</h2>
        <div style={{ marginBottom: '20px' }}>
          <p>拖拽项目到其他项目上，可以放在前面、后面或内部</p>
        </div>
        
        {items.map((item, index) => (
          <DraggableTreeItem
            key={item.id}
            item={item}
            depth={0}
            index={index}
            parentId={null}
            onDrop={handleDrop}
            onToggle={handleToggle}
            findItem={findItem}
            moveItem={moveItem}
          />
        ))}
        
        {/* 拖拽预览 */}
        {draggedItem && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              pointerEvents: 'none',
              zIndex: 100,
              opacity: 0.8,
            }}
          >
            <div
              style={{
                padding: '8px',
                background: '#fff',
                border: '2px dashed #666',
                borderRadius: '4px',
              }}
            >
              {draggedItem.id}
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
}