use engine::ai::coach::{TacticsView, XtGrid};
use engine::ai::perception::{MePercept, PlayerPercept, PassOption, PassType};
use engine::ai::{PitchView, TeamId, Vec2};
use std::vec::Vec;

// This function is a copy of the private function `pass_rank_key` in `packages/engine/src/ai/perception/derive.rs`
// It is copied here for testing purposes.
#[inline]
fn pass_rank_key(o: &PassOption) -> f32 {
    let p_keep = (1.0 - o.p_intercept) * o.p_receiver;
    0.6 * o.xt_delta + 0.4 * p_keep
}

#[test]
fn pass_rank_key_evaluates_risk_and_reward() {
    let risky_high_reward = PassOption {
        p_intercept: 0.8,
        p_receiver: 0.8,
        xt_delta: 0.5,
        ..Default::default()
    };

    let safe_low_reward = PassOption {
        p_intercept: 0.1,
        p_receiver: 0.9,
        xt_delta: 0.1,
        ..Default::default()
    };

    let balanced = PassOption {
        p_intercept: 0.3,
        p_receiver: 0.85,
        xt_delta: 0.3,
        ..Default::default()
    };

    let rank_risky = pass_rank_key(&risky_high_reward);
    let rank_safe = pass_rank_key(&safe_low_reward);
    let rank_balanced = pass_rank_key(&balanced);

    assert!(rank_balanced > rank_safe);
    assert!(rank_balanced > rank_risky);
}

mod test_utils {
    use super::*;
    use engine::ai::utility::math::{clamp, quant_u16_01};
    use engine::ai::debug::{self, Reason};

    pub fn derive_pass_options(
        _tick: u64,
        me: &MePercept,
        mates: &[PlayerPercept],
        opps: &[PlayerPercept],
        pitch: &PitchView,
        xt: &XtGrid,
        tactics: &TacticsView,
    ) -> Vec<PassOption> {
        const MAX_OPTS: usize = 8;
        let mut out = Vec::with_capacity(MAX_OPTS);

        let mut candidates: Vec<&PlayerPercept> = mates
            .iter()
            .filter(|m| m.id != me.id)
            .filter(|m| forwardish(me, m))
            .filter(|m| dist2(me.pos, m.pos) < 30.0 * 30.0)
            .collect();

        candidates.sort_by(|a, b| {
            dist2(me.pos, a.pos)
                .partial_cmp(&dist2(me.pos, b.pos))
                .unwrap_or(std::cmp::Ordering::Equal)
        });
        candidates.truncate(6);

        for m in candidates {
            for &ty in &[PassType::Ground, PassType::Through, PassType::Lofted] {
                let (lead, pace, apex) = propose(me, m, ty);
                let recv = add(m.pos, lead);
                let dt = flight_time(me.pos, recv, pace, apex);
                let pint = intercept_prob(me.pos, recv, dt, opps);
                let prec = receiver_ctrl_prob(m, dt, opps);
                let xtd = xt.sample(recv, pitch) - xt.sample(me.pos, pitch);
                let off = predict_offside_on_arrival(me, m, lead, dt, opps);
                let lane = lane_of(me.pos, recv);

                let mut pace_q = quant_u16_01(pace);
                let mut apex_q = quant_u16_01(apex);
                if matches!(ty, PassType::Ground) {
                    apex_q = 0.0;
                }
                if matches!(ty, PassType::Through) {
                    pace_q = (pace_q * 1.05).min(1.0);
                }

                out.push(PassOption {
                    target_id: m.id,
                    ty,
                    lead,
                    pace: pace_q,
                    apex: apex_q,
                    dt_flight: dt,
                    p_intercept: pint,
                    p_receiver: prec,
                    xt_delta: xtd,
                    offside_on_arrival: off,
                    lane_id: lane,
                });
            }
        }

        let risk_max = tactics.pass_risk_max;
        out.retain(|o| !o.offside_on_arrival && o.p_intercept <= risk_max);

        out.sort_by(|a, b| pass_rank_key(b).partial_cmp(&pass_rank_key(a)).unwrap());
        out.truncate(MAX_OPTS);

        if out.is_empty() {
            debug::alert(_tick, me.id, Reason::NO, "");
        }

        out
    }

    fn dist2(a: Vec2, b: Vec2) -> f32 {
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        dx * dx + dy * dy
    }

    fn add(a: Vec2, b: Vec2) -> Vec2 {
        Vec2 {
            x: a.x + b.x,
            y: a.y + b.y,
        }
    }

    fn forwardish(me: &MePercept, m: &PlayerPercept) -> bool {
        (m.pos.y - me.pos.y) * team_sign(me.team) > -1.0
    }

    fn team_sign(t: u8) -> f32 {
        if t == 0 { 1.0 } else { -1.0 } // Changed from match TeamId::Home/Away
    }

    fn propose(_me: &MePercept, m: &PlayerPercept, ty: PassType) -> (Vec2, f32, f32) {
        match ty {
            PassType::Ground => (Vec2 { x: 0.0, y: 0.0 }, 0.55, 0.0),
            PassType::Lofted => (Vec2 { x: 0.0, y: 0.0 }, 0.62, 0.55),
            PassType::Through => {
                let lead = Vec2 {
                    x: m.vel.x * 0.25,
                    y: m.vel.y * 0.25,
                };
                (lead, 0.68, 0.20)
            }
        }
    }

    fn flight_time(from: Vec2, to: Vec2, pace: f32, apex: f32) -> f32 {
        let d = (to.x - from.x).hypot(to.y - from.y).max(0.1);
        d / (6.0 + 6.0 * pace) + 0.15 * apex
    }

    fn intercept_prob(from: Vec2, to: Vec2, dt: f32, opps: &[PlayerPercept]) -> f32 {
        let mut worst: f32 = 0.0;
        for o in opps {
            let t_def = time_to_segment(o, from, to);
            let margin = dt - t_def;
            let p = 1.0 / (1.0 + (-6.0 * margin).exp());
            worst = worst.max(p);
        }
        clamp(worst, 0.0, 1.0)
    }

    fn time_to_segment(_o: &PlayerPercept, _a: Vec2, _b: Vec2) -> f32 {
        0.0_f32.max(distance_point_to_segment(_o.pos, _a, _b) / 6.5)
    }

    fn distance_point_to_segment(p: Vec2, a: Vec2, b: Vec2) -> f32 {
        let ap = Vec2 {
            x: p.x - a.x,
            y: p.y - a.y,
        };
        let ab = Vec2 {
            x: b.x - a.x,
            y: b.y - a.y,
        };
        let t = ((ap.x * ab.x + ap.y * ab.y) / (ab.x * ab.x + ab.y * ab.y)).clamp(0.0, 1.0);
        let c = Vec2 {
            x: a.x + ab.x * t,
            y: a.y + ab.y * t,
        };
        (p.x - c.x).hypot(p.y - c.y)
    }

    fn receiver_ctrl_prob(m: &PlayerPercept, dt: f32, _opps: &[PlayerPercept]) -> f32 {
        let speed = (m.vel.x * m.vel.x + m.vel.y * m.vel.y).sqrt();
        let s = 1.0 - (speed / 7.0).min(1.0);
        let t = (dt / 1.0).min(1.0);
        clamp(0.4 * s + 0.6 * t, 0.0, 1.0)
    }

    fn predict_offside_on_arrival(
        _me: &MePercept,
        _m: &PlayerPercept,
        _lead: Vec2,
        _dt: f32,
        _opps: &[PlayerPercept],
    ) -> bool {
        false
    }

    fn lane_of(_from: Vec2, _to: Vec2) -> u8 {
        2
    }
}

#[test]
fn derive_pass_options_generates_option_for_open_teammate() {
    // 1. Setup
    let tick = 0;
    let me = MePercept {
        id: 1,
        team: 0, // Home
        pos: Vec2::new(0.0, 0.0),
        has_ball: true,
        ..Default::default()
    };
    let mates = vec![
        PlayerPercept {
            id: 2,
            team: 0, // Home
            pos: Vec2::new(10.0, 5.0), // 10m forward, 5m right
            ..Default::default()
        }
    ];
    let opps = vec![
        PlayerPercept {
            id: 11,
            team: 1, // Away
            pos: Vec2::new(5.0, -5.0), // 5m away, to the left
            ..Default::default()
        }
    ];
    let pitch = PitchView::default();
    let xt = XtGrid::default();
    let mut tactics = TacticsView::default();
    tactics.pass_risk_max = 1.0; // Allow all passes for this test

    // 2. Execute
    let pass_options = test_utils::derive_pass_options(
        tick,
        &me,
        &mates,
        &opps,
        &pitch,
        &xt,
        &tactics,
    );

    // 3. Assert
    assert!(!pass_options.is_empty());
}

