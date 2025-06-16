import { FC } from "react";
import { Avatar, Button, Icon } from "@/ui";

export interface ToolbarProps {
  run?: () => void;
}

const Toolbar: FC<ToolbarProps> = ({ run }) => {
  return (
    <div className="flex gap-2 items-center">
      <Button variant="outline" className="!p-2">
        <Icon name="env" />
      </Button>
      <Button variant="outline" onClick={run}>
        运行
      </Button>
      <Button>发布</Button>
      <Avatar
        className="bg-primary"
        src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
        fallback="U"
        size="large"
      />
    </div>
  );
};

export default Toolbar;
