import Icon from './icons';

const IconEl = (props:any) => {
  const { name, ...restProps } = props;
  return <Icon {...restProps} name={name} />;
};
export default IconEl;
