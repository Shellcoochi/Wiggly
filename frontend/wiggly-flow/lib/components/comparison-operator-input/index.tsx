import { ChangeEvent, FC, memo, useState } from "react";
import { DropdownMenu, DropdownOption, Icon, Separator } from "@/ui";
import { VariableSelect } from "@/lib/components";
import { ComparisonOperator, ComparisonOperatorName } from "@/lib/const";

interface ComparisonOperatorInputProps {
  onChange?: (val: any) => void;
}

export const ComparisonOperatorInput: FC<ComparisonOperatorInputProps> = ({
  onChange,
}) => {
  const [variable, setVariable] = useState<any>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [operator, setOperator] = useState<ComparisonOperator>();

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
  const comparisonOperators: DropdownOption<ComparisonOperator>[] = [
    { type: "radio", label: "包含", value: ComparisonOperator.contains },
    {
      type: "radio",
      label: "不为空",
      value: ComparisonOperator.notNull,
    },
  ];

  const handleVariableSelect = (val: any) => {
    setVariable(val);
    onChange?.({ variable: val, operator, value: inputValue });
  };

  const handleOperatorChange = (val: DropdownOption<ComparisonOperator>) => {
    setOperator(val.value);
    onChange?.({ variable, operator: val.value, value: inputValue });
  };

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange?.({ variable, operator: operator, value: e.target.value });
  };

  return (
    <div className="bg-gray-100 rounded-md relative">
      <VariableSelect
        options={options2}
        onSelect={handleVariableSelect}
        suffix={
          <DropdownMenu
            options={comparisonOperators}
            onItemClick={handleOperatorChange}
          >
            <div className="flex items-center space-x-2">
              <Separator orientation="vertical" />
              <span>
                {(operator && ComparisonOperatorName[operator]) || "选择操作"}{" "}
                <Icon name="ri-arrow-down-s-line" />
              </span>
            </div>
          </DropdownMenu>
        }
      />
      <Separator className="bg-bg-secondary" />
      <input
        className="px-2 w-full h-8 border-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-transparent"
        placeholder="输入值"
        value={inputValue}
        onChange={handleValueChange}
      />
    </div>
  );
};
