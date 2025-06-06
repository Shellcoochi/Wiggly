import { FC } from "react";
import {
  Avatar,
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
    <div className="flex gap-2 items-center">
      <DropdownMenu
        options={[
          { type: "item", label: "New Tab3", shortcut: "⌘+T" },
          { type: "separator" },
          { type: "label", label: "People" },
          { type: "radio", label: "Pedro Duarte", value: "pedro" },
          { type: "radio", label: "Colm Tuite", value: "colm" },
        ]}
      />

      <Button variant="outline" onClick={run}>
        运行
      </Button>
      <Button>发布</Button>
      <Avatar
        src="https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80"
        fallback="U"
        size="large"
      />
    </div>
  );
};

export default Toolbar;
