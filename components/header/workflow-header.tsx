import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  IconZoomIn,
  IconZoomOut,
  IconMaximize,
  IconArrowsMove,
  IconDeviceFloppy,
  IconPlayerPlay,
  IconDownload,
  IconUsers,
  IconEye,
} from "@tabler/icons-react";
import { SidebarTrigger } from "../ui/sidebar";

export function WorkflowHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {/* 左侧：返回和工作流信息 */}
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Input
                  defaultValue="测试流程"
                  className="h-7 w-48 border-0 bg-transparent p-0 text-lg font-semibold focus-visible:ring-0"
                />
                <Badge variant="outline" className="h-5 text-xs text-muted-foreground">
                  草稿
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* 中间：画布控制工具 */}
        <div className="mx-auto flex items-center gap-1">
          <div className="flex items-center gap-1 rounded-lg border bg-card p-1">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <IconZoomIn className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">100%</span>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <IconZoomOut className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="mx-1 h-4" />
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <IconArrowsMove className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <IconMaximize className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 右侧：操作按钮 */}
        <div className="flex items-center gap-2">
          {/* 协作状态 */}
          <div className="mr-2 flex items-center gap-2">
            <IconUsers className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">3人在线</span>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* 主操作按钮 */}
          <Button variant="outline" size="sm" className="gap-1">
            <IconEye className="h-4 w-4" />
            预览
          </Button>

          <Button variant="outline" size="sm" className="gap-1">
            <IconDownload className="h-4 w-4" />
            导出
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button size="sm" className="gap-1">
            <IconDeviceFloppy className="h-4 w-4" />
            保存
          </Button>

          <Button
            size="sm"
            variant="secondary"
            className="gap-1 bg-green-600 hover:bg-green-700 text-white"
          >
            <IconPlayerPlay className="h-4 w-4" />
            发布
          </Button>
        </div>
      </div>
    </header>
  );
}
