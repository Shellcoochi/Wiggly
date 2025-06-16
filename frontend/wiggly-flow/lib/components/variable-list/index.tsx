import { useState, Fragment, useMemo, FC } from "react";
import clsx from "clsx";
import { Input } from "@/ui";
import { getPredVariables } from "@/lib/utils/flowHelper";
import { useEdges, useNodes } from "@xyflow/react";
import { useEnvVariableStore } from "@/lib/store";

export interface VariableListItemProps {
  type?: string;
  name?: string;
  id?: string;
  parentId?: string;
  children?: VariableListItemProps[];
}

interface VariableListProps {
  hideSearch?: boolean;
  options?: VariableListItemProps[];
  className?: string;
  onItemClick?: (value: any, parent?: any) => void;
}

export const VariableList: FC<VariableListProps> = ({
  hideSearch,
  options,
  className,
  onItemClick,
}) => {
  const [searchKey, setSearchKey] = useState("");
  const nodes = useNodes();
  const edges = useEdges();
  const { envVariables } = useEnvVariableStore();

  const variables = useMemo(() => {
    const variableOptions = initOptions();
    if (!searchKey.trim()) return variableOptions;

    const filteredOptions = variableOptions
      .map((option) => {
        if (option.children) {
          const filteredChildren = option.children.filter((child) =>
            child?.name?.toLowerCase().includes(searchKey.toLowerCase())
          );
          return { ...option, children: filteredChildren };
        }
        return option?.name?.toLowerCase().includes(searchKey.toLowerCase())
          ? option
          : null;
      })
      .filter(Boolean) as VariableListItemProps[];

    return filteredOptions;
  }, [options, searchKey]);

  function initOptions() {
    if (options) {
      return options;
    } else {
      const [currentNode] = nodes.filter((node) => node.selected);
      const predecessors = getPredVariables(
        currentNode.id,
        nodes,
        edges
      ) as VariableListItemProps[];
      predecessors.push({
        name: "ENV",
        id: "ENV",
        children: envVariables,
      });
      return predecessors;
    }
  }

  function handleSearch(val: string) {
    setSearchKey(val);
  }

  function handleItemClick(item: any, parent?: any) {
    const data = { ...item, parentId: parent?.id };
    onItemClick?.(data, parent);
  }

  return (
    <div
      className={clsx("rounded-lg text-xs w-[300px] p-2 bg-[#fff]", className)}
    >
      {!hideSearch ? (
        <div className="mb-4">
          <Input
            type="text"
            size="sm"
            placeholder="搜索变量"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      ) : null}

      <div className="space-y-2 max-h-[300px] overflow-auto">
        {variables.map((item, index) => {
          if (item.children) {
            return (
              <Fragment key={index}>
                <div className="text-gray-500">{item.name}</div>
                {item.children.map((child, i) => (
                  <div
                    key={`${item.name}-${child.name}`}
                    className="grid grid-cols-2 py-2 cursor-pointer hover:bg-gray-100 rounded px-1"
                    onClick={() => handleItemClick(child, item)}
                  >
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1">{"{x}"}</span>
                      <span className="font-mono">{child.name}</span>
                    </div>
                    <span className="font-mono text-gray-600 text-right">
                      {child.type}
                    </span>
                  </div>
                ))}
              </Fragment>
            );
          }
          return (
            <div
              key={item.name}
              className="grid grid-cols-2 py-2 cursor-pointer hover:bg-gray-100 rounded px-1"
              onClick={() => handleItemClick(item)}
            >
              <div className="flex items-center">
                <span className="text-gray-500 mr-1">{"{x}"}</span>
                <span className="font-mono">{item.name}</span>
              </div>
              <span className="font-mono text-gray-600 text-right">
                {item.type}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
