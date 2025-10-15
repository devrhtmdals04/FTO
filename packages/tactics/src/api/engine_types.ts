import type { PlayerDirectiveSet } from '../models/tactic';
import type {
  EngineCounterAttack,
  EngineCounterPress,
  EngineStatePresetMap,
  EngineTrapSide,
} from '../models/engineParams';

export type {
  EngineCounterAttack,
  EngineCounterPress,
  EngineStatePresetMap,
  EngineTrapSide,
} from '../models/engineParams';

// Based on the Rust struct `engine::tactics::Tactics`
export interface EnginePlayerInstruction {
  /**
   * 엔진에서 사용하는 선수 인덱스 (0-based)
   */
  player_index: number;
  /**
   * 표준화된 개인 지침
   */
  directives: PlayerDirectiveSet;
}

export interface EngineTactic {
  formation: number;
  line_height: number;
  line_att: number;
  block_def: number;
  press_intensity: number;
  press_int: number;
  team_width: number;
  width: number;
  build_up: number;
  counter_press: number;
  counterpress: EngineCounterPress;
  counterattack: EngineCounterAttack;
  long_ball_bias: number;
  overlap_fullbacks: number;
  compactness: number;
  compact_v: number;
  compact_h: number;
  tempo: number;
  direct: number;
  risk: number;
  support_d: number;
  gk_build: number;
  trap_side: EngineTrapSide;
  rest_def_shape: string;
  state_presets: EngineStatePresetMap;
  player_instructions: EnginePlayerInstruction[];
}
