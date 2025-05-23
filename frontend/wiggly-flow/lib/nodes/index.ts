import { NodeType } from "../const";
import StartNode from "./start";
import EndNode from "./end";
import IfElse from "./if-else";

export const NodeTypes = {
  [NodeType.Start]: StartNode,
  [NodeType.End]: EndNode,
  [NodeType.IfElse]: IfElse,
};
