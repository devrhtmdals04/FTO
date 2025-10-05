export interface FormationPreset {
  readonly value: string;
  readonly label: string;
  readonly description?: string;
  readonly lines: number[];
}

export type FormationRole = 'GK' | 'DF' | 'MF' | 'FW';

export interface FormationSlot {
  readonly index: number;
  readonly x: number; // normalized 0..1 across pitch width
  readonly y: number; // normalized 0..1 across pitch height
  readonly role: FormationRole;
}

const DEFAULT_FORMATION = '4-4-2';
const DEFAULT_LINES = [4, 4, 2];

const normalizeFormationValue = (raw: string): string => {
  const trimmed = raw.replace(/\s+/g, '');
  if (!trimmed) {
    return DEFAULT_FORMATION;
  }

  if (/^\d+$/.test(trimmed)) {
    return trimmed.split('').join('-');
  }

  if (/^\d+(?:-\d+)*$/.test(trimmed)) {
    return trimmed;
  }

  return DEFAULT_FORMATION;
};

const parseLines = (formation: string): number[] => {
  const normalized = normalizeFormationValue(formation);
  const parts = normalized
    .split('-')
    .map(part => Number.parseInt(part, 10))
    .filter(num => Number.isFinite(num) && num > 0);

  return parts.length > 0 ? parts : DEFAULT_LINES;
};

const determineRole = (lineIndex: number, totalLines: number): FormationRole => {
  if (lineIndex === 0) return 'DF';
  if (lineIndex === totalLines - 1) return 'FW';
  return 'MF';
};

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

const createLineXPositions = (count: number): number[] => {
  if (count <= 0) return [];
  if (count === 1) return [0.5];

  const span = clamp(0.3 + count * 0.1, 0.4, 0.8);
  const start = 0.5 - span / 2;
  const step = span / (count - 1);

  return Array.from({ length: count }, (_, index) => clamp(start + step * index, 0.08, 0.92));
};

const createLineYPositions = (lineCount: number): number[] => {
  if (lineCount <= 0) return [];
  if (lineCount === 1) return [0.42];

  const bottom = 0.78;
  const top = 0.18;
  const step = (bottom - top) / (lineCount - 1);

  return Array.from({ length: lineCount }, (_, index) => clamp(bottom - step * index, top, bottom));
};

export const getFormationSlots = (formation: string): FormationSlot[] => {
  const lines = parseLines(formation);
  const slots: FormationSlot[] = [{ index: 0, x: 0.5, y: 0.92, role: 'GK' }];

  const yPositions = createLineYPositions(lines.length);
  let slotIndex = 1;

  lines.forEach((count, lineIndex) => {
    const xs = createLineXPositions(count);
    const y = yPositions[lineIndex] ?? 0.5;
    const role = determineRole(lineIndex, lines.length);

    xs.forEach(x => {
      slots.push({ index: slotIndex++, x, y, role });
    });
  });

  return slots;
};

export const FORMATION_PRESETS: readonly FormationPreset[] = [
  { value: '4-3-3', label: '4-3-3', lines: parseLines('4-3-3') },
  { value: '4-4-2', label: '4-4-2', lines: parseLines('4-4-2') },
  { value: '4-2-3-1', label: '4-2-3-1', lines: parseLines('4-2-3-1') },
  { value: '3-4-3', label: '3-4-3', lines: parseLines('3-4-3') },
  { value: '3-5-2', label: '3-5-2', lines: parseLines('3-5-2') },
  { value: '4-1-4-1', label: '4-1-4-1', lines: parseLines('4-1-4-1') },
  { value: '4-1-2-1-2', label: '4-1-2-1-2', lines: parseLines('4-1-2-1-2') },
  { value: '5-3-2', label: '5-3-2', lines: parseLines('5-3-2') },
  { value: '5-4-1', label: '5-4-1', lines: parseLines('5-4-1') },
] as const;

export const FORMATION_PRESET_VALUES = new Set(FORMATION_PRESETS.map(preset => preset.value));

export const normalizeFormation = (formation: string): string => normalizeFormationValue(formation);
