import { FC } from "react";
import { EnvVariableTool } from "./env-variable-tool";

export interface ToolbarProps {
  run?: () => void;
}

const Toolbar: FC<ToolbarProps> = ({}) => {
  return (
    <div className="flex gap-2 items-center">
      <EnvVariableTool />
    </div>
  );
};

export default Toolbar;
