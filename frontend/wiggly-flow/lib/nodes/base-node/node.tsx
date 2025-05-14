import React, { memo } from "react";
import { Position } from "@xyflow/react";
import Handle from "./handle";
import { Card } from "@/ui";
import { NodeLabel } from "@/lib/const";
import { FlowNode } from "@/lib/types";

interface BaseNodeProps {
  node: FlowNode;
  children: React.ReactNode;
}
export default memo(({ node, children }: BaseNodeProps) => {
  const { data, connectable, type } = node;
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={connectable}
      />
      <Card
        title={NodeLabel[type]}
        subtitle={data?.description}
        icon={<i className="ri-play-line"></i>}
      >
        {children}
      </Card>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={connectable}
      />
    </>
  );
});
