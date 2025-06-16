import { memo } from "react";
import { NodeToolbar, Position } from "@xyflow/react";

interface NodeToolbarProps {
  isVisible: boolean;
}

export default memo(({ isVisible }: NodeToolbarProps) => {
  return (
    <NodeToolbar
      offset={0}
      align="end"
      isVisible={isVisible || undefined}
      position={Position.Top}
    >
      <button>cut</button>
      <button>copy</button>
      <button>paste</button>
    </NodeToolbar>
  );
});
