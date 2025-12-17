"use client";

import Editor from "@monaco-editor/react";
import { useState } from "react";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button";

const languageMap: Record<string, string> = {
  string: "plaintext",
  number: "plaintext",
  boolean: "plaintext",
  array: "json",
  object: "json",
  json: "json",
  javascript: "javascript",
  css: "css",
};

const defaultValueMap: Record<string, string> = {
  string: '"Hello world"',
  number: "1",
  boolean: "true",
  array: '["a", "b", "c"]',
  object: '{ "key": "value" }',
  json: '{ "key": 1 }',
  javascript: "// your JS code",
  css: "body { margin: 0; }",
};

type WigglyEditorProps = {
  type: keyof typeof languageMap;
  onChange?: (val: string) => void;
  value?: string;
  className?: string;
  height?: string | number;
};

export const WigglyEditor = ({
  type,
  value,
  onChange,
  className,
  height = 80,
}: WigglyEditorProps) => {
  const [code, setCode] = useState(value ?? defaultValueMap[type]);
  const language = languageMap[type];

  return (
    <div
      className={cn(
        "inline-flex min-h-8 w-full flex-col justify-between gap-2",
        "rounded border border-border bg-white px-3 py-2",
        "text-sm text-text-primary placeholder:text-text-disabled",
        "hover:border-border-hover hover:shadow-sm",
        "focus-within:outline-none focus-within:border-primary-active",
        "transition-all",
        className
      )}
    >
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <span className="capitalize">{type}</span>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-text-disabled hover:text-primary transition"
          onClick={() => navigator.clipboard.writeText(code)}
        >
          复制
        </Button>
      </div>
      <div>
        <Editor
          height={height}
          language={language}
          value={code}
          theme="vs"
          onChange={(val) => {
            const newVal = val ?? "";
            setCode(newVal);
            onChange?.(newVal);
          }}
          options={{
            minimap: { enabled: false },
            lineNumbers: "off",
            fontSize: 13,
            padding: { top: 0, bottom: 0 },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            overviewRulerBorder: false,
            overviewRulerLanes: 0,
            scrollbar: {
              vertical: "hidden",
              horizontal: "auto",
            },
            cursorWidth: 1,
            renderLineHighlight: "none",
            tabSize: 2,
          }}
        />
      </div>
    </div>
  );
};
