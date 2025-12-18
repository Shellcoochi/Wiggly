import { FC, memo, useEffect, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { PanelProps } from "../base-panel";
import { charId } from "../../utils/flowHelper";
import { VariableSelect } from "../../components/variable-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconPlus, IconTrash, IconX } from "@tabler/icons-react";
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
        <div className="flex items-center justify-between">
          <AccordionTrigger iconPosition="left">
            <span className="flex-1">输出</span>
          </AccordionTrigger>
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-primary hover:text-primary/90"
            onClick={handleAddVariable}
          >
            <IconPlus />
          </Button>
        </div>

        <AccordionContent>
          <div className="grid gap-2">
            {outputs.map((output) => (
              <div
                key={output.id}
                className="grid grid-cols-11 gap-2 items-center"
              >
                <Input
                  value={output.name ?? ""}
                  className="col-span-3 h-8 ring-0!"
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
                  size="icon-xs"
                  className="text-destructive hover:text-destructive/90"
                  onClick={() => handleRemove(output.id)}
                >
                  <IconTrash/>
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
