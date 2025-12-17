import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import { $getSelection, $isNodeSelection, $isRangeSelection } from "lexical";

export function useMentionSelection(nodeKey: string): boolean {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!selection) {
          setIsSelected(false);
          return;
        }

        if ($isNodeSelection(selection)) {
          setIsSelected(selection.has(nodeKey));
        } else if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          const focusNode = selection.focus.getNode();
          setIsSelected(
            anchorNode.getKey() === nodeKey || focusNode.getKey() === nodeKey
          );
        } else {
          setIsSelected(false);
        }
      });
    });
  }, [editor, nodeKey]);

  return isSelected;
}
