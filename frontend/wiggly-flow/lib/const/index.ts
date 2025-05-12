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

export const NodeData = {
  [NodeType.Start]: {
    type: NodeType.Start,
    label: "开始",
    desc: "",
  },
  [NodeType.End]: {
    type: NodeType.End,
    label: "结束",
    desc: "",
  },
};
