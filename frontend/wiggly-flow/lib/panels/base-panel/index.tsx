import { FC, useEffect, useState } from "react";
import { Icon, Input, InputChangeEvent } from "@/ui";
import { FlowNodeProps } from "@/lib/types";
import { useReactFlow } from "@xyflow/react";
import { NodeLabel } from "@/lib/const";
import { PanelTypes } from "../";
import { NodeIcon } from "@/lib/components/node-icon";

export interface PanelProps {
  node?: FlowNodeProps;
}

const Panel: FC<PanelProps> = ({ node }) => {
  const { updateNodeData } = useReactFlow();
  const [label, setLabel] = useState<string>(node?.data.label ?? "节点");
  const [description, setDescription] = useState<string>(
    node?.data?.description ?? ""
  );
  const DynamicPanelComponent = node ? PanelTypes[node.type] : null;

  useEffect(() => {
    setLabel(node?.data.label ?? "节点");
    setDescription(node?.data.description ?? "");
  }, [node?.id]);

  const updateLabel = (val: string) => {
    if (node) {
      setLabel(val);
      updateNodeData(node.id, {
        label: val,
      });
    }
  };

  const updateDescription = (val: string) => {
    if (node) {
      setDescription(val);
      updateNodeData(node.id, {
        description: val,
      });
    }
  };

  const handleLabelChange = (e: InputChangeEvent) => {
    updateLabel(e.target.value);
  };

  const handleDescriptionChange = (e: InputChangeEvent) => {
    updateDescription(e.target.value);
  };

  const handleLabelBlur = () => {
    if (!label?.length && node) {
      updateLabel(NodeLabel[node.type]);
    }
  };

  return (
    <div className="w-[420px] flex flex-col h-full rounded-xl bg-white border border-gray-200 p-5 text-sm shadow-sm">
      <div>
        <div className="flex items-center gap-1">
          <div className="w-8 h-8 rounded-md flex items-center justify-center text-indigo-600 text-lg">
            <NodeIcon type={node?.type} />
          </div>
          <div className="text-base font-semibold">
            <Input
              className="hover:!shadow-none pl-0 border-none focus-within:!ring-0 text-big"
              value={label}
              onChange={handleLabelChange}
              onBlur={handleLabelBlur}
            />
          </div>
        </div>
        <div className="mt-1 text-sm text-gray-400">
          <Input
            className="hover:!shadow-none pl-0 border-none focus-within:!ring-0"
            value={description}
            type="textarea"
            placeholder="请添加描述..."
            onChange={handleDescriptionChange}
          />
        </div>
      </div>
      <div className="overflow-auto">
        {DynamicPanelComponent && <DynamicPanelComponent node={node} />}
      </div>
    </div>
  );
};

export default Panel;
