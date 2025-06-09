import React, { memo, ReactNode, useEffect, useState } from "react";
import { NodeResizeControl, Position } from "@xyflow/react";
import Handle from "./handle";
import { Card, Icon } from "@/ui";
import { NodeLabel } from "@/lib/const";
import { FlowNodeProps } from "@/lib/types";
import clsx from "clsx";
import { NodeIcon } from "@/lib/components/node-icon";

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

export default memo(
  ({
    node,
    children,
    handles = defaultHandles,
    className,
    showResizer,
  }: BaseNodeProps) => {
    const { selected, data, isConnectable, type } = node;
    const [hovered, setHovered] = useState(false);

    useEffect(() => {}, [hovered]);

    const primaryHandle = handles.find((h) => h.isPrimary);
    return (
      <div
        className="h-full"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Card
          className={clsx(
            "h-full px-3 py-2 rounded border-2 transition bg-white box-border",
            {
              "ring-2 ring-border-shadow": hovered,
              "border-primary-active !ring-0": selected,
              "border-transparent": !selected,
            },
            className
          )}
          title={data?.label || NodeLabel[type]}
          subtitle={data?.description}
          icon={<NodeIcon type={node?.type} />}
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
          {showResizer && (hovered || selected) && (
            <NodeResizeControl style={controlStyle}>
              <Icon name="resizer" />
            </NodeResizeControl>
          )}
          <div className="pt-2">{children}</div>
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
                <div className="flex items-center overflow-hidden w-full">
                  {handle.content}
                </div>
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
