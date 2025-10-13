import type { CustomFormationSlot } from '../models/tactic';
import { getFormationSlots, type FormationRole } from '../presets/formationPresets';

const FORMATION_GRID_COLS = 5;
const FORMATION_GRID_ROWS = 6;

const DEF_TITLES: Record<number, readonly string[]> = {
  1: ['CB'],
  2: ['LCB', 'RCB'],
  3: ['LCB', 'CB', 'RCB'],
  4: ['LB', 'LCB', 'RCB', 'RB'],
  5: ['LWB', 'LCB', 'CB', 'RCB', 'RWB'],
};

const MF_TITLES: Record<number, readonly string[]> = {
  1: ['CM'],
  2: ['LCM', 'RCM'],
  3: ['LCM', 'CM', 'RCM'],
  4: ['LM', 'LCM', 'RCM', 'RM'],
  5: ['LDM', 'LCM', 'CM', 'RCM', 'RDM'],
};

const FW_TITLES: Record<number, readonly string[]> = {
  1: ['ST'],
  2: ['LST', 'RST'],
  3: ['LW', 'ST', 'RW'],
  4: ['LW', 'LST', 'RST', 'RW'],
};

const ROLE_FALLBACK: Record<FormationRole, string> = {
  GK: 'GK',
  DF: 'DF',
  MF: 'MF',
  FW: 'FW',
};

export interface SlotLike {
  index: number;
  x: number;
  role: FormationRole;
}

export function computeRoleLabels(slots: readonly SlotLike[]): Map<number, string> {
  const grouped = new Map<FormationRole, SlotLike[]>();
  for (const slot of slots) {
    if (!grouped.has(slot.role)) {
      grouped.set(slot.role, []);
    }
    grouped.get(slot.role)!.push(slot);
  }

  const labels = new Map<number, string>();
  grouped.forEach((groupSlots, role) => {
    const sorted = [...groupSlots].sort((a, b) => a.x - b.x);
    const total = sorted.length;
    sorted.forEach((slot, idx) => {
      labels.set(slot.index, deriveRoleLabel(role, idx, total));
    });
  });
  return labels;
}

export function deriveRoleLabel(role: FormationRole, order: number, total: number): string {
  if (role === 'GK') return 'GK';

  const mapping = role === 'DF' ? DEF_TITLES : role === 'MF' ? MF_TITLES : FW_TITLES;
  const titles = mapping[total];
  if (titles && titles[order]) {
    return titles[order];
  }

  const prefix = ROLE_FALLBACK[role] ?? 'POS';
  return `${prefix}${order + 1}`;
}

export function computeRoleLabelsForPhase(
  formation: string,
  customFormation: CustomFormationSlot[] | undefined,
): Map<number, string> {
  const slots: SlotLike[] = customFormation && customFormation.length > 0
    ? customFormation.map((slot, index) => {
        const gridColumn = slot.gridColumn ?? Math.max(0, Math.min(FORMATION_GRID_COLS - 1, Math.round(slot.x * FORMATION_GRID_COLS - 0.5)));
        const x = (gridColumn + 0.5) / FORMATION_GRID_COLS;
        return { index, x, role: slot.role as FormationRole };
      })
    : getFormationSlots(formation).map(slot => {
        const gridColumn = Math.max(0, Math.min(FORMATION_GRID_COLS - 1, Math.round(slot.x * FORMATION_GRID_COLS - 0.5)));
        const x = (gridColumn + 0.5) / FORMATION_GRID_COLS;
        return { index: slot.index, x, role: slot.role };
      });

  return computeRoleLabels(slots);
}
