import { FC, memo, useEffect, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { PanelProps } from "../base-panel";
import { ComparisonOperator } from "../../const";
import { VariableProps } from "../../components/add-variable-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { ComparisonOperatorInput } from "../../components/comparison-operator-input";

const LoopPanel: FC<PanelProps> = ({ node }) => {
  const { updateNodeData } = useReactFlow();
  const [outputs, setOutputs] = useState<VariableProps[]>([]);
  const [condition, setCondition] = useState();
  const [inputValue, setInputValue] = useState<string>("");
  const [operator, setOperator] = useState<ComparisonOperator>();

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

  return (
    <Accordion
      type="multiple"
      defaultValue={["operator", "times"]}
    >
      <AccordionItem value="operator">
          <AccordionTrigger>循环终止条件</AccordionTrigger>
          <AccordionContent>
             <ComparisonOperatorInput />
          </AccordionContent>
        </AccordionItem>
       
      <AccordionItem value="times" >
         <AccordionTrigger>最大循环次数</AccordionTrigger>
           <AccordionContent><Slider /></AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default memo(LoopPanel);
