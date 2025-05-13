import React, { memo } from "react";
import BaseNode from "../base-node/node";
/**@todo any类型 */
export default memo((props: any) => {
  return <BaseNode nodeProps={props}></BaseNode>;
});
