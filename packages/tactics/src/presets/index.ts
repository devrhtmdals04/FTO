import type { EngineTactic } from '../api/engine_types';

export const PRESET_TACTICS: Record<string, EngineTactic> = {
  Balanced: {
    line_height: 0.5,
    press_intensity: 0.5,
    team_width: 0.5,
    build_up: 0.5,
    counter_press: 0.5,
    long_ball_bias: 0.5,
    overlap_fullbacks: 0.5,
    compactness: 0.5,
  },
  Attacking: {
    line_height: 0.7,
    press_intensity: 0.8,
    team_width: 0.6,
    build_up: 0.8,
    counter_press: 0.7,
    long_ball_bias: 0.3,
    overlap_fullbacks: 0.8,
    compactness: 0.4,
  },
  Defensive: {
    line_height: 0.3,
    press_intensity: 0.3,
    team_width: 0.4,
    build_up: 0.3,
    counter_press: 0.3,
    long_ball_bias: 0.7,
    overlap_fullbacks: 0.2,
    compactness: 0.7,
  },
};
