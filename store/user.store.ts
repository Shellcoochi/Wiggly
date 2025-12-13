"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSelectors } from "@/lib/store-selectors";

interface UserState {
  user: {
    id?: string;
    name?: string;
    avatar?: string;
  } | null;

  setUser: (user: UserState["user"]) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-store", 
    }
  )
);
export const useUser = createSelectors(useUserStore)