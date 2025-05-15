import React, { memo } from "react";
import BaseNode from "../base-node/node";
import { FlowNodeProps } from "@/lib/types";

export default memo((props: FlowNodeProps) => {
  return <BaseNode node={props}></BaseNode>;
});
