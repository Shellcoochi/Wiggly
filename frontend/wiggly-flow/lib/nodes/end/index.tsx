import React, { memo, useEffect } from "react";
import BaseNode from "../base-node/node";
import { FlowNodeProps } from "@/lib/types";
import { VariableProps, VariableLabel } from "@/lib/components";
import { getNestedPredecessors } from "@/lib/utils/flowHelper";
import { useEdges, useNodes } from "@xyflow/react";

export default memo((props: FlowNodeProps) => {
  const {
    id,
    data: { outputVars },
  } = props;
  const nodes = useNodes();
  const edges = useEdges();

  useEffect(() => {
    const predecessors = getNestedPredecessors(id, nodes, edges);
  }, []);

  return (
    <BaseNode
      node={props}
      handles={[
        {
          targetId: "1",
          isPrimary: true,
        },
      ]}
    >
      <div className="grid gap-1">
        {outputVars?.map((variable: VariableProps) => (
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
