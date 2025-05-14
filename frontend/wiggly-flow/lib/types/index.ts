import { Node } from "@xyflow/react";

type NodeType = "start" | "end";

export interface FlowNode extends Node {
  type: NodeType;
  data: Record<string, any>;
}
