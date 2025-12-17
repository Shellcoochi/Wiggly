"use client";

import { clsx } from "clsx";
import { ReactNode } from "react";
import { ComparisonOperator, ComparisonOperatorName } from "../../const";

type ConditionTextProps = {
  field: string;
  operator: ComparisonOperator;
  value?: ReactNode;
  className?: string;
};

export function ComparisonOperatorLabel({
  field,
  operator,
  value,
  className,
}: ConditionTextProps) {
  const opLabel = ComparisonOperatorName[operator];

  const showValue = ![
    ComparisonOperator.empty,
    ComparisonOperator.notEmpty,
  ].includes(operator);

  return (
    <span
      className={clsx(
        "text-xs text-gray-800 h-6",
        "inline-flex items-center max-w-full overflow-hidden",
        "px-1 rounded-md",
        "bg-gray-100",
        className
      )}
    >
      <span className="font-medium truncate">{field}</span>
      <span className="mx-1 text-primary shrink-0">{opLabel}</span>
      {showValue && <span className="truncate">{value}</span>}
    </span>
  );
}
