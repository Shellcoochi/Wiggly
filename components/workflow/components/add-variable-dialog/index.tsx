import { FC, memo, ReactNode } from "react";
import { WigglyEditor } from "../editor";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface AddVariableDialogProps {
  value: VariableProps;
  trigger: ReactNode;
  title?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
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
  function AddDialog({
    value,
    title,
    onChange,
    onSubmit,
    trigger,
    ...restProps
  }) {
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
              value={value.defaultValue}
              onChange={(e) => handleChange("defaultValue", e.target.value)}
            />
          );
        case "number":
          return (
            <Input
              type="number"
              value={value.defaultValue}
              onChange={(e) =>
                handleChange("defaultValue", parseFloat(e.target.value))
              }
            />
          );
        case "boolean":
          return (
            <Select
              value={value.defaultValue}
              onValueChange={(val) =>
                handleChange("defaultValue", val as VariableType)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">true</SelectItem>
                <SelectItem value="false">false</SelectItem>
              </SelectContent>
            </Select>
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
      <Dialog {...restProps}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="bg-popover">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm text-popover-foreground">
                变量名称
              </label>
              <Input
                type="text"
                value={value.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-popover-foreground">
                变量描述
              </label>
              <Input
                type="text"
                value={value.desrc}
                onChange={(e) => handleChange("desrc", e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-popover-foreground">
                变量类型
              </label>
              <Select
                value={value.type}
                onValueChange={(val) =>
                  handleChange("type", val as VariableType)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {variableTypeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-1 text-sm text-popover-foreground">
                默认值
              </label>
              {renderDefaultValueInput()}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
            <Button type="submit" onClick={handleSubmit}>
              确定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
