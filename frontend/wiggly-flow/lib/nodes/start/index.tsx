import React, { memo } from "react";
import BaseNode from "../base-node/node";
import { FlowNodeProps } from "@/lib/types";
import VariableLabel from "@/lib/components/variable-label";

export default memo((props: FlowNodeProps) => {
  return (
    <BaseNode node={props}>
      <div className="grid gap-1">
        <VariableLabel type="string" label="abc" />
        <VariableLabel type="string" label="abc" isRequired />
      </div>
    </BaseNode>
  );
});
