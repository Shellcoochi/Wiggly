import { memo } from "react";
import BaseNode from "../base-node/node";
import { FlowNodeProps } from "../../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconX } from "@tabler/icons-react";

type ModelProps = any;

export default memo(function Llm(props: FlowNodeProps) {
  const model: ModelProps = props.data.model;

  return (
    <BaseNode node={props}>
      <div className="grid gap-1">
        <div className="flex items-center px-1 rounded-md h-6  bg-gray-100 text-xs">
          <label className="mr-2">输入</label>
          <span>
            <IconX name="string" width={16} className="mr-0.5" />
            input
          </span>
        </div>
        <div className="flex items-center px-1 rounded-md h-6  bg-gray-100 text-xs">
          <label className="mr-2">输出</label>
          <span>
            <IconX name="boolean" width={16} className="mr-0.5" />
            output
          </span>
        </div>
        <div className="flex items-center px-1 rounded-md h-6  bg-gray-100 text-xs">
          <label className="mr-2">模型</label>
          <div className="flex gap-0.5 items-center">
            <Avatar>
              <AvatarImage src={model?.logo} />
              <AvatarFallback className="rounded-lg">M</AvatarFallback>
            </Avatar>
            <span className="text-primary">{model?.name}</span>
          </div>
        </div>
      </div>
    </BaseNode>
  );
});
