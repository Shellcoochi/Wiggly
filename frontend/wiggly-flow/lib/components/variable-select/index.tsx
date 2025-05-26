import { memo, useState, Fragment } from "react";
import clsx from "clsx";
import { Icon, Input, Popover, Tag } from "@/ui";

export const VariableSelect = () => {
  const [selectedVariable, setSelectedVariable] = useState<any>();
  const [open, setOpen] = useState(false);
  const [clearVisible, setClearVisible] = useState(false);

  const variables = [
    {
      name: "开始",
      children: [
        { name: "sdf", type: "String", editable: true },
        { name: "eeeee", type: "String", editable: true },
        { name: "aaasss", type: "String", editable: true },
        { name: "nmn", type: "Number", editable: true },
      ],
    },
    { name: "sys.user_id", type: "String", editable: true },
    { name: "sys.files", type: "Array[File]", editable: true },
    { name: "sys.app_id", type: "String", editable: true },
    { name: "sys.workflow_id", type: "String", editable: true },
    { name: "sys.workflow_run_id", type: "String", editable: true },
    { name: "ENVIRONMENT", value: "qwqq", type: "String", editable: false },
  ];

  const handleSearch = (val: string) => {
    console.log(val);
  };

  const handleSelect = (item: any) => {
    setSelectedVariable(item);
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
            <Tag className="bg-bg-base">{selectedVariable.name}</Tag>
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
        <div className="mb-4">
          <Input
            type="text"
            size="sm"
            placeholder="搜索变量"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-2 font-medium text-gray-600 pb-2 border-b">
            <span>变量名</span>
            <span>类型</span>
          </div>

          {variables.map((item, index) => {
            if (item.children) {
              return (
                <Fragment key={index}>
                  <div className="text-gray-500">{item.name}</div>
                  {item.children.map((child, i) => (
                    <div
                      key={`${item.name}-${child.name}`}
                      className="grid grid-cols-2 py-2 cursor-pointer hover:bg-gray-100 rounded px-1"
                      onClick={() => handleSelect(child)}
                    >
                      <div className="flex items-center">
                        {child.editable && (
                          <span className="text-gray-500 mr-1">{"{x}"}</span>
                        )}
                        <span className="font-mono">
                          {child.name}
                          {child.value && (
                            <span className="text-gray-500 ml-2">
                              {child.value}
                            </span>
                          )}
                        </span>
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
                  {item.editable && (
                    <span className="text-gray-500 mr-1">{"{x}"}</span>
                  )}
                  <span className="font-mono">
                    {item.name}
                    {item.value && (
                      <span className="text-gray-500 ml-2">{item.value}</span>
                    )}
                  </span>
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
