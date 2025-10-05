import type { Tactic } from '../models/tactic';

// Use Vite's glob import to dynamically get all preset modules.
const modules = import.meta.glob('./*.ts', { eager: true });

export const PRESET_TACTICS: Record<string, Tactic> = {};

// Iterate over the modules and build the PRESET_TACTICS object.
for (const path in modules) {
  if (path === './productor.ts') continue;

  const mod = modules[path];
  if (!mod || typeof mod !== 'object' || !('default' in mod)) continue;

  const tactic = (mod as { default?: Tactic }).default;
  if (tactic && tactic.label) {
    // Use the tactic's label as the key, which is more robust than using the filename.
    // e.g., a tactic with label "Attacking" will be PRESET_TACTICS['Attacking']
    PRESET_TACTICS[tactic.label] = tactic;
  }
}
