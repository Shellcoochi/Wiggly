import { FC } from "react";
import { clsx } from "clsx";
import { Icon } from "@/ui";

interface VariableLabelProps {
  type?: string;
  label?: string;
  isRequired?: boolean;
  className?: string;
}

export const VariableLabel: FC<VariableLabelProps> = ({
  type,
  isRequired,
  label,
  className,
}) => {
  const renderIcon = () => {
    if (type == "string") {
      return <Icon name="string" width={16} />;
    } else if (type == "number") {
      return <Icon name="number" width={16} />;
    } else if (type == "boolean") {
      return <Icon name="boolean" width={16} />;
    } else if (type == "array") {
      return <Icon name="array" width={16} />;
    } else {
      return <Icon name="variable" width={16} />;
    }
  };

  return (
    <div
      className={clsx(
        "flex justify-between px-1 rounded-md items-center font-mono h-6  bg-gray-100 text-xs",
        className
      )}
    >
      <span className="text-gray-800">
        <span className="text-gray-500 rounded">{renderIcon()}</span>
        {label ?? "未定义"}
      </span>

      {isRequired && (
        <span className="flex items-center text-gray-500">必填</span>
      )}
    </div>
  );
};
