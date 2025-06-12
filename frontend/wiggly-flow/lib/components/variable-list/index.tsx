import { useState, Fragment, useMemo, FC } from "react";
import clsx from "clsx";
import { Input } from "@/ui";

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

  const initOptions = () => {
    return (
      options || [
        {
          name: "开始",
          id: "1",
          children: [
            { name: "sdf233", type: "String" },
            { name: "eeeee", type: "String" },
            { name: "aaasss", type: "String" },
            { name: "nmn", type: "Number" },
          ],
        },
        { name: "sys.user_id", type: "String" },
        { name: "sys.files", type: "Array[File]" },
        { name: "sys.app_id", type: "String" },
        { name: "sys.workflow_id", type: "String" },
        { name: "sys.workflow_run_id", type: "String" },
        { name: "ENVIRONMENT", type: "String" },
      ]
    );
  };

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

  const handleSearch = (val: string) => {
    setSearchKey(val);
  };

  const handleItemClick = (item: any, parent?: any) => {
    const data = { ...item, parentId: parent?.id };
    onItemClick?.(data, parent);
  };

  return (
    <div className={clsx("rounded-lg text-xs w-[300px] p-2 bg-[#fff]", className)}>
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
