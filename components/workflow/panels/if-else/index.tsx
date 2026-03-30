import { FC, memo, useEffect, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { PanelProps } from "../base-panel";
import LogicBuilder from "./logic-builder";
import { VariableProps } from "../../components/add-variable-dialog";

const IfElsePanel: FC<PanelProps> = ({ node }) => {
  const { updateNodeData } = useReactFlow();
  const [outputs, setOutputs] = useState<VariableProps[]>([]);

  useEffect(() => {
    if (node) {
      setOutputs(node.data.outputs ?? []);
    }
  }, [node, node?.id]);

  useEffect(() => {
    if (node) {
      updateNodeData(node.id, {
        outputs: outputs,
      });
    }
  }, [node, outputs, updateNodeData]);

  const handleAddVariable = (data: VariableProps) => {
    setOutputs((prev) => prev.concat(data));
  };
  return (
    <>
      <LogicBuilder node={node} />
    </>
  );
};

export default memo(IfElsePanel);
