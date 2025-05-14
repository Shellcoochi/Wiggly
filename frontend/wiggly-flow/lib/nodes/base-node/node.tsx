import React, { memo, useState } from "react";
import { Position } from "@xyflow/react";
import Handle from "./handle";
import { Card } from "@/ui";
import { NodeLabel } from "@/lib/const";
import { FlowNode } from "@/lib/types";
import clsx from "clsx";

interface BaseNodeProps {
  node: FlowNode;
  children: React.ReactNode;
}
export default memo(({ node, children }: BaseNodeProps) => {
  const { data, connectable, type } = node;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Card
       className={clsx(
        'px-4 py-2 rounded border border-gray-200 shadow-sm transition-transform duration-200 bg-white',
        {
          'shadow-xl scale-[1.02]': hovered,
        }
      )}
        title={NodeLabel[type]}
        subtitle={data?.description}
        icon={<i className="ri-play-line"></i>}
      >
        {children}
      </Card>
       <Handle
        type="target"
        hovered={hovered}
        position={Position.Left}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={connectable}
      />
      <Handle
        type="source"
        hovered={hovered}
        position={Position.Right}
        isConnectable={connectable}
      />
    </div>
  );
});
