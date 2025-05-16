import { FC, memo, useState } from "react";
import { Dialog, Input } from "@/ui";

type VariableType =
  | "string"
  | "number"
  | "array"
  | "json"
  | "date"
  | "object"
  | "files";

interface Variable {
  name: string;
  description: string;
  type: VariableType;
  defaultValue: any;
}

interface AddVariableDialogProps {
  onSubmit?: (variable: Variable) => void;
}

const defaultForm: Variable = {
  name: "",
  description: "",
  type: "string",
  defaultValue: "",
};

export const AddVariableDialog: FC<AddVariableDialogProps> = memo(
  ({ onSubmit }) => {
    const [form, setForm] = useState<Variable>(defaultForm);

    const handleChange = (key: keyof Variable, value: any) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
      console.log(form);
      if (onSubmit) onSubmit(form);
      setForm(defaultForm);
    };

    const renderDefaultValueInput = () => {
      switch (form.type) {
        case "string":
          return (
            <Input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={form.defaultValue}
              onChange={(e) => handleChange("defaultValue", e.target.value)}
            />
          );
        case "number":
          return (
            <Input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={form.defaultValue}
              onChange={(e) =>
                handleChange("defaultValue", parseFloat(e.target.value))
              }
            />
          );
        case "array":
        case "json":
        case "object":
          return (
            <textarea
              className="w-full border rounded px-3 py-2"
              rows={3}
              placeholder="请输入 JSON 格式"
              value={form.defaultValue}
              onChange={(e) => handleChange("defaultValue", e.target.value)}
            />
          );
        case "date":
          return (
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={form.defaultValue}
              onChange={(e) => handleChange("defaultValue", e.target.value)}
            />
          );
        case "files":
          return (
            <input
              type="file"
              multiple
              className="w-full border rounded px-3 py-2"
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
          <div className="cursor-pointer text-blue-600 hover:underline">
            添加变量
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
              className="w-full border rounded px-3 py-2"
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
              className="w-full border rounded px-3 py-2"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              变量类型
            </label>
            <select
              className="w-full border rounded px-3 py-2"
              value={form.type}
              onChange={(e) =>
                handleChange("type", e.target.value as VariableType)
              }
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="array">Array</option>
              <option value="json">JSON</option>
              <option value="date">Date</option>
              <option value="object">Object</option>
              <option value="files">Files</option>
            </select>
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
