import { FC, memo, useEffect, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { Accordion, AccordionItem } from "@/ui";
import {
  AddVariableDialog,
  VariableProps,
  VariableLabel,
  ModelSelect,
} from "@/lib/components";
import { PanelProps } from "../base-panel";

const LLMPanel: FC<PanelProps> = ({ node }) => {
  const { updateNodeData } = useReactFlow();
  const [variables, setVariables] = useState<VariableProps[]>([]);
  const options = [{ name: "deepseek" }];
  return (
    <>
      <Accordion type="multiple" bordered={false} defaultValue={["input"]}>
        <AccordionItem value="input" header="模型">
          <div className="grid gap-1">
            <ModelSelect options={options} />
          </div>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default memo(LLMPanel);
