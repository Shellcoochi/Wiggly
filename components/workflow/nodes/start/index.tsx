import { memo } from "react";
import BaseNode from "../base-node/node";
import { FlowNodeProps } from "../../types";
import { VariableProps } from "../../components/add-variable-dialog";
import { VariableLabel } from "../../components/variable-label";

export default memo(function Start(props: FlowNodeProps) {
  const {
    data: { variables },
  } = props;
  // OutputVars
  return (
    <BaseNode
      node={props}
      handles={[
        {
          sourceId: "1",
          isPrimary: true,
        },
      ]}
    >
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
