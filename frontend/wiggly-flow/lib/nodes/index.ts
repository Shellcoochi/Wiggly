import { NodeType } from "../const";
import StartNode from "./start";
import EndNode from "./end";

export const NodeTypes = {
  [NodeType.Start]: StartNode,
  [NodeType.End]: EndNode,
};
