import { useSyncExternalStore } from "react";
import { createStore, StateCreator } from "zustand";

interface EnvVariableStoreStateProps {
  envVariables: Array<any>;
  setEnvVariables: (envVariables: Array<any>) => void;
}

const envVariableStoreState: StateCreator<EnvVariableStoreStateProps> = (
  set
) => ({
  envVariables: [],
  setEnvVariables: (envVariables) =>
    set(() => ({
      envVariables,
    })),
});

export const EnvVariableStore = createStore(envVariableStoreState);

export const useEnvVariableStore: any = () => {
  return useSyncExternalStore(
    EnvVariableStore.subscribe,
    EnvVariableStore.getState,
    EnvVariableStore.getState
  );
};
