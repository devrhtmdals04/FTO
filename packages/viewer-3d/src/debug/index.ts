import { DebugStore } from './store';

export const debugStore = new DebugStore();

declare global {
  interface Window {
    __FTO_DBG?: (line: string) => void;
  }
}

if (typeof window !== 'undefined') {
  const handler = (line: string) => {
    if (!debugStore.ingest(line)) {
      console.log('[dbg]', line);
    }
  };
  window.__FTO_DBG = handler;
}

export * from './types';
