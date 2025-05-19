import { NodeType } from "../const";
import StartPanel from "./start";
import EndPanel from "./end"

export const PanelTypes: Record<string, React.ComponentType<any>> = {
  [NodeType.Start]: StartPanel,
  [NodeType.End]: EndPanel,
};
