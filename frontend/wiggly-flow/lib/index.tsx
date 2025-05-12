import { useCallback, useState } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";
import { Button, Popover, Input } from "@/ui";
import BaseNode from "@/lib/nodes/base-node/node";
import StartNode from "@/lib/nodes/start/node"
import "@xyflow/react/dist/style.css";
import "remixicon/fonts/remixicon.css";


const initialNodes = [
  {
    id: "1",
    type: "baseNode",
    position: { x: 100, y: 100 },
    data: { label: "12" },
  },
  {
    id: "2",
    type: "baseNode",
    position: { x: 300, y: 100 },
    data: { label: "2" },
  },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const nodeTypes = {
  baseNode: StartNode,
};

function Flow() {
  const [value, setValue] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ height: "100%" }}>
      <Button>默认</Button>
      <Button variant="outline">描边</Button>
      <Button variant="ghost">幽灵</Button>
      <Button variant="destructive">危险操作</Button>
      <Button size="sm">小号</Button>
      <Popover
        trigger={<Button>打开 Popover</Button>}
        side="right"
      >
        <div className="text-sm text-gray-700">这是 Popover 内容</div>
      </Popover>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="请输入内容"
        clearable
        onClear={() => setValue('')}
        size="md"
      />
      <ReactFlow
        proOptions={{ hideAttribution: true }}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default Flow;
