import { FC, memo, useEffect, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { PanelProps } from "../base-panel";
import { charId } from "../../utils/flowHelper";
import { VariableSelect } from "../../components/variable-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconX } from "@tabler/icons-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface OutputProps {
  id: string;
  name?: string;
  desrc?: string;
  variable?: any;
}

const EndPanel: FC<PanelProps> = ({ node }) => {
  const { updateNodeData } = useReactFlow();
  const [outputs, setOutputs] = useState<OutputProps[]>([]);

  useEffect(() => {
    if (node) {
      setOutputs(node.data.outputs ?? []);
    }
  }, [node, node?.id]);

  useEffect(() => {
    if (node) {
      updateNodeData(node.id, { outputs });
    }
  }, [node, outputs, updateNodeData]);

  const handleAddVariable = () => {
    setOutputs((prev) => [...prev, { id: charId() }]);
  };

  const handleUpdate = (id: string, field: keyof OutputProps, value: any) => {
    setOutputs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleRemove = (id: string) => {
    setOutputs((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <Accordion type="multiple" defaultValue={["output"]}>
      <AccordionItem value="output">
        <AccordionTrigger>
          输出
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-500 hover:text-blue-700"
            onClick={handleAddVariable}
          >
            <IconX name="ri-add-line" />
          </Button>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid gap-2">
            {outputs.map((output) => (
              <div
                key={output.id}
                className="grid grid-cols-11 gap-2 items-center"
              >
                <Input
                  value={output.name ?? ""}
                  className="col-span-3"
                  placeholder="变量名"
                  onChange={(e: { target: { value: any } }) =>
                    handleUpdate(output.id, "name", e.target.value)
                  }
                />
                <VariableSelect
                  value={output.variable}
                  className="col-span-7"
                  onSelect={(value) =>
                    handleUpdate(output.id, "variable", value)
                  }
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemove(output.id)}
                >
                  <IconX name="ri-delete-bin-line" />
                </Button>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default memo(EndPanel);
