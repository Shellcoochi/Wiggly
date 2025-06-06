import React, { memo } from "react";
import BaseNode from "../base-node/node";
import { FlowNodeProps } from "@/lib/types";
import { VariableProps, VariableLabel } from "@/lib/components";

export default memo((props: FlowNodeProps) => {
  const {
    data: { variables },
  } = props;

  return (
    <BaseNode node={props}>
      <div className="grid gap-1">llm</div>
    </BaseNode>
  );
});
