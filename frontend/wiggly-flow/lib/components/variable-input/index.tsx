import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { MentionPlugin } from "./mention-plugin";
import {
  $createMentionNode,
  $isMentionNode,
  MentionNode,
} from "./mention-node";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $isTextNode,
  EditorState,
  LexicalNode,
} from "lexical";

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

export const VariableInput = () => {
  const initialConfig = {
    namespace: "VariableInput",
    theme,
    onError,
    nodes: [MentionNode],
    editorState: () => {
      const root = $getRoot();
      const paragraph = $createParagraphNode();
      paragraph.append(
        $createTextNode("你好，"),
        $createMentionNode("张三"),
        $createTextNode("，请填写表单。")
      );
      root.append(paragraph);
    },
  };

  const handleChange = (editorState: EditorState) => {
    editorState.read(() => {
      const root = $getRoot();
      const result: (string | { name: string })[] = [];

      const extractFromNode = (node: LexicalNode) => {
        if ($isTextNode(node)) {
          result.push(node.getTextContent());
        } else if ($isMentionNode(node)) {
          result.push({ name: (node as MentionNode).__name });
        } else if (
          "getChildren" in node &&
          typeof node.getChildren === "function"
        ) {
          node.getChildren().forEach(extractFromNode);
        }
      };

      root.getChildren().forEach(extractFromNode);

      console.log("最终内容：", result);
    });
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
              输入@插入变量...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin onChange={handleChange} />
        <MentionPlugin />
      </LexicalComposer>
    </div>
  );
};
