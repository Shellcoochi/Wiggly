"use client";

import React from "react";
import { useDrag } from "react-dnd";
import { ComponentTemplate } from "./types";
import { Button } from "../ui/button";

const ComponentPanel: React.FC<{
  templates: ComponentTemplate[];
  onDragStart?: (template: ComponentTemplate) => void;
}> = ({ templates, onDragStart }) => {
  return (
    <div style={{ 
      width: "250px", 
      background: "#fff", 
      borderRight: "1px solid #f0f0f0",
      padding: "20px",
      overflow: "auto"
    }}>
      <h3 style={{ marginBottom: "20px" }}>组件列表</h3>
      <p style={{ fontSize: "12px", color: "#666", marginBottom: "20px" }}>
        拖拽组件到画布中
      </p>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {templates.map((template) => (
          <DraggableComponentItem
            key={template.id}
            template={template}
            onDragStart={() => onDragStart?.(template)}
          />
        ))}
      </div>
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
        source: "panel" as const
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
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }
      }}
    >
      <div style={{
        width: "32px",
        height: "32px",
        background: template.isContainer ? "#e6f7ff" : "#f6ffed",
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: template.isContainer ? "#1890ff" : "#52c41a",
        fontSize: "12px"
      }}>
        {template.isContainer ? "容" : "组"}
      </div>
      <div>
        <div style={{ fontWeight: "500" }}>{template.title}</div>
        <div style={{ fontSize: "12px", color: "#666" }}>
          {template.isContainer ? "可包含子组件" : "基础组件"}
        </div>
      </div>
    </div>
  );
};

export default ComponentPanel;