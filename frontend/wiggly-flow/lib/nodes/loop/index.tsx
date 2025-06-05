import { memo, useEffect } from "react";
import BaseNode from "../base-node/node";
import { FlowNodeProps } from "@/lib/types";
import { Background, useReactFlow } from "@xyflow/react";
import { NodeConfig, NodeType } from "@/lib/const";

export default memo((props: FlowNodeProps) => {
  const { addNodes } = useReactFlow();

  useEffect(() => {
    const startLoop: any = {
      id: props.id + "start",
      position: {
        x: props.positionAbsoluteX,
        y: props.positionAbsoluteY,
      },
      parentId: props.id,
      extent: "parent",
      expandParent:true,
      ...NodeConfig[NodeType.LoopStart],
    };
    addNodes(startLoop);
  }, [props.id]);

  return (
    <BaseNode node={props} showResizer>
      <Background id={`loop-background-${props.id}`} className="!z-0" />
    </BaseNode>
  );
});
