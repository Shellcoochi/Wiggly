import React from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  type EdgeProps,
} from "@xyflow/react";
import clsx from "clsx";

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
    selected
  } = props;
  const { setEdges } = useReactFlow();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    curvature: 0.3, // 调整曲线曲率
  });

  const onEdgeClick = (e: React.MouseEvent) => {
    
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} className={clsx("!stroke-2", selected ? "!stroke-blue-500 " : "!stroke-blue-300 ")} />
      {selected ? <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            pointerEvents: "auto",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <i
            className="ri-add-line w-5 h-5 flex items-center justify-center bg-blue-500 text-white rounded-full"
            onClick={onEdgeClick}
          />
        </div>
      </EdgeLabelRenderer> : null}

    </>
  );
}
