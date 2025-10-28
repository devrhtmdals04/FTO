#[allow(unused_imports)]
use crate::*;

use super::PhaseMode;

// --- 정책/가중치/유틸 공통 ---------------------------------------
#[allow(non_snake_case)]
#[derive(Clone, Copy, Debug, Default)]
pub struct Weights {
    pub wT: f32,
    pub wG: f32,
    pub wR: f32,
    pub wL: f32,
    pub wS: f32,
    pub wF: f32,
    pub wC: f32,
    pub wM: f32,
}

#[derive(Clone, Copy, Debug)]
pub struct PressTriggers {
    pub on_backpass: bool,
    pub on_bad_touch: bool,
    pub on_hospital_pass: bool,
}

#[derive(Clone, Copy, Debug)]
pub struct RolePolicy {
    pub weights: Weights,
    pub pass_risk_max: f32,
    pub theta_shot: f32,
    pub epsilon_base: f32,
    pub min_hold_ms: u16,
    pub press_triggers: PressTriggers,
}

#[derive(Clone, Copy, Debug)]
pub struct GameClock {
    pub minute: u16,
    pub second: u8,
    pub stoppage: u8,
}

#[derive(Clone, Copy, Debug)]
pub struct ScoreState {
    pub us: u8,
    pub them: u8,
}

#[derive(Clone, Copy, Debug)]
pub struct GameState {
    pub clock: GameClock,
    pub score: ScoreState,
    pub phase: PhaseMode,
}
