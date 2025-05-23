import React, { memo, ReactNode, useState } from "react";
import { Position } from "@xyflow/react";
import Handle from "./handle";
import { Card, Icon } from "@/ui";
import { NodeLabel } from "@/lib/const";
import { FlowNodeProps } from "@/lib/types";
import clsx from "clsx";

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
}

const defaultHandles: NodeHandleProps[] = [
  {
    targetId: "1",
    sourceId: "1",
    isPrimary: true,
  },
];
export default memo(
  ({ node, children, handles = defaultHandles }: BaseNodeProps) => {
    const { selected, data, isConnectable, type } = node;
    const [hovered, setHovered] = useState(false);

    const primaryHandle = handles.find((h) => h.isPrimary);
    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Card
          className={clsx(
            "px-4 py-2 rounded border-2 transition bg-white box-border",
            {
              "ring-2 ring-border-shadow": hovered,
              "border-primary-active !ring-0": selected,
              "border-transparent": !selected,
            }
          )}
          title={data?.label || NodeLabel[type]}
          subtitle={data?.description}
          icon={<Icon name={node?.type} />}
        >
          {primaryHandle ? (
            <div className="absolute w-full top-6 left-0 ">
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
          {children}
          {handles
            .filter((h) => !h.isPrimary)
            .map((handle) => (
              <div
                key={`${handle.targetId}-${handle.sourceId}`}
                className="flex justify-between min-h-6 my-1"
              >
                <div className="right-4.5 relative">
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
                <div className="overflow-hidden w-full">{handle.content}</div>
                <div className="left-4.5 relative">
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
  }
);
