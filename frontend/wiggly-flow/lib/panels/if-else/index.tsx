import { FC, memo, useEffect, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { Accordion, AccordionItem } from "@/ui";
import {
  AddVariableDialog,
  VariableProps,
  VariableLabel,
} from "@/lib/components";
import { PanelProps } from "../base-panel";
import LogicBuilder from "./logic-builder";

const IfElsePanel: FC<PanelProps> = ({ node }) => {
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
      <LogicBuilder />
    </>
  );
};

export default memo(IfElsePanel);
