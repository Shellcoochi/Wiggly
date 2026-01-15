"use client";

import React, { useState } from "react";
import { Binding, BindingType, Variable, DataSource } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface BindingSelectorProps {
  value: any;
  binding?: Binding;
  onChange: (value: any, binding?: Binding) => void;
  // 可用的变量和数据源
  variables?: Variable[];
  dataSources?: DataSource[];
  // Setter 配置（用于静态值）
  setterComponent: React.ComponentType<any>;
  setterProps?: any;
}

export const BindingSelector: React.FC<BindingSelectorProps> = ({
  value,
  binding,
  onChange,
  variables = [],
  dataSources = [],
  setterComponent: SetterComponent,
  setterProps = {},
}) => {
  const [mode, setMode] = useState<BindingType>(binding?.type || "static");
  const [localBinding, setLocalBinding] = useState<Binding>(
    binding || { type: "static", value }
  );

  // 切换绑定模式
  const handleModeChange = (newMode: BindingType) => {
    setMode(newMode);
    const newBinding: Binding = { type: newMode, value };
    setLocalBinding(newBinding);
    onChange(value, newBinding);
  };

  // 更新绑定配置
  const updateBinding = (updates: Partial<Binding>) => {
    const newBinding = { ...localBinding, ...updates };
    setLocalBinding(newBinding);
    onChange(newBinding.value, newBinding);
  };

  // 判断是否有绑定
  const hasBinding = mode !== "static";

  return (
    <div className="space-y-2">
      {/* 绑定模式切换 */}
      <div className="flex gap-1 bg-muted p-1 rounded-md">
        <Button
          variant={mode === "static" ? "default" : "ghost"}
          size="sm"
          className="flex-1 h-7 text-xs"
          onClick={() => handleModeChange("static")}
        >
          静态值
        </Button>
        <Button
          variant={mode === "variable" ? "default" : "ghost"}
          size="sm"
          className="flex-1 h-7 text-xs"
          onClick={() => handleModeChange("variable")}
        >
          变量
        </Button>
        <Button
          variant={mode === "expression" ? "default" : "ghost"}
          size="sm"
          className="flex-1 h-7 text-xs"
          onClick={() => handleModeChange("expression")}
        >
          表达式
        </Button>
        <Button
          variant={mode === "datasource" ? "default" : "ghost"}
          size="sm"
          className="flex-1 h-7 text-xs"
          onClick={() => handleModeChange("datasource")}
        >
          数据源
        </Button>
      </div>

      {/* 绑定配置区域 */}
      <div
        className={cn(
          "border border-border rounded-md p-3",
          hasBinding && "bg-primary/5 border-primary/30"
        )}
      >
        {mode === "static" && (
          // 静态值：使用原有的 Setter
          <SetterComponent
            value={value}
            onChange={(newValue: any) => {
              updateBinding({ value: newValue });
            }}
            {...setterProps}
          />
        )}

        {mode === "variable" && (
          // 变量绑定
          <div className="space-y-2">
            <Label className="text-xs">选择变量</Label>
            {variables.length > 0 ? (
              <Select
                value={localBinding.variablePath || ""}
                onValueChange={(path) => {
                  const variable = variables.find((v) => v.name === path);
                  updateBinding({
                    variablePath: path,
                    value: variable?.defaultValue,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择变量" />
                </SelectTrigger>
                <SelectContent>
                  {variables.map((variable) => (
                    <SelectItem key={variable.id} value={variable.name}>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono bg-muted px-1 rounded">
                          {variable.type}
                        </span>
                        <span>{variable.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
                暂无可用变量，请先在变量面板中创建
              </div>
            )}

            {localBinding.variablePath && (
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="font-mono bg-muted px-2 py-1 rounded">
                  {`{{${localBinding.variablePath}}}`}
                </span>
              </div>
            )}
          </div>
        )}

        {mode === "expression" && (
          // 表达式绑定
          <div className="space-y-2">
            <Label className="text-xs">表达式</Label>
            <Input
              value={localBinding.expression || ""}
              onChange={(e) => {
                updateBinding({ expression: e.target.value });
              }}
              placeholder="例如: {{user.name + ' (' + user.age + ')'}}"
              className="font-mono text-xs"
            />
            <div className="text-xs text-muted-foreground">
              支持 JavaScript 表达式，使用 {`{{...}}`} 包裹
            </div>
          </div>
        )}

        {mode === "datasource" && (
          // 数据源绑定
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs">选择数据源</Label>
              {dataSources.length > 0 ? (
                <Select
                  value={localBinding.datasourceId || ""}
                  onValueChange={(id) => {
                    updateBinding({ datasourceId: id });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择数据源" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataSources.map((ds) => (
                      <SelectItem key={ds.id} value={ds.id}>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono bg-muted px-1 rounded">
                            {ds.type}
                          </span>
                          <span>{ds.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
                  暂无数据源，请先在数据源面板中创建
                </div>
              )}
            </div>

            {localBinding.datasourceId && (
              <div className="space-y-2">
                <Label className="text-xs">数据路径</Label>
                <Input
                  value={localBinding.dataPath || ""}
                  onChange={(e) => {
                    updateBinding({ dataPath: e.target.value });
                  }}
                  placeholder="例如: data.items[0].title"
                  className="font-mono text-xs"
                />
                <div className="text-xs text-muted-foreground">
                  使用点号访问对象属性，方括号访问数组元素
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 绑定预览 */}
      {hasBinding && (
        <div className="text-xs bg-muted p-2 rounded-md font-mono">
          <span className="text-muted-foreground">绑定: </span>
          <span className="text-primary">
            {mode === "variable" && `{{${localBinding.variablePath}}}`}
            {mode === "expression" && localBinding.expression}
            {mode === "datasource" &&
              `{{${localBinding.datasourceId}.${localBinding.dataPath}}}`}
          </span>
        </div>
      )}
    </div>
  );
};
