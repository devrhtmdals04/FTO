import { TacticsSettingsRoot, TacticsStore, Tactic, EngineBridge, TacticSummary, PRESET_TACTICS, PitchDisplay } from '../src/index';

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
      in_possession_formation: t.Attacking.formation,
      out_of_possession_formation: t.Deffending.formation,
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
const leftPanelMount = document.getElementById('left-panel-container');
const presetListMount = document.getElementById('preset-selection-container');
const pitchPanelMount = document.getElementById('pitch-container');
const rightPanelMount = document.getElementById('right-panel-container');

if (leftPanelMount && presetListMount && pitchPanelMount && rightPanelMount) {
  // 1. Create the store with the mock bridge
  const store = new TacticsStore(mockBridge);

  // 2. Mount the editor panel on the right
  new TacticsSettingsRoot({
    mount: rightPanelMount,
    store: store,
    listMount: presetListMount,
  });

  // 3. Mount and manage the main pitch display in the center
  let mainPitch: PitchDisplay | null = null;
  store.subscribe(state => {
    if (state.activeTactic) {
      mainPitch = new PitchDisplay({
        mount: pitchPanelMount,
        tactic: state.activeTactic,
        mode: state.displayMode,
      });
    } else {
      pitchPanelMount.innerHTML = '<p>Select a tactic to see the pitch display.</p>';
      mainPitch = null;
    }
  });

  // 4. Mount a placeholder for the left panel
  leftPanelMount.innerHTML = '<h2>Roster & Team Style (Placeholder)</h2>';

  // 5. Open the panel and load initial data
  store.openAndEnsureTactic();

} else {
  console.error('One or more mount points not found.');
}
