import { FC } from "react";
import { NodeType } from "@/lib/const";
import { Icon } from "@/ui";
import clsx from "clsx";

interface NodeIconProps {
  type?: NodeType;
}

const COLOR_MAP: Record<string, string> = {
  [NodeType.Start]: "bg-blue-500",
  [NodeType.LLM]: "bg-blue-500",
  [NodeType.End]: "bg-warning",
  [NodeType.IfElse]: "bg-cyan-500",
  [NodeType.Loop]: "bg-cyan-500",
  [NodeType.LoopStart]: "bg-blue-500",
};

export const NodeIcon: FC<NodeIconProps> = ({ type }) => {
  return (
    <Icon
      name={type}
      fill="#fff"
      className={clsx("rounded-md p-1", COLOR_MAP[type])}
    />
  );
};
