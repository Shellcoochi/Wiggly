"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { DesignerNode } from "./types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";

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

// Setter 配置类型
interface SetterConfig {
  name: string;
  props?: Record<string, any>;
}

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
  const { name, title, setter = "StringSetter", options } = attr;

  // 解析 setter 配置
  const setterConfig = useMemo(() => parseSetterConfig(setter), [setter]);
  const { name: setterName, props: setterProps } = setterConfig;

  // 通用的 placeholder
  const placeholder = setterProps?.placeholder || `请输入${title || name}`;

  // 根据 setter 类型渲染不同的编辑器
  switch (setterName) {
    case "StringSetter":
      return (
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full"
          {...setterProps}
        />
      );

    case "NumberInputSetter":
      return (
        <Input
          type="number"
          value={value ?? ""}
          onChange={(e) => {
            const numValue = e.target.value === "" ? "" : Number(e.target.value);
            onChange(numValue);
          }}
          placeholder={placeholder}
          min={setterProps?.min}
          max={setterProps?.max}
          step={setterProps?.step || 1}
          className="w-full"
          {...setterProps}
        />
      );

    case "SelectSetter":
      const selectOptions = options || setterProps?.options || [];
      return (
        <Select 
          value={value ? String(value) : ""} 
          onValueChange={onChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={setterProps?.placeholder || `请选择${title || name}`} />
          </SelectTrigger>
          <SelectContent>
            {selectOptions.map((opt: any) => (
              <SelectItem key={opt.value} value={String(opt.value)}>
                {opt.label || opt.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "SwitchSetter":
    case "BooleanSetter":
      return (
        <div className="flex items-center space-x-2">
          <Switch
            checked={!!value}
            onCheckedChange={onChange}
            id={`switch-${name}`}
            {...setterProps}
          />
          <Label htmlFor={`switch-${name}`} className="text-xs text-gray-500">
            {value ? (setterProps?.onText || "开启") : (setterProps?.offText || "关闭")}
          </Label>
        </div>
      );

    case "ColorSetter":
      return (
        <div className="flex gap-2">
          <Input
            type="color"
            value={value || setterProps?.defaultColor || "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-9 p-1 cursor-pointer"
          />
          <Input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={setterProps?.placeholder || "#000000"}
            className="flex-1"
          />
        </div>
      );

    case "RadioGroupSetter":
      const radioOptions = options || setterProps?.options || [];
      return (
        <div className="flex flex-col gap-2">
          {radioOptions.map((opt: any) => (
            <label
              key={opt.value}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={value === opt.value}
                onChange={(e) => onChange(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">{opt.label || opt.value}</span>
            </label>
          ))}
        </div>
      );

    case "SliderSetter":
      return (
        <div className="space-y-2">
          <input
            type="range"
            value={value || setterProps?.min || 0}
            onChange={(e) => onChange(Number(e.target.value))}
            min={setterProps?.min || 0}
            max={setterProps?.max || 100}
            step={setterProps?.step || 1}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{setterProps?.min || 0}</span>
            <span className="font-medium text-gray-700">{value || setterProps?.min || 0}</span>
            <span>{setterProps?.max || 100}</span>
          </div>
        </div>
      );

    default:
      // 默认使用 StringSetter
      return (
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full"
          {...setterProps}
        />
      );
  }
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
  const configProps = useMemo(
    () => asset?.configure?.props || [],
    [asset]
  );

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