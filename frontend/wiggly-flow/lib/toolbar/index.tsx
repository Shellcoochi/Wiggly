import { FC } from "react";
import {
  Button,
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
    <div className="flex gap-1">
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
