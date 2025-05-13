import StartNode from "@/lib/nodes/start/node";
import EndNode from "@/lib/nodes/end/node";

export enum NodeType {
  Start = "start",
  End = "end",
  Answer = "answer",
  LLM = "llm",
  KnowledgeRetrieval = "knowledge-retrieval",
  QuestionClassifier = "question-classifier",
  IfElse = "if-else",
  Code = "code",
  TemplateTransform = "template-transform",
  HttpRequest = "http-request",
  VariableAssigner = "variable-assigner",
  VariableAggregator = "variable-aggregator",
  Tool = "tool",
  ParameterExtractor = "parameter-extractor",
  Iteration = "iteration",
  DocExtractor = "document-extractor",
  ListFilter = "list-operator",
  IterationStart = "iteration-start",
  Assigner = "assigner",
  Agent = "agent",
  Loop = "loop",
  LoopStart = "loop-start",
  LoopEnd = "loop-end",
}

export enum NodeGroup {}

export const NodeConfig: any = {
  [NodeType.Start]: {
    type: NodeType.Start,
    description: "",
    width: 255,
    data: { label: "开始" },
  },
  [NodeType.End]: {
    type: NodeType.End,
    description: "",
    width: 255,
    data: { label: "结束" },
  },
};

export const NodeTypes = {
  [NodeType.Start]: StartNode,
  [NodeType.End]: EndNode,
};
