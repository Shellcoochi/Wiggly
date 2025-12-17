import { newId } from "../utils/flowHelper";

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
  answer = "answer",
  llm = "llm",
  "knowledge-retrieval" = "knowledge-retrieval",
  "question-classifier" = "question-classifier",
  "if-else" = "条件",
  code = "code",
  "template-transform" = "template-transform",
  "http-request" = "http-request",
  "variable-assigner" = "variable-assigner",
  "variable-aggregator" = "variable-aggregator",
  tool = "tool",
  "parameter-extractor" = "parameter-extractor",
  iteration = "iteration",
  "document-extractor" = "document-extractor",
  "list-operator" = "list-operator",
  "iteration-start" = "iteration-start",
  assigner = "assigner",
  agent = "agent",
  loop = "循环",
  "loop-start" = "",
  "loop-end" = "loop-end",
}

export enum NodeGroup {}

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
  [NodeType.LLM]: {
    type: NodeType.LLM,
    width: 255,
    data: {
      label: NodeLabel.llm,
      description: "",
      outputVars: [{ name: "text", desrc: "生成内容", type: VariableType.String }],
    },
  },
  [NodeType.IfElse]: {
    type: NodeType.IfElse,
    width: 255,
    data: {
      label: NodeLabel["if-else"],
      description: "",
      cases: [
        {
          id: newId(),
          type: "IF",
          conditions: [],
        },
        {
          id: newId(),
          type: "ELIF",
          conditions: [],
        },
      ],
    },
  },
  [NodeType.Loop]: {
    type: NodeType.Loop,
    width: 255,
    data: { label: NodeLabel.loop, description: "" },
  },
  [NodeType.LoopStart]: {
    type: NodeType.LoopStart,
    width: 50,
    height: 50,
    data: { label: "", description: "" },
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

export enum ComparisonOperatorName {
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
