import { useReactFlow } from "@xyflow/react";
import { FC, useEffect, useState } from "react";
import { newId } from "../../utils/flowHelper";
import { FlowNodeProps } from "../../types";
import { ComparisonOperator, ComparisonOperatorName } from "../../const";
import {
  VariableItemProps,
  VariableSelect,
} from "../../components/variable-select";
import { Button } from "@/components/ui/button";
import { IconChevronRight, IconMinus, IconX } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ConditionGroup = {
  id: string;
  conditions: Condition[];
  type: "IF" | "ELIF";
};

type Condition = {
  id: string;
  variable: string | VariableItemProps;
  operator: ComparisonOperator;
  value: string;
};

interface LogicBuilder {
  node?: FlowNodeProps;
}

const LogicBuilder: FC<LogicBuilder> = ({ node }) => {
  const { updateNodeData } = useReactFlow();
  const [clearVisible, setClearVisible] = useState<string>();
  const [conditionGroups, setConditionGroups] = useState<ConditionGroup[]>(
    node?.data.cases
  );

  /** @todo 改为动态，不同类型变量对应的可选操作符不同 */
  const comparisonOperators = [
    { type: "radio", label: "包含", value: "contains" },
    {
      type: "radio",
      label: "不为空",
      value: "not empty",
    },
    { type: "radio", label: "等于", value: "equals" },
    {
      type: "radio",
      label: "不等于",
      value: "not equals",
    },
    {
      type: "radio",
      label: "大于",
      value: "greater than",
    },
    { type: "radio", label: "小于", value: "less than" },
  ];

  useEffect(() => {
    if (node) {
      updateNodeData(node.id, {
        cases: conditionGroups,
      });
    }
  }, [conditionGroups, node, updateNodeData]);

  const addCondition = (groupId: string) => {
    setConditionGroups((groups) =>
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              conditions: [
                ...group.conditions,
                {
                  id: newId(),
                  variable: "",
                  operator: ComparisonOperator.contains,
                  value: "",
                },
              ],
            }
          : group
      )
    );
  };

  const addElifGroup = () => {
    setConditionGroups((groups) => [
      ...groups,
      {
        id: newId(),
        type: "ELIF",
        conditions: [
          {
            id: newId(),
            variable: "",
            operator: ComparisonOperator.contains,
            value: "",
          },
        ],
      },
    ]);
  };

  const updateCondition = (
    groupId: string,
    conditionId: string,
    field: keyof Condition,
    value: string
  ) => {
    setConditionGroups((groups) =>
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              conditions: group.conditions.map((condition) =>
                condition.id === conditionId
                  ? { ...condition, [field]: value }
                  : condition
              ),
            }
          : group
      )
    );
  };

  const removeCondition = (groupId: string, conditionId: string) => {
    setConditionGroups((groups) =>
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              conditions: group.conditions.filter((c) => c.id !== conditionId),
            }
          : group
      )
    );
  };

  const removeGroup = (groupId: string) => {
    if (conditionGroups.length <= 1) return;
    setConditionGroups((groups) => groups.filter((g) => g.id !== groupId));
  };

  return (
    <div className="grid gap-4 pt-4">
      {conditionGroups?.map((group, groupIndex) => (
        <div key={group.id} className="grid gap-2">
          <div className="flex items-center justify-between">
            <div className="font-bold">{group.type}</div>
            {groupIndex > 0 && (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => removeGroup(group.id)}
                className="text-muted-foreground hover:text-muted-foreground/90"
              >
                <IconX />
              </Button>
            )}
          </div>
          {group.conditions?.length > 0 ? (
            <div className="flex w-full my-1">
              <div className="text-xs font-bold text-right pr-2 shrink-0 content-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="cursor-pointer text-right text-primary">
                      AND
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem textValue="1">AND</DropdownMenuItem>
                    <DropdownMenuItem textValue="2">OR</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-col gap-1.5 px-2 w-full border-l-2 border-solid border-border rounded-l-md rounded-r-md">
                {group.conditions.map((condition) => (
                  <div
                    key={condition.id}
                    className="flex items-center gap-1"
                    onMouseEnter={() => setClearVisible(condition.id)}
                    onMouseLeave={() => setClearVisible("")}
                  >
                    <div className="bg-secondary rounded-md flex-1">
                      <VariableSelect
                        value={condition.variable as VariableItemProps}
                        onSelect={(val) => {
                          updateCondition(
                            group.id,
                            condition.id,
                            "variable",
                            val
                          );
                        }}
                        suffix={
                          <DropdownMenu
                          // onItemClick={(val) => {
                          //   updateCondition(
                          //     group.id,
                          //     condition.id,
                          //     "operator",
                          //     val.value ?? ""
                          //   );
                          // }}
                          >
                            <DropdownMenuTrigger asChild>
                              <div className="flex items-center space-x-2">
                                <Separator
                                  orientation="vertical"
                                  className="h-3!"
                                />
                                <span className="flex items-center gap-1">
                                  {ComparisonOperatorName[condition.operator] ||
                                    "选择操作"}
                                  <IconChevronRight
                                    className="rotate-90"
                                    size={12}
                                  />
                                </span>
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {comparisonOperators.map((comp) => (
                                <DropdownMenuItem
                                  key={comp.value}
                                  textValue={comp.value}
                                >
                                  {comp.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        }
                      />
                      <Separator />
                      <input
                        className="px-2 w-full h-8 border-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-transparent"
                        value={condition.value}
                        onChange={(e) =>
                          updateCondition(
                            group.id,
                            condition.id,
                            "value",
                            e.target.value
                          )
                        }
                        placeholder="输入值"
                      />
                    </div>
                    <div className="w-4">
                      {clearVisible === condition.id && (
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() =>
                            removeCondition(group.id, condition.id)
                          }
                          className="text-muted-foreground hover:text-muted-foreground/90"
                        >
                          <IconMinus />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex gap-2 flex-row-reverse">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => addCondition(group.id)}
            >
              添加条件
            </Button>
          </div>
          <Separator />
          {groupIndex === conditionGroups.length - 1 && (
            <div className="mt-2 grid justify-items-center">
              <Button onClick={addElifGroup} size="sm" className="w-75">
                ELIF
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LogicBuilder;
