const Dot = ({
  fill = "#1296db",
  width = "200",
  className = "",
  viewBox = "0 0 1024 1024",
}) => (
  <svg className={className} viewBox={viewBox} width={width} height={width}>
      <path
        d="M512 624a112 112 0 1 0 0-224 112 112 0 0 0 0 224z"
        fill="fill"
      ></path>
  </svg>
);

export default Dot;
