import React, { memo, useState } from "react";
import { Position } from "@xyflow/react";
import Handle from "./handle";
import { Card, Icon } from "@/ui";
import { NodeLabel } from "@/lib/const";
import { FlowNodeProps } from "@/lib/types";
import clsx from "clsx";

interface BaseNodeProps {
  node: FlowNodeProps;
  children?: React.ReactNode;
}
export default memo(({ node, children }: BaseNodeProps) => {
  const { selected, data, isConnectable, type } = node;
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Card
        className={clsx(
          "px-4 py-2 rounded border-2 transition duration-200 bg-white box-border",
          {
            "scale-[1.02]": hovered,
            "border-blue-500 ring-2 ring-blue-100": selected,
            "border-transparent": !selected,
          }
        )}
        title={data?.label || NodeLabel[type]}
        subtitle={data?.description}
        icon={<Icon name={node?.type} />}
      >
        {children}
      </Card>
      <Handle
        type="target"
        hovered={hovered || selected}
        position={Position.Left}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        hovered={hovered || selected}
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </div>
  );
});
