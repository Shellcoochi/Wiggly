import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, $isTextNode } from "lexical";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { $createMentionNode } from "./mention-node";

export const MentionPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [showTagTrigger, setShowTagTrigger] = useState(false);
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState<DOMRect | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [adjustedPos, setAdjustedPos] = useState<{
    top: number;
    left: number;
  } | null>(null);

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

        const shouldShow =
          lastAtPos !== -1 && !textContent.slice(lastAtPos + 1).includes(" ");

        if (shouldShow) {
          setShowTagTrigger(true);
          setQuery("");

          const domRange =
            window.getSelection()?.getRangeAt(0).getBoundingClientRect() ||
            null;
          setPosition(domRange);
        } else {
          setShowTagTrigger(false);
        }
      });
    });
  }, [editor]);

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
          setQuery("");

          const wSelection = window.getSelection();
          const domRange =
            wSelection && wSelection.rangeCount > 0
              ? wSelection.getRangeAt(0).getBoundingClientRect()
              : null;

          setPosition(domRange);
        } else {
          setShowTagTrigger(false);
        }
      });
    });
  }, [editor]);

  useLayoutEffect(() => {
    if (!position || !popupRef.current) {
      setAdjustedPos(null);
      return;
    }
    const popup = popupRef.current;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const popupRect = popup.getBoundingClientRect();

    let left = position.left + window.scrollX;
    let top = position.bottom + window.scrollY + 4;

    if (left + popupRect.width > viewportWidth + window.scrollX) {
      left = Math.max(
        window.scrollX,
        viewportWidth + window.scrollX - popupRect.width - 8
      );
    }
    if (top + popupRect.height > viewportHeight + window.scrollY) {
      top = position.top + window.scrollY - popupRect.height - 4;
    }

    setAdjustedPos({ top, left });
  }, [position]);

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
          if (mentionIndex !== -1) {
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
      }

      setShowTagTrigger(false);
    });
  };

  const filteredList = ["张三三", "李四", "王五", "赵六"].filter((name) =>
    name.includes(query)
  );

  return showTagTrigger && position
    ? createPortal(
        <div
          ref={popupRef}
          className="absolute z-50 w-52 rounded-md bg-white shadow-md border border-gray-200 p-2 text-sm"
          style={{
            top: adjustedPos
              ? adjustedPos.top
              : position.bottom + window.scrollY + 4,
            left: adjustedPos
              ? adjustedPos.left
              : position.left + window.scrollX,
          }}
        >
          <div className="text-xs text-gray-500 mb-1">搜索标签：</div>
          <input
            type="text"
            className="w-full border px-2 py-1 mb-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {filteredList.length > 0 ? (
            filteredList.map((name) => (
              <div
                key={name}
                className="cursor-pointer px-2 py-1 hover:bg-blue-50 rounded"
                onMouseDown={(e) => {
                  e.preventDefault();
                  insertMention(name);
                }}
              >
                {name}
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-xs px-2">无匹配项</div>
          )}
        </div>,
        document.body
      )
    : null;
};
