import { useState, Fragment, useMemo, FC, useEffect } from "react";
import Avatar from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { IconX } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Tag } from "@/components/ui/tag";
import Popover from "@/components/ui/popover";
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
  type?: string;
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
  }, [value, value?.name]);

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
    /** 使用select 组件替换 Popover */
    <Popover
      open={open}
      showArrow={false}
      align="start"
      className="bg-card"
      onOpenChange={() => setOpen(!open)}
      trigger={
        <div
          className={cn(
            "flex items-center cursor-pointer rounded-md bg-input h-8 px-2 space-x-1",
            "hover:border-border"
          )}
          onMouseEnter={() => setClearVisible(true)}
          onMouseLeave={() => setClearVisible(false)}
          onClick={() => setOpen(!open)}
        >
          {prefix && (
            <div
              className="text-muted-foreground"
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
                  size="small"
                  alt={selectedVariable.name}
                  fallback="M"
                />
                <span>{selectedVariable.name}</span>
              </div>
            ) : (
              <div className="text-text-disabled truncate">请选择变量</div>
            )}
          </div>
          {allowClear && clearVisible && selectedVariable && (
            <IconX
              size={14}
              className="text-muted-foreground"
              onClick={handleClear}
            />
          )}

          {suffix && (
            <div
              className="text-muted-foreground"
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
      <div className="rounded-lg text-xs">
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
                  <div className="flex gap-1 text-muted-foreground">
                    <Avatar
                      className="border border-border"
                      src={item.logo}
                      alt={item.name}
                      size={16}
                      fallback="C"
                      shape="square"
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.children.map((child) => (
                    <div
                      key={`${item.name}-${child.name}`}
                      data-selected={selectedVariable?.name === child.name}
                      className={cn(
                        "group",
                        "py-2 cursor-pointer rounded px-1",
                        selectedVariable?.name === child.name
                          ? "hover:bg-primary/90"
                          : "hover:bg-accent",
                        {
                          "bg-primary": selectedVariable?.name === child.name,
                        }
                      )}
                      onClick={() => handleSelect(child, item)}
                    >
                      <div className="flex gap-3 items-center">
                        <Avatar
                          className="border border-border bg-muted"
                          src={child.logo}
                          alt={child.name}
                          fallback="M"
                          shape="square"
                        />
                        <div className="flex flex-col gap-1 overflow-hidden">
                          <span className="font-bold truncate text-sm group-data-[selected=true]:text-primary-foreground">
                            {child.name}
                          </span>
                          <div className="w-fit flex gap-1">
                            {child.tags?.map((tag) => (
                              <Tag
                                key={tag.id}
                                className="bg-bg-base text-xs py-0! px-1! group-data-[selected=true]:text-primary-foreground"
                              >
                                {tag.label}
                              </Tag>
                            ))}
                          </div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="text-xs group-data-[selected=true]:text-primary-foreground/90 text-left line-clamp-1 wrap-break-word">
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
                data-selected={selectedVariable?.name === item.name}
                className={cn(
                  "group",
                  "grid items-center grid-cols-2 py-2 cursor-pointer rounded px-1",
                  selectedVariable?.name === item.name
                    ? "hover:bg-primary/90"
                    : "hover:bg-accent",
                  {
                    "bg-primary": selectedVariable?.name === item.name,
                  }
                )}
                onClick={() => handleSelect(item)}
              >
                <div className="flex items-center gap-1">
                  <Avatar
                    className="border border-border bg-muted"
                    src={item.logo}
                    alt={item.name}
                    fallback="M"
                    shape="square"
                  />
                  <span className="group-data-[selected=true]:text-primary-foreground">
                    {item.name}
                  </span>
                </div>
                <span className="group-data-[selected=true]:text-primary-foreground/90 text-right">
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
