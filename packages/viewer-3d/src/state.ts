export type TeamId = 0 | 1;

export interface BallView {
  x: number;
  y: number;
  z: number;
}

export interface PlayerView {
  x: number;
  y: number;
  h: [number, number];
  vis: number;
  team: number;
  has_ball: boolean;
  state: number;
  role: number;
}

export interface SimView {
  tick: number;
  ball: BallView;
  players: PlayerView[];
}

export interface PlayerProfile {
  index: number;
  name: string;
  team: number;
  pace: number;
  accel: number;
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
  foot: 'L' | 'R';
  weak_foot: number;
  ctrl_radius: number;
}

// (옵션) 엔진 애니 힌트 이벤트 ABI (엔진 미지원이면 사용 안 함)
export type AnimEventKind = "KickL"|"KickR"|"Header"|"Trap"|"Tackle";
export interface AnimEvent { tick: number; pid: number; kind: AnimEventKind; a?: number; b?: number; }
