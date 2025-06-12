import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { MentionPlugin } from "./mention-plugin";
import { MentionNode } from "./mention-node";

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
        <OnChangePlugin onChange={() => {}} />
        <MentionPlugin />
      </LexicalComposer>
    </div>
  );
};
