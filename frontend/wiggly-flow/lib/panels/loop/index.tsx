import { ChangeEvent, FC, memo, useEffect, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { DropdownMenu, DropdownOption, Icon, Separator } from "@/ui";
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
    <>
      <ComparisonOperatorInput />
    </>
  );
};

export default memo(LoopPanel);
