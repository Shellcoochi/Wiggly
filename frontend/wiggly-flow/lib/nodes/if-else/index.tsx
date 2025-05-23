import React, { memo } from "react";
import BaseNode from "../base-node/node";
import { FlowNodeProps } from "@/lib/types";
import { ComparisonOperatorLabel } from "@/lib/components";
import { ComparisonOperator } from "@/lib/const";

export default memo((props: FlowNodeProps) => {
  const handles = [
    {
      targetId: "1",
      isPrimary: true,
    },
    {
      sourceId: "2",
      content: (
        <div className="flex-col flex gap-0  w-full">
          <ComparisonOperatorLabel
            className="w-full"
            field="密码"
            operator={ComparisonOperator.contains}
            value="abcab"
          />
          <div className="text-xs font-bold relative z-10 -my-1.5 ml-auto mr-2 px-2 text-primary">
            AND
          </div>
          <ComparisonOperatorLabel
            className="w-full"
            field="密码"
            operator={ComparisonOperator.contains}
            value="abcab"
          />
        </div>
      ),
    },
    {
      sourceId: "3",
      content: (
        <ComparisonOperatorLabel
          className="w-full"
          field="密码"
          operator={ComparisonOperator.startWith}
          value="abcab"
        />
      ),
    },
  ];
  return (
    <BaseNode node={props} handles={handles}>
      <div className="grid gap-1"></div>
    </BaseNode>
  );
});
