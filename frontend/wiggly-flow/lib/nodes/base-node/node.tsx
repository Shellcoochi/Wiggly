import React, { memo } from "react";
import { Position } from "@xyflow/react";
import Handle from "./handle";
import { Card } from "@/ui";

/**@todo any类型 */
export default memo(({ nodeProps, children }: any) => {
  const { data, isConnectable } = nodeProps;
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <Card
        title={data.label}
        subtitle={data.description}
        icon={<i className="ri-play-line"></i>}
      >
        {children}
      </Card>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </>
  );
});
