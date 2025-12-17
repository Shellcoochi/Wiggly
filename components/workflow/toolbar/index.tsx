import { FC } from "react";
import { EnvVariableTool } from "./env-variable-tool";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
      <Avatar className="bg-primary">
        <AvatarImage src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
        <AvatarFallback className="rounded-lg">U</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default Toolbar;
