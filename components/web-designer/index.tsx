"use client";

import React, { useEffect, useMemo, useRef, useState, CSSProperties } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragStartEvent,
  DragMoveEvent,
  DragOverEvent,
  DragEndEvent,
  MeasuringStrategy,
  defaultDropAnimation,
  DropAnimation,
  UniqueIdentifier,
  Modifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/** Types **/
interface TreeItem {
  id: UniqueIdentifier;
  children: TreeItem[];
  collapsed?: boolean;
  parentId?: UniqueIdentifier | null;
  depth?: number;
}

interface FlattenedItem extends TreeItem {
  parentId: UniqueIdentifier | null;
  depth: number;
  index: number;
}

/** 初始数据 - 添加 collapsed 状态 **/
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
    collapsed: false, // 默认展开
  },
  { id: "About Us", children: [] },
  {
    id: "My Account",
    children: [
      { id: "Addresses", children: [] },
      { id: "Order History", children: [] },
    ],
    collapsed: false, // 默认展开
  },
];

/** 工具函数 - 修改 flattenTree 考虑 collapsed 状态 **/
function flattenTree(
  items: TreeItem[], 
  parentId: UniqueIdentifier | null = null, 
  depth = 0
): FlattenedItem[] {
  return items.reduce<FlattenedItem[]>((acc, item, index) => {
    const current: FlattenedItem = { ...item, parentId, depth, index };
    const children = item.collapsed ? [] : flattenTree(item.children, item.id, depth + 1);
    return [...acc, current, ...children];
  }, []);
}

// 其他工具函数保持不变...
function buildTree(flattened: FlattenedItem[]): TreeItem[] {
  const root: { [key: string]: TreeItem & { parentId: string | null } } = {};
  flattened.forEach((item) => {
    root[item.id.toString()] = { ...item, children: [] };
  });
  const tree: TreeItem[] = [];
  flattened.forEach((item) => {
    if (item.parentId) {
      root[item.parentId].children.push(root[item.id]);
    } else {
      tree.push(root[item.id]);
    }
  });
  return tree;
}

function getChildCount(items: TreeItem[], id: UniqueIdentifier): number {
  const node = findItemDeep(items, id);
  if (!node) return 0;
  const countChildren = (children: TreeItem[]): number =>
    children.reduce((acc, c) => acc + 1 + countChildren(c.children), 0);
  return countChildren(node.children);
}

function findItemDeep(items: TreeItem[], id: UniqueIdentifier): TreeItem | undefined {
  for (const item of items) {
    if (item.id === id) return item;
    const child = findItemDeep(item.children, id);
    if (child) return child;
  }
  return undefined;
}

// 修改 removeChildrenOf 函数，不隐藏有子节点的项本身
function removeChildrenOf(items: FlattenedItem[], ids: UniqueIdentifier[]) {
  const excludeParentIds = [...ids];
  return items.filter((item) => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      excludeParentIds.push(item.id);
      return false;
    }
    return true;
  });
}

function getProjection(
  items: FlattenedItem[],
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier,
  dragOffset: number,
  indentationWidth: number
) {
  const dragDepth = Math.round(dragOffset / indentationWidth);
  const overIndex = items.findIndex((i) => i.id === overId);
  const activeIndex = items.findIndex((i) => i.id === activeId);
  const activeItem = items[activeIndex];
  const newItems = arrayMove(items, activeIndex, overIndex);
  const previousItem = newItems[overIndex - 1];
  let depth = activeItem.depth + dragDepth;
  let parentId: UniqueIdentifier | null = null;

  if (depth === 0 || !previousItem) parentId = null;
  else if (depth === previousItem.depth) parentId = previousItem.parentId;
  else if (depth > previousItem.depth) parentId = previousItem.id;
  else {
    const p = newItems.slice(0, overIndex).reverse().find((i) => i.depth === depth);
    parentId = p?.parentId ?? null;
  }

  return { depth, parentId };
}

/** Tree Item 组件 - 修改点击处理 **/
interface SortableTreeItemProps {
  id: UniqueIdentifier;
  depth: number;
  childCount?: number;
  clone?: boolean;
  value?: string;
  onToggle?: (id: UniqueIdentifier) => void;
  collapsed?: boolean;
  isDragging?: boolean;
}
function SortableTreeItem({ 
  id, 
  depth, 
  childCount = 0, 
  clone, 
  value,
  onToggle,
  collapsed,
  isDragging = false
}: SortableTreeItemProps) {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition, 
    isDragging: isDndDragging
  } = useSortable({ id });

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onToggle && childCount > 0) {
      onToggle(id);
    }
  };

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    paddingLeft: depth * 40,
    opacity: clone ? 0.8 : isDndDragging ? 0.5 : 1,
    background: "#fafafa",
    border: "1px solid #ddd",
    margin: "4px 0",
    display: "flex",
    alignItems: "center",
    cursor: isDndDragging ? "grabbing" : "grab",
    minHeight: "40px",
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
    >
      {childCount > 0 && !clone && (
        <button 
          onClick={handleToggle}
          style={{
            marginRight: "8px",
            background: "none",
            border: "1px solid #ccc",
            borderRadius: "3px",
            width: "20px",
            height: "20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            pointerEvents: isDndDragging ? "none" : "auto",
            opacity: isDndDragging ? 0.5 : 1,
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {collapsed ? "+" : "-"}
        </button>
      )}
      {childCount > 0 && clone && (
        <div style={{ width: "28px", marginRight: "8px" }}></div>
      )}
      {value || id} {childCount > 0 && !clone ? `(${childCount})` : ""}
    </div>
  );
}

/** 主组件 - 添加 toggle 功能 **/
export default function AliLowcodeTree() {
  const [items, setItems] = useState<TreeItem[]>(initialItems);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);

  // 修改：不隐藏 active item 的子节点，只隐藏子节点的子节点
  const flattenedItems = useMemo(() => {
    return flattenTree(items);
  }, [items]);

  const projected = useMemo(() => {
    if (activeId && overId) return getProjection(flattenedItems, activeId, overId, offsetLeft, 40);
    return null;
  }, [activeId, overId, offsetLeft, flattenedItems]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 需要移动5像素才开始拖拽
      },
    }),
    useSensor(KeyboardSensor)
  );

  const activeItem = activeId ? flattenedItems.find((i) => i.id === activeId) : null;

  const sortedIds = useMemo(() => flattenedItems.map((i) => i.id), [flattenedItems]);

  // 切换展开/收起状态
  const handleToggle = (id: UniqueIdentifier) => {
    const toggleCollapsed = (items: TreeItem[]): TreeItem[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, collapsed: !item.collapsed };
        }
        if (item.children.length > 0) {
          return { ...item, children: toggleCollapsed(item.children) };
        }
        return item;
      });
    };
    setItems(prev => toggleCollapsed(prev));
  };

  // 获取某个节点的 collapsed 状态
  const getCollapsedState = (id: UniqueIdentifier): boolean => {
    const findCollapsed = (items: TreeItem[]): boolean | undefined => {
      for (const item of items) {
        if (item.id === id) return item.collapsed || false;
        if (item.children.length > 0) {
          const result = findCollapsed(item.children);
          if (result !== undefined) return result;
        }
      }
      return undefined;
    };
    return findCollapsed(items) || false;
  };

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id);
    setOverId(active.id);
  }

  function handleDragMove({ delta }: DragMoveEvent) {
    setOffsetLeft(delta.x);
  }

  function handleDragOver({ over }: DragOverEvent) {
    setOverId(over?.id ?? null);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    setOverId(null);
    setOffsetLeft(0);
    if (!projected || !over) return;

    const { depth, parentId } = projected;
    const flatClone = [...flattenedItems];
    const activeIndex = flatClone.findIndex((i) => i.id === active.id);
    const overIndex = flatClone.findIndex((i) => i.id === over.id);
    flatClone[activeIndex] = { ...flatClone[activeIndex], depth, parentId };
    const newItems = buildTree(arrayMove(flatClone, activeIndex, overIndex));
    setItems(newItems);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
        {flattenedItems.map((item) => {
          const childCount = getChildCount(items, item.id);
          const collapsed = getCollapsedState(item.id);
          const isBeingDragged = activeId === item.id;
          
          // 如果这个项是正在被拖拽的项的子项，不渲染
          if (activeId && item.parentId === activeId && isBeingDragged === false) {
            return null;
          }
          
          return (
            <SortableTreeItem
              key={item.id}
              id={item.id}
              depth={item.id === activeId && projected ? projected.depth : item.depth}
              value={item.id.toString()}
              childCount={childCount}
              onToggle={handleToggle}
              collapsed={collapsed}
              isDragging={isBeingDragged}
            />
          );
        })}
        {createPortal(
          <DragOverlay>
            {activeId && activeItem ? (
              <SortableTreeItem
                id={activeId}
                depth={activeItem.depth}
                clone
                childCount={getChildCount(items, activeId)}
                value={activeId.toString()}
              />
            ) : null}
          </DragOverlay>,
          document.body
        )}
      </SortableContext>
    </DndContext>
  );
}