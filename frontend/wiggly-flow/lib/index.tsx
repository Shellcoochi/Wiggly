import { useCallback, useState } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  ReactFlowProvider,
} from "@xyflow/react";
import { NodeTypes } from "./nodes";
import { EdgeTypes } from "./edges";
import Panel from "./panels/base-panel";

import "@xyflow/react/dist/style.css";
import "remixicon/fonts/remixicon.css";
import { FlowNodeProps } from "./types";
import Toolbar from "./toolbar";

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
    position: { x: 500, y: 100 },
    width: 255,
    data: { label: "结束" },
  },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2", type: "base" }];

function Flow() {
  const [currentNode, setCurrentNode] = useState<FlowNodeProps>();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  const handleNodeClick = (_: unknown, node: Node) => {
    setCurrentNode(node as unknown as FlowNodeProps);
  };

  return (
    <div className="h-full relative">
      <ReactFlow
        proOptions={{ hideAttribution: true }}
        nodes={nodes}
        edges={edges}
        nodeTypes={NodeTypes}
        edgeTypes={EdgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
      >
        <Background />
        <Controls />
      </ReactFlow>
      <div className="absolute top-2 right-2 h-[50px] p-2 rounded-lg">
        <Toolbar/>
      </div>
      <div className="absolute bottom-2 right-2  h-[calc(100%-50px-2rem)] overflow-hidden">
        <Panel node={currentNode} />
      </div>
    </div>
  );
}

export default () => (
  <ReactFlowProvider>
    <Flow />
  </ReactFlowProvider>
);
