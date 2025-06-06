import { FC, memo, useEffect, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import { Accordion, AccordionItem } from "@/ui";
import { VariableProps, ModelSelect } from "@/lib/components";
import { PanelProps } from "../base-panel";

const LLMPanel: FC<PanelProps> = ({ node }) => {
  const { updateNodeData } = useReactFlow();
  const [variables, setVariables] = useState<VariableProps[]>([]);
  const options = [
    {
      name: "热门模型",
      children: [
        {
          logo:"https://api.dicebear.com/7.x/miniavs/svg?seed=1",
          name: "deepseek1",
          descr:"大模型描述",
          tags: [
            { id: "1", label: "图片理解" },
            { id: "2", label: "智能识别" },
          ],
        },
        { name: "deepseek2", tags: [{ id: "1", label: "工具调用" }] },
      ],
    },
  ];
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
