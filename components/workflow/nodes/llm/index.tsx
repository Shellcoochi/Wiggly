import { memo } from "react";
import BaseNode from "../base-node/node";
import { FlowNodeProps } from "../../types";
import Avatar from "@/components/ui/avatar";
import { VariableLabel } from "../../components/variable-label";

type ModelProps = any;

export default memo(function Llm(props: FlowNodeProps) {
  const model: ModelProps = props.data.model;

  return (
    <BaseNode node={props}>
      <div className="grid gap-1">
        <VariableLabel title="输入" type="string" label="input" />
        <VariableLabel title="输出" type="boolean" label="output" />
        <div className="flex items-center px-1 rounded-md h-6  bg-muted text-xs">
          <label className="mr-2 text-muted-foreground">模型</label>
          <div className="flex gap-0.5 items-center">
            <Avatar
              src={model?.logo}
              alt={model?.name}
              size="small"
              fallback="M"
            />
            <span className="text-primary">{model?.name}</span>
          </div>
        </div>
      </div>
    </BaseNode>
  );
});
