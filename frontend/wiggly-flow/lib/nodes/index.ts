import { NodeType } from "../const";
import StartNode from "./start";
import EndNode from "./end";
import IfElse from "./if-else";
import LoopNode from "./loop";
import LoopStartNode from "./loop-start";
import LLMNode from "./llm";

export const NodeTypes = {
  [NodeType.Start]: StartNode,
  [NodeType.End]: EndNode,
  [NodeType.IfElse]: IfElse,
  [NodeType.Loop]: LoopNode,
  [NodeType.LoopStart]: LoopStartNode,
  [NodeType.LLM]: LLMNode,
};
