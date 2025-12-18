import { useState } from "react";
import { VariableLabel } from "../../components/variable-label";
import { useEnvVariableStore } from "../../store/env-variable-store";
import { Button } from "@/components/ui/button";
import { IconX } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Popover from "@/components/ui/popover";
import { Toggle } from "@/components/ui/toggle";

type VariableType = "string" | "number" | "boolean" | "array";

interface Variable {
  name: string;
  type: VariableType;
  value: any;
}

const ValueInput = ({
  type,
  value,
  onChange,
}: {
  type: VariableType;
  value: any;
  onChange: (v: any) => void;
}) => {
  if (type === "number") {
    return (
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        placeholder="输入数值"
      />
    );
  }
  if (type === "boolean") {
    return <Switch checked={!!value} onCheckedChange={onChange} />;
  }
  if (type === "array") {
    return (
      <Input
        value={Array.isArray(value) ? value.join(",") : ""}
        onChange={(e) =>
          onChange(e.target.value.split(",").map((item) => item.trim()))
        }
        placeholder="用逗号分隔多个值，如: 1,2,3"
      />
    );
  }
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="输入字符串值"
    />
  );
};

export const EnvVariableTool = () => {
  const { envVariables, setEnvVariables } = useEnvVariableStore() as any;
  const [formState, setFormState] = useState<Partial<Variable>>({
    name: "",
    type: "string",
    value: "",
  });
  const [open, setOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const resetForm = () => {
    setFormState({ name: "", type: "string", value: "" });
    setIsAdding(false);
    setEditingIndex(null);
  };

  const submitVariable = () => {
    const name = formState.name?.trim();
    if (!name) return;

    if (
      editingIndex === null &&
      envVariables.some((v: { name: string }) => v.name === name)
    ) {
      alert(`变量名 "${name}" 已存在`);
      return;
    }

    const newVar: Variable = {
      name,
      type: formState.type || "string",
      value:
        formState.type === "boolean"
          ? !!formState.value
          : formState.value ?? "",
    };

    if (editingIndex !== null) {
      envVariables[editingIndex] = newVar;
      setEnvVariables(envVariables);
    } else {
      setEnvVariables([newVar, ...envVariables]);
    }

    resetForm();
  };

  const startEditing = (index: number) => {
    const v = envVariables[index];
    setFormState({ ...v });
    setEditingIndex(index);
    setIsAdding(true);
  };

  const removeVariable = (index: number) => {
    setEnvVariables((prev: any[]) => prev.filter((_, i) => i !== index));
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    resetForm();
  };

  return (
    <Popover
      open={open}
      onOpenChange={handleOpenChange}
      trigger={
        <Toggle pressed={open} onPressedChange={(val) => setOpen(val)}>
          ENV
        </Toggle>
      }
    >
      <div className="w-[320px]">
        {isAdding ? (
          <div className="space-y-3 mb-4">
            <div className="flex items-center space-x-2">
              <Input
                value={formState.name}
                onChange={(e) =>
                  setFormState({ ...formState, name: e.target.value })
                }
                placeholder="变量名"
                className="flex-1"
              />
              <Select
                value={formState.type}
                onValueChange={(type) =>
                  setFormState({
                    ...formState,
                    type: type as VariableType,
                    value:
                      type === "array" ? [] : type === "boolean" ? false : "",
                  })
                }
              >
                <SelectTrigger className="w-45">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">字符串</SelectItem>
                  <SelectItem value="number">数字</SelectItem>
                  <SelectItem value="boolean">布尔值</SelectItem>
                  <SelectItem value="array">数组</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ValueInput
              type={formState.type || "string"}
              value={formState.value}
              onChange={(val) => setFormState({ ...formState, value: val })}
            />
            <div className="flex space-x-2">
              <Button onClick={submitVariable} size="sm">
                {editingIndex !== null ? "保存修改" : "确认添加"}
              </Button>
              <Button onClick={resetForm} variant="outline" size="sm">
                取消
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Button
              onClick={() => setIsAdding(true)}
              size="sm"
              className="w-full mb-4"
            >
              添加变量
            </Button>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {envVariables.length === 0 ? (
                <div className="text-center text-sm text-gray-400">
                  暂无变量，请先添加。
                </div>
              ) : (
                envVariables?.map((variable: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div className="flex-1">
                      <VariableLabel
                        type={variable.type}
                        label={variable.name}
                      />
                    </div>
                    <div className="flex gap-2 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(index)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <IconX name="ri-edit-2-line" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariable(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <IconX name="ri-delete-bin-line" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </Popover>
  );
};
