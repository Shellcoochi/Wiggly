"use client";

import React from "react";
import { useDrag } from "react-dnd";
import { ComponentTemplate } from "./types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Collapsible from "../ui/collapsible";

const ComponentPanel: React.FC<{
  templates: any[];
  onDragStart?: (template: ComponentTemplate) => void;
}> = ({ templates, onDragStart }) => {
  return (
    <div
      style={{
        width: "250px",
        background: "#fff",
        borderRight: "1px solid #f0f0f0",
        padding: "20px",
        overflow: "auto",
      }}
    >
      <h3 style={{ marginBottom: "20px" }}>组件列表</h3>
      <p style={{ fontSize: "12px", color: "#666", marginBottom: "20px" }}>
        拖拽组件到画布中
      </p>
      <Tabs defaultValue="BASIC">
        <TabsList className="bg-muted">
          {templates.map((template) => (
            <TabsTrigger key={template.type} value={template.type}>
              {template.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {templates.map((template) => (
          <TabsContent key={template.type} value={template.type}>
            {template.children.map((group: any) => (
              <Collapsible
                key={group.type}
                defaultValue={true}
                content={
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
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
                <div className="px-2 py-1.5 hover:bg-accent/50 rounded-md">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{group.title}</span>
                  </div>
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

  return (
    <div
      ref={drag}
      style={{
        padding: "12px",
        border: "1px solid #e8e8e8",
        borderRadius: "6px",
        background: isDragging ? "#f0f9ff" : "#fff",
        cursor: "move",
        opacity: isDragging ? 0.5 : 1,
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        "&:hover": {
          borderColor: "#1890ff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        },
      }}
    >
      <div
        style={{
          width: "32px",
          height: "32px",
          background: "#f6ffed",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#52c41a",
          fontSize: "12px",
        }}
      >
        组
      </div>
      <div>
        <div style={{ fontWeight: "500" }}>{template.title}</div>
      </div>
    </div>
  );
};

export default ComponentPanel;
