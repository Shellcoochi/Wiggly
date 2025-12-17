import { useState, Fragment, useMemo, FC, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { IconX } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Tag } from "@/components/ui/tag";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Tag {
  id: string;
  label: string;
}
export interface ModelProps {
  name?: string;
  logo?: string;
  version?: string;
  descr?: string;
  tags?: Tag[];
  children?: ModelProps[];
  config?: Record<string, any>;
}

interface ModelSelectProps {
  value?: ModelProps;
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
  value,
}) => {
  const [selectedVariable, setSelectedVariable] = useState<ModelProps>();
  const [open, setOpen] = useState(false);
  const [clearVisible, setClearVisible] = useState(false);
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    setSelectedVariable(value);
  }, [value?.name]);

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
    onSelect?.(data);
    setSelectedVariable(data);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedVariable(undefined);
  };

  return (
    <Popover open={open} onOpenChange={() => setOpen(!open)}>
      <PopoverTrigger asChild>
        <div
          className={cn(
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
                <Avatar>
                  <AvatarImage src={selectedVariable.logo} />
                  <AvatarFallback className="rounded-lg">M</AvatarFallback>
                </Avatar>
                <span className="text-primary">{selectedVariable.name}</span>
              </div>
            ) : (
              <div className="text-text-disabled truncate">请选择变量</div>
            )}
          </div>
          {allowClear && clearVisible && selectedVariable && (
            <IconX
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
      </PopoverTrigger>
      <PopoverContent>
        <div className="rounded-lg text-xs w-75">
          {!hideSearch && (
            <div className="mb-4">
              <Input
                type="text"
                placeholder="搜索模型"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2 max-h-75 overflow-auto">
            {models.map((item, index) => {
              if (item.children) {
                return (
                  <Fragment key={index}>
                    <div className="flex gap-1 text-gray-500">
                      <Avatar className="border border-border">
                        <AvatarImage src={item.logo} />
                        <AvatarFallback className="rounded-lg">
                          C
                        </AvatarFallback>
                      </Avatar>
                      <span>{item.name}</span>
                    </div>
                    {item.children.map((child, i) => (
                      <div
                        key={`${item.name}-${child.name}`}
                        className={cn(
                          "py-2 cursor-pointer rounded px-1",
                          selectedVariable?.name === child.name
                            ? "hover:bg-blue-200"
                            : "hover:bg-gray-100",
                          {
                            "bg-blue-100":
                              selectedVariable?.name === child.name,
                          }
                        )}
                        onClick={() => handleSelect(child, item)}
                      >
                        <div className="flex gap-3 items-center ">
                          <Avatar className="border border-border">
                            <AvatarImage src={child.logo} />
                            <AvatarFallback className="rounded-lg">
                              M
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col gap-1 overflow-hidden">
                            <span className="font-bold truncate text-sm">
                              {child.name}
                            </span>
                            <div className="w-fit flex gap-1">
                              {child.tags?.map((tag) => (
                                <Tag
                                  key={tag.id}
                                  className="bg-bg-base text-[10px] py-0! px-1! text-secondary"
                                >
                                  {tag.label}
                                </Tag>
                              ))}
                            </div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="text-[12px] text-gray-600 text-left line-clamp-1 wrap-break-word">
                                  {child.descr}
                                </p>
                              </TooltipTrigger>
                              <TooltipContent>{child.descr}</TooltipContent>
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
                    <IconX name="variable" width="14" />
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
      </PopoverContent>
    </Popover>
  );
};
