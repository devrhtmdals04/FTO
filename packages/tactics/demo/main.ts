import { TacticsSettingsRoot, TacticsStore, Tactic, EngineBridge, TacticSummary, PRESET_TACTICS } from '../src/index';

// --- Mock Engine Bridge ---
// This simulates the communication with the Rust engine for the standalone demo.
// It uses localStorage to persist tactics.
const MOCK_DB_KEY = 'fto_mock_tactics';

const isPresetId = (id: string): boolean => id.startsWith('preset-');

const normalizeRecord = (source: Record<string, Tactic>): Record<string, Tactic> => {
  const normalized: Record<string, Tactic> = {};
  for (const tactic of Object.values(source)) {
    normalized[tactic.id] = tactic;
  }
  return normalized;
};

const mergeByLabel = (...records: Array<Record<string, Tactic>>): Record<string, Tactic> => {
  const byLabel = new Map<string, Tactic>();

  for (const record of records) {
    for (const tactic of Object.values(record)) {
      const existing = byLabel.get(tactic.label);
      if (!existing) {
        byLabel.set(tactic.label, tactic);
        continue;
      }

      const existingIsPreset = isPresetId(existing.id);
      const candidateIsPreset = isPresetId(tactic.id);

      if (existingIsPreset && !candidateIsPreset) {
        // Keep preset entry to avoid duplicates with previously random IDs.
        continue;
      }

      if (!existingIsPreset && candidateIsPreset) {
        byLabel.set(tactic.label, tactic);
        continue;
      }

      // Prefer the later entry when both are presets or both user-defined.
      byLabel.set(tactic.label, tactic);
    }
  }

  const normalized: Record<string, Tactic> = {};
  for (const tactic of byLabel.values()) {
    normalized[tactic.id] = tactic;
  }
  return normalized;
};

const getMockTactics = (): Record<string, Tactic> => {
  const base = normalizeRecord(PRESET_TACTICS);

  try {
    const data = localStorage.getItem(MOCK_DB_KEY);
    if (data) {
      const stored = normalizeRecord(JSON.parse(data));
      return mergeByLabel(base, stored);
    }
  } catch (e) {
    console.error("Failed to load mock tactics from localStorage", e);
  }

  return mergeByLabel(base);
};

const saveMockTactics = (tactics: Record<string, Tactic>) => {
  try {
    const merged = mergeByLabel(tactics);
    // Persist only non-preset entries so defaults stay in code.
    const userDefined: Record<string, Tactic> = {};
    for (const [id, tactic] of Object.entries(merged)) {
      if (isPresetId(id)) continue;
      userDefined[id] = tactic;
    }
    localStorage.setItem(MOCK_DB_KEY, JSON.stringify(userDefined));
  } catch (e) {
    console.error("Failed to save mock tactics to localStorage", e);
  }
};

const mockBridge: EngineBridge = {
  listTactics: async (): Promise<TacticSummary[]> => {
    const tactics = getMockTactics();
    return Object.values(tactics).map(t => ({
      id: t.id,
      label: t.label,
      in_possession_formation: t.in_possession.formation,
      out_of_possession_formation: t.out_of_possession.formation,
    }));
  },
  loadTactic: async (id: string): Promise<Tactic | null> => {
    const tactics = getMockTactics();
    return tactics[id] ?? null;
  },
  saveTactic: async (tactic: Tactic): Promise<void> => {
    const tactics = getMockTactics();
    tactics[tactic.id] = tactic;
    saveMockTactics(tactics);
  },
  deleteTactic: async (id: string): Promise<void> => {
    const tactics = getMockTactics();
    delete tactics[id];
    saveMockTactics(tactics);
  },
};


// --- App Initialization ---
const mountPoint = document.getElementById('tactics-root');

if (mountPoint) {
  // 1. Create the store with the mock bridge
  const store = new TacticsStore(mockBridge);

  // 2. Create the UI component
  new TacticsSettingsRoot({
    mount: mountPoint,
    store: store,
  });

  // 3. Open the panel by default for the demo
  store.open();
  
  // 4. If no tactic is active, select the first one
  if (!store.snapshot.activeTactic && store.snapshot.tactics.length > 0) {
      store.selectTactic(store.snapshot.tactics[0].id);
  }

} else {
  console.error('Mount point #tactics-root not found.');
}
