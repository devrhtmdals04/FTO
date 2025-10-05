export type Foot = 'L' | 'R';
export type TeamId = 0 | 1;
export type Position = 'FW' | 'MF' | 'DF' | 'GK';

// This is the detailed player profile, matching the data from the engine.
export interface PlayerProfile {
  index?: number; // Optional index, can be assigned dynamically
  team?: TeamId; // Optional team, can be assigned dynamically
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
  ctrl_radius?: number; // Optional, from viewer-3d
  number?: number;
  nationality?: string;
  photoUrl?: string;
  traits?: string[];
}

// This is the simplified player model used for the 2D tactics board markers.
export interface PlayerStats {
    PAC: number;
    SHO: number;
    PAS: number;
    DRI: number;
    DEF: number;
    PHY: number;
}

export interface Player {
    id: number;
    number: number;
    name: string;
    position: Position;
    stats: PlayerStats;
    x?: number;
    y?: number;
}