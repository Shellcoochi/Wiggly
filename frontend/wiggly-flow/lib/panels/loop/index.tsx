import { ChangeEvent, FC, memo, useEffect, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import {
  Accordion,
  AccordionItem,
  DropdownMenu,
  DropdownOption,
  Icon,
  Separator,
  Slider,
} from "@/ui";
import { ComparisonOperatorInput, VariableProps } from "@/lib/components";
import { PanelProps } from "../base-panel";
import { ComparisonOperator } from "@/lib/const";

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
      bordered={false}
      defaultValue={["operator", "times"]}
    >
      <AccordionItem value="operator" header="循环终止条件">
        <ComparisonOperatorInput />
      </AccordionItem>
      <AccordionItem value="times" header="最大循环次数">
        <Slider />
      </AccordionItem>
    </Accordion>
  );
};

export default memo(LoopPanel);
