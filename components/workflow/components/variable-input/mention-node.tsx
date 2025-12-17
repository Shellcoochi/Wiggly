import React from "react";
import { DecoratorNode, LexicalNode, NodeKey } from "lexical";
import { ReactNode } from "react";
import { useMentionSelection } from "./use-mention-selection";

function MentionComponent({
  name,
  nodeKey,
}: {
  name: string;
  nodeKey: string;
}) {
  const isSelected = useMentionSelection(nodeKey);
  return (
    <div
      className={`flex  items-center rounded border px-1.5 py-px text-xs truncate select-none ${
        isSelected
          ? "border-primary-active bg-blue-50 text-primary-active"
          : "border-gray-300 bg-gray-100 text-primary hover:text-primary-active hover:border-primary-active"
      }`}
    >
      <span className="truncate">{name}</span>
    </div>
  );
}

export class MentionNode extends DecoratorNode<ReactNode> {
  __name: string;

  static getType(): string {
    return "mention";
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__name, node.__key);
  }

  constructor(name: string, key?: NodeKey) {
    super(key);
    this.__name = name;
  }

  createDOM(): HTMLElement {
    const dom = document.createElement("span");
    dom.className = "inline-flex items-center align-start px-1";
    dom.contentEditable = "false";
    return dom;
  }

  updateDOM(): boolean {
    return false;
  }

  decorate(): ReactNode {
    return <MentionComponent name={this.__name} nodeKey={this.getKey()} />;
  }

  static importJSON(serializedNode: any): MentionNode {
    const { name } = serializedNode;
    return $createMentionNode(name);
  }

  exportJSON(): any {
    return {
      type: "mention",
      version: 1,
      name: this.__name,
    };
  }
}

export function $createMentionNode(name: string): MentionNode {
  return new MentionNode(name);
}

export function $isMentionNode(
  node: LexicalNode | null | undefined
): node is MentionNode {
  return node instanceof MentionNode;
}
