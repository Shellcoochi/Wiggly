import { FC } from "react";
import { Avatar, Button, Icon } from "@/ui";
import { EnvVariableTool } from "./env-variable-tool";

export interface ToolbarProps {
  run?: () => void;
}

const Toolbar: FC<ToolbarProps> = ({ run }) => {
  return (
    <div className="flex gap-2 items-center">
      <EnvVariableTool />
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
