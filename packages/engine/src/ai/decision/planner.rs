use crate::ai::{PlayerId, Vec2};
use crate::ai::perception;

use super::effect::predict_effect;
use super::factors::{PassFactors, GATE_STEP_MS};
use super::micro::{MicroAction, MicroActionKind};

pub fn progress(current: &PassFactors, delta: &PassFactors) -> f32 {
    let imp = |gap: f32, change: f32, scale: f32| -> f32 {
        ((gap.max(0.0) - (gap + change).max(0.0)) / scale).max(0.0)
    };
    let p_orient = imp(current.orient_gap, delta.orient_gap, 0.08);
    let p_lane = imp(current.lane_gap, delta.lane_gap, 0.20);
    let p_recv = imp(current.recv_gap, delta.recv_gap, 0.20);
    let p_offs = imp(current.offs_gap, delta.offs_gap, 0.15);
    let p_gate = ((current.gate_gap_ms.max(0) - (current.gate_gap_ms + delta.gate_gap_ms).max(0)) as f32
        / 180.0)
        .max(0.0);
    let p_press = imp(current.press_gap, delta.press_gap, 0.30);
    let p_kick = imp(current.kick_gap, delta.kick_gap, 1.0);

    0.9 * p_lane
        + 0.7 * p_gate
        + 0.6 * p_orient
        + 0.6 * p_recv
        + 0.4 * p_press
        + 0.4 * p_offs
        + 0.3 * p_kick
}

pub fn time_cost_ms(kind: &MicroActionKind) -> i32 {
    match kind {
        MicroActionKind::Orient { .. } => 120,
        MicroActionKind::LateralCarry { dur_ms, .. } => *dur_ms,
        MicroActionKind::Shield { dur_ms, .. } => *dur_ms,
        MicroActionKind::Delay { dur_ms } => *dur_ms,
        MicroActionKind::GateWatch { .. } => GATE_STEP_MS,
        MicroActionKind::PassRequest { .. } => 40,
        MicroActionKind::TriggerRun { .. } => 40,
        MicroActionKind::MicroHold { dur_ms } => *dur_ms,
    }
}

pub fn risk(
    kind: &MicroActionKind,
    _s: &perception::PerceptionSnapshot,
    _o: &perception::PassOption,
) -> f32 {
    match kind {
        MicroActionKind::LateralCarry { .. } => 0.05,
        MicroActionKind::Delay { .. } => 0.06,
        MicroActionKind::Shield { .. } => 0.03,
        _ => 0.02,
    }
}

pub fn score_action(
    kind: &MicroActionKind,
    g: &PassFactors,
    s: &perception::PerceptionSnapshot,
    o: &perception::PassOption,
) -> f32 {
    let delta = predict_effect(kind, s, o);
    let prog = progress(g, &delta);
    let t = time_cost_ms(kind).max(80) as f32;
    let lam = 0.8;
    (prog / t) - lam * risk(kind, s, o)
}

pub fn enumerate_actions(
    tick: u64,
    _pid: PlayerId,
    s: &perception::PerceptionSnapshot,
    o: &perception::PassOption,
    g: &PassFactors,
) -> Vec<MicroAction> {
    let mut actions = Vec::with_capacity(8);
    let aim_world = s.me.pos + o.lead;

    actions.push(MicroAction {
        kind: MicroActionKind::Orient { aim: aim_world },
        until: tick + 3,
    });

    actions.push(MicroAction {
        kind: MicroActionKind::PassRequest { to: o.target_id },
        until: tick + 2,
    });

    if g.lane_gap > 0.0 {
        actions.push(MicroAction {
            kind: MicroActionKind::LateralCarry {
                dir: lateral_best_dir(s, o),
                dur_ms: 240,
            },
            until: tick + 5,
        });
    }

    if g.press_gap > 0.0 {
        actions.push(MicroAction {
            kind: MicroActionKind::Shield {
                dur_ms: 160,
                face: aim_world,
            },
            until: tick + 4,
        });
    }

    if g.gate_gap_ms > 0 {
        actions.push(MicroAction {
            kind: MicroActionKind::GateWatch {
                target: o.target_id,
                deadline: tick + 8,
            },
            until: tick + 3,
        });
    }

    if g.offs_gap > 0.0 {
        actions.push(MicroAction {
            kind: MicroActionKind::Delay { dur_ms: 140 },
            until: tick + 4,
        });
    }

    if g.kick_gap > 0.0 {
        actions.push(MicroAction {
            kind: MicroActionKind::MicroHold { dur_ms: 140 },
            until: tick + 4,
        });
    }

    if g.recv_gap > 0.0 || g.gate_gap_ms > 0 {
        if let Some(runner) = pick_third_man(s, o) {
            actions.push(MicroAction {
                kind: MicroActionKind::TriggerRun { runner },
                until: tick + 3,
            });
        }
    }

    actions
}

fn lateral_best_dir(s: &perception::PerceptionSnapshot, o: &perception::PassOption) -> Vec2 {
    let forward = if o.lead.norm() > 1e-4 {
        o.lead.normalize()
    } else {
        Vec2::new(1.0, 0.0)
    };
    let left = Vec2::new(-forward.y, forward.x);
    let right = Vec2::new(forward.y, -forward.x);

    let score_dir = |dir: Vec2| -> f32 {
        s.opps
            .iter()
            .map(|opp| {
                let rel = opp.pos - s.me.pos;
                rel.dot(dir)
            })
            .filter(|proj| *proj > 0.0)
            .count() as f32
    };

    if score_dir(left) < score_dir(right) {
        left
    } else {
        right
    }
}

fn pick_third_man(
    s: &perception::PerceptionSnapshot,
    o: &perception::PassOption,
) -> Option<PlayerId> {
    let aim = s.me.pos + o.lead;
    s.mates
        .iter()
        .filter(|mate| mate.id != o.target_id)
        .min_by(|a, b| {
            let da = a.pos.distance(aim);
            let db = b.pos.distance(aim);
            da.partial_cmp(&db).unwrap_or(std::cmp::Ordering::Equal)
        })
        .map(|mate| mate.id)
}

