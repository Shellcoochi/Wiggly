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

export enum EdgeType {
  Base = "base",
}

export enum NodeLabel {
  start = "开始",
  end = "结束",
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
    width: 255,
    data: { label: "开始", description: "" },
  },
  [NodeType.End]: {
    type: NodeType.End,
    width: 255,
    data: { label: "结束", description: "" },
  },
};

export enum VariableType {
  String = "string",
  Number = "number",
  Boolean = "boolean",
}

export const VariableTypes = {
  string: {
    label: "String",
  },
  number: {
    label: "Number",
  },
  boolean: {
    label: "Boolean",
  },
};
