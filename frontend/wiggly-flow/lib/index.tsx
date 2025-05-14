import { useCallback, useState } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  ReactFlowProvider,
} from "@xyflow/react";
import { NodeTypes } from "./const";
import Panel from "./nodes/base-node/panel";

import "@xyflow/react/dist/style.css";
import "remixicon/fonts/remixicon.css";

const initialNodes = [
  {
    id: "1",
    type: "start",
    position: { x: 100, y: 100 },
    width: 255,
    data: { label: "开始" },
  },
  {
    id: "2",
    type: "end",
    position: { x: 400, y: 100 },
    width: 255,
    data: { label: "结束" },
  },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

function Flow() {
  const [currentNode, setCurrentNode] = useState<Node>();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick = (_: unknown, node: Node) => {
    setCurrentNode(node);
  };

  return (
    <div className="h-full relative">
      <ReactFlow
        proOptions={{ hideAttribution: true }}
        nodes={nodes}
        edges={edges}
        nodeTypes={NodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
      >
        <Background />
        <Controls />
      </ReactFlow>
      <div className="absolute bottom-2 right-2">
        <Panel node={currentNode}/>
      </div>
    </div>
  );
}

export default () => (
  <ReactFlowProvider>
    <Flow />
  </ReactFlowProvider>
);
