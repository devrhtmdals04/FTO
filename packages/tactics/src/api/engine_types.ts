import type { PlayerDirectiveSet } from '../models/tactic';

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
  press_intensity: number;
  team_width: number;
  build_up: number;
  counter_press: number;
  long_ball_bias: number;
  overlap_fullbacks: number;
  compactness: number;
  player_instructions: EnginePlayerInstruction[];
}
