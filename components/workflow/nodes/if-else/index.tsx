import React, { memo, useMemo } from "react";
import BaseNode from "../base-node/node";
import { cn } from "@/lib/utils"
import { FlowNodeProps } from "../../types";
import { ComparisonOperatorLabel } from "../../components/comparison-operator-label";
import { ConditionGroup } from "../../panels/if-else/logic-builder";

export default memo(function ConditionNode(props: FlowNodeProps) {
  const {
    data: { cases = [] },
  } = props;

  const sourceHandles = useMemo(
    () =>
      cases.map((item: ConditionGroup, i: number) => ({
        sourceId: `source-${i + 1}`,
        content: (
          <div className="flex w-full my-1">
            <div className="text-xs font-bold w-9.5 text-right text-primary pr-2 shrink-0 content-center">
              {item.type}
            </div>
            <div
              className={cn(
                "flex flex-col gap-0 px-2 w-full border-solid border-gray-200 rounded-l-md rounded-r-md",
                {
                  "border-l-2": item.conditions.length > 1,
                }
              )}
            >
              {item.conditions.map((condition, i) => (
                <React.Fragment key={condition.id}>
                  <ComparisonOperatorLabel
                    className="w-full"
                    field={condition.variable.name}
                    operator={condition.operator}
                    value={condition.value}
                  />
                  {i < item.conditions.length - 1 && (
                    <div className="text-xs font-bold relative z-10 -my-1.5 ml-auto mr-4 px-2 text-primary">
                      AND
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ),
      })),
    [cases]
  );

  const handles = useMemo(
    () => [
      {
        targetId: "target-1",
        isPrimary: true,
      },
      ...sourceHandles,
    ],
    [sourceHandles]
  );

  return (
    <BaseNode node={props} handles={handles}>
      <div className="grid gap-1"></div>
    </BaseNode>
  );
});
