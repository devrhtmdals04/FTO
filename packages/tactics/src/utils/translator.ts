import type { EnginePlayerInstruction, EngineTactic } from '../api/engine_types';
import type { PlayerDirectiveSet, PlayerInstruction, Tactic } from '../models/tactic';

const BASE_PARAMS: EngineTactic = {
  formation: 442,
  line_height: 0.5,
  press_intensity: 0.5,
  team_width: 0.5,
  build_up: 0.5,
  counter_press: 0.5,
  long_ball_bias: 0.5,
  overlap_fullbacks: 0.5,
  compactness: 0.5,
  player_instructions: [],
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
  const params: EngineTactic = {
    ...BASE_PARAMS,
    player_instructions: [],
  };

  params.formation = parseFormationCode(tactic.Attacking.formation);

  // This is a very simple placeholder mapping.
  // It can be expanded with more sophisticated logic.

  // Example: Transition style affects pressing
  if (tactic.transition.on_loss === 'press_on_heavy_touch') {
    params.press_intensity = 0.8;
    params.counter_press = 0.8;
  } else { // 'fall_back'
    params.press_intensity = 0.3;
    params.counter_press = 0.3;
  }

  // Example: A very basic mapping from formation to line height
  const formation = tactic.Attacking.formation;
  if (formation.startsWith('3')) {
    // e.g., 3-4-3, 3-5-2
    params.line_height = 0.7; // More attacking
    params.overlap_fullbacks = 0.7;
  } else if (formation.startsWith('5')) {
    // e.g., 5-3-2, 5-4-1
    params.line_height = 0.3; // More defensive
    params.overlap_fullbacks = 0.2;
  }

  // The label of the tactic can also influence the params
  switch (tactic.label) {
    case 'Attacking':
      params.line_height = Math.max(params.line_height, 0.7);
      params.build_up = 0.8;
      params.team_width = 0.6;
      break;
    case 'Defensive':
      params.line_height = Math.min(params.line_height, 0.3);
      params.press_intensity = Math.min(params.press_intensity, 0.4);
      params.team_width = 0.4;
      break;
  }

  params.player_instructions = toEnginePlayerInstructions(tactic.playerInstructions);

  return params;
}
