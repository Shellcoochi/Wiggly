import { FC, memo, useEffect, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { Accordion, AccordionItem, Button, Icon } from "@/ui";
import {
  AddVariableDialog,
  VariableProps,
  VariableLabel,
} from "@/lib/components";
import { PanelProps } from "../base-panel";

const defaultForm: VariableProps = {
  id: "",
  name: "",
  desrc: "",
  type: "string",
  defaultValue: "",
};

const EndPanel: FC<PanelProps> = ({ node }) => {
  const { updateNodeData } = useReactFlow();
  const [variable, setVariable] = useState<VariableProps>(defaultForm);
  const [outputs, setOutputs] = useState<VariableProps[]>([]);

  useEffect(() => {
    if (node) {
      setOutputs(node.data.outputs ?? []);
    }
  }, [node?.id]);

  useEffect(() => {
    if (node) {
      updateNodeData(node.id, {
        outputs: outputs,
      });
    }
  }, [outputs]);

  const handleAddVariable = (data: VariableProps) => {
    setOutputs((prev) => prev.concat(data));
  };
  return (
    <>
      <Accordion type="multiple" bordered={false} defaultValue={["input"]}>
        <AccordionItem
          value="input"
          header="输出"
          actions={
            <AddVariableDialog
              value={variable}
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Icon name="ri-add-line" />
                </Button>
              }
              onChange={setVariable}
              onSubmit={handleAddVariable}
            />
          }
        >
          <div className="grid gap-1">
            {outputs?.map((variable) => (
              <VariableLabel
                key={variable.name}
                type={variable.type}
                label={variable.name}
              />
            ))}
          </div>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default memo(EndPanel);
