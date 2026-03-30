import { useState, FC, useEffect } from "react";
import { useReactFlow } from "@xyflow/react";
import { VariableList } from "../variable-list";
import { IconX } from "@tabler/icons-react";
import Popover from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Tag } from "@/components/ui/tag";

export interface VariableItemProps {
  type?: string;
  name?: string;
  parentId?: string;
  children?: VariableItemProps[];
}

interface VariableSelectProps {
  value?: VariableItemProps;
  hideSearch?: boolean;
  options?: VariableItemProps[];
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  allowClear?: boolean;
  onSelect?: (value: any) => void;
  className?: string;
}

export const VariableSelect: FC<VariableSelectProps> = ({
  value,
  hideSearch,
  options,
  prefix,
  suffix,
  allowClear,
  onSelect,
  className,
}) => {
  const { getNode } = useReactFlow();
  const [selectedVariable, setSelectedVariable] = useState<VariableItemProps>();
  const [open, setOpen] = useState(false);
  const [clearVisible, setClearVisible] = useState(false);
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    setSelectedVariable(value);
  }, [value]);

  const renderNodeLabel = (id?: string) => {
    if (id === "ENV") return "ENV";
    if (id) {
      const node = getNode(id);
      return node?.data.label as string;
    }
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
      open={open}
      className="bg-popover"
      onOpenChange={() => setOpen(!open)}
      trigger={
        <div
          className={cn(
            "flex items-center cursor-pointer rounded-md bg-secondary h-8 px-2 space-x-1",
            "hover:border-border",
            className
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
            {selectedVariable?.name ? (
              <Tag className="bg-background truncate text-xs">
                <span>{renderNodeLabel(selectedVariable.parentId)}</span>
                {selectedVariable.parentId ? <span>/</span> : null}
                <span className="text-primary">{selectedVariable.name}</span>
              </Tag>
            ) : (
              <div className="text-muted-foreground truncate">请选择变量</div>
            )}
          </div>
          {allowClear && clearVisible && selectedVariable && (
            <IconX className="text-muted-foreground" onClick={handleClear} />
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
      <VariableList
        hideSearch={hideSearch}
        options={options}
        onItemClick={(item, parent) => handleSelect(item, parent)}
      />
    </Popover>
  );
};
