import React, { useState } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  type EdgeProps,
} from "@xyflow/react";
import clsx from "clsx";
import Selector, { SectionItemProps } from "@/lib/nodes/base-node/selector";
import { Popover } from "@/ui";
import { numericId } from "@/lib/utils/flowHelper";
import { EdgeType, NodeConfig } from "@/lib/const";

/** @todo 增加鼠标悬浮显示 */
export default function CustomEdge(props: EdgeProps) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    markerEnd,
    source,
    target,
    selected
  } = props;
  const { addNodes, addEdges, setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    curvature: 0.3, // 调整曲线曲率
  });

  const handleSelectorChange = (selectedNode: SectionItemProps) => {
    const newNodeId = numericId();
    const newSourceEdgeId = numericId();
    const newTargetEdgeId = numericId();
    const newNode: any = {
      id: newNodeId,
      position: {
        x: (sourceX + targetX) / 2,
        y: (sourceY + targetY) / 2,
      },
      ...NodeConfig[selectedNode.type],
    };
    const newSourceEdge = {
      id: newSourceEdgeId,
      source: source,
      target: newNodeId,
      type: EdgeType.Base
    };
    const newTargetEdge = {
      id: newTargetEdgeId,
      source: newNodeId,
      target: target,
      type: EdgeType.Base
    };
    addNodes(newNode);
    addEdges([newSourceEdge, newTargetEdge]);
    setEdges((eds) => eds.filter((e) => e.id !== id))
  };

  return (
    <>
      <BaseEdge
        path={edgePath} markerEnd={markerEnd} className={clsx("!stroke-2", selected ? "!stroke-blue-500 " : "!stroke-blue-300 ")} />
      {selected ? <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            pointerEvents: "auto",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <Popover
            trigger={
              <i
                className="ri-add-line w-5 h-5 flex items-center justify-center bg-blue-500 text-white rounded-full"
              />
            }
          >
            <Selector onChange={handleSelectorChange} />
          </Popover>
        </div>
      </EdgeLabelRenderer> : null}

    </>
  );
}
