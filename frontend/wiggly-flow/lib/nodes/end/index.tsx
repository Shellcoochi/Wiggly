import React, { memo } from "react";
import BaseNode from "../base-node/node";
/**@todo any类型 */
export default memo((props: any) => {
  return <BaseNode node={props}>结束</BaseNode>;
});
