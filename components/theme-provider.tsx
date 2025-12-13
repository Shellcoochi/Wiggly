"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useUi } from "@/store";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <ThemeEffect />
      {children}
    </NextThemesProvider>
  );
}
function ThemeEffect() {
  const { theme, setTheme, systemTheme } = useTheme();
  const localTheme = useUi.use.theme();

  React.useEffect(() => {
    if (!theme) return;

    // 如果没有本地主题设置，使用系统默认
    if (!localTheme) {
      setTheme("system");
      return;
    }

    const { mode = "system", color = "default" } = localTheme;

    let finalMode: React.SetStateAction<string>;

    // 如果颜色是默认，只使用模式
    if (color === "default") {
      finalMode = mode;
    }
    // 如果是系统模式，添加系统主题
    else if (mode === "system") {
      finalMode = `${color}-${systemTheme}`;
    }
    // 如果是特定模式，添加模式后缀
    else if (mode === "light" || mode === "dark") {
      finalMode = `${color}-${mode}`;
    }
    // 其他情况使用系统默认
    else {
      finalMode = "system";
    }

    setTheme(finalMode);
  }, [theme, systemTheme, localTheme, setTheme]);

  return null;
}
