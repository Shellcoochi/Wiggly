"use client";

import { useDraggable } from "@dnd-kit/core";
import {
  IconBox,
  IconTypography,
  IconHandClick,
} from "@tabler/icons-react";

const materials = [
  { type: "container", label: "容器", icon: IconBox },
  { type: "text", label: "文本", icon: IconTypography },
  { type: "button", label: "按钮", icon: IconHandClick },
];

function MaterialItem({ type, label, icon: Icon }: any) {
  const { setNodeRef, listeners, attributes } = useDraggable({
    id: `material-${type}`,
    data: { type },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="flex items-center gap-2 p-2 border rounded cursor-move hover:bg-muted"
    >
      <Icon size={16} />
      {label}
    </div>
  );
}

export function MaterialPanel() {
  return (
    <div className="w-56 border-r p-3 space-y-2">
      {materials.map((m) => (
        <MaterialItem key={m.type} {...m} />
      ))}
    </div>
  );
}
