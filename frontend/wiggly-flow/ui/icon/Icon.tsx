import { clsx } from "clsx";
import Icon from "./icons";

const WigglyIcon = (props: any) => {
  const { name, className, ...restProps } = props;
  if (name.startsWith("ri-")) {
    return <i className={clsx(name, className)} {...restProps}></i>;
  }
  return <Icon className={className} {...restProps} name={name} />;
};
export default WigglyIcon;
