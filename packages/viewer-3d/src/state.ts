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
  home_team_phase: number;
  away_team_phase: number;
}

export interface PlayerInput20 {
  player_id: number;
  name: string;
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
  foot: 'L' | 'R';
  weak_foot: number;
}

export type DetailedPlayerRole =
  | 'GK'
  | 'LB'
  | 'LCB'
  | 'RCB'
  | 'RB'
  | 'LM'
  | 'LCM'
  | 'RCM'
  | 'RM'
  | 'LF'
  | 'RF'
  | 'CB'
  | 'CDM'
  | 'CAM'
  | 'ST'
  | 'LW'
  | 'RW';

export interface PhaseFocus {
  width: number;
  depth: number;
  tempo: number;
  pressure: number;
}

export interface PhaseDirective {
  shape?: string | null;
  focus: PhaseFocus;
  notes?: string | null;
}

export interface QuantifiedTactics {
  version: number;
  base_attacking_shape?: string | null;
  base_defending_shape?: string | null;
  set_piece_attack_shape?: string | null;
  set_piece_defence_shape?: string | null;
  phase_directives: Record<string, PhaseDirective>;
  meta: Record<string, number>;
}

export interface PlayerInstruction {
  risk_intensity: number;
  defense_participation: number;
  attacking_participation: number;
  mark_man_id: number | null;
  buildup_intensity: number | null;
  cover_radius: number | null;
}

export interface PlayerParams {
  v_max: number;
  a_max: number;
  omega_max: number;
  ctrl_radius: number;
  ctrl_angle_deg: number;
  pass_err_sigma: number;
  shot_err_sigma: number;
  pass_speed_max: number;
  shot_speed_max: number;
  tackle_len: number;
  tackle_rad: number;
  foul_base: number;
  collision_push: number;
  intercept_react_ms: number;
  weak_acc_mult: number;
  weak_power_mult: number;
  foot: 'L' | 'R';
  stamina_max: number;
  stamina_recovery: number;
  stamina_move_cost: number;
  height_m: number;
  mass_kg: number;
  bmi: number;
  aerial_ctrl_rad: number;
  jump_gain_m: number;
  heading_err_sigma_deg: number;
  heading_power_mult: number;
  jump_fatigue_floor: number;
  vis_scale: number;
  collider_radius_opt: number;
  heading: number;
  strength: number;
}

export interface PlayerClassJson {
  index: number;
  team: number;
  player_id: number;
  name: string;
  role: DetailedPlayerRole;
  role_id: number;
  quantified_tactics: QuantifiedTactics;
  personal_instructions?: PlayerInstruction | null;
  params: PlayerParams;
  base_stats: PlayerInput20;
}

export interface PlayerProfile extends PlayerInput20 {
  index: number;
  team: number;
  ctrl_radius: number;
  role: DetailedPlayerRole;
  roleId: number;
  quantifiedTactics: QuantifiedTactics;
  personalInstructions: PlayerInstruction | null;
  params: PlayerParams;
}

// (옵션) 엔진 애니 힌트 이벤트 ABI (엔진 미지원이면 사용 안 함)
export type AnimEventKind = "KickL"|"KickR"|"Header"|"Trap"|"Tackle";
export interface AnimEvent { tick: number; pid: number; kind: AnimEventKind; a?: number; b?: number; }
