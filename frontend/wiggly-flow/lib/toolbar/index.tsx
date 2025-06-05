import { FC } from "react";
import {
  Button,
  DropdownMenu,
  Icon,
  Select,
  SelectOptionItemProps,
  Switch,
  Tag,
  Tooltip,
} from "@/ui";

export interface ToolbarProps {
  run?: () => void;
}

const Toolbar: FC<ToolbarProps> = ({ run }) => {
  const options: Array<SelectOptionItemProps> = [
    {
      value: "1",
      label: "123",
      children: [{ value: "1-1", label: "1111" }],
    },
    {
      value: "2",
      label: "22",
      children: [{ value: "2-1", label: "222" }],
    },
    {
      value: "3",
      label: "33",
    },
  ];
  return (
    <div className="flex gap-1 items-center">
      <DropdownMenu
        options={[
          { type: "item", label: "New Tab3", shortcut: "⌘+T" },
          { type: "separator" },
          {
            type: "submenu",
            label: "More Tools",
            children: [
              { type: "item", label: "Save Page As…" },
              { type: "item", label: "Developer Tools" },
            ],
          },
          {
            type: "checkbox",
            label: "Show Bookmarks",
            checked: true,
            onCheckedChange: (v) => {},
          },
          { type: "label", label: "People" },
          { type: "radio", label: "Pedro Duarte", value: "pedro" },
          { type: "radio", label: "Colm Tuite", value: "colm" },
        ]}
        radioGroup={{
          value: "pedro",
          onValueChange: (v) => {},
        }}
      />
      <Icon name="string"/>
      <Icon name="number"/>
      <Icon name="boolean"/>
      <Icon name="object"/>
      <Icon name="array"/>
      <Icon name="array-number"/>
      <Icon name="array-string"/>
      <Icon name="array-image"/>
      <Tooltip content="这是一个标签">
        <Tag color="primary">tag</Tag>
      </Tooltip>
      <Switch />
      <Select options={options} />
      <Button variant="outline" onClick={run}>
        运行
      </Button>
      <Button>发布</Button>
    </div>
  );
};

export default Toolbar;
