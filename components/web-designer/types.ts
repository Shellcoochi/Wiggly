export type NodeType = "container" | "text" | "button";
export type NodePositon = "before" | "after" | "inside";
export type Positon = "left" | "right" | "top" | "bottom" | "inside";

export interface DropResult {
  id: string;
  position: Positon;
}

export interface DragItem {
  id: string;
  type: string;
  depth: number;
  parentId: string | null;
  isContainer?: boolean;
  source?: "panel" | "tree";
  nodeData?: DesignerNode;
}

export interface DesignerNode {
  id: string;
  title: string;
  componentName: string;
  isContainer?: boolean;
  children?: DesignerNode[];
  props?: Record<string, any>;
  style?: React.CSSProperties;
  [key: string]: any;
}

// 组件模板类型（snippets 数组中的元素）
export interface ComponentTemplate {
  id: string;
  title: string;
  screenshot?: string;
  schema: {
    componentName: string;
    props: Record<string, any>;
    style?: React.CSSProperties;
  };
}

export interface ComponentGroup {
  title: string;
  type?: string;
  children: (ComponentGroup | ComponentItem)[];
}

export interface ComponentItem {
  asset: {
    title: string;
    componentName: string;
    library?: React.ComponentType<any>; // 添加 library 字段
    configure?: {
      component?: {
        isContainer?: boolean;
      };
      props?: Array<{
        name: string;
        title: string;
        setter: string | {
          name: string;
          props?: Record<string, any>;
        };
      }>;
      supports?: {
        style?: boolean;
        loop?: boolean;
        className?: boolean;
      };
    };
  };
  snippet: {
    snippets: ComponentTemplate[]; // 使用 ComponentTemplate 类型
  };
}