import { VariableSelect } from "@/lib/components";
import { Input, Select, SelectOptionItemProps } from "@/ui";
import * as React from "react";
import { useState } from "react";

const LogicBuilder = () => {
  const options: Array<SelectOptionItemProps> = [
    {
      value: "start",
      label: "开始",
      children: [{ value: "1-1", label: "1111" }],
    },
    {
      value: "end",
      label: "结束",
      children: [{ value: "2-1", label: "222" }],
    },
  ];
  const options2 = [
      {
        name: "开始",
        children: [
          { name: "sdf233", type: "String" },
          { name: "eeeee", type: "String" },
          { name: "aaasss", type: "String" },
          { name: "nmn", type: "Number" },
        ],
      },
      { name: "sys.user_id", type: "String" },
      { name: "sys.files", type: "Array[File]" },
      { name: "sys.app_id", type: "String" },
      { name: "sys.workflow_id", type: "String" },
      { name: "sys.workflow_run_id", type: "String" },
      { name: "ENVIRONMENT", type: "String" },
    ];
  
  return (
    <div className="grid gap-2">
      <VariableSelect options={options2}/>
      <Select className="w-full" options={options} />
      <Select className="w-full" options={options} />
      <Input className="" />
    </div>
  );
};
export default LogicBuilder;
