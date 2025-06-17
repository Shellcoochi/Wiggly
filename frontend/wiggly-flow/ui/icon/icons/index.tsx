import End from "./end";
import Start from "./start";
import IfElse from "./if-else";
import Loop from "./loop";
import Http from "./http";
import Code from "./code";
import Dot from "./dot";
import LoopStart from "./loop-start";
import Resizer from "./resizer";
import String from "./string";
import Number from "./number";
import ArrayNumber from "./array-number";
import ArrayString from "./array-string";
import Array from "./array";
import Object from "./object";
import ArrayImage from "./array-image";
import Boolean from "./boolean";
import Time from "./time";
import ArrayFile from "./array-file";
import Variable from "./variable";
import LLM from "./llm";
import Env from "./env";
import Json from "./json";

const Icon = (props: any) => {
  switch (props.name) {
    case "llm":
      return <LLM {...props} />;
    case "json":
      return <Json {...props} />;
    case "env":
      return <Env {...props} />;
    case "variable":
      return <Variable {...props} />;
    case "array-file":
      return <ArrayFile {...props} />;
    case "time":
      return <Time {...props} />;
    case "start":
      return <Start {...props} />;
    case "boolean":
      return <Boolean {...props} />;
    case "end":
      return <End {...props} />;
    case "if-else":
      return <IfElse {...props} />;
    case "loop":
      return <Loop {...props} />;
    case "loop-start":
      return <LoopStart {...props} />;
    case "http":
      return <Http {...props} />;
    case "code":
      return <Code {...props} />;
    case "dot":
      return <Dot {...props} />;
    case "resizer":
      return <Resizer {...props} />;
    case "string":
      return <String {...props} />;
    case "number":
      return <Number {...props} />;
    case "array":
      return <Array {...props} />;
    case "object":
      return <Object {...props} />;
    case "array-number":
      return <ArrayNumber {...props} />;
    case "array-string":
      return <ArrayString {...props} />;
    case "array-image":
      return <ArrayImage {...props} />;
    default:
      return <Start {...props} />;
  }
};
export default Icon;
