"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SafeRenderer } from "@/components/web-designer/renderer";
import { PageSchema, DesignerNode } from "@/components/web-designer/types";
import {
  IconArrowLeft,
  IconCopy,
  IconCheck,
} from "@tabler/icons-react";
import { toast } from "sonner";

export default function PreviewPage() {
  const router = useRouter();
  const [schema, setSchema] = useState<PageSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // 从 localStorage 读取保存的 Schema
    const loadSchema = () => {
      try {
        const saved = localStorage.getItem("page-schema");
        if (saved) {
          const parsedSchema = JSON.parse(saved) as PageSchema;
          setSchema(parsedSchema);
        } else {
          setError("没有找到保存的设计内容");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "未知错误";
        setError(`加载失败: ${message}`);
        console.error("加载 Schema 失败:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSchema();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          <p className="text-muted-foreground">加载预览中...</p>
        </div>
      </div>
    );
  }

  if (error || !schema) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="text-destructive text-lg font-semibold">
            {error || "加载失败"}
          </div>
          <Button onClick={() => router.back()} variant="outline">
            <IconArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
        </div>
      </div>
    );
  }

  // 提取预览需要的运行时数据
  const variableValues = schema.variables.reduce((acc, v) => {
    acc[v.name] = v.defaultValue;
    return acc;
  }, {} as Record<string, any>);

  const dataSourceValues = schema.dataSources.reduce((acc, ds) => {
    acc[ds.id] = ds.config.data || null;
    return acc;
  }, {} as Record<string, any>);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopiedLink(true);
      toast.success("预览链接已复制");
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* 顶部控制栏 */}
      <div className="h-12 border-b bg-background/80 backdrop-blur-sm px-6 flex items-center gap-4 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <IconArrowLeft className="w-4 h-4" />
          返回
        </Button>

        <div className="h-6 w-px bg-border" />

        <div className="flex-1">
          <h1 className="text-sm font-semibold">{schema.meta.name}</h1>
          {schema.meta.description && (
            <p className="text-xs text-muted-foreground">{schema.meta.description}</p>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="gap-2"
        >
          {copiedLink ? (
            <>
              <IconCheck className="w-4 h-4" />
              已复制
            </>
          ) : (
            <>
              <IconCopy className="w-4 h-4" />
              复制链接
            </>
          )}
        </Button>
      </div>

      {/* 预览内容区域 */}
      <div className="flex-1 overflow-auto p-12 bg-muted/30">
        <div className="mx-auto bg-card rounded-lg shadow-2xl ring-1 ring-black/5 p-8 min-h-full max-w-6xl">
          <SafeRenderer
            schema={schema.components as DesignerNode[]}
            preview={true}
            variables={variableValues}
            dataSources={dataSourceValues}
            onError={(error, node) => {
              console.error(`[Preview] 渲染错误 [${node.componentName}]:`, error);
            }}
          />
        </div>
      </div>
    </div>
  );
}

