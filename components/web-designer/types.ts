export type NodeType = "container" | "text" | "button";
export interface DesignerNode {
  id: string;
  title: string;
  componentName: string;
  children?: DesignerNode[] | null;
  isContainer?: boolean;
  isLocked?: boolean;
  parentId?: string | null;
  depth?: number;
}
