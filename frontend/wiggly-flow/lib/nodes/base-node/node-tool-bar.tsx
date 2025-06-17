import { memo } from "react";
import { DropdownMenu, DropdownOption, Icon } from "@/ui";
import { numericId } from "@/lib/utils/flowHelper";
import { useReactFlow } from "@xyflow/react";

interface NodeToolbarProps {
  isVisible: boolean;
  nodeId: string;
}

const comparisonOperators: DropdownOption<string>[] = [
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

export default memo(({ isVisible, nodeId }: NodeToolbarProps) => {
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

  const handleAction = ({ value: action }: DropdownOption) => {
    switch (action) {
      case "duplicate":
        duplicateAction();
        break;
      case "删除":
        break;
    }
  };
  return (
    <DropdownMenu
      options={comparisonOperators}
      onItemClick={handleAction}
      showArrow={false}
    >
      <div
        hidden={!isVisible}
        className=" cursor-pointer w-[30px] bg-bg-base rounded-lg px-1.5  hover:bg-bg-hover border-1 border-bg-base"
      >
        <Icon name="ri-more-fill" />
      </div>
    </DropdownMenu>
  );
});
