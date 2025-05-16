import { FC, memo, useEffect, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { Accordion, AccordionItem } from "@/ui";
import { AddVariableDialog, VariableProps } from "@/lib/components";
import VariableLabel from "@/lib/components/variable-label";
import { PanelProps } from "../base-panel";

const StartPanel: FC<PanelProps> = ({ node }) => {
  const { updateNodeData } = useReactFlow();
  const [variables, setVariables] = useState<VariableProps[]>([]);

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
      <Accordion
        type="multiple"
        bordered={false}
        defaultValue={["input", "item-2"]}
      >
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
        <AccordionItem value="item-2" header="标题二">
          内容二
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default memo(StartPanel);
