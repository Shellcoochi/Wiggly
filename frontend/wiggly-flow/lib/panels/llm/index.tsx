import { FC, memo, useEffect, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { Accordion, AccordionItem } from "@/ui";
import { ModelSelect, ModelProps, VariableInput } from "@/lib/components";
import { PanelProps } from "../base-panel";

const LLMPanel: FC<PanelProps> = ({ node }) => {
  const { updateNodeData } = useReactFlow();
  const [model, setModel] = useState<ModelProps>();

  useEffect(() => {
    if (node) {
      setModel(node.data.model ?? {});
    }
  }, [node?.id]);

  useEffect(() => {
    if (node) {
      updateNodeData(node.id, {
        model,
      });
    }
  }, [model?.name]);

  const options = [
    {
      name: "热门模型",
      children: [
        {
          logo: "https://api.dicebear.com/7.x/miniavs/svg?seed=1",
          name: "deepseek1",
          descr: "大模型描述",
          tags: [
            { id: "1", label: "图片理解" },
            { id: "2", label: "智能识别" },
          ],
        },
        { name: "deepseek2", tags: [{ id: "1", label: "工具调用" }] },
      ],
    },
  ];

  const handleModelChange = (data: ModelProps) => {
    setModel(data);
  };

  return (
    <>
      <Accordion
        type="multiple"
        bordered={false}
        defaultValue={["input", "system"]}
      >
        <AccordionItem value="input" header="模型">
          <div className="grid gap-1">
            <ModelSelect
              value={model}
              options={options}
              onSelect={handleModelChange}
            />
          </div>
        </AccordionItem>
        <AccordionItem value="system" header="提示词">
          <VariableInput
            value={[
              {
                type: "text",
                content: "hello",
              },
              {
                type: "tag",
                content: "tag",
              },
            ]}
          />
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default memo(LLMPanel);
