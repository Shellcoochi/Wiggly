import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
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
        className="!w-5 !h-5 !bg-blue-500  flex flex-col justify-center items-center"
        isConnectable={isConnectable}
      >
        <i className="ri-add-line text-white pointer-events-none" />
      </Handle>
    </>
  );
});
