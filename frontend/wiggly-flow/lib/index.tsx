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
  Panel,
  useOnSelectionChange,
} from "@xyflow/react";
import { NodeTypes } from "./nodes";
import { EdgeTypes } from "./edges";
import BasePanel from "./panels/base-panel";

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
    type: "llm",
    position: { x: 500, y: 100 },
    width: 255,
    data: { label: "LLM" },
  },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2", type: "base" }];

function Flow() {
  const [currentNode, setCurrentNode] = useState<FlowNodeProps>();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) => addEdge({ ...params, type: "base" }, eds)),
    [setEdges]
  );
  const onChange = useCallback(({ nodes }: any) => {
    const [node] = nodes;
    setCurrentNode(node);
  }, []);

  useOnSelectionChange({
    onChange,
  });

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
      >
        <Background />
        <Controls orientation="horizontal" />

        {currentNode ? (
          <Panel
            position="bottom-right"
            className="h-[calc(100%-50px-2rem)] overflow-hidden"
          >
            <BasePanel key={currentNode.id} node={currentNode} />
          </Panel>
        ) : null}
      </ReactFlow>

      <div className="absolute top-2 right-2 h-[50px] p-2 rounded-lg">
        <Toolbar />
      </div>
    </div>
  );
}

export default () => (
  <ReactFlowProvider>
    <Flow />
  </ReactFlowProvider>
);
