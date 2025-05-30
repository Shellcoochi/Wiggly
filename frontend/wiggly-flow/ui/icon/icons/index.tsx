import End from "./end";
import Start from "./start";
import IfElse from "./if-else";
import Loop from "./loop";
import Http from "./http";
import Code from "./code";
import Dot from "./dot";

const Icon = (props: any) => {
  switch (props.name) {
    case "start":
      return <Start {...props} />;
    case "end":
      return <End {...props} />;
    case "if-else":
      return <IfElse {...props} />;
    case "loop":
      return <Loop {...props} />;
    case "http":
      return <Http {...props} />;
    case "code":
      return <Code {...props} />;
    case "dot":
      return <Dot {...props} />;
    default:
      return <Start {...props} />;
  }
};
export default Icon;
