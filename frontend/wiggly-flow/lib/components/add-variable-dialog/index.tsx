import { FC, memo, ReactNode, useState } from "react";
import { Dialog, DialogProps, Icon, Input, Select } from "@/ui";
import { WigglyEditor } from "../editor";

type VariableType =
  | "string"
  | "boolean"
  | "number"
  | "array"
  | "json"
  | "date"
  | "object"
  | "files";

export interface VariableProps {
  id: string;
  name: string;
  desrc: string;
  type: VariableType;
  defaultValue: any;
}

interface AddVariableDialogProps extends DialogProps {
  value: VariableProps;
  onChange?: (val: VariableProps) => void;
  onSubmit?: (variable: VariableProps) => void;
}

const variableTypeOptions = [
  { value: "string", label: "String" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "object", label: "Object" },
  { value: "array", label: "Array" },
  { value: "json", label: "Json" },
  { value: "files", label: "Files" },
];
export const AddVariableDialog: FC<AddVariableDialogProps> = memo(
  ({ value, onChange, onSubmit, ...restProps }) => {
    const handleChange = (key: keyof VariableProps, val: any) => {
      onChange?.({ ...value, [key]: val });
    };

    const handleSubmit = () => {
      onSubmit?.(value);
    };

    const renderDefaultValueInput = () => {
      switch (value.type) {
        case "string":
          return (
            <Input
              type="text"
              size="sm"
              value={value.defaultValue}
              onChange={(e) => handleChange("defaultValue", e.target.value)}
            />
          );
        case "number":
          return (
            <Input
              type="number"
              size="sm"
              value={value.defaultValue}
              onChange={(e) =>
                handleChange("defaultValue", parseFloat(e.target.value))
              }
            />
          );
        case "boolean":
          return (
            <Select
              className="w-full"
              value={value.defaultValue}
              options={[
                { value: "true", label: "true" },
                { value: "false", label: "false" },
              ]}
              onValueChange={(val) =>
                handleChange("defaultValue", val as VariableType)
              }
            />
          );
        case "array":
        case "json":
        case "object":
          return (
            <WigglyEditor
              type={value.type}
              value={value.defaultValue}
              onChange={(val) => handleChange("defaultValue", val)}
            />
          );
        case "date":
          return (
            <input
              type="date"
              value={value.defaultValue}
              onChange={(e) => handleChange("defaultValue", e.target.value)}
            />
          );
        case "files":
          return (
            <input
              type="file"
              multiple
              onChange={(e) =>
                handleChange("defaultValue", Array.from(e.target.files || []))
              }
            />
          );
        default:
          return null;
      }
    };

    return (
      <Dialog {...restProps} onOk={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              变量名称
            </label>
            <Input
              type="text"
              size="sm"
              value={value.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              变量描述
            </label>
            <Input
              type="text"
              size="sm"
              value={value.desrc}
              onChange={(e) => handleChange("desrc", e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              变量类型
            </label>
            <Select
              className="w-full"
              value={value.type}
              options={variableTypeOptions}
              onValueChange={(val) => handleChange("type", val as VariableType)}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              默认值
            </label>
            {renderDefaultValueInput()}
          </div>
        </div>
      </Dialog>
    );
  }
);
