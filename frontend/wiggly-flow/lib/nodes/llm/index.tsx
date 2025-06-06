import React, { memo } from "react";
import BaseNode from "../base-node/node";
import { FlowNodeProps } from "@/lib/types";
import { Avatar, Icon } from "@/ui";

export default memo((props: FlowNodeProps) => {
  const {
    data: { variables },
  } = props;

  return (
    <BaseNode node={props}>
      <div className="grid gap-1">
        <div className="flex items-center px-1 rounded-md h-6  bg-gray-100 text-xs">
          <label className="mr-2">输入</label>
          <span>
            <Icon name="string" width={16} className="mr-0.5" />
            input
          </span>
        </div>
        <div className="flex items-center px-1 rounded-md h-6  bg-gray-100 text-xs">
          <label className="mr-2">输出</label>
          <span>
            <Icon name="boolean" width={16} className="mr-0.5" />
            output
          </span>
        </div>
        <div className="flex items-center px-1 rounded-md h-6  bg-gray-100 text-xs">
          <label className="mr-2">模型</label>
          <div className="flex gap-0.5 items-center">
            <Avatar
              src={"https://api.dicebear.com/7.x/miniavs/svg?seed=1"}
              fallback="M"
              shape="square"
              size={16}
            />
            <span className="text-primary">Deepseek</span>
          </div>
        </div>
      </div>
    </BaseNode>
  );
});
