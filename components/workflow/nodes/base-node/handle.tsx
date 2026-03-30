import { memo, useMemo, useState } from "react";
import {
  Handle,
  Position,
  OnConnect,
  useNodeId,
  useReactFlow,
  useNodes,
} from "@xyflow/react";
import Popover from "@/components/ui/popover";
import Selector, { SectionItemProps } from "./selector";
import {
  layoutNewNode,
  numericId,
} from "@/components/workflow/utils/flowHelper";
import { EdgeType, NodeConfig } from "@/components/workflow/const";
import { cn } from "@/lib/utils";
import { IconPlus } from "@tabler/icons-react";

export interface HandleProps {
  type: "target" | "source";
  id?: string;
  isConnectable?: boolean;
  position: Position;
  onConnect?: OnConnect;
  hovered?: boolean;
  handleClass?: string;
}

export default memo(function CustomHandle({
  id,
  type,
  position,
  isConnectable,
  onConnect,
  hovered,
  handleClass,
}: HandleProps) {
  const { getNode, addNodes, addEdges } = useReactFlow();
  const [open, setOpen] = useState(false);
  const nodeId = useNodeId();
  const nodes = useNodes();

  const isSource = useMemo(() => {
    return type === "source";
  }, [type]);

  const handleSelectorChange = async (selectedNode: SectionItemProps) => {
    const newNodeId = numericId();
    const newEdgeId = numericId();
    if (!nodeId) return;

    const currentNode = getNode(nodeId);
    if (!currentNode) return;

    const newNode: any = {
      id: newNodeId,
      position: {
        x: currentNode.position.x + (currentNode?.width ?? 255) + 300,
        y: currentNode.position.y,
      },
      parentId: currentNode.parentId,
      expandParent: true,
      ...NodeConfig[selectedNode.type],
    };

    const newEdge = {
      id: newEdgeId,
      source: nodeId,
      sourceHandle: id,
      target: newNodeId,
      type: EdgeType.Base,
      zIndex: currentNode.parentId ? 1002 : 0,
    };

    const { newNode: newNodePositioned }: any = await layoutNewNode({
      existingNodes: nodes,
      newNode,
      newEdge,
    });
    addNodes(newNodePositioned);
    addEdges(newEdge);
    handleOpenChange();
  };

  const handleOpenChange = () => {
    if (isSource) {
      setOpen(!open);
    } else {
      setOpen(false);
    }
  };

  return (
    <Popover
      open={open}
      onOpenChange={handleOpenChange}
      trigger={
        <Handle
          id={id}
          type={type}
          position={position}
          className={cn(
            "border-none!",
            "hover:scale-110 transition-transform duration-300",
            handleClass,
            hovered && isSource
              ? "w-5! h-5! bg-primary!  flex flex-col justify-center items-center"
              : "w-0.75! min-w-0.5! h-3! bg-primary! rounded-none!"
          )}
          onConnect={onConnect}
          isConnectable={isConnectable}
        >
          {hovered && isSource ? (
            <IconPlus
              size="12"
              className="pointer-events-none text-primary-foreground"
            />
          ) : null}
        </Handle>
      }
    >
      <Selector onChange={handleSelectorChange} />
    </Popover>
  );
});
