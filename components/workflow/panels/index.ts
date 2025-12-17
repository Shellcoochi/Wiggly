import { NodeType } from "../const";
import StartPanel from "./start";
import EndPanel from "./end";
import IfElsePanel from "./if-else";
import LoopPanel from "./loop";
import LLMPanel from "./llm";

export const PanelTypes: Record<string, React.ComponentType<any>> = {
  [NodeType.Start]: StartPanel,
  [NodeType.End]: EndPanel,
  [NodeType.IfElse]: IfElsePanel,
  [NodeType.Loop]: LoopPanel,
  [NodeType.LLM]: LLMPanel,
};
