import React, { memo } from "react";
import BaseNode from "../base-node/node";
import { FlowNodeProps } from "@/lib/types";

export default memo((props: FlowNodeProps) => {
  const handles = [
    {
      targetId: "1",
      isPrimary: true,
    },
    {
      sourceId: "2",
      content: (
        <div className="bg-amber-500">
          if<div>aaa</div>
          <div>aaa-if</div>
          <div>aaa-if</div>
        </div>
      ),
    },
    {
      sourceId: "3",
      content: <div>else-if</div>,
    },
  ];
  return (
    <BaseNode node={props} handles={handles}>
      <div className="grid gap-1"></div>
    </BaseNode>
  );
});
