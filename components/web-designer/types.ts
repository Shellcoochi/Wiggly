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

export interface ComponentGroup {
  title: string;
  type?: string;
  children: (ComponentGroup | ComponentItem)[];
}

export interface ComponentItem {
  asset: {
    title: string;
    componentName: string;
    configure?: {
      props?: Array<{
        name: string;
        title: string;
        setter: string;
      }>;
      supports?: {
        style?: boolean;
        loop?: boolean;
      };
    };
  };
  snippet: {
    snippets: Array<{
      id: string;
      title: string;
      screenshot?: string;
      schema: {
        componentName: string;
        props: Record<string, any>;
      };
    }>;
  };
}
