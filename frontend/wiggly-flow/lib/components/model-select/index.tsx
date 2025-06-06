import { useState, Fragment, useMemo, FC } from "react";
import clsx from "clsx";
import { Avatar, Icon, Input, Popover, Tag, Tooltip } from "@/ui";

interface Tag {
  id: string;
  label: string;
}
interface ModelProps {
  name?: string;
  logo?: string;
  version?: string;
  descr?: string;
  tags?: Tag[];
  children?: ModelProps[];
  config?: Record<string, any>;
}

interface ModelSelectProps {
  hideSearch?: boolean;
  options: ModelProps[];
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  allowClear?: boolean;
  onSelect?: (value: any) => void;
}

export const ModelSelect: FC<ModelSelectProps> = ({
  hideSearch,
  options,
  prefix,
  suffix,
  allowClear,
  onSelect,
}) => {
  const [selectedVariable, setSelectedVariable] = useState<any>();
  const [open, setOpen] = useState(false);
  const [clearVisible, setClearVisible] = useState(false);
  const [searchKey, setSearchKey] = useState("");

  const models = useMemo(() => {
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
      .filter(Boolean) as ModelProps[];

    return filteredOptions;
  }, [options, searchKey]);

  const handleSearch = (val: string) => {
    setSearchKey(val);
  };

  const handleSelect = (item: any, parent?: any) => {
    const data = { ...item, parentName: parent?.name };
    console.log(data)
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
            {selectedVariable ? (
              <div className="flex gap-1 items-center">
                <Avatar
                  src={selectedVariable.logo}
                  fallback="M"
                  shape="square"
                  size={16}
                />
                <span className="text-primary">{selectedVariable.name}</span>
              </div>
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
        {!hideSearch && (
          <div className="mb-4">
            <Input
              type="text"
              size="sm"
              placeholder="搜索模型"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        )}

        <div className="space-y-2 max-h-[300px] overflow-auto">
          {models.map((item, index) => {
            if (item.children) {
              return (
                <Fragment key={index}>
                  <div className="flex gap-1 text-gray-500">
                    <Avatar
                      className="border-1 border-border"
                      src={item.logo}
                      fallback="C"
                      shape="square"
                      size={16}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.children.map((child, i) => (
                    <div
                      key={`${item.name}-${child.name}`}
                      className="py-2 cursor-pointer hover:bg-gray-100 rounded px-1"
                      onClick={() => handleSelect(child, item)}
                    >
                      <div className="flex gap-3 items-center ">
                        <Avatar
                          className="border-1 border-border"
                          src={child.logo}
                          fallback="M"
                          shape="square"
                          size="large"
                        />
                        <div className="flex flex-col gap-1 overflow-hidden">
                          <span className="font-bold truncate text-sm">
                            {child.name}
                          </span>
                          <div className="w-fit flex gap-1">
                            {child.tags?.map((tag) => (
                              <Tag
                                key={tag.id}
                                className="bg-bg-base text-[10px] !py-0 !px-1 text-secondary"
                              >
                                {tag.label}
                              </Tag>
                            ))}
                          </div>
                          <Tooltip content={child.descr}>
                            <p className="text-[12px] text-gray-600 text-left line-clamp-1 break-words">
                              {child.descr}
                            </p>
                          </Tooltip>
                        </div>
                      </div>
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
                <div className="flex items-center gap-1">
                  <Icon name="variable" width="14" />
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
