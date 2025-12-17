"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconSearch,
  IconApps,
  IconList,
  IconPlus,
  IconFilter,
  IconSortAscending,
  IconDotsVertical,
  IconDownload,
  IconShare,
  IconStar,
  IconExternalLink,
  IconSettings,
  IconUsers,
  IconTrash,
  IconBrandSlack,
  IconBrandDiscord,
  IconBrandNotion,
  IconBrandFigma,
  IconBrandGithub,
  IconBrandZoom,
  IconBrandGoogleDrive,
  IconBrandTrello,
  IconBrandAsana,
  IconBrandDropbox,
  IconDeviceDesktop,
  IconMessages,
  IconNotebook,
  IconBrush,
  IconTerminal2,
  IconCategory,
  IconCheck,
  IconX,
  IconRefresh,
  IconInfoCircle,
} from "@tabler/icons-react";

// 应用数据类型定义
type App = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  rating: number;
  installs: number | string;
  featured: boolean;
  new: boolean;
  popular: boolean;
  color: string;
  tags: string[];
  status: "active" | "inactive" | "needs_setup";
  lastUpdated: string;
  version: string;
};

export default function AppsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  // 模拟应用数据
  const apps: App[] = [
    {
      id: "1",
      name: "Slack",
      description: "团队沟通与协作工具，实时消息、文件共享和集成多种工作应用",
      icon: <IconBrandSlack className="w-8 h-8" />,
      category: "communication",
      rating: 4.8,
      installs: "2.5M+",
      featured: true,
      new: false,
      popular: true,
      color: "#4A154B",
      tags: ["沟通", "团队协作", "实时聊天"],
      status: "active",
      lastUpdated: "2024-01-15",
      version: "v2.4.1",
    },
    {
      id: "2",
      name: "Notion",
      description: "一体化工作空间，笔记、文档、数据库和项目管理",
      icon: <IconBrandNotion className="w-8 h-8" />,
      category: "productivity",
      rating: 4.7,
      installs: "1.8M+",
      featured: true,
      new: true,
      popular: true,
      color: "#000000",
      tags: ["文档", "笔记", "项目管理"],
      status: "active",
      lastUpdated: "2024-01-10",
      version: "v3.2.0",
    },
    {
      id: "3",
      name: "Figma",
      description: "云端设计工具，支持团队协作的界面设计",
      icon: <IconBrandFigma className="w-8 h-8" />,
      category: "design",
      rating: 4.9,
      installs: "1.2M+",
      featured: false,
      new: false,
      popular: true,
      color: "#F24E1E",
      tags: ["设计", "UI/UX", "原型设计"],
      status: "active",
      lastUpdated: "2024-01-12",
      version: "v1.8.3",
    },
    {
      id: "4",
      name: "GitHub",
      description: "代码托管平台，版本控制和协作开发",
      icon: <IconBrandGithub className="w-8 h-8" />,
      category: "development",
      rating: 4.6,
      installs: "3.1M+",
      featured: false,
      new: false,
      popular: true,
      color: "#181717",
      tags: ["开发", "代码托管", "版本控制"],
      status: "active",
      lastUpdated: "2024-01-05",
      version: "v5.2.1",
    },
    {
      id: "5",
      name: "Zoom",
      description: "视频会议平台，支持大型在线会议和网络研讨会",
      icon: <IconBrandZoom className="w-8 h-8" />,
      category: "communication",
      rating: 4.5,
      installs: "4.2M+",
      featured: false,
      new: false,
      popular: true,
      color: "#2D8CFF",
      tags: ["视频会议", "远程办公"],
      status: "inactive",
      lastUpdated: "2023-12-20",
      version: "v1.3.4",
    },
    {
      id: "6",
      name: "Google Drive",
      description: "云存储服务，文件同步和共享",
      icon: <IconBrandGoogleDrive className="w-8 h-8" />,
      category: "productivity",
      rating: 4.4,
      installs: "5.0M+",
      featured: false,
      new: false,
      popular: true,
      color: "#4285F4",
      tags: ["云存储", "文件共享"],
      status: "active",
      lastUpdated: "2024-01-08",
      version: "v4.0.2",
    },
    {
      id: "7",
      name: "Discord",
      description: "社区和游戏聊天应用，支持语音、视频和文字",
      icon: <IconBrandDiscord className="w-8 h-8" />,
      category: "communication",
      rating: 4.7,
      installs: "1.9M+",
      featured: false,
      new: false,
      popular: true,
      color: "#5865F2",
      tags: ["社区", "游戏", "聊天"],
      status: "needs_setup",
      lastUpdated: "2023-12-15",
      version: "v2.1.0",
    },
    {
      id: "8",
      name: "Trello",
      description: "看板式项目管理工具，可视化任务管理",
      icon: <IconBrandTrello className="w-8 h-8" />,
      category: "productivity",
      rating: 4.3,
      installs: "980K+",
      featured: false,
      new: true,
      popular: false,
      color: "#0052CC",
      tags: ["项目管理", "看板"],
      status: "active",
      lastUpdated: "2024-01-18",
      version: "v3.0.0",
    },
    {
      id: "9",
      name: "Asana",
      description: "工作管理平台，任务分配和项目追踪",
      icon: <IconBrandAsana className="w-8 h-8" />,
      category: "productivity",
      rating: 4.4,
      installs: "750K+",
      featured: false,
      new: false,
      popular: false,
      color: "#273347",
      tags: ["项目管理", "任务追踪"],
      status: "inactive",
      lastUpdated: "2023-12-28",
      version: "v2.5.1",
    },
    {
      id: "10",
      name: "Miro",
      description: "在线白板协作工具，支持团队头脑风暴",
      icon: <IconX className="w-8 h-8" />,
      category: "design",
      rating: 4.8,
      installs: "600K+",
      featured: false,
      new: false,
      popular: true,
      color: "#050038",
      tags: ["白板", "头脑风暴", "协作"],
      status: "active",
      lastUpdated: "2024-01-14",
      version: "v1.5.2",
    },
    {
      id: "11",
      name: "Jira",
      description: "敏捷开发项目管理工具，支持Scrum和Kanban",
      icon: <IconX className="w-8 h-8" />,
      category: "development",
      rating: 4.2,
      installs: "850K+",
      featured: false,
      new: false,
      popular: false,
      color: "#0052CC",
      tags: ["敏捷开发", "项目管理"],
      status: "active",
      lastUpdated: "2024-01-03",
      version: "v4.1.3",
    },
    {
      id: "12",
      name: "Dropbox",
      description: "云存储和文件同步服务",
      icon: <IconBrandDropbox className="w-8 h-8" />,
      category: "productivity",
      rating: 4.3,
      installs: "2.3M+",
      featured: false,
      new: false,
      popular: false,
      color: "#0061FF",
      tags: ["云存储", "文件同步"],
      status: "needs_setup",
      lastUpdated: "2023-12-25",
      version: "v3.2.1",
    },
  ];

  // 分类选项
  const categories = [
    {
      id: "all",
      label: "全部应用",
      icon: <IconApps className="w-4 h-4" />,
      count: apps.length,
    },
    {
      id: "communication",
      label: "沟通协作",
      icon: <IconMessages className="w-4 h-4" />,
      count: apps.filter((app) => app.category === "communication").length,
    },
    {
      id: "productivity",
      label: "效率工具",
      icon: <IconNotebook className="w-4 h-4" />,
      count: apps.filter((app) => app.category === "productivity").length,
    },
    {
      id: "design",
      label: "设计创意",
      icon: <IconBrush className="w-4 h-4" />,
      count: apps.filter((app) => app.category === "design").length,
    },
    {
      id: "development",
      label: "开发工具",
      icon: <IconTerminal2 className="w-4 h-4" />,
      count: apps.filter((app) => app.category === "development").length,
    },
  ];

  // 过滤和排序应用
  const filteredApps = useMemo(() => {
    let result = [...apps];

    // 搜索过滤
    if (searchQuery) {
      result = result.filter(
        (app) =>
          app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // 分类过滤
    if (selectedCategory !== "all") {
      result = result.filter((app) => app.category === selectedCategory);
    }

    // 排序
    switch (sortBy) {
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "installs":
        result.sort((a, b) => {
          const aVal =
            typeof a.installs === "string"
              ? parseFloat(a.installs)
              : a.installs;
          const bVal =
            typeof b.installs === "string"
              ? parseFloat(b.installs)
              : b.installs;
          return bVal - aVal;
        });
        break;
      case "new":
        result.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
        break;
      case "recent":
        result.sort(
          (a, b) =>
            new Date(b.lastUpdated).getTime() -
            new Date(a.lastUpdated).getTime()
        );
        break;
    }

    return result;
  }, [apps, searchQuery, selectedCategory, sortBy]);

  // 获取状态徽章
  const getStatusBadge = (status: App["status"]) => {
    const config = {
      active: {
        label: "已激活",
        variant: "default" as const,
        icon: <IconCheck className="w-3 h-3 mr-1" />,
      },
      inactive: {
        label: "未激活",
        variant: "secondary" as const,
        icon: <IconX className="w-3 h-3 mr-1" />,
      },
      needs_setup: {
        label: "需配置",
        variant: "outline" as const,
        icon: <IconX className="w-3 h-3 mr-1" />,
      },
    };
    return config[status];
  };

  // 获取分类图标
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "communication":
        return <IconMessages className="w-4 h-4" />;
      case "productivity":
        return <IconNotebook className="w-4 h-4" />;
      case "design":
        return <IconBrush className="w-4 h-4" />;
      case "development":
        return <IconTerminal2 className="w-4 h-4" />;
      default:
        return <IconDeviceDesktop className="w-4 h-4" />;
    }
  };

  // 获取分类名称
  const getCategoryName = (category: string) => {
    switch (category) {
      case "communication":
        return "沟通协作";
      case "productivity":
        return "效率工具";
      case "design":
        return "设计创意";
      case "development":
        return "开发工具";
      default:
        return "其他";
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* 头部区域 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <IconApps className="w-8 h-8" />
            应用商店
          </h1>
          <p className="text-muted-foreground">
            发现和安装您需要的应用，提升工作效率
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="gap-2">
            <IconPlus className="w-4 h-4" />
            添加应用
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 总应用数 */}
        <Card className="bg-background border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <IconCategory className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span>总应用数</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {apps.length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              已安装 {apps.filter((a) => a.status === "active").length} 个
            </p>
          </CardContent>
        </Card>

        {/* 活跃应用 */}
        <Card className="bg-background border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <IconCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <span>活跃应用</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {apps.filter((a) => a.status === "active").length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">正常运行中</p>
          </CardContent>
        </Card>

        {/* 平均评分 */}
        <Card className="bg-background border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                <IconStar className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <span>平均评分</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">4.6</div>
            <p className="text-sm text-muted-foreground mt-1">基于用户评价</p>
          </CardContent>
        </Card>

        {/* 本月新增 */}
        <Card className="bg-background border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <IconRefresh className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span>本月新增</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {apps.filter((app) => app.new).length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">持续更新中</p>
          </CardContent>
        </Card>
      </div>

      {/* 过滤和搜索栏 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 w-full">
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="搜索应用、分类或标签..."
                  className="pl-9 w-full lg:w-[400px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-2">
                <IconFilter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">分类：</span>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-45">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(selectedCategory)}
                      <SelectValue placeholder="选择分类" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          {category.icon}
                          {category.label}
                          <Badge variant="secondary" className="ml-auto">
                            {category.count}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <IconSortAscending className="w-4 h-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="排序方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">按名称</SelectItem>
                    <SelectItem value="rating">按评分</SelectItem>
                    <SelectItem value="installs">按安装量</SelectItem>
                    <SelectItem value="new">按新增</SelectItem>
                    <SelectItem value="recent">按更新</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none border-0"
                >
                  <IconApps className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none border-0 border-l"
                >
                  <IconList className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* 分类标签 */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                className="cursor-pointer gap-1.5 px-3 py-1.5"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.icon}
                {category.label}
                <span className="ml-1 text-xs opacity-80">
                  ({category.count})
                </span>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 应用列表 */}
      {filteredApps.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="max-w-md mx-auto">
              <IconSearch className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">未找到应用</h3>
              <p className="text-muted-foreground mb-4">
                没有找到匹配的应用，请尝试其他搜索词或选择其他分类
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="gap-2"
              >
                <IconFilter className="w-4 h-4" />
                重置筛选
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              找到 {filteredApps.length} 个应用
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconInfoCircle className="w-4 h-4" />
              点击卡片查看详情，右键菜单查看更多操作
            </div>
          </div>

          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredApps.map((app) => {
              const statusConfig = getStatusBadge(app.status);
              return (
                <Card
                  key={app.id}
                  className={`group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 ${
                    viewMode === "list" ? "flex" : ""
                  } ${app.status === "active" ? "border-primary/20" : ""}`}
                >
                  <CardHeader
                    className={`${
                      viewMode === "list"
                        ? "shrink-0 w-64 border-r"
                        : "pb-3"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md"
                          style={{ backgroundColor: app.color }}
                        >
                          {app.icon}
                        </div>
                        <div className="space-y-1">
                          <CardTitle className="text-base flex items-center gap-2">
                            {app.name}
                            {app.featured && (
                              <Badge
                                variant="secondary"
                                className="gap-1 text-xs"
                              >
                                <IconStar className="w-3 h-3 fill-current" />
                                精选
                              </Badge>
                            )}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {getCategoryIcon(app.category)}
                            {getCategoryName(app.category)}
                            {app.new && (
                              <Badge variant="default" className="text-xs">
                                新
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <IconDotsVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <IconExternalLink className="w-4 h-4 mr-2" />
                            查看详情
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <IconDownload className="w-4 h-4 mr-2" />
                            {app.status === "active" ? "重新安装" : "安装"}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <IconShare className="w-4 h-4 mr-2" />
                            分享应用
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <IconTrash className="w-4 h-4 mr-2" />
                            移除应用
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="mt-4">
                      <Badge
                        variant={statusConfig.variant}
                        className="gap-1 text-xs"
                      >
                        {statusConfig.icon}
                        {statusConfig.label}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent
                    className={`${viewMode === "list" ? "flex-1" : "pt-0"}`}
                  >
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {app.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {app.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs px-2 py-0.5"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5">
                            <IconStar className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{app.rating}</span>
                            <span className="text-muted-foreground">/5.0</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <IconDownload className="w-4 h-4" />
                            {app.installs}
                          </div>
                        </div>

                        {app.popular && (
                          <Badge variant="secondary" className="gap-1 text-xs">
                            <IconUsers className="w-3 h-3" />
                            热门
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                        <span>版本: {app.version}</span>
                        <span>更新: {app.lastUpdated}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter
                    className={`${
                      viewMode === "list" ? "shrink-0 border-t" : "pt-0"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        {app.status === "active" && (
                          <Button variant="outline" size="sm" className="gap-2">
                            <IconSettings className="w-4 h-4" />
                            管理
                          </Button>
                        )}
                        {app.status === "inactive" && (
                          <Button size="sm" className="gap-2">
                            <IconDownload className="w-4 h-4" />
                            激活
                          </Button>
                        )}
                        {app.status === "needs_setup" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="gap-2"
                          >
                            <IconX className="w-4 h-4" />
                            配置
                          </Button>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" className="gap-2">
                        详情
                        <IconExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* 热门推荐 */}
      {filteredApps.some((app) => app.featured) && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <IconStar className="w-5 h-5 text-yellow-500 fill-current" />
            精选推荐
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredApps
              .filter((app) => app.featured)
              .map((app) => (
                <Card
                  key={app.id}
                  className="bg-linear-to-r from-primary/5 to-primary/10"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md"
                        style={{ backgroundColor: app.color }}
                      >
                        {app.icon}
                      </div>
                      <div>
                        <div className="font-semibold">{app.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {app.description}
                        </div>
                      </div>
                      <Badge className="ml-auto gap-1">
                        <IconStar className="w-3 h-3 fill-current" />
                        精选
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
