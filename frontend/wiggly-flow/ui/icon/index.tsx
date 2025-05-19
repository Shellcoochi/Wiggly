import { clsx } from "clsx";
import WigglyIcon from "./icons";

export const Icon = (props: any) => {
  const { name, className, ...restProps } = props;
  if (name?.startsWith("ri-")) {
    return <i className={clsx(name, className)} {...restProps}></i>;
  }
  return <WigglyIcon className={className} {...restProps} name={name} />;
};
