"use client";

import React, { useMemo } from "react";
import { DesignerNode } from "../types";
import { findAsset } from "../utils/tools";


interface RendererProps {
  /**
   * 设计器产出的 Schema
   */
  schema: DesignerNode | DesignerNode[];
  /**
   * 是否为预览模式（禁用交互）
   */
  preview?: boolean;
  /**
   * 自定义组件映射（可选）
   */
  components?: Record<string, React.ComponentType<any>>;
  /**
   * 渲染错误时的回调
   */
  onError?: (error: Error, node: DesignerNode) => void;
}

export const Renderer: React.FC<RendererProps> = ({
  schema,
  preview = false,
  components,
  onError,
}) => {
  // 如果是数组，渲染所有节点
  if (Array.isArray(schema)) {
    return (
      <>
        {schema.map((node) => (
          <NodeRenderer
            key={node.id}
            node={node}
            preview={preview}
            components={components}
            onError={onError}
          />
        ))}
      </>
    );
  }

  // 单个节点
  return (
    <NodeRenderer
      node={schema}
      preview={preview}
      components={components}
      onError={onError}
    />
  );
};


interface NodeRendererProps {
  node: DesignerNode;
  preview?: boolean;
  components?: Record<string, React.ComponentType<any>>;
  onError?: (error: Error, node: DesignerNode) => void;
}

const NodeRenderer: React.FC<NodeRendererProps> = ({
  node,
  preview = false,
  components,
  onError,
}) => {
  const { id, componentName, props, style, children, isContainer } = node;

  // 获取组件
  const Component = useMemo(() => {
    // 优先使用自定义组件映射
    if (components && components[componentName]) {
      return components[componentName];
    }

    // 从物料库中查找
    const asset = findAsset(componentName);
    if (asset && asset.library) {
      return asset.library;
    }

    // 未找到组件
    console.error(`Component not found: ${componentName}`);
    return null;
  }, [componentName, components]);

  // 组件未找到时的错误处理
  if (!Component) {
    const error = new Error(`Component "${componentName}" not found`);
    onError?.(error, node);
    
    return (
      <div
        className="border-2 border-destructive bg-destructive/10 p-4 rounded text-destructive text-sm"
        data-renderer-id={id}
      >
        <strong>组件渲染错误:</strong> {componentName} 未找到
      </div>
    );
  }

  // 错误边界处理
  try {
    // 合并 props 和 style
    const finalProps = {
      ...props,
      style: { ...props?.style, ...style },
      "data-renderer-id": id, // 添加标识符，方便调试
    };

    // 如果是预览模式，禁用某些交互
    if (preview) {
      // 可以在这里添加预览模式的特殊处理
      // 例如：禁用所有点击事件
      // finalProps.onClick = (e: Event) => e.preventDefault();
    }

    // 渲染组件
    return (
      <Component {...finalProps}>
        {/* 渲染子节点 */}
        {isContainer && children && children.length > 0 && (
          <>
            {children.map((child) => (
              <NodeRenderer
                key={child.id}
                node={child}
                preview={preview}
                components={components}
                onError={onError}
              />
            ))}
          </>
        )}
        
        {/* 如果没有子节点，渲染 props.children */}
        {!isContainer && props?.children}
      </Component>
    );
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    onError?.(err, node);
    
    return (
      <div
        className="border-2 border-destructive bg-destructive/10 p-4 rounded text-destructive text-sm"
        data-renderer-id={id}
      >
        <strong>渲染错误:</strong> {err.message}
      </div>
    );
  }
};

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class RenderErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Renderer Error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="border-2 border-destructive bg-destructive/10 p-4 rounded text-destructive">
          <h3 className="font-bold mb-2">渲染出错</h3>
          <p className="text-sm">{this.state.error?.message}</p>
          <details className="mt-2 text-xs">
            <summary className="cursor-pointer hover:text-destructive/80">详细信息</summary>
            <pre className="mt-2 overflow-auto p-2 bg-muted rounded text-muted-foreground">
              {this.state.errorInfo?.componentStack}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export const SafeRenderer: React.FC<
  RendererProps & { fallback?: React.ReactNode }
> = ({ fallback, ...props }) => {
  return (
    <RenderErrorBoundary fallback={fallback}>
      <Renderer {...props} />
    </RenderErrorBoundary>
  );
};