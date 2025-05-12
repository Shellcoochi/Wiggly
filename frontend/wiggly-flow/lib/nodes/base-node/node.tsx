import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Card } from "@/ui";

/**@todo any类型 */
export default memo(({ data, isConnectable }: any) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <Card title={data.label}  icon={<i className="ri-play-line"></i>}>
      </Card>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        isConnectable={isConnectable}
      />
    </>
  );
});
