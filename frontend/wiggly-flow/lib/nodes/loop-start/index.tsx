import { memo, useEffect } from "react";
import BaseNode from "../base-node/node";
import { FlowNodeProps } from "@/lib/types";

export default memo((props: FlowNodeProps) => {
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
