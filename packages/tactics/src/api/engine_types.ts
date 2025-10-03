// Based on the Rust struct `engine::tactics::Tactics`
export interface EngineTactic {
  line_height: number;
  press_intensity: number;
  team_width: number;
  build_up: number;
  counter_press: number;
  long_ball_bias: number;
  overlap_fullbacks: number;
  compactness: number;
}
