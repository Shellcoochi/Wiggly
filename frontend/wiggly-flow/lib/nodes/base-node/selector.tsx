import { FC } from "react";
import { Tabs } from "@/ui";

const Selector: FC = () => {
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
                  items={[
                    { label: "开始", color: "text-indigo-600", icon: <i className="ri-play-line"/> },
                    { label: "结束", color: "text-indigo-600", icon: <i className="ri-stop-line"/> },
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

interface SectionProps {
  title: string;
  items: {
    label: string;
    icon: React.ReactNode;
    color: string;
  }[];
}

const Section: FC<SectionProps> = ({ title, items }) => {
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
