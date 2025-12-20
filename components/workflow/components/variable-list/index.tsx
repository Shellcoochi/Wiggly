import { useState, Fragment, useMemo, FC } from "react";
import { useEdges, useNodes } from "@xyflow/react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getPredVariables } from "../../utils/flowHelper";
import { useEnvVariableStore } from "../../store/env-variable-store";
import { IconVariable } from "@tabler/icons-react";

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
  const { envVariables } = useEnvVariableStore() as any;

  const variables = useMemo(() => {
    function initOptions() {
      if (options) {
        return options;
      } else {
        const [currentNode] = nodes.filter((node) => node.selected);
        const predecessors = getPredVariables(
          currentNode?.id,
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
  }, [searchKey, options, nodes, edges, envVariables]);

  function handleSearch(val: string) {
    setSearchKey(val);
  }

  function handleItemClick(item: any, parent?: any) {
    const data = { ...item, parentId: parent?.id };
    onItemClick?.(data, parent);
  }

  return (
    <div className={cn("rounded-lg text-xs p-2 bg-card", className)}>
      {!hideSearch ? (
        <div className="mb-4">
          <Input
            type="text"
            placeholder="搜索变量"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      ) : null}

      <div className="space-y-2 max-h-75 overflow-auto">
        {variables.map((item, index) => {
          if (item.children) {
            return (
              <Fragment key={index}>
                <div className="text-muted-foreground">{item.name}</div>
                {item.children.map((child) => (
                  <div
                    key={`${item.name}-${child.name}`}
                    className="grid grid-cols-2 py-2 cursor-pointer hover:bg-accent rounded px-1"
                    onClick={() => handleItemClick(child, item)}
                  >
                    <div className="flex items-center">
                      <IconVariable
                        className="text-muted-foreground mr-1"
                        size={14}
                      />
                      <span>{child.name}</span>
                    </div>
                    <span className="text-muted-foreground text-right">
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
              className="grid grid-cols-2 py-2 cursor-pointer hover:bg-accent rounded px-1"
              onClick={() => handleItemClick(item)}
            >
              <div className="flex items-center">
                <IconVariable
                  className="text-muted-foreground mr-1"
                  size={14}
                />
                <span className="font-mono">{item.name}</span>
              </div>
              <span className="text-muted-foreground text-right">
                {item.type}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
