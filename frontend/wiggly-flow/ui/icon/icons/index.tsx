import End from "./end";
import Start from "./start";

const Icon = (props: any) => {
  switch (props.name) {
    case "start":
      return <Start {...props} />;
    case "end":
      return <End {...props} />;
    default:
      return <Start {...props} />;
  }
};
export default Icon;
