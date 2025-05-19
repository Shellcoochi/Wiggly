const Start = ({
  fill = "#507BEE",
  width = "22",
  className = "",
  viewBox = "0 0 1024 1024",
}) => (
  <svg className={className} viewBox={viewBox} width={width} height={width}>
    <path
      d="M0 1024V0h1024v1024H0zM511 64C263.58 64 63 264.58 63 512s200.58 448 448 448 448-200.58 448-448S758.42 64 511 64z m0.5 844C293.07 908 116 730.93 116 512.5S293.07 117 511.5 117 907 294.07 907 512.5 729.93 908 511.5 908zM393.99 312.01l4.96 399.98 278.04-198.23z"
      fill={fill}
      p-id="22021"
    ></path>
  </svg>
);

export default Start;
