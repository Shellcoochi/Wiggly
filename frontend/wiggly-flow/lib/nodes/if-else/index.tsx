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
        <div className="flex w-full my-1">
          <div className="text-xs font-bold w-[38px] text-right text-primary pr-2 shrink-0 content-center">IF</div>
          <div className="flex flex-col gap-0 px-2 w-full border-l-2 border-r-2 border-solid border-gray-200 rounded-l-md rounded-r-md">
            <ComparisonOperatorLabel
              className="w-full"
              field="密码"
              operator={ComparisonOperator.contains}
              value="abcab"
            />
            <div className="text-xs font-bold relative z-10 -my-1.5 ml-auto mr-4 px-2 text-primary">
              AND
            </div>
            <ComparisonOperatorLabel
              className="w-full"
              field="密码"
              operator={ComparisonOperator.contains}
              value="abcab"
            />
            <div className="text-xs font-bold relative z-10 -my-1.5 ml-auto mr-4 px-2 text-primary">
              AND
            </div>
            <ComparisonOperatorLabel
              className="w-full"
              field="密码"
              operator={ComparisonOperator.contains}
              value="abcab"
            />
          </div>
        </div>
      ),
    },
    {
      sourceId: "3",
      content: (
        <div className="flex w-full">
          <div className="text-xs font-bold  w-[38px]text-right text-primary pr-2 shrink-0 content-center">ELSE</div>
          <div className="flex flex-col gap-0 px-2 w-full border-l-2 border-r-2 border-solid border-gray-200 rounded-l-md rounded-r-md">
            <ComparisonOperatorLabel
              className="w-full"
              field="密码"
              operator={ComparisonOperator.contains}
              value="abcab"
            />
            <div className="text-xs font-bold relative z-10 -my-1.5 ml-auto mr-4 px-2 text-primary">
              AND
            </div>
            <ComparisonOperatorLabel
              className="w-full"
              field="密码"
              operator={ComparisonOperator.contains}
              value="abcab"
            />
          </div>
        </div>
      ),
    },
  ];
  return (
    <BaseNode node={props} handles={handles}>
      <div className="grid gap-1"></div>
    </BaseNode>
  );
});
