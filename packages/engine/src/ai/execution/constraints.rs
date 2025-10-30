//! Low-level emission constraints for ball release.
//!
//! This module encodes coarse "body cone" limits so that the execution
//! runtime can decide whether a pass or shot is mechanically feasible on the
//! current tick.  The goal is to prevent unrealistic immediate releases (e.g.
//! firing the ball 150° behind the player without any run-up) and to provide a
//! simple penalty model for off-axis touches.

use core::f32::consts::{FRAC_PI_2, PI};

/// Player skill slice relevant for emission decisions.
#[derive(Clone, Copy, Debug, Default)]
pub struct SkillProfile {
    /// Normalised passing/first-touch ability in 0..1.
    pub pass_control: f32,
    /// Whether we are effectively on the weak foot for this release.
    pub weak_foot: bool,
    /// Current stamina ratio (0..1).
    pub stamina: f32,
}

impl SkillProfile {
    pub fn clamp(mut self) -> Self {
        self.pass_control = self.pass_control.clamp(0.0, 1.0);
        self.stamina = self.stamina.clamp(0.0, 1.0);
        self
    }
}

/// Half-angle specifications for the different release cones.
#[derive(Clone, Copy, Debug)]
pub struct Cones {
    pub forward: f32,
    pub side: f32,
    pub side_band: f32,
    pub backheel: f32,
}

impl Cones {
    fn clamp(mut self) -> Self {
        const MIN_RAD: f32 = 5.0_f32.to_radians();
        self.forward = self.forward.max(MIN_RAD);
        self.side = self.side.max(MIN_RAD);
        self.backheel = self.backheel.max(MIN_RAD);
        self
    }
}

/// Penalties applied when kicking near the edge of a cone.
#[derive(Clone, Copy, Debug, Default)]
pub struct EmissionPenalty {
    pub power_scale: f32,
    pub angle_jitter: f32,
}

/// Chosen emission surface.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum EmissionSurface {
    Forward,
    SideLeft,
    SideRight,
    Backheel,
}

/// Finalised evaluation result when we can emit immediately.
#[derive(Clone, Copy, Debug)]
pub struct EmissionOutcome {
    pub surface: EmissionSurface,
    pub penalty: EmissionPenalty,
    /// Absolute angle (radians) we expect to emit along.
    pub target_angle: f32,
    /// Remaining mismatch after any pre-turn accounted for.
    pub residual: f32,
}

/// Decision returned by the constraint evaluator.
#[derive(Clone, Copy, Debug)]
pub enum EmissionDecision {
    Emit(EmissionOutcome),
    NeedTurn { add_ticks: u8 },
}

/// Input snapshot for the constraint evaluation.
#[derive(Clone, Copy, Debug)]
pub struct EmissionInput {
    pub body_angle: f32,
    pub target_angle: f32,
    pub runup_ticks: u8,
    pub dt: f32,
    pub turn_rate_max: f32,
    pub speed: f32,
    pub skill: SkillProfile,
}

pub fn tuned_cones(skill: SkillProfile) -> Cones {
    let mut base_forward = 35.0_f32.to_radians();
    let mut base_side = 25.0_f32.to_radians();
    let side_band = 90.0_f32.to_radians();
    let mut base_backheel = 30.0_f32.to_radians();

    let skill = skill.clamp();
    let pass_bonus = skill.pass_control;
    let stamina_penalty = (1.0 - skill.stamina).max(0.0);

    // Skill widens the effective cone slightly.
    base_forward += (5.0 * pass_bonus).to_radians();
    base_side += (5.0 * pass_bonus).to_radians();
    base_backheel += (4.0 * pass_bonus).to_radians();

    // Fatigue tightens control.
    base_forward -= (8.0 * stamina_penalty).to_radians();
    base_side -= (6.0 * stamina_penalty).to_radians();
    base_backheel -= (8.0 * stamina_penalty).to_radians();

    if skill.weak_foot {
        base_forward -= 6.0_f32.to_radians();
        base_side -= 4.0_f32.to_radians();
        base_backheel -= 8.0_f32.to_radians();
    }

    Cones {
        forward: base_forward,
        side: base_side,
        side_band,
        backheel: base_backheel,
    }
    .clamp()
}

pub fn evaluate(input: &EmissionInput) -> EmissionDecision {
    let cones = tuned_cones(input.skill);

    let delta = wrap_angle(input.target_angle - input.body_angle);
    let max_pre_turn = (input.turn_rate_max.max(0.0)) * input.runup_ticks as f32 * input.dt;
    let pre_turn = delta.signum() * max_pre_turn.min(delta.abs());
    let delta_res = wrap_angle(delta - pre_turn);

    // Try forward release first.
    if delta_res.abs() <= cones.forward {
        let penalty = penalty_forward(delta_res, cones.forward);
        return EmissionDecision::Emit(EmissionOutcome {
            surface: EmissionSurface::Forward,
            penalty,
            target_angle: input.target_angle,
            residual: delta_res,
        });
    }

    // Side releases (left/right around ±90°).
    let left_delta = wrap_angle(delta_res - cones.side_band);
    if left_delta.abs() <= cones.side {
        let penalty = penalty_side(left_delta, cones.side);
        return EmissionDecision::Emit(EmissionOutcome {
            surface: EmissionSurface::SideLeft,
            penalty,
            target_angle: input.target_angle,
            residual: left_delta,
        });
    }

    let right_delta = wrap_angle(delta_res + cones.side_band);
    if right_delta.abs() <= cones.side {
        let penalty = penalty_side(right_delta, cones.side);
        return EmissionDecision::Emit(EmissionOutcome {
            surface: EmissionSurface::SideRight,
            penalty,
            target_angle: input.target_angle,
            residual: right_delta,
        });
    }

    // Backheel requires low speed.
    const BACKHEEL_SPEED_GUARD: f32 = 3.0;
    if input.speed <= BACKHEEL_SPEED_GUARD {
        let back_delta = normalise_pi(delta_res);
        let to_backheel = wrap_angle(back_delta - PI * back_delta.signum());
        if to_backheel.abs() <= cones.backheel {
            let penalty = penalty_backheel(to_backheel, cones.backheel);
            return EmissionDecision::Emit(EmissionOutcome {
                surface: EmissionSurface::Backheel,
                penalty,
                target_angle: input.target_angle,
                residual: to_backheel,
            });
        }
    }

    // Not currently feasible — estimate additional ticks required to turn.
    let needed = required_rotation(delta_res, &cones);
    let add_ticks = ticks_to_cover(needed, input.turn_rate_max, input.dt).max(1);
    EmissionDecision::NeedTurn {
        add_ticks,
    }
}

fn penalty_forward(delta: f32, cone_half: f32) -> EmissionPenalty {
    let cos_term = delta.abs().cos().clamp(0.0, 1.0);
    let power_scale = 0.85 + 0.15 * cos_term.powf(1.2);
    let norm = (delta.abs() / cone_half).clamp(0.0, 1.0);
    EmissionPenalty {
        power_scale,
        angle_jitter: 0.01 + 0.05 * norm,
    }
}

fn penalty_side(delta: f32, cone_half: f32) -> EmissionPenalty {
    let cos_term = (FRAC_PI_2 - delta.abs()).cos().abs().clamp(0.0, 1.0);
    let power_scale = 0.65 + 0.25 * cos_term.powf(1.3);
    let norm = (delta.abs() / cone_half).clamp(0.0, 1.0);
    EmissionPenalty {
        power_scale,
        angle_jitter: 0.03 + 0.08 * norm,
    }
}

fn penalty_backheel(delta: f32, cone_half: f32) -> EmissionPenalty {
    let cos_term = (PI - delta.abs()).cos().abs().clamp(0.0, 1.0);
    let power_scale = 0.55 + 0.30 * cos_term.powf(1.4);
    let norm = (delta.abs() / cone_half).clamp(0.0, 1.0);
    EmissionPenalty {
        power_scale,
        angle_jitter: 0.05 + 0.10 * norm,
    }
}

fn required_rotation(delta_res: f32, cones: &Cones) -> f32 {
    let forward_gap = angle_gap(delta_res.abs(), cones.forward);
    let left_gap = angle_gap((wrap_angle(delta_res - cones.side_band)).abs(), cones.side);
    let right_gap = angle_gap((wrap_angle(delta_res + cones.side_band)).abs(), cones.side);
    let back_gap = angle_gap((wrap_angle(delta_res - PI * delta_res.signum())).abs(), cones.backheel);
    forward_gap.min(left_gap).min(right_gap).min(back_gap)
}

fn angle_gap(current: f32, limit: f32) -> f32 {
    if current <= limit {
        0.0
    } else {
        current - limit
    }
}

fn ticks_to_cover(angle: f32, omega_max: f32, dt: f32) -> u8 {
    if omega_max <= 1e-4 {
        return 4;
    }
    let seconds = angle.abs() / omega_max;
    let ticks = (seconds / dt).ceil();
    ticks.clamp(0.0, 12.0) as u8
}

fn wrap_angle(mut angle: f32) -> f32 {
    while angle > PI {
        angle -= 2.0 * PI;
    }
    while angle < -PI {
        angle += 2.0 * PI;
    }
    angle
}

fn normalise_pi(angle: f32) -> f32 {
    wrap_angle(angle)
}
