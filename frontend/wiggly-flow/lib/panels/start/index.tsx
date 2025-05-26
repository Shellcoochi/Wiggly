import { FC, memo, useEffect, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { Accordion, AccordionItem } from "@/ui";
import {
  AddVariableDialog,
  VariableProps,
  VariableLabel,
} from "@/lib/components";
import { PanelProps } from "../base-panel";

const StartPanel: FC<PanelProps> = ({ node }) => {
  const { updateNodeData } = useReactFlow();
  const [variables, setVariables] = useState<VariableProps[]>([]);

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
    setVariables((prev) => prev.concat(data));
  };
  return (
    <>
      <Accordion type="multiple" bordered={false} defaultValue={["input"]}>
        <AccordionItem
          value="input"
          header="输入"
          actions={<AddVariableDialog onSubmit={handleAddVariable} />}
        >
          <div className="grid gap-1">
            {variables?.map((variable) => (
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

export default memo(StartPanel);
