import type {
  EngineCounterAttack,
  EngineCounterPress,
  EnginePlayerInstruction,
  EngineTactic,
  EngineTrapSide,
} from '../api/engine_types';
import {
  createDefaultEngineStatePresets,
  normalizeEngineStatePresets,
  type EngineStateParams,
  type EngineStatePresetMap,
  type EngineTacticStateKey,
} from '../models/engineParams';
import type { PlayerDirectiveSet, PlayerInstruction, Tactic, TransitionStyle } from '../models/tactic';

type LegacyTacticShape = {
  Attacking?: { formation?: string };
  Deffending?: { formation?: string };
  transition?: { on_loss?: TransitionStyle; on_win?: TransitionStyle };
  playerInstructions?: PlayerInstruction[];
  label?: string;
};

const BASE_PARAMS: EngineTactic = {
  formation: 442,
  line_height: 0.5,
  line_att: 0.5,
  block_def: 0.5,
  press_intensity: 0.5,
  press_int: 0.5,
  team_width: 0.5,
  width: 0.5,
  build_up: 0.5,
  counter_press: 0.5,
  counterpress: 'contain',
  counterattack: 'balanced',
  long_ball_bias: 0.5,
  overlap_fullbacks: 0.5,
  compactness: 0.5,
  compact_v: 16,
  compact_h: 0.4,
  tempo: 0.5,
  direct: 0.5,
  risk: 0.4,
  support_d: 11,
  gk_build: 0.5,
  trap_side: 'auto',
  rest_def_shape: '2-3',
  state_presets: createDefaultEngineStatePresets(),
  player_instructions: [],
};

const isFiniteNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

const pickFromStates = <K extends keyof EngineStateParams>(
  states: EngineStatePresetMap,
  key: K,
  order: EngineTacticStateKey[],
): EngineStateParams[K] | undefined => {
  for (const stateKey of order) {
    const entry = states[stateKey];
    if (!entry) continue;
    const value = entry.params[key];
    if (value !== undefined && value !== null) {
      return value;
    }
  }
  return undefined;
};

const applyStateDrivenParams = (params: EngineTactic, states: EngineStatePresetMap): void => {
  const pickNumber = (key: keyof EngineStateParams, order: EngineTacticStateKey[]): number | undefined => {
    const value = pickFromStates(states, key, order);
    return isFiniteNumber(value) ? value : undefined;
  };

  const pickString = (key: keyof EngineStateParams, order: EngineTacticStateKey[]): string | undefined => {
    const value = pickFromStates(states, key, order);
    return typeof value === 'string' ? value : undefined;
  };

  const lineAtt = pickNumber('line_att', ['progression', 'buildUp', 'creation', 'setPlayDefense']);
  if (lineAtt !== undefined) {
    params.line_att = lineAtt;
    params.line_height = Math.max(params.line_height, lineAtt);
  }

  const blockDef = pickNumber('block_def', ['midBlock', 'highBlock', 'lowBlock']);
  if (blockDef !== undefined) {
    params.block_def = blockDef;
  }

  const width = pickNumber('width', ['progression', 'buildUp', 'creation', 'defenseToAttack', 'highBlock', 'midBlock', 'lowBlock']);
  if (width !== undefined) {
    params.width = width;
    params.team_width = width;
  }

  const compactV = pickNumber('compact_v', ['progression', 'buildUp', 'creation', 'attackToDefense', 'highBlock', 'midBlock', 'lowBlock', 'setPlayDefense']);
  if (compactV !== undefined) {
    params.compact_v = compactV;
  }

  const compactH = pickNumber('compact_h', ['progression', 'buildUp', 'creation', 'attackToDefense', 'highBlock', 'midBlock', 'lowBlock', 'setPlayDefense']);
  if (compactH !== undefined) {
    params.compact_h = compactH;
  }

  const tempo = pickNumber('tempo', ['progression', 'buildUp', 'creation', 'defenseToAttack', 'highBlock', 'midBlock', 'lowBlock', 'setPlayAttack']);
  if (tempo !== undefined) {
    params.tempo = tempo;
  }

  const direct = pickNumber('direct', ['progression', 'buildUp', 'creation', 'defenseToAttack', 'highBlock', 'midBlock', 'lowBlock']);
  if (direct !== undefined) {
    params.direct = direct;
  }

  const risk = pickNumber('risk', ['progression', 'buildUp', 'creation', 'defenseToAttack', 'highBlock', 'midBlock', 'lowBlock', 'setPlayAttack']);
  if (risk !== undefined) {
    params.risk = risk;
  }

  const supportD = pickNumber('support_d', ['progression', 'buildUp', 'creation', 'attackToDefense', 'defenseToAttack', 'highBlock', 'midBlock', 'lowBlock']);
  if (supportD !== undefined) {
    params.support_d = supportD;
  }

  const gkBuild = pickNumber('gk_build', ['progression', 'buildUp', 'creation']);
  if (gkBuild !== undefined) {
    params.gk_build = gkBuild;
  }

  const pressInt = pickNumber('press_int', ['attackToDefense', 'highBlock', 'midBlock', 'lowBlock', 'progression', 'buildUp', 'creation']);
  if (pressInt !== undefined) {
    params.press_int = pressInt;
    params.press_intensity = pressInt;
    params.counter_press = pressInt;
  }

  const trapSide = pickString('trap_side', ['attackToDefense', 'highBlock', 'midBlock', 'lowBlock', 'progression', 'buildUp']);
  if (trapSide) {
    params.trap_side = trapSide as EngineTrapSide;
  }

  const counterpress = pickString('counterpress', ['attackToDefense', 'highBlock', 'midBlock', 'lowBlock', 'progression', 'buildUp']);
  if (counterpress) {
    params.counterpress = counterpress as EngineCounterPress;
  }

  const counterattack = pickString('counterattack', ['defenseToAttack', 'progression', 'buildUp', 'creation', 'highBlock', 'midBlock', 'lowBlock', 'setPlayDefense']);
  if (counterattack) {
    params.counterattack = counterattack as EngineCounterAttack;
  }

  const restDefShape = pickString('rest_def_shape', ['progression', 'buildUp', 'creation', 'defenseToAttack', 'setPlayAttack']);
  if (restDefShape) {
    params.rest_def_shape = restDefShape;
  }
};

const cloneDirectiveSet = (directives?: PlayerDirectiveSet): PlayerDirectiveSet => {
  if (!directives) return {};
  const { marking, pressing, positioning } = directives;
  return {
    ...(marking ? { marking: { ...marking } as typeof marking } : {}),
    ...(pressing ? { pressing: { ...pressing } } : {}),
    ...(positioning ? { positioning: { ...positioning } as typeof positioning } : {}),
  };
};

const toEnginePlayerInstructions = (
  instructions: PlayerInstruction[] | undefined,
): EnginePlayerInstruction[] => {
  if (!instructions || instructions.length === 0) return [];
  return instructions.map((instruction) => ({
    player_index: instruction.playerIndex,
    directives: cloneDirectiveSet(instruction.directives),
  }));
};

const parseFormationCode = (formation: string): number => {
  const digits = formation.replace(/[^\d]/g, '');
  if (digits.length === 0) return 0;
  return Number(digits);
};

/**
 * Translates a high-level Tactic object into low-level engine parameters.
 * @param tactic The Tactic object.
 * @returns EngineTactic object with values from 0 to 1.
 */
export function tacticToEngineParams(tactic: Tactic): EngineTactic {
  const legacy = tactic as unknown as LegacyTacticShape;
  const params: EngineTactic = {
    ...BASE_PARAMS,
    player_instructions: [],
  };

  const formationString =
    legacy.Attacking?.formation ??
    tactic.inPossession?.buildUp?.formation ??
    tactic.inPossession?.progression?.formation ??
    tactic.inPossession?.creation?.formation ??
    legacy.Deffending?.formation ??
    tactic.outOfPossession?.highBlock?.formation ??
    tactic.outOfPossession?.midBlock?.formation ??
    tactic.outOfPossession?.lowBlock?.formation;

  if (formationString) {
    params.formation = parseFormationCode(formationString);
  }

  // This is a very simple placeholder mapping.
  // It can be expanded with more sophisticated logic.

  // Example: Transition style affects pressing
  const onLoss = (tactic.transitions?.on_loss ?? legacy.transition?.on_loss) as TransitionStyle | undefined;
  if (onLoss === 'press_on_heavy_touch') {
    params.press_intensity = 0.8;
    params.counter_press = 0.8;
    params.press_int = params.press_intensity;
    params.counterpress = 'hunt';
  } else {
    params.press_intensity = 0.3;
    params.counter_press = 0.3;
    params.press_int = params.press_intensity;
    params.counterpress = 'contain';
  }

  const onWin = tactic.transitions?.on_win ?? legacy.transition?.on_win;
  if (onWin === 'press_on_heavy_touch') {
    params.counterattack = 'fast';
  } else if (onWin === 'fall_back') {
    params.counterattack = 'secure';
  }

  // Example: A very basic mapping from formation to line height
  const formation = formationString ?? '';
  if (formation.startsWith('3')) {
    // e.g., 3-4-3, 3-5-2
    params.line_height = 0.7; // More attacking
    params.line_att = Math.max(params.line_att, 0.65);
    params.overlap_fullbacks = 0.7;
  } else if (formation.startsWith('5')) {
    // e.g., 5-3-2, 5-4-1
    params.line_height = 0.3; // More defensive
    params.overlap_fullbacks = 0.2;
    params.line_att = Math.min(params.line_att, 0.35);
  }

  // The label of the tactic can also influence the params
  const tacticLabel = tactic.label ?? legacy.label ?? '';
  switch (tacticLabel) {
    case 'Attacking':
      params.line_height = Math.max(params.line_height, 0.7);
      params.line_att = Math.max(params.line_att, 0.7);
      params.build_up = 0.8;
      params.team_width = 0.6;
      params.width = Math.max(params.width, 0.6);
      params.direct = Math.max(params.direct, 0.65);
      params.risk = Math.max(params.risk, 0.6);
      params.counterattack = 'fast';
      break;
    case 'Defensive':
      params.line_height = Math.min(params.line_height, 0.3);
      params.line_att = Math.min(params.line_att, 0.4);
      params.press_intensity = Math.min(params.press_intensity, 0.4);
      params.team_width = 0.4;
      params.width = Math.min(params.width, 0.45);
      params.risk = Math.min(params.risk, 0.35);
      break;
  }

  params.press_int = params.press_intensity;
  params.width = params.team_width;

  const midBlock = tactic.outOfPossession?.midBlock;
  if (midBlock) {
    params.block_def = midBlock.defensiveLine;
    params.width = Math.max(params.width, midBlock.width);
  }

  const buildUp = tactic.inPossession?.buildUp;
  if (buildUp) {
    params.line_att = Math.max(params.line_att, buildUp.defensiveLine);
    params.width = Math.max(params.width, buildUp.width);
  }

  const engineStatePresets = normalizeEngineStatePresets((tactic as unknown as { engineStatePresets?: unknown }).engineStatePresets);
  applyStateDrivenParams(params, engineStatePresets);

  params.team_width = params.width;
  params.press_intensity = params.press_int;
  params.counter_press = params.press_int;
  params.state_presets = engineStatePresets;

  const instructions = tactic.playerInstructions ?? legacy.playerInstructions;
  params.player_instructions = toEnginePlayerInstructions(instructions);

  return params;
}
