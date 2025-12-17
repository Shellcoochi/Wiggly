import { FC } from "react";
import { NodeType } from "@/components/workflow/const";
import {
  IconArrowsSplit,
  IconBrain,
  IconPennant,
  IconPlayerPlay,
  IconRepeat,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface NodeIconProps {
  type?: NodeType;
  className?: string;
}

const ICON_CONFIG: any = {
  [NodeType.Start]: {
    icon: IconPlayerPlay,
    bgColor: "bg-blue-500",
  },
  [NodeType.LLM]: {
    icon: IconBrain,
    bgColor: "bg-purple-500",
  },
  [NodeType.End]: {
    icon: IconPennant,
    bgColor: "bg-orange-500",
  },
  [NodeType.IfElse]: {
    icon: IconArrowsSplit,
    bgColor: "bg-cyan-500",
  },
  [NodeType.Loop]: {
    icon: IconRepeat,
    bgColor: "bg-cyan-500",
  },
  [NodeType.LoopStart]: {
    icon: IconPlayerPlay,
    bgColor: "bg-blue-500",
  },
};

export const NodeIcon: FC<NodeIconProps> = ({
  type = NodeType.Start,
  className = "",
}) => {
  const { icon: Icon, bgColor } = ICON_CONFIG[type];

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-md w-6 h-6",
        bgColor,
        className
      )}
    >
      <Icon size={14} className="text-white" />
    </div>
  );
};
