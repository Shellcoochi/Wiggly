import { useState, Fragment, useMemo, FC } from "react";
import clsx from "clsx";
import { Icon, Input, Popover, Tag } from "@/ui";
interface VariableProps {
  type?: string;
  name?: string;
  children?: VariableProps[];
}

interface VariableSelectProps {
  hideSearch?: boolean;
  options: VariableProps[];
}

export const VariableSelect: FC<VariableSelectProps> = ({
  hideSearch,
  options,
}) => {
  const [selectedVariable, setSelectedVariable] = useState<any>();
  const [open, setOpen] = useState(false);
  const [clearVisible, setClearVisible] = useState(false);
  const [searchKey, setSearchKey] = useState("");

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
      .filter(Boolean) as VariableProps[];

    return filteredOptions;
  }, [options, searchKey]);

  const handleSearch = (val: string) => {
    setSearchKey(val);
  };

  const handleSelect = (item: any, parent?: any) => {
    setSelectedVariable({ ...item, parentName: parent?.name });
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
            "flex items-center justify-between cursor-pointer rounded-md",
            "h-8 px-1 bg-gray-100"
          )}
          onMouseEnter={() => setClearVisible(true)}
          onMouseLeave={() => setClearVisible(false)}
          onClick={() => setOpen(!open)}
        >
          {selectedVariable ? (
            <Tag className="bg-bg-base">
              <span>{selectedVariable.parentName}</span>
              {selectedVariable.parentName ? <span>/</span> : null}
              <span className="text-primary">{selectedVariable.name}</span>
            </Tag>
          ) : (
            <div className="text-text-disabled">请选择变量</div>
          )}
          {clearVisible && selectedVariable && (
            <Icon
              name="ri-close-line"
              className="text-text-secondary"
              onClick={handleClear}
            />
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
