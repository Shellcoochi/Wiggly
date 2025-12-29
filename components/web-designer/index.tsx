"use client";

import React, { useState, useMemo, useEffect, CSSProperties } from "react";
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
  UniqueIdentifier,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from "@dnd-kit/sortable";

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
function flattenTree(items: TreeItem[], parentId: UniqueIdentifier | null = null, depth = 0): FlattenedItem[] {
  return items.reduce<FlattenedItem[]>((acc, item, index) => {
    const current: FlattenedItem = { ...item, parentId, depth, index };
    const children = item.collapsed ? [] : flattenTree(item.children, item.id, depth + 1);
    return [...acc, current, ...children];
  }, []);
}

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

/** `getProjection` 函数实现 **/
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

/** 树形渲染：递归渲染父子节点 **/
interface SortableTreeItemProps {
  item: TreeItem;
  depth: number;
  onToggle: (id: UniqueIdentifier) => void;
  collapsed: boolean;
  isDragging?: boolean;
}
function SortableTreeItem({ item, depth, onToggle, collapsed, isDragging = false }: SortableTreeItemProps) {
  const { id, children } = item;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isDndDragging } = useSortable({ id });

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggle(id);
  };

  const style: CSSProperties = {
    // transform: CSS.Translate.toString(transform),
    transition,
    paddingLeft: depth * 40, // 控制缩进
    opacity: isDndDragging ? 0.5 : 1,
    background: "#fafafa",
    border: "1px solid #ddd",
    margin: "4px 0",
    display: "flex",
    alignItems: "center",
    cursor: isDndDragging ? "grabbing" : "grab",
    minHeight: "40px",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children.length > 0 && (
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
          }}
        >
          {collapsed ? "+" : "-"}
        </button>
      )}
      {item.id}
      {children.length > 0 && !collapsed && (
        <div style={{ marginLeft: 20 }}>
          {children.map((child) => (
            <SortableTreeItem
              key={child.id}
              item={child}
              depth={depth + 1}
              onToggle={onToggle}
              collapsed={collapsed}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** 主组件 - 添加 toggle 功能 **/
export default function AliLowcodeTree() {
  const [items, setItems] = useState<TreeItem[]>(initialItems);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);

  const flattenedItems = useMemo(() => flattenTree(items), [items]);

  const projected = useMemo(() => {
    if (activeId && overId) return getProjection(flattenedItems, activeId, overId, offsetLeft, 40);
    return null;
  }, [activeId, overId, offsetLeft, flattenedItems]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const activeItem = activeId ? flattenedItems.find((i) => i.id === activeId) : null;

  const sortedIds = useMemo(() => flattenedItems.map((i) => i.id), [flattenedItems]);

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
        {items.map((item) => (
          <SortableTreeItem
            key={item.id}
            item={item}
            depth={0}
            onToggle={handleToggle}
            collapsed={item.collapsed || false}
          />
        ))}
      </SortableContext>

      {createPortal(
        <DragOverlay>
          {activeId && activeItem ? (
            <SortableTreeItem
              item={activeItem}
              depth={activeItem.depth}
              clone
              onToggle={handleToggle}
              collapsed={activeItem.collapsed || false}
            />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
