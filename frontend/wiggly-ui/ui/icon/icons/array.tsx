const Array = ({
  fill = "#8a8a8a",
  width = "22",
  className = "",
  viewBox = "0 0 1024 1024",
}) => (
  <svg className={className} viewBox={viewBox} width={width} height={width}>
    <path
      d="M768 213.333c43.605 0 81.536 30.72 85.077 72.832l0.256 6.4v438.87c0 43.178-35.84 75.946-78.848 79.018l-6.485 0.214H640v-85.334h128V298.667H640v-85.334h128z m-384 0v85.334H256v426.666h128v85.334H256c-43.605 0-81.536-30.72-85.077-72.832l-0.256-6.4v-438.87c0-43.178 35.84-75.946 78.848-79.018l6.485-0.214h128z"
      fill={fill}
    ></path>
  </svg>
);

export default Array;
