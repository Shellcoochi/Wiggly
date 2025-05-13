import React, { memo } from "react";
import {
  Handle,
  Position,
  OnConnect,
  useNodeId,
  useReactFlow,
} from "@xyflow/react";
import { Popover } from "@/ui";
import Selector, { SectionItemProps } from "./selector";
import { numericId } from "@/lib/utils/flowHelper";

interface HandleProps {
  type: "target" | "source";
  isConnectable: boolean;
  position: Position;
  onConnect?: OnConnect;
}

export default memo(
  ({ type, position, isConnectable, onConnect }: HandleProps) => {
    const { getNode, addNodes, addEdges } = useReactFlow();
    const nodeId = useNodeId();

    const handleSelectorChange = (selectedNode: SectionItemProps) => {
      const newNodeId = numericId();
      const newEdgeId = numericId();

      if (!nodeId) return;

      const currentNode = getNode(nodeId);
      if (!currentNode) return;

      const newNode: any = {
        id: newNodeId,
        type: selectedNode.type,
        position: {
          x: currentNode.position.x,
          y: currentNode.position.y,
        },
        data: { label: selectedNode.label },
      };

      const newEdge = {
        id: newEdgeId,
        source: nodeId,
        target: newNodeId,
      };

      addNodes(newNode);
      addEdges(newEdge);
    };

    return (
      <Popover
        trigger={
          <Handle
            type={type}
            position={position}
            className="!w-5 !h-5 !bg-blue-500  flex flex-col justify-center items-center"
            onConnect={onConnect}
            isConnectable={isConnectable}
          >
            <i className="ri-add-line text-white pointer-events-none" />
          </Handle>
        }
      >
        <Selector onChange={handleSelectorChange} />
      </Popover>
    );
  }
);
