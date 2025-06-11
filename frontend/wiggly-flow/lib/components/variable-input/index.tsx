import React, { useState, useRef, useEffect, ReactNode } from "react";

type ContentPart = {
  type: "text" | "tag";
  content: string;
  id: string;
};

export const VariableInput = () => {
  const [content, setContent] = useState<ContentPart[]>([]);
  const [contentT, setContentT] = useState<ContentPart[]>([]);
  const [showTagTrigger, setShowTagTrigger] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Range | null>(null);

  const generateId = () => crypto.randomUUID();

  const updateContent = () => {
    const newContent: any = [];
    inputRef.current?.childNodes.forEach((node) => {
      if (node.nodeName === "#text") {
        newContent.push({
          type: "text",
          content: node.nodeValue || "", 
          id: generateId(),
        });
      }
      else if (node instanceof HTMLElement) {
        if (node.dataset.type === "text") {
          newContent.push({
            type: "text",
            content: node.dataset.content || "",
            id: generateId(),
          });
        } else {
          newContent.push({
            type: "tag",
            content: node.dataset.content || "",
            id: generateId(),
          });
        }
      }
    });
    setContentT(newContent);
    console.log(newContent);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    setShowTagTrigger(e.key === "@");
    setTimeout(() => {
      updateContent();
    });
  };

  const insertContentAtCursor = (content: Node) => {
    const selection = window.getSelection();
    if (selection?.rangeCount === 0) return;
    const range = selection?.getRangeAt(0);
    if (range) {
      range.deleteContents();
      range.insertNode(content);
      range.setStartAfter(content);
      range.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(range);

      const parent = inputRef.current;
      Array.from(parent?.childNodes ?? []).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && !node.textContent?.trim()) {
          parent?.removeChild(node);
        }
      });
    }
  };

  const createTag = (label: string) => {
    const tag = document.createElement("span");
    tag.className =
      "inline-flex items-center bg-blue-100 text-blue-800 px-2 py-0.5 rounded mx-1";
    tag.textContent = label;
    tag.contentEditable = "false";
    tag.dataset.content = label;
    tag.dataset.type = "tag";
    return tag;
  };

  const mentionTag = (label: string) => {
    const tag = createTag(label);
    const selection = window.getSelection();
    if (selection?.rangeCount === 0) return;
    const range = selection?.getRangeAt(0);
    const textBeforeCursor = range?.startContainer.textContent?.slice(
      0,
      range.startOffset
    );
    const hasAtSymbol = textBeforeCursor?.endsWith("@");

    if (hasAtSymbol && range) {
      const newRange = document.createRange();
      newRange.setStart(range.startContainer, range.startOffset - 1);
      newRange.setEnd(range.startContainer, range.startOffset);
      newRange.deleteContents();
      range.setStart(newRange.startContainer, newRange.startOffset);
    }
    insertContentAtCursor(tag);
    updateContent();
    setShowTagTrigger(false);
  };

  const renderContent = () =>
    content.map((part) => {
      if (part.type === "tag") {
        return (
          <span
            key={part.id}
            contentEditable={false}
            data-content={part.content}
            data-type={part.type}
            className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-0.5 rounded mx-1"
          >
            {part.content}
          </span>
        );
      }
      return (
        <span
          key={part.id}
          data-id={part.id}
          data-type={part.type}
          data-content={part.content}
        >
          {part.content}
        </span>
      );
    });

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="mb-2 text-sm text-gray-500">
        提示：输入 @ 可插入标签，标签不可编辑，Backspace 可整体删除标签
      </div>

      <div
        ref={inputRef}
        contentEditable
        onKeyDown={handleKeyDown}
        className="min-h-[100px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 whitespace-pre-wrap break-words"
        suppressContentEditableWarning
      >
        {renderContent()}
      </div>

      {showTagTrigger && (
        <div className="mt-2 p-2 border border-gray-200 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500 mb-1">选择标签：</div>
          <div className="flex flex-wrap gap-2">
            {["张三三", "李四", "王五", "赵六"].map((name) => (
              <button
                key={name}
                onClick={() => mentionTag(name)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
