import { memo, useEffect } from "react";
import BaseNode from "../base-node/node";
import { Background, useReactFlow } from "@xyflow/react";
import { NodeConfig, NodeType } from "../../const";
import { FlowNodeProps } from "../../types";

export default memo(function Loop(props: FlowNodeProps) {
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
      expandParent: true,
      ...NodeConfig[NodeType.LoopStart],
    };
    addNodes(startLoop);
  }, [addNodes, props.id, props.positionAbsoluteX, props.positionAbsoluteY]);

  return (
    <BaseNode node={props} showResizer>
      <Background id={`loop-background-${props.id}`} className="z-0!" />
    </BaseNode>
  );
});
