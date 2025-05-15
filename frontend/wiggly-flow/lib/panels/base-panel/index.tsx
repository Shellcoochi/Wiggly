import { FC, useEffect, useState, ChangeEvent } from "react";
import { Input } from "@/ui";
import { FlowNodeProps } from "@/lib/types";
import { useReactFlow } from "@xyflow/react";
import { NodeLabel } from "@/lib/const";

interface PanelProps {
  node?: FlowNodeProps;
}

const Panel: FC<PanelProps> = ({ node }) => {
  const { updateNodeData } = useReactFlow();
  const [label, setLabel] = useState<string>(node?.data.label ?? "节点");
  const description = node?.data?.description ?? "请添加描述...";

  useEffect(() => {
    setLabel(node?.data.label ?? "节点");
  }, [node?.data.label]);

  const updateLabel = (val: string) => {
    if (node) {
      setLabel(val);
      updateNodeData(node.id, {
        label: val,
      });
    }
  };

  const handleLabelChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateLabel(e.target.value);
  };

  const handleLabelBlur = () => {
    if (!label?.length && node) {
      updateLabel(NodeLabel[node.type]);
    }
  };

  return (
    <div className="w-[400px] rounded-xl bg-white border border-gray-200 p-5 text-sm shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-600 text-lg">
            ⚙️
          </div>
          <div className="text-base font-semibold">
            <Input
              className="pl-0 border-none focus-within:!ring-0"
              value={label}
              onChange={handleLabelChange}
              onBlur={handleLabelBlur}
            />
          </div>
        </div>
        <div className="mt-1 text-sm text-gray-400">{description}</div>
      </div>

      {/* 模型 */}
      <div className="mb-4">
        <label className="block font-medium mb-1">
          模型 <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2 border border-yellow-300 bg-yellow-50 text-yellow-800 rounded px-3 py-2">
          <div className="w-4 h-4 bg-yellow-300 rounded-full" />
          <span className="text-sm">请选择模型</span>
        </div>
      </div>

      {/* 上下文 */}
      <div className="mb-4">
        <label className="flex items-center gap-1 font-medium mb-1">
          上下文 <span className="text-gray-400 cursor-default">?</span>
        </label>
        <div className="px-3 py-2 bg-gray-100 text-gray-500 rounded">
          {"{x}"} 设置变量值
        </div>
      </div>

      {/* 异常处理 */}
      <div className="mb-6">
        <label className="font-medium block mb-1">异常处理</label>
        <select className="w-full border border-gray-300 rounded px-2 py-1 bg-white text-gray-700">
          <option value="none">无</option>
          <option value="retry">重试</option>
          <option value="skip">跳过</option>
        </select>
      </div>

      {/* 下一步 */}
      <div>
        <label className="font-medium mb-1 block">下一步</label>
        <p className="text-gray-400 text-sm mb-2">
          添加此工作流程中的下一个节点
        </p>
        <div className="flex items-center gap-2 border border-dashed border-gray-300 p-2 rounded cursor-pointer">
          <div className="w-6 h-6 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded">
            ⚙️
          </div>
          <span className="text-gray-500">选择下一个节点</span>
        </div>
      </div>
    </div>
  );
};

export default Panel;
