"use client";

import React, { useEffect, useRef } from "react";
import { useDrag } from "react-dnd";
import { ComponentTemplate } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Collapsible from "../ui/collapsible";
import { cn } from "@/lib/utils";

const ComponentPanel: React.FC<{
  templates: any[];
  onDragStart?: (template: ComponentTemplate) => void;
}> = ({ templates, onDragStart }) => {
  return (
    <div className="w-62.5 shrink-0 bg-card border-r border-border p-5 overflow-auto">
      {/* Header */}
      <h3 className="mb-2 text-sm font-semibold text-foreground">组件列表</h3>
      <p className="mb-5 text-xs text-muted-foreground">拖拽组件到画布中</p>

      {/* Tabs */}
      <Tabs defaultValue="BASIC" className="space-y-4">
        <TabsList className="bg-muted p-1 rounded-lg">
          {templates.map((template) => (
            <TabsTrigger
              key={template.type}
              value={template.type}
              className="text-xs"
            >
              {template.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {templates.map((template) => (
          <TabsContent
            key={template.type}
            value={template.type}
            className="space-y-3"
          >
            {template.children.map((group: any) => (
              <Collapsible
                key={group.type}
                defaultValue
                content={
                  <div className="flex flex-col gap-3 pt-2">
                    {group.children.map((com: any) => (
                      <DraggableComponentItem
                        key={com.snippet.snippets[0].id}
                        template={com.snippet.snippets[0]}
                        onDragStart={() =>
                          onDragStart?.(com.snippet.snippets[0])
                        }
                      />
                    ))}
                  </div>
                }
              >
                {/* Group Header */}
                <div
                  className={cn(
                    "flex items-center px-2 py-1.5 rounded-md",
                    "text-sm font-medium text-foreground",
                    "cursor-pointer transition-colors",
                    "hover:bg-accent/50"
                  )}
                >
                  {group.title}
                </div>
              </Collapsible>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

const DraggableComponentItem: React.FC<{
  template: ComponentTemplate;
  onDragStart?: () => void;
}> = ({ template, onDragStart }) => {
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

  return (
    <div
      ref={dragRef}
      className={cn(
        "flex items-center gap-2.5 p-3 rounded-lg border border-border bg-card",
        "cursor-move transition-all",
        "hover:border-primary hover:shadow-sm",
        isDragging && "bg-accent opacity-50"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center",
          "h-8 w-8 rounded-md",
          "bg-muted text-primary text-xs font-medium"
        )}
      >
        组
      </div>

      <div className="text-sm font-medium text-foreground">
        {template.title}
      </div>
    </div>
  );
};

export default ComponentPanel;
