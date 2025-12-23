import { Slot } from "@radix-ui/react-slot";
import { useDndContext, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";

interface DraggableProps {
  id: string;
  children: React.ReactNode;
  overlay?: boolean;
}

export function Draggable(props: DraggableProps) {
  const { id, children, overlay } = props;
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const [dragging, setDragging] = useState(false);

  // Use useDndContext to track drag events globally
  const { active } = useDndContext();

  // Update dragging state based on active drag
  useEffect(() => {
    if (active && active.id === id) {
      setDragging(true);
    } else {
      setDragging(false);
    }
  }, [active, id]);

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: "none",
  };

  return (
    <Slot
      ref={setNodeRef}
      style={dragging && !overlay ? style : {}}
      {...listeners}
      {...attributes}
    >
      {children}
    </Slot>
  );
}
