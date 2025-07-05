import React, { useState, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const COMPONENTS: Record<string, any> = {
  Container: ({ children }: any) => (
    <div className="p-4 border border-dashed border-gray-400 bg-white min-h-[60px]">{children}</div>
  ),
  Text: ({ text }: any) => <div className="text-gray-800">{text || "文本"}</div>,
  Button: ({ text }: any) => (
    <button className="px-4 py-2 bg-blue-500 text-white rounded">{text || "按钮"}</button>
  ),
};

const MaterialItem = ({ type }: { type: string }) => {
  const [, drag] = useDrag(() => ({
    type: "component",
    item: { type },
  }));
  return (
    <div ref={drag} className="px-2 py-1 bg-white border rounded shadow-sm cursor-move">
      {type}
    </div>
  );
};

let globalId = 0;
const generateId = () => `node_${++globalId}`;

const CanvasNode = ({ node, selectedId, onSelect, onDropChild }: any) => {
  const Comp = COMPONENTS[node.type];
  const [, drop] = useDrop(() => ({
    accept: "component",
    drop: (item: any) => onDropChild(node.id, item.type),
  }));

  const isSelected = selectedId === node.id;

  return (
    <div
      ref={node.type === "Container" ? drop : null}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
      className={`p-2 ${isSelected ? "ring-2 ring-blue-500" : ""}`}
    >
      <Comp {...node.props}>
        {node.children &&
          node.children.map((child: any) => (
            <CanvasNode
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
              onDropChild={onDropChild}
            />
          ))}
      </Comp>
    </div>
  );
};

const CanvasArea = ({ schema, onDrop, selectedId, onSelect, onDropChild }: any) => {
  const [, drop] = useDrop(() => ({
    accept: "component",
    drop: (item: any) => onDrop(item.type),
  }));

  return (
    <div
      ref={drop}
      className="flex-1 min-h-screen p-6 bg-gray-100 space-y-3"
      onClick={() => onSelect(null)}
    >
      {schema.map((node: any) => (
        <CanvasNode
          key={node.id}
          node={node}
          selectedId={selectedId}
          onSelect={onSelect}
          onDropChild={onDropChild}
        />
      ))}
    </div>
  );
};

export default function AdvancedLowcodeCanvas() {
  const [schema, setSchema] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDropRoot = (type: string) => {
    const newNode = {
      id: generateId(),
      type,
      props: { text: type === "Text" ? "文本" : type === "Button" ? "按钮" : "" },
      children: type === "Container" ? [] : undefined,
    };
    setSchema([...schema, newNode]);
  };

  const handleDropChild = useCallback(
    (parentId: string, type: string) => {
      const updateNode = (nodes: any[]): any[] =>
        nodes.map((node) => {
          if (node.id === parentId && node.type === "Container") {
            const newChild = {
              id: generateId(),
              type,
              props: { text: type === "Text" ? "文本" : type === "Button" ? "按钮" : "" },
              children: type === "Container" ? [] : undefined,
            };
            return { ...node, children: [...(node.children || []), newChild] };
          } else if (node.children) {
            return { ...node, children: updateNode(node.children) };
          } else {
            return node;
          }
        });
      setSchema(updateNode(schema));
    },
    [schema]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen">
        {/* 左侧物料区 */}
        <div className="w-48 p-4 bg-white border-r space-y-2">
          <MaterialItem type="Container" />
          <MaterialItem type="Text" />
          <MaterialItem type="Button" />
        </div>

        {/* 中间画布 */}
        <CanvasArea
          schema={schema}
          onDrop={handleDropRoot}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onDropChild={handleDropChild}
        />

        {/* 右侧属性区 */}
        <div className="w-64 p-4 bg-white border-l text-sm text-gray-600">
          {selectedId ? <div>选中：{selectedId}</div> : "未选中组件"}
        </div>
      </div>
    </DndProvider>
  );
}
