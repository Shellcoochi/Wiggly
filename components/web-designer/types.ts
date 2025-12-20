export type NodeType = "container" | "text" | "button";

export interface DesignerNode {
  id: string;
  type: NodeType;
  props?: Record<string, any>;
  children?: DesignerNode[];
}
