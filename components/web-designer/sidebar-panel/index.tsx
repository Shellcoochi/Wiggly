"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import ComponentPanel from "./component-panel";
import { ComponentTemplate, Variable } from "../types";
import { VariablesPanel } from "./variables-panel";

// 侧边栏面板类型
type SidebarPanel = "components" | "variables" | "datasources" | "outline";

interface SidebarConfig {
  id: SidebarPanel;
  label: string;
  icon: React.ReactNode;
  component: React.ComponentType<any>;
}

// 侧边栏主组件
export const DesignerSidebar: React.FC<{
  templates: any[];
  onDragStart?: (template: ComponentTemplate) => void;
  // 新增变量相关 props
  variables?: Variable[];
  variableValues?: Record<string, any>;
  onVariablesChange?: (variables: Variable[]) => void;
  onVariableValuesChange?: (values: Record<string, any>) => void;
}> = ({ 
  templates, 
  onDragStart,
  variables = [],
  variableValues = {},
  onVariablesChange = () => {},
  onVariableValuesChange = () => {},
}) => {
  const [activePanel, setActivePanel] = useState<SidebarPanel>("components");

  // 侧边栏配置
  const sidebarPanels: SidebarConfig[] = [
    {
      id: "components",
      label: "组件",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
        </svg>
      ),
      component: (props: any) => <ComponentPanel {...props} />,
    },
    {
      id: "variables",
      label: "变量",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      component: VariablesPanel,
    },
    {
      id: "datasources",
      label: "数据源",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
      component: DataSourcesPanel,
    },
    {
      id: "outline",
      label: "大纲",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
      component: OutlinePanel,
    },
  ];

  const ActivePanelComponent = sidebarPanels.find(p => p.id === activePanel)?.component;

  return (
    <div className="flex h-full bg-background border-r border-border">
      {/* 侧边栏导航 */}
      <div className="w-16 bg-card border-r border-border flex flex-col items-center py-4 gap-2">
        {sidebarPanels.map((panel) => (
          <button
            key={panel.id}
            onClick={() => setActivePanel(panel.id)}
            className={cn(
              "group relative flex flex-col items-center justify-center",
              "w-12 h-12 rounded-lg transition-all",
              activePanel === panel.id
                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
            title={panel.label}
          >
            {panel.icon}
            
            {/* 激活指示器 */}
            {activePanel === panel.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
            )}
            
            {/* Tooltip */}
            <div className={cn(
              "absolute left-full ml-2 px-2 py-1 rounded bg-popover text-popover-foreground text-xs whitespace-nowrap",
              "opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md border border-border",
              "z-50"
            )}>
              {panel.label}
            </div>
          </button>
        ))}

        {/* 分隔线 */}
        <div className="w-8 h-px bg-border my-2" />

        {/* 底部操作按钮（可选） */}
        <div className="mt-auto">
          <button
            className={cn(
              "flex items-center justify-center",
              "w-12 h-12 rounded-lg transition-all",
              "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
            title="设置"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 面板内容区域 */}
      <div className="flex-1 overflow-hidden">
        {ActivePanelComponent && (
          <ActivePanelComponent
            templates={templates}
            onDragStart={onDragStart}
            // 传递变量相关 props
            variables={variables}
            variableValues={variableValues}
            onVariablesChange={onVariablesChange}
            onVariableValuesChange={onVariableValuesChange}
          />
        )}
      </div>
    </div>
  );
};

// 数据源面板
const DataSourcesPanel: React.FC = () => {
  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b border-border bg-card">
        <h3 className="text-sm font-semibold text-foreground">数据源</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          配置 API 和数据连接
        </p>
      </div>
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center space-y-2">
          <svg className="w-12 h-12 mx-auto opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
          <p className="text-sm">数据源面板</p>
          <p className="text-xs">功能开发中...</p>
        </div>
      </div>
    </div>
  );
};

// 大纲面板
const OutlinePanel: React.FC = () => {
  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b border-border bg-card">
        <h3 className="text-sm font-semibold text-foreground">页面大纲</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          查看组件结构树
        </p>
      </div>
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center space-y-2">
          <svg className="w-12 h-12 mx-auto opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <p className="text-sm">大纲面板</p>
          <p className="text-xs">功能开发中...</p>
        </div>
      </div>
    </div>
  );
};

export default DesignerSidebar;