import { NodeType } from "../const";
import StartPanel from "./start";

export const PanelTypes: Record<string, React.ComponentType<any>> = {
  [NodeType.Start]: StartPanel,
};
