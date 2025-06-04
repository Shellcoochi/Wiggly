const Resizer = ({
  fill = "#1296db",
  width = "22",
  className = "",
  viewBox = "0 0 1280 1024",
}) => (
  <svg className={className} viewBox={viewBox} width={width} height={width}>
    <path
      d="M319.20128 974.56128L348.16 1003.52l655.36-655.36-28.95872-28.95872-655.36 655.36zM675.84 1003.52l327.68-327.68-28.95872-28.95872-327.68 327.68L675.84 1003.52z"
      fill={fill}
    ></path>
  </svg>
);

export default Resizer;
