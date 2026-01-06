"use client";

import React, { useState, useEffect } from "react";
import { DesignerNode } from "./types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface PropertyPanelProps {
  selectedNode: DesignerNode | null;
  onUpdate: (nodeId: string, updates: Partial<DesignerNode>) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedNode,
  onUpdate,
}) => {
  const [localProps, setLocalProps] = useState<Record<string, any>>({});
  const [localStyle, setLocalStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (selectedNode) {
      setLocalProps(selectedNode.props || {});
      setLocalStyle(selectedNode.style || {});
    } else {
      setLocalProps({});
      setLocalStyle({});
    }
  }, [selectedNode]);

  const handlePropChange = (key: string, value: any) => {
    setLocalProps((prev) => ({ ...prev, [key]: value }));
  };

  const handleStyleChange = (key: string, value: any) => {
    setLocalStyle((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (selectedNode) {
      onUpdate(selectedNode.id, {
        props: { ...localProps },
        style: { ...localStyle },
      });
    }
  };

  if (!selectedNode) {
    return (
      <div
        style={{
          width: "300px",
          background: "#fff",
          padding: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
        }}
      >
        请选择一个组件
      </div>
    );
  }

  return (
    <div
      style={{
        width: "300px",
        background: "#fff",
        padding: "20px",
        overflow: "auto",
      }}
    >
      <h3 style={{ marginBottom: "20px" }}>属性设置</h3>

      {/* 基本信息 */}
      <div style={{ marginBottom: "24px" }}>
        <h4 style={{ fontSize: "14px", marginBottom: "12px", color: "#666" }}>
          基本信息
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontSize: "12px",
                color: "#666",
              }}
            >
              组件ID
            </label>
            <Input value={selectedNode.id} disabled style={{ width: "100%" }} />
          </div>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "4px",
                fontSize: "12px",
                color: "#666",
              }}
            >
              标题
            </label>
            <Input
              value={selectedNode.title}
              onChange={(e) =>
                onUpdate(selectedNode.id, { title: e.target.value })
              }
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>

      {/* 属性设置 */}
      <div style={{ marginBottom: "24px" }}>
        <h4 style={{ fontSize: "14px", marginBottom: "12px", color: "#666" }}>
          组件属性
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {selectedNode.componentName === "Button" && (
            <>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    fontSize: "12px",
                    color: "#666",
                  }}
                >
                  按钮文字
                </label>
                <Input
                  value={localProps.children || ""}
                  //   onChange={(e) => handlePropChange("children", e.target.value)}
                  onChange={(e) =>
                    onUpdate(selectedNode.id, {
                      props: { children: e.target.value },
                    })
                  }
                  style={{ width: "100%" }}
                />
              </div>
            </>
          )}

          {selectedNode.componentName === "Text" && (
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "12px",
                  color: "#666",
                }}
              >
                文本内容
              </label>
              <Input
                value={localProps.children || ""}
                onChange={(e) => handlePropChange("children", e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          )}

          {selectedNode.componentName === "Input" && (
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "12px",
                  color: "#666",
                }}
              >
                占位符
              </label>
              <Input
                value={localProps.placeholder || ""}
                onChange={(e) =>
                  handlePropChange("placeholder", e.target.value)
                }
                style={{ width: "100%" }}
              />
            </div>
          )}
        </div>
      </div>

      {/* 样式设置 */}
      <div style={{ marginBottom: "24px" }}>
        <h4 style={{ fontSize: "14px", marginBottom: "12px", color: "#666" }}>
          样式设置
        </h4>
      </div>

      {/* 操作按钮 */}
      <div style={{ display: "flex", gap: "10px" }}>
        <Button onClick={handleSave} style={{ flex: 1 }}>
          应用更改
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setLocalProps(selectedNode.props || {});
            setLocalStyle(selectedNode.style || {});
          }}
        >
          重置
        </Button>
      </div>

      {/* 预览 */}
      <div
        style={{
          marginTop: "24px",
          padding: "16px",
          background: "#fafafa",
          borderRadius: "4px",
        }}
      >
        <h4 style={{ fontSize: "14px", marginBottom: "12px", color: "#666" }}>
          预览
        </h4>
        <div style={{ fontSize: "12px", color: "#999" }}>
          {JSON.stringify(
            {
              id: selectedNode.id,
              title: selectedNode.title,
              props: localProps,
              style: localStyle,
            },
            null,
            2
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyPanel;
