import React, { memo, ReactNode, useEffect, useState } from "react";
import { NodeResizeControl, Position } from "@xyflow/react";
import Handle from "./handle";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NodeLabel } from "@/components/workflow/const";
import { FlowNodeProps } from "@/components/workflow/types";
import { NodeIcon } from "./node-icon";
import NodeToolbar from "./node-tool-bar";
import { IconRadiusBottomRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type NodeHandleProps = {
  targetId?: string;
  sourceId?: string;
  content?: ReactNode;
  isPrimary?: boolean;
};

interface BaseNodeProps {
  node: FlowNodeProps;
  children?: React.ReactNode;
  handles?: NodeHandleProps[];
  className?: string;
  showResizer?: boolean;
}

const defaultHandles: NodeHandleProps[] = [
  {
    targetId: "1",
    sourceId: "1",
    isPrimary: true,
  },
];

const controlStyle = {
  background: "transparent",
  border: "none",
  top: "calc(100% - 25px)",
  left: "calc(100% - 25px)",
};

export default memo(function Node({
  node,
  children,
  handles = defaultHandles,
  className,
  showResizer,
}: BaseNodeProps) {
  const { selected, data, isConnectable, type } = node;
  const [hovered, setHovered] = useState(false);

  useEffect(() => {}, [hovered]);

  const primaryHandle = handles.find((h) => h.isPrimary);
  return (
    <div
      className="h-full relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Card
        className={cn(
          "h-full px-3 py-2 rounded-xl transition bg-card box-border gap-0",
          {
            "ring-1 ring-border shadow-md": hovered,
            "border-primary border": selected,
            "border-transparent": !selected,
          },
          className
        )}
      >
        <CardHeader className="w-full p-0 gap-2 flex justify-between mt-2">
          <CardTitle className="w-full flex items-center gap-2">
            <NodeIcon type={node?.type} />
            <span className="truncate flex-1 w-0">
              {data?.label || NodeLabel[type]}
            </span>
          </CardTitle>
          <CardAction className="h-6 flex items-center">
            <NodeToolbar nodeId={node.id} isVisible={selected || hovered} />
          </CardAction>
        </CardHeader>
        {data?.description && (
          <CardDescription className="mt-2">{data.description}</CardDescription>
        )}
        <CardContent className="px-0 mt-2">{children}</CardContent>
        {primaryHandle ? (
          <div className="absolute w-full top-6 left-0">
            {primaryHandle.targetId ? (
              <Handle
                type="target"
                id={`${node.id}-target-${primaryHandle.targetId}`}
                hovered={hovered || selected}
                position={Position.Left}
                isConnectable={isConnectable}
              />
            ) : null}
            {primaryHandle.sourceId ? (
              <Handle
                type="source"
                id={`${node.id}-source-${primaryHandle.sourceId}`}
                hovered={hovered || selected}
                position={Position.Right}
                isConnectable={isConnectable}
              />
            ) : null}
          </div>
        ) : null}
        {showResizer && (hovered || selected) && (
          <NodeResizeControl style={controlStyle}>
            <IconRadiusBottomRight />
          </NodeResizeControl>
        )}

        {handles
          .filter((h) => !h.isPrimary)
          .map((handle) => (
            <div
              key={`${handle.targetId}-${handle.sourceId}`}
              className="flex justify-between min-h-6 my-1"
            >
              <div className="right-3.25 relative">
                {handle.targetId ? (
                  <Handle
                    type="target"
                    id={`${node.id}-target-${handle.targetId}`}
                    hovered={hovered || selected}
                    position={Position.Left}
                    isConnectable={isConnectable}
                  />
                ) : null}
              </div>
              <div className="flex items-center overflow-hidden w-full">
                {handle.content}
              </div>
              <div className="left-3.25 relative">
                {handle.sourceId ? (
                  <Handle
                    type="source"
                    id={`${node.id}-source-${handle.sourceId}`}
                    hovered={hovered || selected}
                    position={Position.Right}
                    isConnectable={isConnectable}
                  />
                ) : null}
              </div>
            </div>
          ))}
      </Card>
    </div>
  );
});
