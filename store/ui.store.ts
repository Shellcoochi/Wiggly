"use client";

import { createSelectors } from "@/lib/store-selectors";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiState {
  theme: {
    mode?: "light" | "dark" | "system";
    color?: string;
  };
  setTheme: (theme: UiState["theme"]) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      theme: { mode: "system", color: "default" },
      setTheme: (theme) => set({ theme: { ...get().theme, ...theme } }),
      sidebarCollapsed: false,
      toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
    }),
    {
      name: "ui-store",
    }
  )
);

export const useUi = createSelectors(useUiStore);
