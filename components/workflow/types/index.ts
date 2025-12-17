import { type NodeProps } from "@xyflow/react";
import { NodeType } from "../const";


export interface FlowNodeProps extends NodeProps {
  type: NodeType;
  data: Record<string, any>;
}
