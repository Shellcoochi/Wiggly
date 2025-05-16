import Start from "./start";

const Icon = (props:any) => {
  switch (props.name) {
    case "start":
      return <Start {...props} />;
    default:
      return <Start {...props} />;
  }
};
export default Icon;
