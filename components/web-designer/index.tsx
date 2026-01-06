"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "../ui/button";
import { DesignerNode } from "./types";
import ComponentPanel from "./component-panel";
import PropertyPanel from "./property-panel";
import materials from "./material";
import { findNode, generateNodeId } from "./utils/tools";
import { NodeSelector } from "./node-selector";
import { NodeItem } from "./node-item";

const { assets, snippets, categories } = materials;

const findAsset = (componentName: string) => {
  return assets.find((asset: any) => asset.componentName === componentName);
};

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
        style: {
          padding: "12px",
          border: "1px solid #ddd",
          minHeight: "100px",
        },
        children: [
          {
            id: "button1",
            title: "按钮1",
            componentName: "Button",
            isContainer: false,
            props: { type: "primary", children: "按钮1" },
            style: {
              padding: "8px 16px",
              background: "#1890ff",
              color: "#fff",
              borderRadius: "4px",
            },
          },
          {
            id: "text1",
            title: "文本1",
            componentName: "Text",
            isContainer: false,
            props: { children: "文本内容" },
            style: { fontSize: "14px", color: "#333" },
          },
        ],
      },
    ],
  },
];

/** 主组件 **/
export default function Designer() {
  const [items, setItems] = useState<DesignerNode[]>(initialItems);
  const [selectedNode, setSelectedNode] = useState<DesignerNode | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // 监听器
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const nodeId = el
        ?.closest?.("[data-node-id]")
        ?.getAttribute("data-node-id");
      setHoveredNodeId(nodeId || null);
    };

    const handleClickCapture = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const nodeEl = el.closest?.("[data-node-id]");
      const id = nodeEl?.getAttribute("data-node-id");

      if (id) {
        const node = findNode(id, items);
        setSelectedNode(node || null);
      } else {
        setSelectedNode(null);
      }
    };

    // 添加监听（capture 阶段）
    canvas.addEventListener("mousemove", handleMouseMove, { capture: true });
    canvas.addEventListener("click", handleClickCapture, { capture: true });

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove, {
        capture: true,
      });
      canvas.removeEventListener("click", handleClickCapture, {
        capture: true,
      });
    };
  }, [items]); // 确保 items 更新时重新绑定（如果 findNode 依赖它）

  // 查找树中的项目
  const findItem = useCallback(
    function findItemRecursive(
      id: string,
      tree: DesignerNode[] = items
    ): DesignerNode | undefined {
      for (const item of tree) {
        if (item.id === id) return item;
        if (item.isContainer && item.children) {
          const found = findItemRecursive(id, item.children);
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
      source: "panel" | "tree" = "tree"
    ) => {
      if (source === "tree" && dragId === dropId) {
        setErrorMessage("不能将元素拖拽到自身");
        return;
      }

      let draggedItem: DesignerNode;

      if (source === "panel") {
        // 从面板拖拽
        const template = snippets.find((t) => t.id === dragId);
        if (!template) {
          setErrorMessage(`找不到组件模板: ${dragId}`);
          return;
        }

        const asset = findAsset(template.schema.componentName);
        draggedItem = {
          id: generateNodeId(),
          title: template.title,
          componentName: template.schema.componentName,
          isContainer: asset.configure?.component?.isContainer,
          props: { ...template.schema.props },
          style: { ...template.schema.style },
          children: asset.configure?.component?.isContainer ? [] : undefined,
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
          return !!item.children?.some((child) =>
            isDescendant(child.id, childId)
          );
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
  const updateNode = useCallback(
    (nodeId: string, updates: Partial<DesignerNode>) => {
      const updateNodeInTree = (tree: DesignerNode[]): DesignerNode[] => {
        return tree.map((item) => {
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
              children: updateNodeInTree(item.children),
            };
          }
          return item;
        });
      };

      setItems((prev) => updateNodeInTree(prev));
    },
    [selectedNode]
  );

  // 删除节点
  const deleteNode = useCallback(
    (nodeId: string) => {
      setItems((prev) => removeItem(nodeId, prev));
    },
    [removeItem]
  );

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
      <div
        style={{
          display: "flex",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* 左侧组件面板 */}
        <ComponentPanel
          templates={categories}
          onDragStart={(template) => {
            console.log("开始拖拽:", template.name);
          }}
        />

        {/* 中间画布区域 */}
        <div
          ref={canvasRef}
          className="flex-1 overflow-auto relative"
        >
          {/* 错误提示 */}
          {errorMessage && (
            <div
              style={{
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#fff2f0",
                border: "1px solid #ffccc7",
                borderRadius: "4px",
                color: "#ff4d4f",
              }}
            >
              {errorMessage}
              <button
                onClick={() => setErrorMessage(null)}
                style={{
                  marginLeft: "10px",
                  background: "none",
                  border: "none",
                  color: "#ff4d4f",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>
          )}

          {/* 操作按钮 */}
          <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
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
            <div
              style={{
                flex: 1,
                textAlign: "right",
                fontSize: "14px",
                color: "#666",
              }}
            >
              当前选中: {selectedNode ? selectedNode.title : "无"}
            </div>
          </div>

          {/* 组件树 */}
          {items.map((item, index) => (
            <NodeItem
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
            <div
              style={{
                marginTop: "20px",
                padding: "20px",
                background: "#fafafa",
                border: "1px dashed #d9d9d9",
                borderRadius: "4px",
                textAlign: "center",
                color: "#999",
              }}
            >
              点击组件以选中，在右侧面板编辑属性
            </div>
          )}
          {/* Overlay 高亮层 */}
          <div className="absolute inset-0 pointer-events-none">
            {hoveredNodeId && hoveredNodeId !== selectedNode?.id && (
              <NodeSelector nodeId={hoveredNodeId} canvasRef={canvasRef} />
            )}
            {selectedNode && (
              <NodeSelector
                nodeId={selectedNode.id}
                canvasRef={canvasRef}
                isSelected
              />
            )}
          </div>
        </div>

        {/* 右侧属性面板 */}
        <PropertyPanel selectedNode={selectedNode} onUpdate={updateNode} />
      </div>
    </DndProvider>
  );
}
