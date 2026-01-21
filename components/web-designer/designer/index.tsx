"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import {
  DesignerNode,
  DropResult,
  NodePositon,
  PageSchema,
  Variable,
  DataSource,
  Positon,
} from "../types";
import PropertyPanel from "../property-panel";
import materials from "../material";
import { findNode, generateNodeId } from "../utils/tools";
import { NodeSelector } from "../node-selector";
import { NodeItem } from "./node-item";
import { PositionIndicator } from "../position-indicator";
import DesignerSidebar from "../sidebar-panel";
import DesignerHeader, { ViewMode } from "./designer-header";
import { initialPageSchema } from "./initial-schema";
import { IconTrash } from "@tabler/icons-react";

const { assets, snippets, categories } = materials;

const findAsset = (componentName: string) => {
  return assets.find((asset: any) => asset.componentName === componentName);
};

/** 主组件 **/
export default function Designer() {
  // ✅ 核心 Schema State
  const [schema, setSchema] = useState<PageSchema>(initialPageSchema);

  // UI 状态
  const [selectedNode, setSelectedNode] = useState<DesignerNode | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [dropInfo, setDropInfo] = useState<DropResult | null>(null);
  const [outlineDropInfo, setOutlineDropInfo] = useState<{
    nodeId: string;
    position: Positon;
  } | null>(null);

  const [viewMode, setViewMode] = useState<ViewMode>("design");
  const [zoom, setZoom] = useState(100);

  // 历史记录状态(TODO: 后续用 useSchemaHistory 替换)
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  // ✅ 从 schema 中解构
  const items = schema.components;
  const variables = schema.variables;
  const dataSources = schema.dataSources;

  // 变量运行时值
  const [variableValues, setVariableValues] = useState<Record<string, any>>(
    () => {
      const values: Record<string, any> = {};
      schema.variables.forEach((v) => {
        values[v.name] = v.defaultValue;
      });
      return values;
    }
  );

  // 数据源运行时值
  const [dataSourceValues, setDataSourceValues] = useState<Record<string, any>>(
    () => {
      const values: Record<string, any> = {};
      schema.dataSources.forEach((ds) => {
        values[ds.id] = ds.config.data || null;
      });
      return values;
    }
  );

  // 创建绑定上下文
  const bindingContext = useMemo(
    () => ({
      variables: variableValues,
      dataSources: dataSourceValues,
    }),
    [variableValues, dataSourceValues]
  );

  // ============================================
  // Schema 更新方法
  // ============================================

  const setItems = useCallback(
    (
      newItemsOrUpdater:
        | DesignerNode[]
        | ((prev: DesignerNode[]) => DesignerNode[])
    ) => {
      setSchema((prev) => {
        const newComponents =
          typeof newItemsOrUpdater === "function"
            ? newItemsOrUpdater(prev.components)
            : newItemsOrUpdater;

        return {
          ...prev,
          components: newComponents,
          meta: {
            ...prev.meta,
            updatedAt: new Date().toISOString(),
          },
        };
      });
    },
    []
  );

  const setVariables = useCallback((newVariables: Variable[]) => {
    setSchema((prev) => ({
      ...prev,
      variables: newVariables,
      meta: {
        ...prev.meta,
        updatedAt: new Date().toISOString(),
      },
    }));
  }, []);

  const setDataSources = useCallback((newDataSources: DataSource[]) => {
    setSchema((prev) => ({
      ...prev,
      dataSources: newDataSources,
      meta: {
        ...prev.meta,
        updatedAt: new Date().toISOString(),
      },
    }));
  }, []);

  // ============================================
  // 画布交互监听
  // ============================================

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

  // ============================================
  // 节点操作辅助方法
  // ============================================

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
              toast.warning(`元素 ${targetId} 不是容器,不能包含子元素`);
              return [node];
            }
            return [
              {
                ...node,
                children: [item, ...(node.children ?? [])],
              },
            ];
          } else if (position === "before") {
            return [item, node];
          } else {
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

  // ============================================
  // 拖拽处理
  // ============================================

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
        const template = snippets.find((t: { id: string }) => t.id === dragId);
        if (!template) {
          toast.warning(`找不到组件模板: ${dragId}`);
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
          toast.warning(`找不到拖拽的元素: ${dragId}`);
          return;
        }
      }

      const dropItem = findItem(dropId);
      if (!dropItem) {
        toast.warning(`找不到目标元素: ${dropId}`);
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
          toast.warning(`不能将父节点拖拽到子节点中`);
          return;
        }
      }

      if (position === "inside" && !dropItem.isContainer) {
        toast.warning(`元素 ${dropId} 不是容器,不能包含子元素`);
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
    [findItem, removeItem, insertItem, setItems]
  );

  const handleOutlineMove = useCallback(
    (
      dragId: string,
      targetId: string,
      position: "before" | "after" | "inside"
    ) => {
      const draggedItem = findItem(dragId);
      if (!draggedItem) {
        toast.warning(`找不到拖拽的元素: ${dragId}`);
        return;
      }

      const targetItem = findItem(targetId);
      if (!targetItem) {
        toast.warning(`找不到目标元素: ${targetId}`);
        return;
      }

      const isDescendant = (parentId: string, childId: string): boolean => {
        const item = findItem(parentId);
        if (!item) return false;
        if (item.children?.some((child) => child.id === childId)) return true;
        return !!item.children?.some((child) =>
          isDescendant(child.id, childId)
        );
      };

      if (position === "inside" && isDescendant(dragId, targetId)) {
        toast.warning(`不能将父节点拖拽到子节点中`);
        return;
      }

      if (position === "inside" && !targetItem.isContainer) {
        toast.warning(`元素 ${targetId} 不是容器,不能包含子元素`);
        return;
      }

      setItems((prevItems) => {
        const newItems = removeItem(dragId, prevItems);
        return insertItem(draggedItem, targetId, position, newItems);
      });

      toast.success("移动成功");
    },
    [findItem, removeItem, insertItem, setItems]
  );

  const handleOutlineHover = useCallback(
    (
      dragId: string,
      targetId: string,
      position: "before" | "after" | "inside"
    ) => {
      let canvasPosition: "left" | "right" | "top" | "bottom" | "inside" =
        "inside";
      if (position === "before") {
        canvasPosition = "top";
      } else if (position === "after") {
        canvasPosition = "bottom";
      } else {
        canvasPosition = "inside";
      }

      setOutlineDropInfo({
        nodeId: targetId,
        position: canvasPosition as any,
      });
    },
    []
  );

  const handleOutlineHoverEnd = useCallback(() => {
    setOutlineDropInfo(null);
  }, []);

  const moveItem = useCallback(
    (dragId: string, hoverId: string, dropResult: DropResult) => {
      setDropInfo(dropResult);
    },
    []
  );

  // ============================================
  // 节点更新和删除
  // ============================================

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

      setItems(updateNodeInTree(items));
    },
    [items, selectedNode?.id, setItems]
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      setItems(removeItem(nodeId, items));
    },
    [items, removeItem, setItems]
  );

  // ============================================
  // 智能滚动
  // ============================================

  const scrollCanvasToNode = useCallback((nodeId: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const nodeEl = canvas.querySelector<HTMLElement>(
      `[data-node-id="${nodeId}"]`
    );
    if (!nodeEl) return;

    const canvasRect = canvas.getBoundingClientRect();
    const nodeRect = nodeEl.getBoundingClientRect();

    const relativeTop = nodeRect.top - canvasRect.top + canvas.scrollTop;
    const relativeBottom = relativeTop + nodeRect.height;

    const isAboveView = relativeTop < canvas.scrollTop;
    const isBelowView = relativeBottom > canvas.scrollTop + canvas.clientHeight;

    if (isAboveView) {
      canvas.scrollTo({
        top: relativeTop - 100,
        behavior: "smooth",
      });
    } else if (isBelowView) {
      canvas.scrollTo({
        top: relativeBottom - canvas.clientHeight + 100,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    if (selectedNode?.id) {
      setTimeout(() => {
        scrollCanvasToNode(selectedNode.id);
      }, 100);
    }
  }, [selectedNode?.id, scrollCanvasToNode]);

  useEffect(() => {
    if (outlineDropInfo?.nodeId) {
      scrollCanvasToNode(outlineDropInfo.nodeId);
    }
  }, [outlineDropInfo?.nodeId, scrollCanvasToNode]);

  const canvasDropInfoForOutline = useMemo(() => {
    if (!dropInfo) return null;

    let position: "before" | "after" | "inside" = "inside";

    if (dropInfo.position === "left" || dropInfo.position === "top") {
      position = "before";
    } else if (
      dropInfo.position === "right" ||
      dropInfo.position === "bottom"
    ) {
      position = "after";
    } else if (dropInfo.position === "inside") {
      position = "inside";
    }

    return {
      nodeId: dropInfo.id,
      position,
    };
  }, [dropInfo]);

  // ============================================
  // 保存/导出/导入
  // ============================================

  const handleSave = useCallback(() => {
    const updatedSchema = {
      ...schema,
      meta: {
        ...schema.meta,
        updatedAt: new Date().toISOString(),
      },
    };

    localStorage.setItem("page-schema", JSON.stringify(updatedSchema));

    console.log("保存的 Schema:", updatedSchema);
    toast.success("保存成功");
  }, [schema]);

  const handlePublish = useCallback(() => {
    console.log("发布 Schema:", schema);
    toast.success("发布成功");
  }, [schema]);

  const handleShare = useCallback(() => {
    const json = JSON.stringify(schema, null, 2);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(json).then(() => {
        toast.success("Schema 已复制到剪贴板");
      });
    } else {
      console.log("分享 Schema:", json);
      toast.success("Schema 已输出到控制台");
    }
  }, [schema]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
        {/* 顶部导航栏 */}
        <DesignerHeader
          projectName={schema.meta.name}
          pageName={schema.meta.name}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={() => {
            console.log("撤销");
            toast.info("撤销功能开发中");
          }}
          onRedo={() => {
            console.log("重做");
            toast.info("重做功能开发中");
          }}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          zoom={zoom}
          onZoomChange={setZoom}
          onSave={handleSave}
          onPublish={handlePublish}
          onShare={handleShare}
          onPageChange={(id) => console.log("切换页面:", id)}
          onCreatePage={() => console.log("新建页面")}
          onSettings={() => console.log("设置")}
          onLogout={() => console.log("退出登录")}
        />

        <div className="flex-1 flex overflow-hidden">
          {/* 左侧:组件/资源面板 */}
          <div className="w-72 border-r bg-card shrink-0 z-10 shadow-sm border-border">
            <DesignerSidebar
              templates={categories}
              variables={variables}
              variableValues={variableValues}
              onVariablesChange={setVariables}
              onVariableValuesChange={setVariableValues}
              items={items}
              selectedNodeId={selectedNode?.id || null}
              onSelectNode={setSelectedNode}
              onMoveNode={handleOutlineMove}
              onHoverNode={handleOutlineHover}
              onHoverEndNode={handleOutlineHoverEnd}
              canvasDropInfo={canvasDropInfoForOutline}
            />
          </div>

          {/* 中间:主工作区 */}
          <main className="flex-1 relative bg-background flex flex-col overflow-hidden">
            {/* 工具栏 */}
            <div className="h-10 border-b bg-background/80 backdrop-blur-sm px-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => selectedNode && deleteNode(selectedNode.id)}
                  disabled={!selectedNode || selectedNode.id === "root"}
                >
                  <IconTrash className="mr-1" /> 删除
                </Button>
                <div className="h-4 w-px bg-border mx-2" />
                <span className="text-xs text-muted-foreground">
                  {selectedNode ? `选中: ${selectedNode.title}` : "未选中组件"}
                </span>
              </div>
            </div>

            {/* 画布滚动区域 */}
            <div
              ref={canvasRef}
              className="flex-1 overflow-auto p-12 custom-scrollbar relative scroll-smooth"
              style={{
                backgroundImage:
                  "radial-gradient(#e5e7eb 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            >
              {/* 模拟页面纸张感 */}
              <div
                className="mx-auto bg-card shadow-2xl ring-1 ring-black/5 min-h-full transition-all duration-300 origin-top"
                style={{
                  transform: `scale(${zoom / 100})`,
                }}
              >
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
                    bindingContext={bindingContext}
                  />
                ))}

                {/* 空白页提示 */}
                {items[0]?.children?.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-40 text-muted-foreground border-2 border-dashed m-4 rounded-lg">
                    <p>拖拽组件到此处开始构建</p>
                  </div>
                )}
              </div>

              {/* Overlay 高亮层 */}
              <div className="absolute inset-0 pointer-events-none">
                {hoveredNodeId && hoveredNodeId !== selectedNode?.id && (
                  <NodeSelector nodeId={hoveredNodeId} canvasRef={canvasRef} />
                )}
                {selectedNode && (
                  <NodeSelector
                    nodeId={selectedNode.id}
                    canvasRef={canvasRef}
                    zoom={zoom}
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
                {outlineDropInfo?.nodeId && (
                  <PositionIndicator
                    canvasRef={canvasRef}
                    nodeId={outlineDropInfo.nodeId}
                    position={outlineDropInfo.position}
                  />
                )}
              </div>
            </div>
          </main>

          {/* 右侧:属性面板 */}
          <div className="w-80 border-l bg-card shrink-0 z-10 shadow-sm border-border">
            <PropertyPanel
              asset={asset}
              selectedNode={selectedNode}
              onUpdate={updateNode}
              variables={variables}
              dataSources={dataSources}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
