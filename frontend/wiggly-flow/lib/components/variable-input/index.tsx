import { $getSelection, $isRangeSelection, $isTextNode } from "lexical";
import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { $createMentionNode, MentionNode } from "./MentionNode";
import { Popover } from "@/ui";
import { createPortal } from "react-dom";

const theme = {
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
  },
};

function onError(error: Error) {
  console.error(error);
}

function MentionPlugin() {
  const [editor] = useLexicalComposerContext();
  const [showTagTrigger, setShowTagTrigger] = useState(false);
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState<DOMRect | null>(null);

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
          className="absolute z-50 w-52 rounded-md bg-white shadow-md border border-gray-200 p-2 text-sm"
          style={{
            top: position.bottom + window.scrollY + 4,
            left: position.left + window.scrollX,
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
}

export const VariableInput = () => {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
    nodes: [MentionNode],
  };

  return (
    <div className="relative">
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="min-h-[100px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
          }
          placeholder={
            <div className="absolute top-3 left-3 text-gray-400 pointer-events-none">
              输入@插入标签...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin onChange={() => {}} />
        <MentionPlugin />
      </LexicalComposer>
    </div>
  );
};
