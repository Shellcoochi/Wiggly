import { VariableType } from "@/lib/const";
import { FC, memo } from "react";
import { clsx } from "clsx";

interface VariableLabelProps {
  type?: string;
  label?: string;
  isRequired?: boolean;
  className?: string;
}

const VariableLabel: FC<VariableLabelProps> = ({
  type,
  isRequired,
  label,
  className,
}) => {
  const renderIcon = () => {
    if (type == "string") {
      return "{str.}";
    } else {
      return "{var}";
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

export default memo(VariableLabel);
