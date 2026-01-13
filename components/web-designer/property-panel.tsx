"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { DesignerNode } from "./types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { SETTER_MAP, SetterConfig } from "./setter";

interface PropertyPanelProps {
  asset: any;
  selectedNode: DesignerNode | null;
  onUpdate: (nodeId: string, updates: Partial<DesignerNode>) => void;
}

// 表单字段组件
const FormField: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => (
  <div className="space-y-1.5">
    <Label className="text-xs text-gray-600">{label}</Label>
    {children}
  </div>
);

// 解析 setter 配置
const parseSetterConfig = (setter: string | SetterConfig): SetterConfig => {
  if (typeof setter === "string") {
    return { name: setter, props: {} };
  }
  return { name: setter.name || "StringSetter", props: setter.props || {} };
};

// 属性编辑器工厂
const PropertyEditor: React.FC<{
  attr: any;
  value: any;
  onChange: (value: any) => void;
}> = ({ attr, value, onChange }) => {
  const { name, title, setter = "StringSetter" } = attr;

  // 解析 setter 配置
  const setterConfig = useMemo(() => parseSetterConfig(setter), [setter]);
  const { name: setterName, props: setterProps } = setterConfig;

  // 获取对应的 Setter 组件
  const SetterComponent = SETTER_MAP[setterName as keyof typeof SETTER_MAP];

  if (!SetterComponent) {
    console.warn(`Unknown setter: ${setterName}`);
    return (
      <div className="text-xs text-red-500">
        未知的 Setter 类型: {setterName}
      </div>
    );
  }

  // 合并默认 placeholder
  const finalProps = {
    placeholder: `请输入${title || name}`,
    ...setterProps,
  };

  return <SetterComponent value={value} onChange={onChange} {...finalProps} />;
};

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  asset,
  selectedNode,
  onUpdate,
}) => {
  const [localProps, setLocalProps] = useState<Record<string, any>>({});
  const [localStyle, setLocalStyle] = useState<React.CSSProperties>({});
  const [hasChanges, setHasChanges] = useState(false);

  // 同步选中节点的数据
  useEffect(() => {
    if (selectedNode) {
      setLocalProps(selectedNode.props || {});
      setLocalStyle(selectedNode.style || {});
      setHasChanges(false);
    } else {
      setLocalProps({});
      setLocalStyle({});
      setHasChanges(false);
    }
  }, [selectedNode]);

  // 获取配置的属性列表
  const configProps = useMemo(() => asset?.configure?.props || [], [asset]);

  // 处理属性变化（实时更新）
  const handlePropChange = useCallback(
    (key: string, value: any) => {
      if (!selectedNode) return;

      const newProps = { ...localProps, [key]: value };
      setLocalProps(newProps);
      setHasChanges(true);

      // 实时更新到父组件
      onUpdate(selectedNode.id, { props: newProps });
    },
    [selectedNode, localProps, onUpdate]
  );

  // 处理样式变化
  const handleStyleChange = useCallback(
    (key: string, value: any) => {
      const newStyle = { ...localStyle, [key]: value };
      setLocalStyle(newStyle);
      setHasChanges(true);
    },
    [localStyle]
  );

  // 应用所有更改
  const handleSave = useCallback(() => {
    if (selectedNode) {
      onUpdate(selectedNode.id, {
        props: { ...localProps },
        style: { ...localStyle },
      });
      setHasChanges(false);
    }
  }, [selectedNode, localProps, localStyle, onUpdate]);

  // 重置更改
  const handleReset = useCallback(() => {
    if (selectedNode) {
      setLocalProps(selectedNode.props || {});
      setLocalStyle(selectedNode.style || {});
      setHasChanges(false);
    }
  }, [selectedNode]);

  // 空状态
  if (!selectedNode) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-5 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-300 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm">请选择一个组件</p>
          <p className="text-xs mt-1 text-gray-400">点击画布中的组件进行编辑</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* 头部 */}
      <div className="p-5 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">属性设置</h3>
        <p className="text-xs text-gray-500 mt-1">
          {selectedNode.componentName}
        </p>
      </div>

      {/* 内容区域 - 可滚动 */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* 基本信息 */}
        <section>
          <h4 className="text-sm font-medium mb-3 text-gray-700 flex items-center">
            <span className="w-1 h-4 bg-blue-500 rounded mr-2" />
            基本信息
          </h4>
          <div className="space-y-3">
            <FormField label="组件ID">
              <Input
                value={selectedNode.id}
                disabled
                className="w-full bg-gray-50"
              />
            </FormField>
            <FormField label="标题">
              <Input
                value={selectedNode.title}
                onChange={(e) =>
                  onUpdate(selectedNode.id, { title: e.target.value })
                }
                placeholder="请输入组件标题"
                className="w-full"
              />
            </FormField>
          </div>
        </section>

        {/* 组件属性 */}
        {configProps.length > 0 && (
          <section>
            <h4 className="text-sm font-medium mb-3 text-gray-700 flex items-center">
              <span className="w-1 h-4 bg-green-500 rounded mr-2" />
              组件属性
            </h4>
            <div className="space-y-3">
              {configProps.map((attr: any) => (
                <FormField key={attr.name} label={attr.title || attr.name}>
                  <PropertyEditor
                    attr={attr}
                    value={localProps[attr.name]}
                    onChange={(value) => handlePropChange(attr.name, value)}
                  />
                </FormField>
              ))}
            </div>
          </section>
        )}

        {/* 样式设置 */}
        <section>
          <h4 className="text-sm font-medium mb-3 text-gray-700 flex items-center">
            <span className="w-1 h-4 bg-purple-500 rounded mr-2" />
            样式设置
          </h4>
          <div className="space-y-3">
            <FormField label="宽度">
              <Input
                value={localStyle.width || ""}
                onChange={(e) => handleStyleChange("width", e.target.value)}
                placeholder="auto / 100px / 100%"
                className="w-full"
              />
            </FormField>
            <FormField label="高度">
              <Input
                value={localStyle.height || ""}
                onChange={(e) => handleStyleChange("height", e.target.value)}
                placeholder="auto / 100px / 100%"
                className="w-full"
              />
            </FormField>
            <FormField label="背景颜色">
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={localStyle.backgroundColor || "#ffffff"}
                  onChange={(e) =>
                    handleStyleChange("backgroundColor", e.target.value)
                  }
                  className="w-12 h-9 p-1"
                />
                <Input
                  type="text"
                  value={localStyle.backgroundColor || ""}
                  onChange={(e) =>
                    handleStyleChange("backgroundColor", e.target.value)
                  }
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
            </FormField>
          </div>
        </section>

        {/* 预览 */}
        <section>
          <h4 className="text-sm font-medium mb-3 text-gray-700 flex items-center">
            <span className="w-1 h-4 bg-orange-500 rounded mr-2" />
            数据预览
          </h4>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <pre className="text-xs text-gray-600 whitespace-pre-wrap break-words font-mono">
              {JSON.stringify(
                {
                  id: selectedNode.id,
                  title: selectedNode.title,
                  componentName: selectedNode.componentName,
                  props: localProps,
                  style: localStyle,
                },
                null,
                2
              )}
            </pre>
          </div>
        </section>
      </div>

      {/* 底部操作栏 */}
      {hasChanges && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1" size="sm">
              应用更改
            </Button>
            <Button variant="outline" onClick={handleReset} size="sm">
              重置
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyPanel;
