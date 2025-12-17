import { createStore } from "zustand/vanilla";
import { useSyncExternalStore } from "react";

export const counterStore = createStore((set) => ({
  count: 0,
  increment: () =>
    set((state: { count: number }) => ({ count: state.count + 1 })),
}));

export const useCounterStore: any = () => {
  return useSyncExternalStore(
    counterStore.subscribe,
    counterStore.getState,
    counterStore.getState
  );
};
