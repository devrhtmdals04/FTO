import type { Position } from '../../tactics/src/models/marker';

export type Foot = 'L' | 'R';

export interface PlayerProfile {
  name: string;
  position: Position;
  pace: number;
  accel: number;
  agility: number;
  stamina: number;
  strength: number;
  first_touch: number;
  passing: number;
  vision: number;
  finishing: number;
  shot_power: number;
  tackling: number;
  interception: number;
  heading: number;
  jumping: number;
  height_cm: number;
  weight_kg: number;
  foot: Foot;
  weak_foot: number;
}
