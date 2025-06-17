import { FC, memo, useEffect, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { Accordion, AccordionItem, Button, Collapsible, Icon } from "@/ui";
import {
  AddVariableDialog,
  VariableProps,
  VariableLabel,
} from "@/lib/components";
import { PanelProps } from "../base-panel";
import { charId } from "@/lib/utils/flowHelper";

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
      <Accordion type="multiple" bordered={false} defaultValue={["input"]}>
        <AccordionItem
          value="input"
          header="输入"
          actions={
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
                  <Icon name="ri-add-line" />
                </Button>
              }
              value={variable}
              onChange={setVariable}
              onSubmit={handleAddVariable}
            />
          }
        >
          <div className="grid gap-1">
            {variables?.map((variable) => (
              <div
                key={variable.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <div className="flex-1">
                  <Collapsible content={123}>
                    <VariableLabel type={variable.type} label={variable.name} />
                  </Collapsible>
                </div>
                <div className="flex gap-1 ml-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEditing(variable)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Icon name="ri-edit-2-line" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVariable(variable.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Icon name="ri-delete-bin-line" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default memo(StartPanel);
