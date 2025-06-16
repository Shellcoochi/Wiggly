import { useCallback, useRef, useSyncExternalStore } from "react";
import { createStore, StateCreator } from "zustand";

interface EnvVariableStoreStateProps {
  envVariables: Array<any>;
  setEnvVariables: (envVariables: Array<any>) => void;
}

const envVariableStoreState: StateCreator<EnvVariableStoreStateProps> = (
  set
) => ({
  envVariables: [],
  setEnvVariables: (envVariables) => set(() => ({ envVariables })),
});

export const EnvVariableStore = createStore(envVariableStoreState);

export function useEnvVariableStore<T>(
  selector: (state: EnvVariableStoreStateProps) => T = (state) =>
    state as unknown as T,
  equalityFn: (a: T, b: T) => boolean = Object.is
): T {
  const lastSelectedRef = useRef<T | undefined>(undefined);
  const subscribe = useCallback(
    (callback: () => void) => {
      return EnvVariableStore.subscribe(() => {
        const newSelected = selector(EnvVariableStore.getState());
        if (!equalityFn(lastSelectedRef.current!, newSelected)) {
          lastSelectedRef.current = newSelected;
          callback();
        }
      });
    },
    [selector, equalityFn]
  );

  const getSnapshot = useCallback(() => {
    const selected = selector(EnvVariableStore.getState());
    lastSelectedRef.current = selected;
    return selected;
  }, [selector]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
