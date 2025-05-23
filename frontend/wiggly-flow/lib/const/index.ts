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
  IfElse = "条件",
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
    data: { label: NodeLabel.start, description: "" },
  },
  [NodeType.End]: {
    type: NodeType.End,
    width: 255,
    data: { label: NodeLabel.end, description: "" },
  },
  [NodeType.IfElse]: {
    type: NodeType.IfElse,
    width: 255,
    data: { label: NodeLabel.IfElse, description: "" },
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

export enum ComparisonOperator {
  contains = "contains",
  notContains = "not contains",
  startWith = "start with",
  endWith = "end with",
  is = "is",
  isNot = "is not",
  empty = "empty",
  notEmpty = "not empty",
  null = "null",
  notNull = "not null",
  in = "in",
  notIn = "not in",
  allOf = "all of",
  exists = "exists",
  notExists = "not exists",
  before = "before",
  after = "after",
}

export enum ComparisonOperatorLabel {
  contains = "包含",
  "not contains" = "不包含",
  "start with" = "开始是",
  "end with" = "结束是",
  is = "是",
  "is not" = "不是",
  empty = "为空",
  "not empty" = "不为空",
  null = "空",
  "not null" = "不为空",
  in = "是",
  "not in" = "不是",
  "all of" = "全部是",
  exists = "存在",
  "not exists" = "不存在",
  before = "早于",
  after = "晚于",
}

export const ComparisonOperators = {
  string: {
    contains: "包含",
    "not contains": "不包含",
    "start with": "开始是",
    "end with": "结束是",
    is: "是",
    "is not": "不是",
    empty: "为空",
    "not empty": "不为空",
    null: "空",
    "not null": "不为空",
    in: "是",
    "not in": "不是",
    "all of": "全部是",
    exists: "存在",
    "not exists": "不存在",
    before: "早于",
    after: "晚于",
  },
};
