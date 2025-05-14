import { type NodeProps } from "@xyflow/react";

type NodeType = "start" | "end";

export interface FlowNode extends NodeProps {
  type: NodeType;
  data: Record<string, any>;
}
