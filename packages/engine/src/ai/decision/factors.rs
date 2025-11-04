use std::f32::consts::PI;

use crate::ai::perception::{PassOption, PerceptionSnapshot, PlayerPercept};
use crate::ai::{Vec2, PlayerId};

pub const TURN_RATE_RAD_PER_MS: f32 = 0.0009;
pub const PLAYER_SPEED_MPS: f32 = 6.2;
pub const RECV_MIN: f32 = 0.72;
pub const REQ_MARGIN: f32 = 0.30;
pub const PRESS_OK: f32 = 0.55;
pub const GATE_STEP_MS: i32 = 100;

#[derive(Copy, Clone, Default, Debug)]
pub struct PassFactors {
    pub orient_gap: f32,
    pub lane_gap: f32,
    pub recv_gap: f32,
    pub offs_gap: f32,
    pub gate_gap_ms: i32,
    pub press_gap: f32,
    pub kick_gap: f32,
}

#[inline]
pub fn all_ok(g: &PassFactors) -> bool {
    g.orient_gap <= 0.0
        && g.lane_gap <= 0.0
        && g.recv_gap <= 0.0
        && g.offs_gap <= 0.0
        && g.gate_gap_ms <= 0
        && g.press_gap <= 0.0
        && g.kick_gap <= 0.0
}

pub fn quantify_pass_factors(
    s: &PerceptionSnapshot,
    o: &PassOption,
    risk_cap: f32,
    exec_can_kick: bool,
) -> PassFactors {
    let target_point = predicted_receive_point(s, o);
    let facing = Vec2::new(s.me.body_angle.cos(), s.me.body_angle.sin());
    let desired = (target_point - s.me.pos).normalize();
    let ang_err = angle_between(facing, desired).abs();
    let required_turn_ms = ang_err / TURN_RATE_RAD_PER_MS;
    let orient_slack_ms = estimate_orient_slack_ms(o);
    let orient_gap = (required_turn_ms - orient_slack_ms).max(0.0);

    let lane_gap = o.p_intercept - risk_cap;
    let recv_gap = RECV_MIN - o.p_receiver;
    let offs_gap = REQ_MARGIN - estimate_onside_margin(s, o);
    let gate_gap_ms = estimate_gate_gap_ms(s, o, risk_cap);
    let press_gap = estimate_pressure_gap(s) - PRESS_OK;
    let kick_gap = if exec_can_kick { 0.0 } else { 1.0 };

    PassFactors {
        orient_gap,
        lane_gap,
        recv_gap,
        offs_gap,
        gate_gap_ms,
        press_gap,
        kick_gap,
    }
}

fn estimate_orient_slack_ms(o: &PassOption) -> f32 {
    let flight_ms = (o.dt_flight * 1000.0).clamp(40.0, 1200.0);
    // Assume roughly half of the window is usable for orientation.
    flight_ms * 0.5
}

fn predicted_receive_point(s: &PerceptionSnapshot, o: &PassOption) -> Vec2 {
    if let Some(target) = find_player(&s.mates, o.target_id) {
        target.pos + o.lead
    } else {
        s.me.pos + o.lead
    }
}

fn estimate_onside_margin(s: &PerceptionSnapshot, o: &PassOption) -> f32 {
    let our_goal = s.pitch.our_goal;
    let their_goal = s.pitch.their_goal;
    let dir = (their_goal - our_goal).normalize();
    if dir.norm_squared() < 1e-6 {
        return 5.0;
    }

    let project = |p: Vec2| -> f32 { (p - our_goal).dot(dir) };

    let target_axis = project(predicted_receive_point(s, o));

    let mut defender_axes: Vec<f32> = s.opps.iter().map(|opp| project(opp.pos)).collect();
    if defender_axes.len() < 2 {
        return 5.0;
    }

    defender_axes.sort_by(|a, b| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal));
    let second_last = defender_axes[defender_axes.len() - 2];

    let ball_axis = project(Vec2::new(s.ball.pos.x, s.ball.pos.y));
    let effective_line = second_last.max(ball_axis);

    effective_line - target_axis
}

fn estimate_gate_gap_ms(_s: &PerceptionSnapshot, o: &PassOption, risk_cap: f32) -> i32 {
    if o.p_intercept <= risk_cap {
        return 0;
    }

    let p_current = o.p_intercept.clamp(1e-3, 1.0 - 1e-3);
    let p_cap = risk_cap.clamp(1e-3, 1.0 - 1e-3);

    let margin_current = logistic_margin(p_current);
    let margin_cap = logistic_margin(p_cap);
    let delta = (margin_current - margin_cap).max(0.0);

    (delta * 1000.0) as i32
}

fn estimate_pressure_gap(s: &PerceptionSnapshot) -> f32 {
    const PRESS_RADIUS: f32 = 8.0;
    let mut accum = 0.0;
    for opp in &s.opps {
        let dist = (opp.pos - s.me.pos).norm();
        if dist > PRESS_RADIUS {
            continue;
        }
        let proximity = (PRESS_RADIUS - dist) / PRESS_RADIUS;
        let facing_bonus = (1.0 - (opp.facing_to_me.abs() / PI).min(1.0)) * 0.5;
        accum += (proximity.max(0.0)) * (1.0 + facing_bonus);
    }
    accum.min(2.0)
}

pub fn angle_diff(mut angle: f32) -> f32 {
    while angle > PI {
        angle -= 2.0 * PI;
    }
    while angle < -PI {
        angle += 2.0 * PI;
    }
    angle
}

fn angle_between(a: Vec2, b: Vec2) -> f32 {
    let a_ang = a.y.atan2(a.x);
    let b_ang = b.y.atan2(b.x);
    angle_diff(b_ang - a_ang)
}

fn logistic_margin(p: f32) -> f32 {
    let odds = (1.0 / p) - 1.0;
    -(odds.ln()) / 6.0
}

fn find_player<'a>(players: &'a [PlayerPercept], id: PlayerId) -> Option<&'a PlayerPercept> {
    players.iter().find(|p| p.id == id)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::ai::perception::{BallPercept, MePercept};
    use crate::params::{PITCH_H, PITCH_W};

    #[test]
    fn quantify_pass_factors_basic() {
        let mut snapshot = PerceptionSnapshot::default();
        snapshot.me = MePercept {
            id: 1,
            team: 0,
            pos: Vec2::new(0.0, 0.0),
            vel: Vec2::new(0.0, 0.0),
            body_angle: PI * 0.5,
            stamina: 1.0,
            has_ball: true,
            can_kick: true,
            relinquish_until: 0,
            just_kicked: false,
            last_kick_tick: 0,
        };
        snapshot.ball = BallPercept {
            pos: crate::ai::Vec3 { x: 0.0, y: -1.0, z: 0.0 },
            vel: crate::ai::Vec3 { x: 0.0, y: 0.0, z: 0.0 },
            airborne: false,
        };
        snapshot.pitch.our_goal = Vec2::new(-PITCH_W * 0.5, 0.0);
        snapshot.pitch.their_goal = Vec2::new(PITCH_W * 0.5, 0.0);
        snapshot.pitch.length = PITCH_W;
        snapshot.pitch.width = PITCH_H;
        snapshot.opps = vec![
            PlayerPercept {
                id: 10,
                team: 1,
                pos: Vec2::new(0.0, 6.0),
                vel: Vec2::new(0.0, 0.0),
                dist: 6.0,
                facing_to_me: 0.0,
            },
            PlayerPercept {
                id: 11,
                team: 1,
                pos: Vec2::new(1.0, 8.0),
                vel: Vec2::new(0.0, 0.0),
                dist: 8.0,
                facing_to_me: 0.0,
            },
            PlayerPercept {
                id: 12,
                team: 1,
                pos: Vec2::new(2.0, 3.0),
                vel: Vec2::new(0.0, 0.0),
                dist: 3.0,
                facing_to_me: 0.0,
            },
        ];
        snapshot.mates = vec![PlayerPercept {
            id: 3,
            team: 0,
            pos: Vec2::new(0.0, 4.5),
            vel: Vec2::new(0.0, 0.0),
            dist: 4.5,
            facing_to_me: 0.0,
        }];

        let option = PassOption {
            target_id: 3,
            ty: crate::ai::perception::PassType::Ground,
            lead: Vec2::new(0.0, 0.2),
            pace: 0.55,
            apex: 0.0,
            dt_flight: 0.6,
            p_intercept: 0.55,
            p_receiver: 0.68,
            xt_delta: 0.3,
            offside_on_arrival: false,
            lane_id: 1,
        };

        let factors = quantify_pass_factors(&snapshot, &option, 0.35, true);
        assert!(factors.orient_gap <= 0.05);
        assert!((factors.lane_gap - 0.20).abs() < 0.02);
        assert!((factors.recv_gap - 0.04).abs() < 0.02);
        assert!(factors.offs_gap < -0.2);
        assert!(factors.gate_gap_ms > 100);
        assert!(factors.press_gap > -0.5);
        assert_eq!(factors.kick_gap, 0.0);
    }

    #[test]
    fn quantify_pass_factors_requires_kick() {
        let snapshot = PerceptionSnapshot::default();
        let option = PassOption::default();
        let factors = quantify_pass_factors(&snapshot, &option, 0.3, false);
        assert!(factors.kick_gap > 0.9);
    }
}
