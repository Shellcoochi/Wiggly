"use client";

import { useDraggable } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import {
  IconBox,
  IconTypography,
  IconHandClick,
} from "@tabler/icons-react";
import useMounted from "@/hooks/use-mounted";

const materials = [
  { type: "container", label: "容器", icon: IconBox },
  { type: "text", label: "文本", icon: IconTypography },
  { type: "button", label: "按钮", icon: IconHandClick },
];

function MaterialItem({ type, label, icon: Icon }: any) {
  const isMounted = useMounted()

  const { setNodeRef, listeners, attributes } = useDraggable({
    id: `material-${type}`,
    data: { type },
  });

  if (!isMounted) {
    return null; // 在客户端渲染前不返回任何内容
  }

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
