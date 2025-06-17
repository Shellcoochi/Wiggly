import { FC, memo, useState } from "react";
import { Dialog, Icon, Input, Select } from "@/ui";
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
  name: string;
  desrc: string;
  type: VariableType;
  defaultValue: any;
}

interface AddVariableDialogProps {
  onSubmit?: (variable: VariableProps) => void;
}

const defaultForm: VariableProps = {
  name: "",
  desrc: "",
  type: "string",
  defaultValue: "",
};

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
  ({ onSubmit }) => {
    const [form, setForm] = useState<VariableProps>(defaultForm);

    const handleChange = (key: keyof VariableProps, value: any) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
      if (onSubmit) onSubmit(form);
      setForm(defaultForm);
    };

    const renderDefaultValueInput = () => {
      switch (form.type) {
        case "string":
          return (
            <Input
              type="text"
              size="sm"
              value={form.defaultValue}
              onChange={(e) => handleChange("defaultValue", e.target.value)}
            />
          );
        case "number":
          return (
            <Input
              type="number"
              size="sm"
              value={form.defaultValue}
              onChange={(e) =>
                handleChange("defaultValue", parseFloat(e.target.value))
              }
            />
          );
        case "boolean":
          return (
            <Select
              className="w-full"
              value={form.defaultValue}
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
              type={form.type}
              value={form.defaultValue}
              onChange={(val) => handleChange("defaultValue", val)}
            />
          );
        case "date":
          return (
            <input
              type="date"
              value={form.defaultValue}
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
      <Dialog
        title="添加变量"
        trigger={
          <div className="cursor-pointer text-blue-600">
            <Icon name="ri-add-line" />
          </div>
        }
        onOk={handleSubmit}
      >
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              变量名称
            </label>
            <Input
              type="text"
              size="sm"
              value={form.name}
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
              value={form.desrc}
              onChange={(e) => handleChange("desrc", e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              变量类型
            </label>
            <Select
              className="w-full"
              value={form.type}
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
