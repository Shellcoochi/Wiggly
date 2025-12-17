import { memo } from "react";
import BaseNode from "../base-node/node";
import { FlowNodeProps } from "../../types";

export default memo(function LoopStart(props: FlowNodeProps) {
  return (
    <BaseNode
      className="flex items-center"
      node={props}
      handles={[
        {
          sourceId: "1",
          isPrimary: true,
        },
      ]}
    ></BaseNode>
  );
});
