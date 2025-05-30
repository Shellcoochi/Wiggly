import { VariableSelect } from "@/lib/components";
import { DropdownMenu, Input, Select, SelectOptionItemProps } from "@/ui";
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
      <VariableSelect options={options2} />
      <DropdownMenu
        options={[
          { type: "item", label: "New Tab3", shortcut: "⌘+T" },
          { type: "separator" },
          {
            type: "submenu",
            label: "More Tools",
            children: [
              { type: "item", label: "Save Page As…" },
              { type: "item", label: "Developer Tools" },
            ],
          },
          {
            type: "checkbox",
            label: "Show Bookmarks",
            checked: true,
            onCheckedChange: (v) => {},
          },
          { type: "label", label: "People" },
          { type: "radio", label: "Pedro Duarte", value: "pedro" },
          { type: "radio", label: "Colm Tuite", value: "colm" },
        ]}
        radioGroup={{
          value: "pedro",
          onValueChange: (v) => {},
        }}
      />
      <Select className="w-full" options={options} />
      <Select className="w-full" options={options} />
      <Input className="" />
    </div>
  );
};
export default LogicBuilder;
