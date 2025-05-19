import { FC, memo, useEffect, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { Accordion, AccordionItem } from "@/ui";
import { AddVariableDialog, VariableProps } from "@/lib/components";
import VariableLabel from "@/lib/components/variable-label";
import { PanelProps } from "../base-panel";

const EndPanel: FC<PanelProps> = ({ node }) => {
  const { updateNodeData } = useReactFlow();
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
          actions={<AddVariableDialog onSubmit={handleAddVariable} />}
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
