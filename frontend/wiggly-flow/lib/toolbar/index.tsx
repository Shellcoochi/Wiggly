import { FC } from "react";
import { Button } from "@/ui";

export interface ToolbarProps {}

const Toolbar: FC<ToolbarProps> = () => {
  return (
    <div className="">
      <Button>工具栏</Button>
    </div>
  );
};

export default Toolbar;
