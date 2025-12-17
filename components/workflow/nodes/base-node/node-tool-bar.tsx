import { memo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { numericId } from "@/components/workflow/utils/flowHelper";
import { useReactFlow } from "@xyflow/react";
import { IconDots } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

interface NodeToolbarProps {
  isVisible: boolean;
  nodeId: string;
}

const comparisonOperators = [
  { type: "item", label: "运行此步骤", value: "run" },
  {
    type: "separator",
  },
  { type: "item", label: "创建副本", value: "duplicate", shortcut: "⌘+D" },
  {
    type: "separator",
  },
  { type: "item", label: "删除", value: "delete", shortcut: "⌘+D" },
];

export default memo(function NodeTollBar({
  isVisible,
  nodeId,
}: NodeToolbarProps) {
  const { setNodes, getNode } = useReactFlow();

  const duplicateAction = () => {
    const currentNode = getNode(nodeId);
    if (currentNode) {
      const newNodeId = numericId();
      const newNode = {
        ...currentNode,
        id: newNodeId,
        position: {
          x: currentNode.position.x + 40,
          y: currentNode.position.y + 40,
        },
        data: {
          ...currentNode.data,
        },
        selected: true,
      };

      setTimeout(() => {
        setNodes((nds) =>
          nds
            .map((n) => ({ ...n, selected: false }))
            .concat({ ...newNode, selected: true })
        );
      }, 0);
    }
  };

  const deleteAction = () => {
    setTimeout(() => {
      setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    }, 0);
  };

  const handleAction = ({ value: action }: any) => {
    switch (action) {
      case "duplicate":
        duplicateAction();
        break;
      case "delete":
        deleteAction();
        break;
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button hidden={!isVisible} variant="ghost" size="icon-sm">
          <IconDots />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-32" align="end" sideOffset={5}>
        {comparisonOperators.map((item, index) => {
          if (item.type === "separator") {
            return <DropdownMenuSeparator key={index} />;
          }

          return (
            <DropdownMenuItem
              key={index}
              onClick={() => handleAction(item)}
              className="text-sm"
            >
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
