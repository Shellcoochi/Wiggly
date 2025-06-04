import { FC } from "react";
import { Icon, Tabs } from "@/ui";
import { NodeType } from "@/lib/const";

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
    <div className="w-64 bg-white border-gray-200 flex flex-col p-2 text-sm">
      <div className="relative mb-2">
        <i className="ri-add-line absolute left-2.5 top-2.5 text-gray-400" />
        <input
          placeholder="搜索节点"
          className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <Tabs
        tabs={[
          {
            value: "nodes",
            label: "节点",
            content: (
              <div>
                <Section
                  title=""
                  onSelected={onChange}
                  items={[
                    {
                      label: "开始",
                      type: NodeType.Start,
                      color: "text-indigo-600",
                      icon: <Icon name="start" />,
                    },
                    {
                      label: "结束",
                      type: NodeType.End,
                      color: "text-indigo-600",
                      icon: <Icon name="end" />,
                    },
                    {
                      label: "条件",
                      color: "text-indigo-600",
                      type: NodeType.IfElse,
                      icon: <Icon name="if-else" />,
                    },
                    {
                      label: "循环",
                      color: "text-indigo-600",
                      type: NodeType.Loop,
                      icon: <Icon name="loop" />,
                    },
                  ]}
                />
              </div>
            ),
          },
          {
            value: "tools",
            label: "工具",
            content: <div> 工具面板开发中...</div>,
          },
        ]}
      />
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
