import { FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NodeType } from "@/components/workflow/const";
import { NodeIcon } from "./node-icon";
import { IconSearch } from "@tabler/icons-react";

export interface SectionItemProps {
  label: string;
  type: string;
  icon: React.ReactNode;
  color?: string;
}
interface SelectorProps {
  onChange?: (value: SectionItemProps) => void;
}
interface SectionProps {
  title: string;
  items: SectionItemProps[];
  onSelected?: (value: any) => void;
}

const Selector: FC<SelectorProps> = ({ onChange }) => {
  return (
    <div className="w-40 bg-white border-gray-200 flex flex-col p-2 text-sm">
      <div className="relative mb-2">
        <IconSearch className="absolute left-2.5 top-1.5 text-gray-400" />
        <input
          placeholder="搜索节点"
          className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <Tabs defaultValue="nodes" className="w-full flex flex-col gap-4">
        <TabsList className="inline-flex h-auto p-0 bg-transparent border-b border-gray-200 rounded-none">
          <TabsTrigger
            value="nodes"
            className="data-[state=active]:bg-transparent data-[state=active]:border-black data-[state=active]:text-black data-[state=active]:shadow-none text-gray-600 hover:text-black rounded-none border-b-2 border-transparent px-4 py-2"
          >
            节点
          </TabsTrigger>
          <TabsTrigger
            value="tools"
            className="data-[state=active]:bg-transparent data-[state=active]:border-black data-[state=active]:text-black data-[state=active]:shadow-none text-gray-600 hover:text-black rounded-none border-b-2 border-transparent px-4 py-2"
          >
            工具
          </TabsTrigger>
        </TabsList>
        <TabsContent value="nodes" className="mt-2">
          <div>
            <Section
              title=""
              onSelected={onChange}
              items={[
                {
                  label: "开始",
                  type: NodeType.Start,
                  color: "text-indigo-600",
                  icon: <NodeIcon type={NodeType.Start} />,
                },
                {
                  label: "结束",
                  type: NodeType.End,
                  color: "text-indigo-600",
                  icon: <NodeIcon type={NodeType.End} />,
                },
                {
                  label: "LLM",
                  color: "text-indigo-600",
                  type: NodeType.LLM,
                  icon: <NodeIcon type={NodeType.LLM} />,
                },
                {
                  label: "条件",
                  color: "text-indigo-600",
                  type: NodeType.IfElse,
                  icon: <NodeIcon type={NodeType.IfElse} />,
                },
                {
                  label: "循环",
                  color: "text-indigo-600",
                  type: NodeType.Loop,
                  icon: <NodeIcon type={NodeType.Loop} />,
                },
              ]}
            />
          </div>
        </TabsContent>

        <TabsContent value="tools" className="mt-2">
          <div>工具面板开发中...</div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Section: FC<SectionProps> = ({ title, items, onSelected }) => {
  const handleAddNode = (item: SectionItemProps) => {
    onSelected?.(item);
  };

  return (
    <div className="mb-4">
      {title ? (
        <div className="text-xs text-gray-500 border-b border-gray-200 pb-1 mb-2">
          {title}
        </div>
      ) : null}
      <ul className="space-y-1">
        {items.map((item) => (
          <li
            key={item.label}
            onClick={handleAddNode.bind(null, item)}
            className="flex items-center px-2 py-1 rounded cursor-pointer hover:bg-gray-100 text-gray-800"
          >
            <span className={`mr-2 ${item.color}`}>{item.icon}</span>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Selector;
