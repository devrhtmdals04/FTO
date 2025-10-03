import type { TacticsStore, TacticsStoreListener } from "../state/tacticsStore";

export interface StoreBinding {
  readonly dispose: () => void;
}

export const bindStore = (
  store: TacticsStore,
  listener: TacticsStoreListener,
): StoreBinding => {
  const dispose = store.subscribe(listener);
  return { dispose };
};
