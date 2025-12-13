// app/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useUi } from "@/store";
import { themeColors, themeModes } from "@/lib/themes";
import { IconBell, IconDeviceFloppy, IconPalette, IconRefresh, IconShield, IconUser } from "@tabler/icons-react";

export default function SettingsPage() {
  const localTheme = useUi.use.theme();
  const changeTheme = useUi.use.setTheme();
  const { setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState({
    // 外观设置
    appearance: {
      theme: "system" as "light" | "dark" | "system",
      compactMode: false,
      reduceAnimations: false,
      fontSize: "medium" as "small" | "medium" | "large",
    },
    // 通知设置
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      newsletter: false,
      securityAlerts: true,
    },
    // 隐私设置
    privacy: {
      profileVisibility: "public" as "public" | "private" | "contacts",
      dataCollection: true,
      activityTracking: false,
      showOnlineStatus: true,
    },
    // 账户设置
    account: {
      twoFactorAuth: false,
      autoLogout: 30, // minutes
      sessionTimeout: 24, // hours
    },
  });

  // 防止水合不匹配
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // 从 localStorage 加载设置
    const savedSettings = localStorage.getItem("app-settings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Failed to parse saved settings:", error);
      }
    }
  }, []);

  // 保存设置到 localStorage
  const saveSettings = () => {
    localStorage.setItem("app-settings", JSON.stringify(settings));
    toast.success("设置已保存", {
      description: "您的设置已成功保存",
    });
  };

  // 重置设置
  const resetSettings = () => {
    const defaultSettings: any = {
      appearance: {
        theme: "system",
        compactMode: false,
        reduceAnimations: false,
        fontSize: "medium",
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: false,
        newsletter: false,
        securityAlerts: true,
      },
      privacy: {
        profileVisibility: "public",
        dataCollection: true,
        activityTracking: false,
        showOnlineStatus: true,
      },
      account: {
        twoFactorAuth: false,
        autoLogout: 30,
        sessionTimeout: 24,
      },
    };

    setSettings(defaultSettings);
    setTheme("system");
    localStorage.setItem("app-settings", JSON.stringify(defaultSettings));
    toast.info("设置已重置为默认值");
  };

  // 更新嵌套设置
  const updateSetting = (
    section: keyof typeof settings,
    key: string,
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  if (!mounted) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">系统设置</h1>
          <p className="text-muted-foreground">自定义您的应用体验</p>
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList className="grid grid-cols-4 lg:grid-cols-6">
          <TabsTrigger value="appearance" className="gap-2">
            <IconPalette className="h-4 w-4" />
            外观
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <IconBell className="h-4 w-4" />
            通知
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2">
            <IconShield className="h-4 w-4" />
            隐私
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-2">
            <IconUser className="h-4 w-4" />
            账户
          </TabsTrigger>
        </TabsList>

        {/* 外观设置 */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconPalette className="h-5 w-5" />
                外观设置
              </CardTitle>
              <CardDescription>自定义应用的主题、字体和布局</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className=" bg-background border rounded-lg p-4 shadow-lg z-50">
                <div className="space-y-4">
                  {/* 颜色选择 */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">主题颜色</h3>
                    <div className="flex flex-wrap gap-2">
                      {themeColors.map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2  ${
                            localTheme.color === color
                              ? "border-primary"
                              : "border-transparent"
                          }`}
                          style={{
                            backgroundColor: `var(--color-${color}-500)`,
                            borderColor:
                              localTheme.color === color
                                ? `var(--color-${color}-600)`
                                : "transparent",
                          }}
                          onClick={() => changeTheme({ color })}
                          aria-label={`选择${color}主题`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* 模式选择 */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">主题模式</h3>
                    <div className="flex gap-2">
                      {themeModes.map((mode) => (
                        <button
                          key={mode}
                          className={`px-3 py-1 rounded-md text-sm ${
                            localTheme.mode === mode
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                          onClick={() => changeTheme({ mode })}
                        >
                          {mode === "light"
                            ? "浅色"
                            : mode === "dark"
                            ? "深色"
                            : "系统"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 当前主题显示 */}
                  <div className="text-xs text-muted-foreground">
                    当前: {localTheme.color}-{localTheme.mode}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="compact-mode">紧凑模式</Label>
                      <p className="text-sm text-muted-foreground">
                        减少界面元素之间的间距
                      </p>
                    </div>
                    <Switch
                      id="compact-mode"
                      checked={settings.appearance.compactMode}
                      onCheckedChange={(checked) =>
                        updateSetting("appearance", "compactMode", checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reduce-animations">减少动画</Label>
                      <p className="text-sm text-muted-foreground">
                        禁用非必要的动画效果
                      </p>
                    </div>
                    <Switch
                      id="reduce-animations"
                      checked={settings.appearance.reduceAnimations}
                      onCheckedChange={(checked) =>
                        updateSetting("appearance", "reduceAnimations", checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="font-size">字体大小</Label>
                    <Select
                      value={settings.appearance.fontSize}
                      onValueChange={(value: "small" | "medium" | "large") =>
                        updateSetting("appearance", "fontSize", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">小</SelectItem>
                        <SelectItem value="medium">中</SelectItem>
                        <SelectItem value="large">大</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 通知设置 */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconBell className="h-5 w-5" />
                通知设置
              </CardTitle>
              <CardDescription>管理您希望接收的通知类型</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[
                  {
                    id: "email-notifications",
                    label: "邮件通知",
                    description: "通过电子邮件接收重要更新",
                    checked: settings.notifications.emailNotifications,
                    onChange: (checked: boolean) =>
                      updateSetting(
                        "notifications",
                        "emailNotifications",
                        checked
                      ),
                  },
                  {
                    id: "push-notifications",
                    label: "推送通知",
                    description: "在设备上接收推送通知",
                    checked: settings.notifications.pushNotifications,
                    onChange: (checked: boolean) =>
                      updateSetting(
                        "notifications",
                        "pushNotifications",
                        checked
                      ),
                  },
                  {
                    id: "newsletter",
                    label: "订阅简报",
                    description: "接收产品更新和新闻简报",
                    checked: settings.notifications.newsletter,
                    onChange: (checked: boolean) =>
                      updateSetting("notifications", "newsletter", checked),
                  },
                  {
                    id: "security-alerts",
                    label: "安全提醒",
                    description: "接收账户安全相关的提醒",
                    checked: settings.notifications.securityAlerts,
                    onChange: (checked: boolean) =>
                      updateSetting("notifications", "securityAlerts", checked),
                  },
                ].map((item) => (
                  <div key={item.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor={item.id}>{item.label}</Label>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <Switch
                        id={item.id}
                        checked={item.checked}
                        onCheckedChange={item.onChange}
                      />
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 隐私设置 */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconShield className="h-5 w-5" />
                隐私设置
              </CardTitle>
              <CardDescription>管理您的隐私和数据设置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-base">个人资料可见性</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      控制谁可以查看您的个人资料
                    </p>
                    <RadioGroup
                      value={settings.privacy.profileVisibility}
                      onValueChange={(
                        value: "public" | "private" | "contacts"
                      ) => updateSetting("privacy", "profileVisibility", value)}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="public" id="public" />
                        <Label htmlFor="public" className="cursor-pointer">
                          <span className="font-medium">公开</span>
                          <p className="text-sm text-muted-foreground">
                            任何人都可以查看您的个人资料
                          </p>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="contacts" id="contacts" />
                        <Label htmlFor="contacts" className="cursor-pointer">
                          <span className="font-medium">仅联系人</span>
                          <p className="text-sm text-muted-foreground">
                            仅限您的联系人可以查看
                          </p>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="private" id="private" />
                        <Label htmlFor="private" className="cursor-pointer">
                          <span className="font-medium">私密</span>
                          <p className="text-sm text-muted-foreground">
                            只有您自己可以查看
                          </p>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  {[
                    {
                      id: "data-collection",
                      label: "数据收集",
                      description: "允许收集匿名使用数据以改进产品",
                      checked: settings.privacy.dataCollection,
                      onChange: (checked: boolean) =>
                        updateSetting("privacy", "dataCollection", checked),
                    },
                    {
                      id: "activity-tracking",
                      label: "活动追踪",
                      description: "追踪您的使用活动以提供个性化体验",
                      checked: settings.privacy.activityTracking,
                      onChange: (checked: boolean) =>
                        updateSetting("privacy", "activityTracking", checked),
                    },
                    {
                      id: "online-status",
                      label: "显示在线状态",
                      description: "向其他用户显示您的在线状态",
                      checked: settings.privacy.showOnlineStatus,
                      onChange: (checked: boolean) =>
                        updateSetting("privacy", "showOnlineStatus", checked),
                    },
                  ].map((item) => (
                    <div key={item.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor={item.id}>{item.label}</Label>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                        <Switch
                          id={item.id}
                          checked={item.checked}
                          onCheckedChange={item.onChange}
                        />
                      </div>
                      <Separator />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 账户设置 */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconUser className="h-5 w-5" />
                账户设置
              </CardTitle>
              <CardDescription>管理您的账户安全设置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">双重认证</Label>
                    <p className="text-sm text-muted-foreground">
                      启用双重认证以提高账户安全性
                    </p>
                  </div>
                  <Switch
                    id="two-factor"
                    checked={settings.account.twoFactorAuth}
                    onCheckedChange={(checked) =>
                      updateSetting("account", "twoFactorAuth", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="auto-logout">自动登出时间</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    设置无操作后的自动登出时间
                  </p>
                  <Select
                    value={settings.account.autoLogout.toString()}
                    onValueChange={(value) =>
                      updateSetting("account", "autoLogout", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5分钟</SelectItem>
                      <SelectItem value="15">15分钟</SelectItem>
                      <SelectItem value="30">30分钟</SelectItem>
                      <SelectItem value="60">1小时</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="session-timeout">会话超时</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    设置登录会话的有效期
                  </p>
                  <Select
                    value={settings.account.sessionTimeout.toString()}
                    onValueChange={(value) =>
                      updateSetting(
                        "account",
                        "sessionTimeout",
                        parseInt(value)
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1小时</SelectItem>
                      <SelectItem value="8">8小时</SelectItem>
                      <SelectItem value="24">24小时</SelectItem>
                      <SelectItem value="168">7天</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={resetSettings} className="gap-2">
          <IconRefresh className="h-4 w-4" />
          重置设置
        </Button>
        <Button onClick={saveSettings} className="gap-2">
          <IconDeviceFloppy className="h-4 w-4" />
          保存所有设置
        </Button>
      </div>
    </div>
  );
}
