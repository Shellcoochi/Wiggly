import { FC } from "react";
import { Button } from "@/ui";

export interface ToolbarProps {}

const Toolbar: FC<ToolbarProps> = () => {
  return (
    <div className="">
      <Button>发布</Button>
    </div>
  );
};

export default Toolbar;
