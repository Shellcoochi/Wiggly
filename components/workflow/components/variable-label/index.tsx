import { FC } from "react";
import { cn } from "@/lib/utils";
import {
  IconAbc,
  IconBracketsContain,
  IconJson,
  IconNumber,
  IconToggleLeft,
  IconVariable,
} from "@tabler/icons-react";

interface VariableLabelProps {
  title?: string;
  type?: string;
  label?: string;
  isRequired?: boolean;
  className?: string;
}

export const VariableLabel: FC<VariableLabelProps> = ({
  type,
  isRequired,
  label,
  title,
  className,
}) => {
  const renderIcon = () => {
    const size = 16;
    if (type == "string") {
      return <IconAbc size={size} />;
    } else if (type == "number") {
      return <IconNumber size={size} />;
    } else if (type == "boolean") {
      return <IconToggleLeft size={size} />;
    } else if (type == "array") {
      return <IconBracketsContain size={size} />;
    } else if (type == "json") {
      return <IconJson size={size} />;
    } else {
      return <IconVariable size={size} />;
    }
  };

  return (
    <div
      className={cn(
        "flex justify-between px-1 rounded-md items-center h-6 bg-secondary text-xs",
        className
      )}
    >
      <span className="text-gray-800 flex items-center gap-1">
        {title ? <span className="text-muted-foreground">{title}</span> : null}
        <span className="text-muted-foreground rounded mr-0.5">
          {renderIcon()}
        </span>
        <span>{label ?? "未定义"}</span>
      </span>

      {isRequired && (
        <span className="flex items-center text-muted-foreground">必填</span>
      )}
    </div>
  );
};
