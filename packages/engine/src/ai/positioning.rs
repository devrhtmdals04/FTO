use crate::params::{PITCH_H, PITCH_W};
use crate::types::{TeamId, Vec2};

use super::perception::PerceptionSnapshot;
use super::phase::TeamPhase;

#[derive(Clone, Copy, Debug)]
pub struct PositioningWeights {
    pub xt: f32,
    pub space: f32,
    pub tactic: f32,
}

impl Default for PositioningWeights {
    fn default() -> Self {
        Self {
            xt: 0.5,
            space: 0.3,
            tactic: 0.2,
        }
    }
}

pub struct PositioningContext<'a> {
    pub anchor: Vec2,
    pub player_index: usize,
    pub team_phase: TeamPhase,
    pub perception: &'a PerceptionSnapshot,
    pub weights: PositioningWeights,
    pub noise_bias: f32,
}

pub fn compute_best_position(ctx: &PositioningContext<'_>) -> Vec2 {
    let perception = ctx.perception;
    let mut xt_target = perception.ball_position;

    if ctx.team_phase.is_attacking() {
        let dir = attack_direction(perception.team_id);
        xt_target += dir * 12.0;
    } else {
        // Stay closer to the anchor while defending.
        xt_target = ctx.anchor;
    }

    let space_dir = perception.suggested_space_direction();
    let space_target = perception.player_position + space_dir * 6.0;

    let tactic_target = ctx.anchor;

    let combined = xt_target * ctx.weights.xt
        + space_target * ctx.weights.space
        + tactic_target * ctx.weights.tactic;
    let denom = ctx.weights.xt + ctx.weights.space + ctx.weights.tactic;
    let mut target = combined / denom.max(1e-3);
    target = apply_noise(target, ctx);
    clamp_to_pitch(target)
}

pub fn apply_noise(mut target: Vec2, ctx: &PositioningContext<'_>) -> Vec2 {
    let status = ctx.perception.positioning_status();
    if status <= 0.0 {
        return target;
    }

    let phase = (ctx.perception.tick as f32 * 0.07 + ctx.player_index as f32 * 1.37).sin();
    let amp = ctx.noise_bias * (0.5 + 0.5 * status);
    let forward = (ctx.perception.ball_position - ctx.perception.player_position).normalize();
    let perp = Vec2::new(-forward.y, forward.x);

    let noise = if perp.norm_squared() > 1e-5 {
        perp * amp * phase
    } else {
        Vec2::new(0.0, amp * phase)
    };

    target += noise;
    target
}

fn attack_direction(team: TeamId) -> Vec2 {
    match team {
        TeamId::Home => Vec2::new(1.0, 0.0),
        TeamId::Away => Vec2::new(-1.0, 0.0),
    }
}

fn clamp_to_pitch(mut pos: Vec2) -> Vec2 {
    let half_w = PITCH_W * 0.5 - 2.0;
    let half_h = PITCH_H * 0.5 - 2.0;
    pos.x = pos.x.clamp(-half_w, half_w);
    pos.y = pos.y.clamp(-half_h, half_h);
    pos
}
