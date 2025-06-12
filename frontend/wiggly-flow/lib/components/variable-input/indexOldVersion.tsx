import React, { useState, useRef, useEffect, ReactNode, FC } from "react";

type ContentPart = {
  type: "text" | "tag";
  content: string;
};

interface VariableInputProps {
  value?: Array<ContentPart>;
}

const tagStyle =
  "inline-flex items-center bg-blue-100 text-blue-800 px-2 py-0.5 rounded mx-1";

export const VariableInput: FC<VariableInputProps> = ({ value }) => {
  const [content, setContent] = useState<ContentPart[]>([]);
  const [showTagTrigger, setShowTagTrigger] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value && inputRef.current) {
      while (inputRef.current.firstChild) {
        inputRef.current.removeChild(inputRef.current.firstChild);
      }

      value.forEach((val) => {
        let newNode;
        if (val.type === "tag") {
          newNode = createTag(val.content);
        } else {
          newNode = createText(val.content);
        }
        inputRef.current?.append(newNode);
      });
    }
  }, [value]);

  const updateContent = () => {
    const newContent: any = [];
    inputRef.current?.childNodes.forEach((node) => {
      if (node instanceof HTMLElement && node.dataset.type === "tag") {
        newContent.push({
          type: "tag",
          content: node.dataset.content || "",
        });
      } else {
        newContent.push({
          type: "text",
          content: node.nodeValue || "",
        });
      }
    });
    setContent(newContent);
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

  const createText = (label: string) => {
    const textNode = document.createTextNode(label);
    return textNode;
  };

  const createTag = (label: string) => {
    const tagNode = document.createElement("span");
    tagNode.className = tagStyle;
    tagNode.textContent = label;
    tagNode.contentEditable = "false";
    tagNode.dataset.content = label;
    tagNode.dataset.type = "tag";
    return tagNode;
  };

  const mentionTag = (label: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const textBeforeCursor = range.startContainer.textContent?.slice(
      0,
      range.startOffset
    );
    const hasAtSymbol = textBeforeCursor?.endsWith("@");

    if (hasAtSymbol) {
      const newRange = document.createRange();
      newRange.setStart(range.startContainer, range.startOffset - 1);
      newRange.setEnd(range.startContainer, range.startOffset);
      newRange.deleteContents();
    }

    const tagHTML = `<span contenteditable="false" data-type="tag" data-content="${label}" 
    class="${tagStyle}">${label}</span>`;
    document.execCommand("insertHTML", false, tagHTML);

    updateContent();
    setShowTagTrigger(false);
  };

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
      ></div>

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
