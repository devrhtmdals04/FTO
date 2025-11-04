use crate::ai::Vec2;
use crate::ai::perception;

use super::factors::{
    angle_diff, PassFactors, PLAYER_SPEED_MPS, TURN_RATE_RAD_PER_MS, GATE_STEP_MS,
};
use super::micro::MicroActionKind;

pub fn predict_effect(
    action: &MicroActionKind,
    s: &perception::PerceptionSnapshot,
    o: &perception::PassOption,
) -> PassFactors {
    match action {
        MicroActionKind::Orient { aim } => {
            let facing = Vec2::new(s.me.body_angle.cos(), s.me.body_angle.sin());
            let desired = (*aim - s.me.pos).normalize();
            let ang = angle_between(facing, desired);
            PassFactors {
                orient_gap: -(ang / TURN_RATE_RAD_PER_MS) - 0.02,
                ..PassFactors::default()
            }
        }
        MicroActionKind::LateralCarry { dir, dur_ms } => {
            let offset = dir.normalize()
                * (PLAYER_SPEED_MPS * (*dur_ms as f32) / 1000.0).max(0.0);
            let est = estimate_lane_after_offset(s, o, offset);
            PassFactors {
                lane_gap: o.p_intercept - est.p_intercept,
                press_gap: -0.04,
                ..PassFactors::default()
            }
        }
        MicroActionKind::Shield { dur_ms, .. } => PassFactors {
            press_gap: -(0.0015 * (*dur_ms as f32)),
            orient_gap: -0.01,
            ..PassFactors::default()
        },
        MicroActionKind::Delay { dur_ms } => PassFactors {
            gate_gap_ms: -(*dur_ms),
            offs_gap: -(0.001 * (*dur_ms as f32)),
            ..PassFactors::default()
        },
        MicroActionKind::GateWatch { .. } => PassFactors {
            gate_gap_ms: -GATE_STEP_MS,
            ..PassFactors::default()
        },
        MicroActionKind::PassRequest { .. } => PassFactors {
            recv_gap: -0.08,
            ..PassFactors::default()
        },
        MicroActionKind::TriggerRun { .. } => PassFactors {
            recv_gap: -0.05,
            offs_gap: -0.03,
            ..PassFactors::default()
        },
        MicroActionKind::MicroHold { dur_ms } => PassFactors {
            kick_gap: if *dur_ms >= 120 { -1.0 } else { -0.2 },
            ..PassFactors::default()
        },
    }
}

fn estimate_lane_after_offset(
    _s: &perception::PerceptionSnapshot,
    o: &perception::PassOption,
    offset: Vec2,
) -> LaneEstimate {
    // Very coarse approximation: assume horizontal offset reduces intercept chance
    // proportionally to the lateral movement.
    let mut est = LaneEstimate {
        p_intercept: o.p_intercept,
    };
    let lateral_gain = (offset.norm() * 0.05).min(0.25);
    est.p_intercept = (est.p_intercept - lateral_gain).max(0.0);
    est
}

struct LaneEstimate {
    pub p_intercept: f32,
}

fn angle_between(a: Vec2, b: Vec2) -> f32 {
    let a_ang = a.y.atan2(a.x);
    let b_ang = b.y.atan2(b.x);
    angle_diff(b_ang - a_ang)
}

