import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, $isTextNode } from "lexical";
import {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";
import { Popover  } from "radix-ui";
import { useFloating, flip, offset, shift, autoUpdate } from "@floating-ui/react-dom";
import { $createMentionNode } from "./mention-node";
import { VariableList } from "..";

export const MentionPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [showTagTrigger, setShowTagTrigger] = useState(false);
  const [position, setPosition] = useState<DOMRect | null>(null);
  const virtualRef = useRef<{ getBoundingClientRect: () => DOMRect } | null>(null);

  const { refs, floatingStyles, update } = useFloating({
    placement: "bottom-start",
    middleware: [offset(4), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  // Update virtual anchor whenever position changes
  useLayoutEffect(() => {
    if (position) {
      virtualRef.current = {
        getBoundingClientRect: () => position,
      };
      refs.setReference(virtualRef.current);
      update();
    }
  }, [position, refs, update]);

  // Track selection and trigger display
  const updateMentionTrigger = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const anchor = selection.anchor;
      const anchorNode = anchor.getNode();
      const anchorOffset = anchor.offset;
      const textContent = anchorNode.getTextContent().slice(0, anchorOffset);
      const lastAtPos = textContent.lastIndexOf("@");

      const shouldShow =
        lastAtPos !== -1 && !textContent.slice(lastAtPos + 1).includes(" ");

      if (shouldShow) {
        setShowTagTrigger(true);
        const domRange =
          window.getSelection()?.getRangeAt(0).getBoundingClientRect() || null;
        setPosition(domRange);
      } else {
        setShowTagTrigger(false);
      }
    });
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(() => updateMentionTrigger());
  }, [editor, updateMentionTrigger]);

  const insertMention = (name: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection) || !selection.isCollapsed()) return;

      const anchorNode = selection.anchor.getNode();
      const anchorOffset = selection.anchor.offset;
      const textContent = anchorNode.getTextContent();
      const lastAtPos = textContent.lastIndexOf("@", anchorOffset - 1);

      if (lastAtPos !== -1 && $isTextNode(anchorNode)) {
        anchorNode.spliceText(lastAtPos, anchorOffset - lastAtPos, "");

        const newSelection = $getSelection();
        if (!$isRangeSelection(newSelection)) return;

        newSelection.anchor.set(anchorNode.getKey(), lastAtPos, "text");
        newSelection.focus.set(anchorNode.getKey(), lastAtPos, "text");

        const mentionNode = $createMentionNode(name);
        newSelection.insertNodes([mentionNode]);

        const parent = mentionNode.getParent();
        if (parent) {
          const mentionIndex = parent.getChildren().indexOf(mentionNode);
          const nextNode = parent.getChildren()[mentionIndex + 1];

          if (nextNode && $isTextNode(nextNode)) {
            newSelection.anchor.set(nextNode.getKey(), 0, "text");
            newSelection.focus.set(nextNode.getKey(), 0, "text");
          } else {
            newSelection.anchor.set(parent.getKey(), parent.getChildrenSize(), "element");
            newSelection.focus.set(parent.getKey(), parent.getChildrenSize(), "element");
          }
        }
      }

      setShowTagTrigger(false);
    });
  };

  return (
    <Popover.Root open={showTagTrigger}>
      <Popover.Anchor asChild>
        {/* 虚拟锚点，Radix 需要一个真实 DOM 元素 */}
        <span
          style={{
            position: "absolute",
            width: 0,
            height: 0,
            top: 0,
            left: 0,
          }}
          ref={(node) => {
            if (node && position) {
              node.getBoundingClientRect = () => position;
              refs.setReference(node);
            }
          }}
        />
      </Popover.Anchor>
      <Popover.Portal>
        <Popover.Content
          ref={refs.setFloating}
          style={floatingStyles}
          sideOffset={4}
          className="z-50 w-[300px] rounded-md bg-white shadow-md border border-gray-200 p-2 text-sm"
        >
          <VariableList onItemClick={(item) => insertMention(item.name)} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
