import React, { memo } from "react";
import BaseNode from "../base-node/node";
import { FlowNodeProps } from "@/lib/types";
import VariableLabel from "@/lib/components/variable-label";
import { VariableProps } from "@/lib/components";

export default memo((props: FlowNodeProps) => {
  const {
    data: { variables },
  } = props;
  return (
    <BaseNode node={props}>
      <div className="grid gap-1">
        {variables?.map((variable: VariableProps) => (
          <VariableLabel
            key={variable.name}
            type={variable.type}
            label={variable.name}
          />
        ))}
      </div>
    </BaseNode>
  );
});
