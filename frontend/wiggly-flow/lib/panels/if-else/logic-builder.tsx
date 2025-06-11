import { VariableItemProps, VariableSelect } from "@/lib/components";
import { ComparisonOperator, ComparisonOperatorName } from "@/lib/const";
import { FlowNodeProps } from "@/lib/types";
import { newId } from "@/lib/utils/flowHelper";
import { Button, DropdownMenu, DropdownOption, Icon, Separator } from "@/ui";
import { useReactFlow } from "@xyflow/react";
import { FC, useEffect, useState } from "react";

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
  const comparisonOperators: DropdownOption[] = [
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

  /** @todo 从前置节点和全局获取变量 */
  const options2 = [
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
  ];

  useEffect(() => {
    if (node) {
      updateNodeData(node.id, {
        cases: conditionGroups,
      });
    }
  }, [conditionGroups]);

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
    <div className="grid gap-4">
      {conditionGroups?.map((group, groupIndex) => (
        <div key={group.id} className="grid gap-2">
          <div className="flex items-center justify-between">
            <div className="font-bold">{group.type}</div>
            {groupIndex > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeGroup(group.id)}
              >
                <Icon name="ri-delete-bin-line" />
              </Button>
            )}
          </div>
          {group.conditions?.length > 0 ? (
            <div className="flex w-full my-1">
              <div className="text-xs font-bold w-[38px] text-right pr-2 shrink-0 content-center">
                <DropdownMenu
                  options={[
                    { type: "radio", label: "AND", value: "1" },
                    { type: "radio", label: "OR", value: "2" },
                  ]}
                >
                  <div className="cursor-pointer text-right text-primary">
                    AND
                  </div>
                </DropdownMenu>
              </div>
              <div className="flex flex-col gap-1.5 px-2 w-full border-l-2 border-solid border-gray-200 rounded-l-md rounded-r-md">
                {group.conditions.map((condition) => (
                  <div
                    key={condition.id}
                    onMouseEnter={() => setClearVisible(condition.id)}
                    onMouseLeave={() => setClearVisible("")}
                    className="bg-gray-100 rounded-md relative"
                  >
                    <VariableSelect
                      options={options2}
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
                          onItemClick={(val) => {
                            updateCondition(
                              group.id,
                              condition.id,
                              "operator",
                              val.value ?? ""
                            );
                          }}
                          options={comparisonOperators}
                        >
                          <div className="flex items-center space-x-2">
                            <Separator orientation="vertical" />
                            <span>
                              {ComparisonOperatorName[condition.operator] ||
                                "选择操作"}{" "}
                              <Icon name="ri-arrow-down-s-line" />
                            </span>
                          </div>
                        </DropdownMenu>
                      }
                    />
                    <Separator className="bg-bg-secondary" />
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
                    {clearVisible === condition.id && (
                      <Icon
                        name="ri-close-circle-fill"
                        className="cursor-pointer text-gray-500 absolute -right-2 -top-2"
                        onClick={() => removeCondition(group.id, condition.id)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex gap-2 flex-row-reverse">
            <Button
              variant="outline"
              size="sm"
              onClick={() => addCondition(group.id)}
            >
              添加条件
            </Button>
          </div>
          <Separator className="bg-text-disabled/30" />
          {groupIndex === conditionGroups.length - 1 && (
            <div className="mt-2 grid justify-items-center">
              <Button onClick={addElifGroup} size="sm" className="w-[300px]">
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
