pub const DT: f32 = 1.0 / 60.0; // 60Hz physics/control tick
pub const TICKS_PER_SECOND: u32 = 60;

pub const PITCH_W: f32 = 105.0;
pub const PITCH_H: f32 = 68.0;
pub const GOAL_W: f32 = 7.32;
pub const GOAL_HEIGHT: f32 = 2.44;
pub const R_BODY: f32 = 0.35;

pub const PLAYER_VMAX: f32 = 6.8;
pub const PLAYER_AMAX: f32 = 4.5;
pub const OMEGA_MAX: f32 = 6.0;

pub const G: f32 = 9.81;
pub const MU_AIR: f32 = 0.005;
pub const MU_GROUND: f32 = 0.02;
pub const MU_BOUNCE: f32 = 0.10;
pub const E_Z: f32 = 0.55;
pub const VZ_MIN: f32 = 1.0;

pub const GRID_X: usize = 8;
pub const GRID_Y: usize = 6;
pub const NEIGHBORS: usize = 6;

pub const AI_REEVAL_PERIOD: u32 = 3; // ~20Hz scheduler cadence at 60Hz core tick
pub const INTERCEPT_SAMPLES: usize = 12;
pub const INTERCEPT_TOPK: usize = 3;

pub const SNAPSHOT_POS_SCALE: f32 = 1.0 / 0.05; // 0.05m
pub const SNAPSHOT_VEL_SCALE: f32 = 1.0 / 0.02; // 0.02m/s

pub const TACTICS_COOLDOWN_TICKS: u32 = 10;
