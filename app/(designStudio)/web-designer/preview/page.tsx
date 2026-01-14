"use client";

import { SafeRenderer,Renderer } from "@/components/web-designer/renderer";
import schema from "./schema.json";

export default function Workflow() {

  return (
    <div className="container mx-auto space-y-6 max-w-full">
      <SafeRenderer
        schema={schema}
        onError={(error, node) => {
          console.error(`Error in ${node.componentName}:`, error);
        }}
        fallback={<div>渲染失败</div>}
      />
      {/* <Renderer schema={schema} /> */}
    </div>
  );
}
