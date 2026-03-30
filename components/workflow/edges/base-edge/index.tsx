import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  type EdgeProps,
} from "@xyflow/react";
import { numericId } from "../../utils/flowHelper";
import { EdgeType, NodeConfig } from "../../const";
import { cn } from "@/lib/utils";
import Selector, { SectionItemProps } from "../../nodes/base-node/selector";
import Popover from "@/components/ui/popover";
import { IconPlus } from "@tabler/icons-react";

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
    selected,
    style,
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
      type: EdgeType.Base,
    };
    const newTargetEdge = {
      id: newTargetEdgeId,
      source: newNodeId,
      target: target,
      type: EdgeType.Base,
    };
    addNodes(newNode);
    addEdges([newSourceEdge, newTargetEdge]);
    setEdges((eds) => eds.filter((e) => e.id !== id));
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={style}
        className={cn(
          "stroke-2!",
          selected ? "stroke-primary! " : "stroke-border! "
        )}
      />
      {selected ? (
        <EdgeLabelRenderer>
          <div
            style={{
              zIndex: 1002,
              position: "absolute",
              pointerEvents: "auto",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
          >
            <Popover
              trigger={
                <div className="ri-add-line w-5 h-5 flex items-center justify-center bg-primary text-primary-foreground rounded-full">
                  <IconPlus
                    size="12"
                    className="pointer-events-none text-primary-foreground"
                  />
                </div>
              }
            >
              <Selector onChange={handleSelectorChange} />
            </Popover>
          </div>
        </EdgeLabelRenderer>
      ) : null}
    </>
  );
}
