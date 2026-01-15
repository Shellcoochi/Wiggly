"use client";

import React, { ReactNode, useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import { ComponentTemplate } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Collapsible from "../ui/collapsible";
import { cn } from "@/lib/utils";
import { IconPuzzleFilled } from "@tabler/icons-react";

const ComponentPanel: React.FC<{
  templates: any[];
  onDragStart?: (template: ComponentTemplate) => void;
}> = ({ templates, onDragStart }) => {
  return (
    <div className="w-64 shrink-0 bg-background border-r border-border overflow-hidden flex flex-col">
      {/* Header - 固定 */}
      <div className="p-4 border-b border-border bg-card">
        <h3 className="text-sm font-semibold text-foreground">组件库</h3>
        <p className="mt-1 text-xs text-muted-foreground">拖拽组件到画布</p>
      </div>

      {/* Tabs - 可滚动 */}
      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="BASIC" className="h-full">
          <div className="sticky top-0 z-10 bg-background border-b border-border p-3">
            <TabsList className="w-full bg-muted">
              {templates.map((template) => (
                <TabsTrigger
                  key={template.type}
                  value={template.type}
                  className="flex-1 text-xs data-[state=active]:bg-background"
                >
                  {template.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {templates.map((template) => (
            <TabsContent
              key={template.type}
              value={template.type}
              className="p-3 space-y-4 mt-0"
            >
              {template.children.map((group: any) => (
                <Collapsible
                  key={group.type}
                  defaultValue
                  content={
                    <div className="space-y-2 pt-2">
                      {group.children.map((com: any) => {
                        const snippets = com.snippet.snippets;

                        // 单个组件：显示为卡片
                        if (snippets.length === 1) {
                          return (
                            <DraggableComponentCard
                              key={snippets[0].id}
                              template={snippets[0]}
                              componentTitle={com.asset.title}
                              onDragStart={() => onDragStart?.(snippets[0])}
                            />
                          );
                        }

                        // 多个变体：显示为网格
                        return (
                          <div
                            key={com.asset.componentName}
                            className="space-y-2"
                          >
                            <div className="text-xs font-medium text-muted-foreground px-1">
                              {com.asset.title}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {snippets.map((snippet: ComponentTemplate) => (
                                <DraggableComponentCard
                                  key={snippet.id}
                                  template={snippet}
                                  isCompact
                                  onDragStart={() => onDragStart?.(snippet)}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  }
                >
                  <div
                    className={cn(
                      "flex items-center justify-between px-2 py-1.5 rounded-md",
                      "text-xs font-medium text-foreground",
                      "cursor-pointer transition-colors",
                      "hover:bg-accent"
                    )}
                  >
                    <span>{group.title}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {group.children.reduce(
                        (acc: number, com: any) =>
                          acc + com.snippet.snippets.length,
                        0
                      )}
                    </span>
                  </div>
                </Collapsible>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

// 可拖拽的组件卡片
const DraggableComponentCard: React.FC<{
  template: ComponentTemplate;
  componentTitle?: string;
  isCompact?: boolean;
  onDragStart?: () => void;
}> = ({ template, componentTitle, isCompact = false, onDragStart }) => {
  const dragRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "component-panel-item",
    item: () => {
      onDragStart?.();
      return {
        id: template.id,
        type: "component-panel-item",
        source: "panel" as const,
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    if (dragRef.current) {
      drag(dragRef.current);
    }
  }, [drag]);

  if (isCompact) {
    // 紧凑模式：网格显示
    return (
      <div
        ref={dragRef}
        className={cn(
          "group relative flex flex-col items-center gap-2 p-3 rounded-lg",
          "border border-border bg-card",
          "cursor-move transition-all",
          "hover:border-primary hover:shadow-sm hover:scale-105",
          isDragging && "opacity-50 scale-95"
        )}
      >
        {/* 图标/预览 */}
        <div
          className={cn(
            "flex items-center justify-center",
            "h-10 w-10 rounded-md",
            "bg-primary/10 text-primary text-sm font-semibold",
            "transition-colors group-hover:bg-primary/20"
          )}
        >
          {getComponentIcon(template)}
        </div>

        {/* 标题 */}
        <div className="text-[10px] font-medium text-center text-foreground leading-tight">
          {template.title}
        </div>

        {/* 拖拽提示 */}
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
            <div className="text-xs text-muted-foreground">拖拽中...</div>
          </div>
        )}
      </div>
    );
  }

  // 标准模式：列表显示
  return (
    <div
      ref={dragRef}
      className={cn(
        "group relative flex items-center gap-3 p-3 rounded-lg",
        "border border-border bg-card",
        "cursor-move transition-all",
        "hover:border-primary hover:shadow-sm",
        isDragging && "opacity-50"
      )}
    >
      {/* 图标/预览 */}
      <div
        className={cn(
          "flex items-center justify-center shrink-0",
          "h-10 w-10 rounded-md",
          "bg-primary/10 text-primary text-sm font-semibold",
          "transition-colors group-hover:bg-primary/20"
        )}
      >
        {getComponentIcon(template)}
      </div>

      {/* 信息 */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground truncate">
          {componentTitle || template.title}
        </div>
        {componentTitle && template.title !== componentTitle && (
          <div className="text-xs text-muted-foreground truncate">
            {template.title}
          </div>
        )}
      </div>

      {/* 拖拽图标 */}
      <div className="shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8h16M4 16h16"
          />
        </svg>
      </div>
    </div>
  );
};

// 根据组件名称返回图标
const getComponentIcon = (template: ComponentTemplate): ReactNode => {
  if (template?.screenshot) {
    // return template?.screenshot;
  }
  return <IconPuzzleFilled />;
};

export default ComponentPanel;
