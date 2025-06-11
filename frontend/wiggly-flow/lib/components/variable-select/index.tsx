import { useState, Fragment, useMemo, FC, useEffect } from "react";
import clsx from "clsx";
import { Icon, Input, Popover, Tag } from "@/ui";
import { useReactFlow } from "@xyflow/react";

export interface VariableItemProps {
  type?: string;
  name?: string;
  parentId?: string;
  children?: VariableItemProps[];
}

interface VariableSelectProps {
  value?: VariableItemProps;
  hideSearch?: boolean;
  options: VariableItemProps[];
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  allowClear?: boolean;
  onSelect?: (value: any) => void;
}

export const VariableSelect: FC<VariableSelectProps> = ({
  value,
  hideSearch,
  options,
  prefix,
  suffix,
  allowClear,
  onSelect,
}) => {
  const { getNode } = useReactFlow();
  const [selectedVariable, setSelectedVariable] = useState<VariableItemProps>();
  const [open, setOpen] = useState(false);
  const [clearVisible, setClearVisible] = useState(false);
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    setSelectedVariable(value);
  }, [value]);

  const variables = useMemo(() => {
    if (!searchKey.trim()) return options;

    const filteredOptions = options
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
      .filter(Boolean) as VariableItemProps[];

    return filteredOptions;
  }, [options, searchKey]);

  const renderNodeLabel = (id?: string) => {
    if (id) {
      const node = getNode(id);
      return node?.data.label as string;
    }
  };

  const handleSearch = (val: string) => {
    setSearchKey(val);
  };

  const handleSelect = (item: any, parent?: any) => {
    const data = { ...item, parentId: parent?.id };
    onSelect?.(data);
    setSelectedVariable(data);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedVariable(undefined);
  };

  return (
    <Popover
      showArrow={false}
      open={open}
      onOpenChange={() => setOpen(!open)}
      align="start"
      trigger={
        <div
          className={clsx(
            "flex items-center cursor-pointer rounded-md bg-gray-100 h-8 px-2 space-x-1",
            "hover:border-gray-300"
          )}
          onMouseEnter={() => setClearVisible(true)}
          onMouseLeave={() => setClearVisible(false)}
          onClick={() => setOpen(!open)}
        >
          {prefix && (
            <div
              className="text-gray-500"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {prefix}
            </div>
          )}
          <div className="flex-1 flex items-center overflow-hidden">
            {selectedVariable?.name ? (
              <Tag className="bg-bg-base truncate">
                <span>{renderNodeLabel(selectedVariable.parentId)}</span>
                {selectedVariable.parentId ? <span>/</span> : null}
                <span className="text-primary">{selectedVariable.name}</span>
              </Tag>
            ) : (
              <div className="text-text-disabled truncate">请选择变量</div>
            )}
          </div>
          {allowClear && clearVisible && selectedVariable && (
            <Icon
              name="ri-close-circle-fill"
              className="text-gray-500"
              onClick={handleClear}
            />
          )}

          {suffix && (
            <div
              className="text-gray-500"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {suffix}
            </div>
          )}
        </div>
      }
    >
      <div className="rounded-lg text-xs w-[300px]">
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
                      onClick={() => handleSelect(child, item)}
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
                onClick={() => handleSelect(item)}
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
    </Popover>
  );
};
