import { FC, memo, useEffect, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { PanelProps } from "../base-panel";
import { charId } from "../../utils/flowHelper";
import {
  AddVariableDialog,
  VariableProps,
} from "../../components/add-variable-dialog";
import { VariableLabel } from "../../components/variable-label";
import { Button } from "@/components/ui/button";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Collapsible from "@/components/ui/collapsible";

const defaultForm: VariableProps = {
  id: "",
  name: "",
  desrc: "",
  type: "string",
  defaultValue: "",
};

const StartPanel: FC<PanelProps> = ({ node }) => {
  const { updateNodeData } = useReactFlow();
  const [variables, setVariables] = useState<VariableProps[]>([]);
  const [variable, setVariable] = useState<VariableProps>(defaultForm);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (node) {
      setVariables(node.data.variables ?? []);
    }
  }, [node?.id]);

  useEffect(() => {
    if (node) {
      updateNodeData(node.id, {
        variables: variables,
      });
    }
  }, [variables]);

  const handleAddVariable = (data: VariableProps) => {
    setVariables((prev) => {
      if (isEditing) {
        return prev.map((val) => {
          return val.id === data.id ? data : val;
        });
      } else {
        return prev.concat({ ...data, id: charId() });
      }
    });
    setOpen(false);
  };

  const startAdding = () => {
    setVariable(defaultForm);
    setIsEditing(false);
    setOpen(true);
  };

  const startEditing = (val: VariableProps) => {
    setVariable(val);
    setIsEditing(true);
    setOpen(true);
  };

  const removeVariable = (id: string) => {
    setVariables((prev) => prev.filter((val) => val.id !== id));
  };

  return (
    <>
      <Accordion type="multiple" defaultValue={["input"]}>
        <AccordionItem value="input">
          <div className="flex items-center justify-between">
            <AccordionTrigger iconPosition="left">
              <span className="flex-1">输入</span>
            </AccordionTrigger>
            <AddVariableDialog
              open={open}
              title={isEditing ? "编辑变量" : "添加变量"}
              onOpenChange={(v) => setOpen(v)}
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={startAdding}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <IconPlus />
                </Button>
              }
              value={variable}
              onChange={setVariable}
              onSubmit={handleAddVariable}
            />
          </div>
          <AccordionContent>
            <div className="grid gap-1">
              {variables?.map((variable) => (
                <div
                  key={variable.id}
                  className="flex w-full items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div className="flex-1 min-w-0 break-all overflow-hidden">
                    <Collapsible
                      content={
                        <div className="flex flex-col gap-1 text-sm text-gray-600 min-w-0 break-all">
                          {variable.desrc && (
                            <div className="whitespace-pre-wrap break-all min-w-0">
                              描述：<div>{variable.desrc}</div>
                            </div>
                          )}
                          <div className="min-w-0">
                            默认值：
                            <pre className="rounded px-2 py-1 overflow-auto break-all whitespace-pre-wrap max-w-full">
                              {typeof variable.defaultValue === "object"
                                ? JSON.stringify(variable.defaultValue, null, 2)
                                : String(variable.defaultValue)}
                            </pre>
                          </div>
                        </div>
                      }
                    >
                      <VariableLabel
                        type={variable.type}
                        label={variable.name}
                      />
                    </Collapsible>
                  </div>

                  <div className="flex gap-1 ml-1 items-start h-full shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing(variable)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <IconEdit />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVariable(variable.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <IconTrash />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default memo(StartPanel);
