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
  return (
    <div className="grid gap-2">
      <VariableSelect />
      <Select className="w-full" options={options} />
      <Select className="w-full" options={options} />
      <Input className="" />
    </div>
  );
};
export default LogicBuilder;
