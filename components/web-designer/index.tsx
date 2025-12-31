"use client";

import React, { useState, useCallback, useEffect } from "react";
import { DndProvider, useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "../ui/button";
import { DesignerNode, ComponentTemplate } from "./types";
import ComponentPanel from "./component-panel";
import PropertyPanel from "./property-panel";

interface DragItem {
  id: string;
  type: string;
  depth: number;
  parentId: string | null;
  isContainer?: boolean;
  source?: "panel" | "tree";
  nodeData?: DesignerNode;
}

interface DropResult {
  id: string;
  position: "before" | "after" | "inside";
}

/** 组件物料数据 **/
const componentTemplates: ComponentTemplate[] = [
  {
    id: "container",
    name: "Container",
    title: "容器",
    isContainer: true,
    defaultProps: { padding: 12, background: "#fff" },
    defaultStyle: { padding: "12px", border: "1px solid #ddd", minHeight: "100px" }
  },
  {
    id: "button",
    name: "Button",
    title: "按钮",
    isContainer: false,
    defaultProps: { type: "primary", children: "按钮" },
    defaultStyle: { padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer" }
  },
  {
    id: "text",
    name: "Text",
    title: "文本",
    isContainer: false,
    defaultProps: { children: "文本内容" },
    defaultStyle: { fontSize: "14px", lineHeight: 1.5, color: "#333" }
  },
  {
    id: "input",
    name: "Input",
    title: "输入框",
    isContainer: false,
    defaultProps: { placeholder: "请输入" },
    defaultStyle: { padding: "8px 12px", border: "1px solid #ccc", borderRadius: "4px" }
  },
  {
    id: "card",
    name: "Card",
    title: "卡片",
    isContainer: true,
    defaultProps: { title: "卡片标题" },
    defaultStyle: { padding: "16px", border: "1px solid #eee", borderRadius: "8px", background: "#fff" }
  }
];

/** 初始数据 **/
const initialItems: DesignerNode[] = [
  {
    id: "root",
    title: "页面根节点",
    componentName: "Page",
    isContainer: true,
    props: {},
    style: {},
    children: [
      {
        id: "container1",
        title: "容器1",
        componentName: "Container",
        isContainer: true,
        props: { padding: 12 },
        style: { padding: "12px", border: "1px solid #ddd", minHeight: "100px" },
        children: [
          { 
            id: "button1", 
            title: "按钮1", 
            componentName: "Button", 
            isContainer: false,
            props: { type: "primary", children: "按钮1" },
            style: { padding: "8px 16px", background: "#1890ff", color: "#fff", borderRadius: "4px" }
          },
          { 
            id: "text1", 
            title: "文本1", 
            componentName: "Text", 
            isContainer: false,
            props: { children: "文本内容" },
            style: { fontSize: "14px", color: "#333" }
          },
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
  index,
  parentId,
  selectedNodeId,
  onSelect,
  onDrop,
  findItem,
  moveItem,
}) => {
  const { id, children, isContainer, title, componentName } = item;
  const [dropPosition, setDropPosition] = useState<
    "before" | "after" | "inside" | null
  >(null);
  const isSelected = selectedNodeId === id;

  // 使用 useDrag 实现拖拽
  const [{ isDragging }, drag, preview] = useDrag({
    type: "tree-item",
    item: (): DragItem => ({
      id,
      type: "tree-item",
      depth,
      parentId,
      isContainer,
      source: "tree",
      nodeData: item
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // 使用 useDrop 实现放置区域
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ["tree-item", "component-panel-item"],
    canDrop: (dragItem: DragItem, monitor) => {
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

      const hoverBoundingRect = (
        ref.current as unknown as HTMLElement
      )?.getBoundingClientRect();
      if (!hoverBoundingRect) return;

      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
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

  const ref = React.useRef<HTMLDivElement>(null);
  drag(drop(ref));

  // 修复点击事件冒泡问题
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
    onSelect(item);
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
      border: isSelected ? "2px solid #1890ff" : "1px solid #ddd",
      marginBottom: "4px",
      background: isSelected ? "#e6f7ff" : "#fff",
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

  return (
    <div
      ref={ref}
      style={getContainerStyle()}
      onClick={handleClick}
    >
      {/* 拖拽指示器 */}
      {isOver && canDrop && dropPosition && (
        <div style={getDropIndicatorStyle()} />
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ 
          width: "8px", 
          height: "8px", 
          borderRadius: "50%", 
          background: isContainer ? "#1890ff" : "#52c41a" 
        }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "bold" }}>{title || id}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>{componentName}</div>
        </div>
        {isContainer && (
          <span style={{
            fontSize: "12px",
            color: "#1890ff",
            background: "#e6f7ff",
            padding: "2px 8px",
            borderRadius: "3px"
          }}>
            容器
          </span>
        )}
      </div>

      {/* 渲染子元素 */}
      {isContainer && children && children.length > 0 && (
        <div style={{ marginTop: "8px" }}>
          {children.map((child, childIndex) => (
            <DraggableTreeItem
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
            cursor: "pointer"
          }}
        >
          {isOver && dropPosition === "inside" ? 
            "释放以添加到此容器" : "暂无子元素"
          }
        </div>
      )}
    </div>
  );
};

/** 主组件 **/
export default function Designer() {
  const [items, setItems] = useState<DesignerNode[]>(initialItems);
  const [selectedNode, setSelectedNode] = useState<DesignerNode | null>(null);
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
          if (item.id === id) {
            if (selectedNode?.id === id) {
              setSelectedNode(null);
            }
            return false;
          }
          if (item.isContainer && item.children) {
            item.children = removeRecursive(id, item.children);
          }
          return true;
        });
      };
      return removeRecursive(id, tree);
    },
    [selectedNode]
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
      position: "before" | "after" | "inside",
      source: "panel" | "tree" = "tree",
      nodeData?: DesignerNode
    ) => {
      if (source === "tree" && dragId === dropId) {
        setErrorMessage("不能将元素拖拽到自身");
        return;
      }

      let draggedItem: DesignerNode;
      
      if (source === "panel") {
        // 从面板拖拽
        const template = componentTemplates.find(t => t.id === dragId);
        if (!template) {
          setErrorMessage(`找不到组件模板: ${dragId}`);
          return;
        }
        
        // 生成唯一ID
        const newId = `${template.name.toLowerCase()}_${Date.now()}`;
        draggedItem = {
          id: newId,
          title: template.title,
          componentName: template.name,
          isContainer: template.isContainer,
          props: { ...template.defaultProps },
          style: { ...template.defaultStyle },
          children: template.isContainer ? [] : undefined
        };
      } else {
        // 树内拖拽
        draggedItem = findItem(dragId)!;
        if (!draggedItem) {
          setErrorMessage(`找不到拖拽的元素: ${dragId}`);
          return;
        }
      }

      const dropItem = findItem(dropId);
      if (!dropItem) {
        setErrorMessage(`找不到目标元素: ${dropId}`);
        return;
      }

      // 检查是否尝试放置到自己的子节点中
      if (source === "tree") {
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
      }

      // 检查目标是否是容器
      if (position === "inside" && !dropItem.isContainer) {
        setErrorMessage(`元素 ${dropId} 不是容器，不能包含子元素`);
        return;
      }

      setItems((prevItems) => {
        let newItems = prevItems;
        
        // 如果是树内拖拽，先移除原位置
        if (source === "tree") {
          newItems = removeItem(dragId, prevItems);
        }
        
        // 插入到新位置
        return insertItem(draggedItem, dropId, position, newItems);
      });

      // 选中新添加的节点
      if (source === "panel") {
        setSelectedNode(draggedItem);
      }
    },
    [findItem, removeItem, insertItem]
  );

  // 更新节点属性
  const updateNode = useCallback((nodeId: string, updates: Partial<DesignerNode>) => {
    const updateNodeInTree = (tree: DesignerNode[]): DesignerNode[] => {
      return tree.map(item => {
        if (item.id === nodeId) {
          const updated = { ...item, ...updates };
          if (selectedNode?.id === nodeId) {
            setSelectedNode(updated);
          }
          return updated;
        }
        if (item.isContainer && item.children) {
          return {
            ...item,
            children: updateNodeInTree(item.children)
          };
        }
        return item;
      });
    };

    setItems(prev => updateNodeInTree(prev));
  }, [selectedNode]);

  // 删除节点
  const deleteNode = useCallback((nodeId: string) => {
    setItems(prev => removeItem(nodeId, prev));
  }, [removeItem]);

  // 移动项目的即时反馈
  const moveItem = useCallback(
    (
      dragId: string,
      hoverId: string,
      position: "before" | "after" | "inside"
    ) => {
      // 这里可以实现即时视觉反馈
    },
    []
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ 
        display: "flex", 
        height: "100vh", 
        overflow: "hidden" 
      }}>
        {/* 左侧组件面板 */}
        <ComponentPanel 
          templates={componentTemplates} 
          onDragStart={(template) => {
            console.log("开始拖拽:", template.name);
          }}
        />

        {/* 中间画布区域 */}
        <div 
          style={{ 
            flex: 1, 
            padding: "20px", 
            overflow: "auto",
            borderLeft: "1px solid #f0f0f0",
            borderRight: "1px solid #f0f0f0"
          }}
          onClick={(e) => {
            // 点击画布空白区域取消选中
            if (e.target === e.currentTarget) {
              setSelectedNode(null);
            }
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>组件树</h2>
          
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
              <button 
                onClick={() => setErrorMessage(null)}
                style={{ 
                  marginLeft: "10px", 
                  background: "none", 
                  border: "none", 
                  color: "#ff4d4f",
                  cursor: "pointer"
                }}
              >
                ×
              </button>
            </div>
          )}

          {/* 操作按钮 */}
          <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
            <Button 
              onClick={() => {
                const containerTemplate = componentTemplates.find(t => t.id === "container");
                if (containerTemplate) {
                  const newId = `container_${Date.now()}`;
                  const newItem: DesignerNode = {
                    id: newId,
                    title: "新容器",
                    componentName: "Container",
                    isContainer: true,
                    props: { padding: 12 },
                    style: { padding: "12px", border: "1px solid #ddd" },
                    children: []
                  };
                  setItems(prev => [{
                    ...prev[0],
                    children: [...(prev[0]?.children || []), newItem]
                  }]);
                  setSelectedNode(newItem);
                }
              }}
            >
              添加容器
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                if (selectedNode) {
                  deleteNode(selectedNode.id);
                }
              }}
              disabled={!selectedNode || selectedNode.id === "root"}
            >
              删除选中
            </Button>
            <div style={{ flex: 1, textAlign: "right", fontSize: "14px", color: "#666" }}>
              当前选中: {selectedNode ? selectedNode.title : "无"}
            </div>
          </div>

          {/* 组件树 */}
          {items.map((item, index) => (
            <DraggableTreeItem
              key={item.id}
              item={item}
              depth={0}
              index={index}
              parentId={null}
              selectedNodeId={selectedNode?.id || null}
              onSelect={setSelectedNode}
              onDrop={handleDrop}
              findItem={findItem}
              moveItem={moveItem}
            />
          ))}

          {/* 提示信息 */}
          {!selectedNode && (
            <div style={{
              marginTop: "20px",
              padding: "20px",
              background: "#fafafa",
              border: "1px dashed #d9d9d9",
              borderRadius: "4px",
              textAlign: "center",
              color: "#999"
            }}>
              点击组件以选中，在右侧面板编辑属性
            </div>
          )}
        </div>

        {/* 右侧属性面板 */}
        <PropertyPanel
          selectedNode={selectedNode}
          onUpdate={updateNode}
        />
      </div>
    </DndProvider>
  );
}