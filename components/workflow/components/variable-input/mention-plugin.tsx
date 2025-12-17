import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, $isTextNode } from "lexical";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import {
  useFloating,
  flip,
  offset,
  shift,
  autoUpdate,
} from "@floating-ui/react-dom";
import { $createMentionNode } from "./mention-node";
import { VariableList } from "../variable-list";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const MentionPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [showTagTrigger, setShowTagTrigger] = useState(false);
  const [position, setPosition] = useState<DOMRect | null>(null);
  const virtualRef = useRef<{ getBoundingClientRect: () => DOMRect } | null>(
    null
  );

  const { refs, floatingStyles, update } = useFloating({
    placement: "bottom-start",
    middleware: [offset(4), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  useLayoutEffect(() => {
    if (position) {
      virtualRef.current = {
        getBoundingClientRect: () => position,
      };
      refs.setReference(virtualRef.current);
      update();
    }
  }, [position, refs, update]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        const anchor = selection.anchor;
        const anchorNode = anchor.getNode();
        const anchorOffset = anchor.offset;
        const textContent = anchorNode.getTextContent().slice(0, anchorOffset);

        const lastAtPos = textContent.lastIndexOf("@");
        const afterAtText =
          lastAtPos !== -1 ? textContent.slice(lastAtPos + 1) : "";

        const shouldShow = lastAtPos !== -1 && afterAtText.length === 0;

        if (shouldShow) {
          setShowTagTrigger(true);

          const domSelection = window.getSelection();
          const domRange =
            domSelection &&
            domSelection.rangeCount > 0 &&
            editor.getRootElement()?.contains(domSelection.anchorNode)
              ? domSelection.getRangeAt(0).getBoundingClientRect()
              : null;

          setPosition(domRange);
        } else {
          setShowTagTrigger(false);
        }
      });
    });
  }, [editor]);

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
            newSelection.anchor.set(
              parent.getKey(),
              parent.getChildrenSize(),
              "element"
            );
            newSelection.focus.set(
              parent.getKey(),
              parent.getChildrenSize(),
              "element"
            );
          }
        }
      }
      setShowTagTrigger(false);
    });
  };

  return (
    <Popover open={showTagTrigger}>
      <PopoverTrigger asChild>
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
      </PopoverTrigger>
      <PopoverContent
        ref={refs.setFloating}
        style={floatingStyles}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <VariableList onItemClick={(item) => insertMention(item.name)} />
      </PopoverContent>
    </Popover>
  );
};
