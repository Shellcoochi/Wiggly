export type NodeType = "container" | "text" | "button";
export interface DesignerNode {
  id: string;
  title: string;
  componentName: string;
  isContainer: boolean;
  children?: DesignerNode[];
  props?: Record<string, any>;
  style?: React.CSSProperties;
  [key: string]: any;
}

export interface ComponentTemplate {
  id: string;
  name: string;
  title: string;
  icon?: string;
  isContainer: boolean;
  defaultProps?: Record<string, any>;
  defaultStyle?: React.CSSProperties;
}
