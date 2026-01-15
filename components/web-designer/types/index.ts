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
        setter:
          | string
          | {
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

// 绑定类型
export type BindingType = "static" | "variable" | "expression" | "datasource";

// 绑定配置
export interface Binding {
  type: BindingType;
  value: any;
  // 变量绑定
  variablePath?: string; // 例如: "user.name"
  // 表达式绑定
  expression?: string; // 例如: "{{user.name + ' ' + user.age}}"
  // 数据源绑定
  datasourceId?: string;
  dataPath?: string; // 例如: "data.items[0].title"
}

// 扩展 DesignerNode，支持属性绑定
export interface DesignerNode {
  id: string;
  title: string;
  componentName: string;
  isContainer?: boolean;
  children?: DesignerNode[];
  props?: Record<string, any>;
  style?: React.CSSProperties;
  // 新增：属性绑定配置
  bindings?: Record<string, Binding>;
  [key: string]: any;
}

// 变量定义
export interface Variable {
  id: string;
  name: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  defaultValue: any;
  description?: string;
}

// 数据源定义
export interface DataSource {
  id: string;
  name: string;
  type: "api" | "static" | "mock";
  config: {
    url?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    params?: Record<string, any>;
    // 静态数据
    data?: any;
  };
  // 是否自动加载
  autoLoad?: boolean;
  // 数据转换
  transformer?: string; // JavaScript 代码
}
