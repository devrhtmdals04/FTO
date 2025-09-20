use serde::{Deserialize, Serialize};

use crate::params::{OMEGA_MAX, PLAYER_AMAX, PLAYER_VMAX};
use crate::types::{Footedness, PlayerParams};

#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
pub struct PlayerInput {
    pub pace: u8,
    pub accel: u8,
    pub agility: u8,
    pub stamina: u8,
    pub strength: u8,
    pub first_touch: u8,
    pub passing: u8,
    pub vision: u8,
    pub finishing: u8,
    pub shot_power: u8,
    pub tackling: u8,
    pub interception: u8,
    pub height_cm: u16,
    pub weight_kg: u16,
    pub foot: FootPreference,
    pub weak_foot: u8, // 1..5
}

#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum FootPreference {
    Left,
    Right,
    Both,
}

impl From<FootPreference> for Footedness {
    fn from(value: FootPreference) -> Self {
        match value {
            FootPreference::Left => Footedness::Left,
            FootPreference::Right => Footedness::Right,
            FootPreference::Both => Footedness::Both,
        }
    }
}

pub fn compute_params(inp: &PlayerInput) -> PlayerParams {
    let weak_grade = inp.weak_foot.clamp(1, 5) as f32;
    let weak_scale = (weak_grade - 1.0) / 4.0; // 0.0..1.0

    PlayerParams {
        v_max: scale_stat(inp.pace, 5.2, 8.6).max(PLAYER_VMAX * 0.7),
        a_max: scale_stat(inp.accel, 3.0, 6.0).max(PLAYER_AMAX * 0.6),
        omega_max: scale_stat(inp.agility, 3.0, 8.5).max(OMEGA_MAX * 0.6),
        ctrl_radius: scale_stat(inp.first_touch, 0.4, 1.2),
        ctrl_angle: scale_stat(inp.agility, 0.7, 2.6),
        pass_err_sigma: scale_stat(inv_stat(inp.passing), 0.4, 3.0),
        shot_err_sigma: scale_stat(inv_stat(inp.finishing), 0.5, 3.5),
        pass_speed_max: scale_stat(inp.passing, 16.0, 28.0),
        shot_speed_max: scale_stat(inp.shot_power, 22.0, 35.0),
        tackle_len: scale_stat(inp.tackling, 0.8, 1.5),
        tackle_rad: scale_stat(inp.tackling, 0.35, 0.6),
        foul_base: scale_stat(inv_stat(inp.tackling), 0.08, 0.28),
        collision_push: scale_stat(inp.strength, 0.9, 1.5),
        intercept_react_ms: scale_stat(inv_stat(inp.interception), 85.0, 210.0),
        weak_acc_mult: 0.4 + 0.6 * weak_scale,
        weak_power_mult: 0.35 + 0.65 * weak_scale,
        foot: inp.foot.into(),
    }
}

fn scale_stat(stat: u8, min: f32, max: f32) -> f32 {
    let alpha = (stat as f32).clamp(0.0, 100.0) / 100.0;
    min + (max - min) * alpha
}

fn inv_stat(stat: u8) -> u8 {
    100 - stat
}
