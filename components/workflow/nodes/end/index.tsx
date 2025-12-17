import React, { memo, useEffect } from "react";
import BaseNode from "../base-node/node";
import { FlowNodeProps } from "@/components/workflow/types";
import { VariableProps } from "@/components/workflow/components/add-variable-dialog";
import { VariableLabel } from "@/components/workflow/components/variable-label";
import { getPredVariables } from "@/components/workflow/utils/flowHelper";
import { useEdges, useNodes } from "@xyflow/react";

export default memo(function End(props: FlowNodeProps) {
  const {
    id,
    data: { outputVars },
  } = props;
  const nodes = useNodes();
  const edges = useEdges();

  useEffect(() => {
    const predecessors = getPredVariables(id, nodes, edges);
  }, [edges, id, nodes]);

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
