import type { Tactic } from '../models/tactic';

// Use Vite's glob import to dynamically get all preset modules.
const modules = import.meta.glob('./*.ts', { eager: true, import: 'default' });

export const PRESET_TACTICS: Record<string, Tactic> = {};

// Iterate over the modules and build the PRESET_TACTICS object.
for (const path in modules) {
  // Exclude this index.ts file itself
  if (path === './index.ts') continue;

  const tactic = modules[path] as Tactic;
  if (tactic && tactic.label) {
    // Use the tactic's label as the key, which is more robust than using the filename.
    // e.g., a tactic with label "Attacking" will be PRESET_TACTICS['Attacking']
    PRESET_TACTICS[tactic.label] = tactic;
  }
}
