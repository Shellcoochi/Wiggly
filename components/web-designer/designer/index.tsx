"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "../../ui/button";
import {
  DataSource,
  DesignerNode,
  DropResult,
  NodePositon,
  Variable,
} from "../types";
import PropertyPanel from "../property-panel";
import materials from "../material";
import { findNode, generateNodeId } from "../utils/tools";
import { NodeSelector } from "../node-selector";
import { NodeItem } from "./node-item";
import { PositionIndicator } from "../position-indicator";
import DesignerSidebar from "../sidebar-panel";
import { DragPreviewLayer } from "./DragPreviewLayer";

const { assets, snippets, categories } = materials;

const findAsset = (componentName: string) => {
  return assets.find((asset: any) => asset.componentName === componentName);
};

/** 初始数据 **/
const initialItems: DesignerNode[] = [
  {
    id: "root",
    title: "产品介绍页",
    componentName: "Container",
    isContainer: true,
    props: {
      direction: "col",
      gap: "xl",
      align: "center",
      justify: "start",
      className:
        "min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800",
    },
    style: {
      padding: "48px 24px",
    },
    children: [
      {
        id: "hero-section",
        title: "Hero Section",
        componentName: "Container",
        isContainer: true,
        props: {
          direction: "col",
          gap: "lg",
          align: "center",
          justify: "center",
          className: "max-w-4xl w-full",
        },
        style: {
          padding: "60px 0",
        },
        children: [
          {
            id: "hero-title",
            title: "主标题",
            componentName: "Text",
            props: {
              children: "打造下一代低代码平台",
              as: "h1",
              size: "4xl",
              weight: "extrabold",
              align: "center",
              color: "default",
              className:
                "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
            },
          },
          {
            id: "hero-subtitle",
            title: "副标题",
            componentName: "Text",
            props: {
              children:
                "使用可视化设计器，快速构建美观的应用程序，无需编写代码",
              as: "p",
              size: "xl",
              weight: "normal",
              align: "center",
              color: "muted",
              className: "max-w-2xl",
            },
            style: {
              marginTop: "16px",
            },
          },
          {
            id: "hero-buttons",
            title: "按钮组",
            componentName: "Container",
            isContainer: true,
            props: {
              direction: "row",
              gap: "md",
              align: "center",
              justify: "center",
            },
            style: {
              marginTop: "32px",
            },
            children: [
              {
                id: "cta-primary",
                title: "主按钮",
                componentName: "Button",
                props: {
                  children: "开始使用",
                  variant: "default",
                  size: "lg",
                },
              },
              {
                id: "cta-secondary",
                title: "次按钮",
                componentName: "Button",
                props: {
                  children: "查看文档",
                  variant: "outline",
                  size: "lg",
                },
              },
            ],
          },
        ],
      },
      {
        id: "features-section",
        title: "特性区域",
        componentName: "Container",
        isContainer: true,
        props: {
          direction: "col",
          gap: "xl",
          align: "center",
          justify: "start",
          className: "max-w-6xl w-full",
        },
        style: {
          marginTop: "80px",
        },
        children: [
          {
            id: "features-title",
            title: "特性标题",
            componentName: "Text",
            props: {
              children: "核心特性",
              as: "h2",
              size: "3xl",
              weight: "bold",
              align: "center",
              color: "default",
            },
          },
          {
            id: "features-grid",
            title: "特性网格",
            componentName: "Container",
            isContainer: true,
            props: {
              direction: "row",
              gap: "lg",
              align: "stretch",
              justify: "center",
              className: "w-full flex-wrap",
            },
            style: {
              marginTop: "48px",
            },
            children: [
              {
                id: "feature-card-1",
                title: "特性卡片1",
                componentName: "Container",
                isContainer: true,
                props: {
                  direction: "col",
                  gap: "md",
                  align: "start",
                  justify: "start",
                  className:
                    "bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow",
                },
                style: {
                  padding: "32px",
                  flex: "1 1 300px",
                  maxWidth: "350px",
                },
                children: [
                  {
                    id: "feature-1-image",
                    title: "特性1图片",
                    componentName: "Image",
                    props: {
                      src: "/next.svg",
                      alt: "可视化设计",
                      width: "80px",
                      height: "80px",
                      objectFit: "fill",
                      rounded: "lg",
                    },
                  },
                  {
                    id: "feature-1-title",
                    title: "特性1标题",
                    componentName: "Text",
                    props: {
                      children: "可视化设计",
                      as: "h3",
                      size: "xl",
                      weight: "semibold",
                      color: "default",
                    },
                  },
                  {
                    id: "feature-1-desc",
                    title: "特性1描述",
                    componentName: "Text",
                    props: {
                      children:
                        "通过拖拽操作快速构建页面，所见即所得的设计体验让开发变得简单高效",
                      as: "p",
                      size: "sm",
                      weight: "normal",
                      color: "muted",
                    },
                  },
                ],
              },
              {
                id: "feature-card-2",
                title: "特性卡片2",
                componentName: "Container",
                isContainer: true,
                props: {
                  direction: "col",
                  gap: "md",
                  align: "start",
                  justify: "start",
                  className:
                    "bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow",
                },
                style: {
                  padding: "32px",
                  flex: "1 1 300px",
                  maxWidth: "350px",
                },
                children: [
                  {
                    id: "feature-2-image",
                    title: "特性2图片",
                    componentName: "Image",
                    props: {
                      src: "/next.svg",
                      alt: "组件丰富",
                      width: "80px",
                      height: "80px",
                      objectFit: "fill",
                      rounded: "lg",
                    },
                  },
                  {
                    id: "feature-2-title",
                    title: "特性2标题",
                    componentName: "Text",
                    props: {
                      children: "组件丰富",
                      as: "h3",
                      size: "xl",
                      weight: "semibold",
                      color: "default",
                    },
                  },
                  {
                    id: "feature-2-desc",
                    title: "特性2描述",
                    componentName: "Text",
                    props: {
                      children:
                        "内置丰富的组件库，支持自定义扩展，满足各种业务场景需求",
                      as: "p",
                      size: "sm",
                      weight: "normal",
                      color: "muted",
                    },
                  },
                ],
              },
              {
                id: "feature-card-3",
                title: "特性卡片3",
                componentName: "Container",
                isContainer: true,
                props: {
                  direction: "col",
                  gap: "md",
                  align: "start",
                  justify: "start",
                  className:
                    "bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow",
                },
                style: {
                  padding: "32px",
                  flex: "1 1 300px",
                  maxWidth: "350px",
                },
                children: [
                  {
                    id: "feature-3-image",
                    title: "特性3图片",
                    componentName: "Image",
                    props: {
                      src: "/next.svg",
                      alt: "主题定制",
                      width: "80px",
                      height: "80px",
                      objectFit: "fill",
                      rounded: "lg",
                    },
                  },
                  {
                    id: "feature-3-title",
                    title: "特性3标题",
                    componentName: "Text",
                    props: {
                      children: "主题定制",
                      as: "h3",
                      size: "xl",
                      weight: "semibold",
                      color: "default",
                    },
                  },
                  {
                    id: "feature-3-desc",
                    title: "特性3描述",
                    componentName: "Text",
                    props: {
                      children:
                        "支持多种主题配色，轻松切换深色模式，打造独特的视觉风格",
                      as: "p",
                      size: "sm",
                      weight: "normal",
                      color: "muted",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "cta-section",
        title: "CTA 区域",
        componentName: "Container",
        isContainer: true,
        props: {
          direction: "col",
          gap: "lg",
          align: "center",
          justify: "center",
          className:
            "max-w-4xl w-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl",
        },
        style: {
          padding: "64px 48px",
          marginTop: "80px",
        },
        children: [
          {
            id: "cta-title",
            title: "CTA标题",
            componentName: "Text",
            props: {
              children: "准备好开始了吗？",
              as: "h2",
              size: "3xl",
              weight: "bold",
              align: "center",
              className: "text-white",
            },
          },
          {
            id: "cta-desc",
            title: "CTA描述",
            componentName: "Text",
            props: {
              children: "立即体验全新的低代码开发方式，让创意快速落地",
              as: "p",
              size: "lg",
              weight: "normal",
              align: "center",
              className: "text-white/90",
            },
          },
          {
            id: "cta-button",
            title: "CTA按钮",
            componentName: "Button",
            props: {
              children: "免费试用",
              variant: "secondary",
              size: "lg",
            },
            style: {
              marginTop: "16px",
            },
          },
        ],
      },
      {
        id: "footer",
        title: "页脚",
        componentName: "Container",
        isContainer: true,
        props: {
          direction: "col",
          gap: "md",
          align: "center",
          justify: "center",
          className: "max-w-6xl w-full border-t border-border",
        },
        style: {
          padding: "40px 0",
          marginTop: "80px",
        },
        children: [
          {
            id: "footer-text",
            title: "版权信息",
            componentName: "Text",
            props: {
              children: "© 2026 wiggly. All rights reserved.",
              as: "p",
              size: "sm",
              weight: "normal",
              align: "center",
              color: "muted",
            },
          },
        ],
      },
    ],
  },
];

// 新增: 初始变量定义
const initialVariables: Variable[] = [
  {
    id: "var1",
    name: "userName",
    type: "string",
    defaultValue: "张三",
    description: "用户名称",
  },
  {
    id: "var2",
    name: "userAge",
    type: "number",
    defaultValue: 25,
    description: "用户年龄",
  },
];

// 新增: 初始数据源
const initialDataSources: DataSource[] = [];

/** 主组件 **/
export default function Designer() {
  const [items, setItems] = useState<DesignerNode[]>(initialItems);
  const [selectedNode, setSelectedNode] = useState<DesignerNode | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [dropInfo, setDropInfo] = useState<DropResult | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // 新增: 变量管理
  const [variables, setVariables] = useState<Variable[]>(initialVariables);
  const [dataSources, setDataSources] =
    useState<DataSource[]>(initialDataSources);

  // 新增: 变量运行时值
  const [variableValues, setVariableValues] = useState<Record<string, any>>(
    () => {
      const values: Record<string, any> = {};
      initialVariables.forEach((v) => {
        values[v.name] = v.defaultValue;
      });
      return values;
    }
  );

  // 新增: 数据源运行时值
  const [dataSourceValues, setDataSourceValues] = useState<Record<string, any>>(
    () => {
      const values: Record<string, any> = {};
      initialDataSources.forEach((ds) => {
        values[ds.id] = ds.config.data || null;
      });
      return values;
    }
  );

  // 新增: 创建绑定上下文
  const bindingContext = useMemo(
    () => ({
      variables: variableValues,
      dataSources: dataSourceValues,
    }),
    [variableValues, dataSourceValues]
  );

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
  }, [items]);

  const asset = useMemo(() => {
    if (selectedNode) {
      return findAsset(selectedNode.componentName);
    } else {
      return null;
    }
  }, [selectedNode]);

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
      position: NodePositon,
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
    (dragId: string, result: DropResult, source: "panel" | "tree" = "tree") => {
      const dropId = result.id;
      let position: NodePositon = "inside";
      if (result.position === "left" || result.position === "top") {
        position = "before";
      }
      if (result.position === "right" || result.position === "bottom") {
        position = "after";
      }
      if (result.position === "inside") {
        position = "inside";
      }

      if (source === "tree" && dragId === dropId) {
        return;
      }

      let draggedItem: DesignerNode;

      if (source === "panel") {
        const template = snippets.find((t: { id: string; }) => t.id === dragId);
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

      if (position === "inside" && !dropItem.isContainer) {
        setErrorMessage(`元素 ${dropId} 不是容器，不能包含子元素`);
        return;
      }

      setItems((prevItems) => {
        let newItems = prevItems;

        if (source === "tree") {
          newItems = removeItem(dragId, prevItems);
        }

        return insertItem(draggedItem, dropId, position, newItems);
      });

      setSelectedNode(draggedItem);
      setDropInfo(null);
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
      console.log(items)

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
    (dragId: string, hoverId: string, dropResult: DropResult) => {
      setDropInfo(dropResult);
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
        <DesignerSidebar
          templates={categories}
          onDragStart={(template) => {
            console.log("开始拖拽:", template);
          }}
          variables={variables}
          variableValues={variableValues}
          onVariablesChange={setVariables}
          onVariableValuesChange={setVariableValues}
        />

        {/* 中间画布区域 */}
        <div ref={canvasRef} className="flex-1 overflow-auto relative">
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
              bindingContext={bindingContext} // 新增: 传递绑定上下文
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
            {dropInfo?.id && (
              <PositionIndicator
                canvasRef={canvasRef}
                nodeId={dropInfo?.id}
                position={dropInfo.position}
              />
            )}
          </div>
        </div>

        {/* 右侧属性面板 */}
        <PropertyPanel
          asset={asset}
          selectedNode={selectedNode}
          onUpdate={updateNode}
          variables={variables} // 新增: 传递变量列表
          dataSources={dataSources} // 新增: 传递数据源列表
        />
      </div>
    </DndProvider>
  );
}
