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
      <div className="w-80 bg-white p-5 flex items-center justify-center text-gray-400">
        请选择一个组件
      </div>
    );
  }

  return (
    <div className="w-80 bg-white p-5 overflow-auto">
      <h3 className="mb-5 text-lg font-semibold">属性设置</h3>

      {/* 基本信息 */}
      <div className="mb-6">
        <h4 className="text-sm mb-3 text-gray-600">基本信息</h4>
        <div className="flex flex-col gap-3">
          <div>
            <label className="block mb-1 text-xs text-gray-600">组件ID</label>
            <Input value={selectedNode.id} disabled className="w-full" />
          </div>
          <div>
            <label className="block mb-1 text-xs text-gray-600">标题</label>
            <Input
              value={selectedNode.title}
              onChange={(e) =>
                onUpdate(selectedNode.id, { title: e.target.value })
              }
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* 属性设置 */}
      <div className="mb-6">
        <h4 className="text-sm mb-3 text-gray-600">组件属性</h4>
        <div className="flex flex-col gap-3">
          {selectedNode.componentName === "Button" && (
            <div>
              <label className="block mb-1 text-xs text-gray-600">
                按钮文字
              </label>
              <Input
                value={localProps.children || ""}
                onChange={(e) =>
                  onUpdate(selectedNode.id, {
                    props: { children: e.target.value },
                  })
                }
                className="w-full"
              />
            </div>
          )}

          {selectedNode.componentName === "Text" && (
            <div>
              <label className="block mb-1 text-xs text-gray-600">
                文本内容
              </label>
              <Input
                value={localProps.children || ""}
                onChange={(e) => handlePropChange("children", e.target.value)}
                className="w-full"
              />
            </div>
          )}

          {selectedNode.componentName === "Input" && (
            <div>
              <label className="block mb-1 text-xs text-gray-600">
                占位符
              </label>
              <Input
                value={localProps.placeholder || ""}
                onChange={(e) =>
                  handlePropChange("placeholder", e.target.value)
                }
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>

      {/* 样式设置 */}
      <div className="mb-6">
        <h4 className="text-sm mb-3 text-gray-600">样式设置</h4>
        {/* 可以在这里添加样式编辑器 */}
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2.5">
        <Button onClick={handleSave} className="flex-1">
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
      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h4 className="text-sm mb-3 text-gray-600">预览</h4>
        <pre className="text-xs text-gray-400 whitespace-pre-wrap wrap-break-word">
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
        </pre>
      </div>
    </div>
  );
};

export default PropertyPanel;