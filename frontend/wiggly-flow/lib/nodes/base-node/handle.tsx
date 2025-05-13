import React, { memo } from "react";
import { Handle, Position, OnConnect } from "@xyflow/react";
import { Popover } from "@/ui";
import Selector from "./selector";

interface HandleProps {
  type: "target" | "source";
  isConnectable: boolean;
  position: Position;
  onConnect?: OnConnect;
}

export default memo(
  ({ type, position, isConnectable, onConnect }: HandleProps) => {
    return (
      <Handle
        type={type}
        position={position}
        className="!w-5 !h-5 !bg-blue-500  flex flex-col justify-center items-center"
        onConnect={onConnect}
        isConnectable={isConnectable}
      >
        <Popover trigger={<i className="ri-add-line text-white " />}>
          <Selector />
        </Popover>
      </Handle>
    );
  }
);
