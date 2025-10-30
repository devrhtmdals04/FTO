use crate::ai::{EngineView, Footed, PlayerAgent, TeamCtx, Vec2};
use crate::params::AI_REEVAL_PERIOD;

use super::comm::{MsgPayload, MsgType, TeamMessage};
use super::decision::Decision;
use super::decision::types::DecisionEnvelope;
use super::perception::{ActuationView, PerceptionSnapshot};
use super::execution::runtime::ApplyContext;
use crate::ai::debug as dbg;


/// 신규 10 Hz 스케줄러.
#[derive(Debug, Default)]
pub struct AiScheduler {
    phase_tick_mod: u8,
}

impl AiScheduler {
    pub fn new() -> Self {
        Self { phase_tick_mod: 0 }
    }

    pub fn tick(&mut self, tick: u64, team_ctx: &mut TeamCtx, engine: &dyn EngineView) {
        team_ctx.comm_broker.tick(tick);

        let slot_tick = tick + self.phase_tick_mod as u64;
        let tactics = team_ctx.tactics.clone();
        let seed = team_ctx.seed;

        for idx in 0..team_ctx.players.len() {
            let player_id = team_ctx.players[idx].id;
            let slot = team_ctx.players[idx].slot(slot_tick);
            if !slot {
                continue;
            }

            let readiness = team_ctx.players[idx].execution.readiness(slot_tick);
            let mut perception_owned = core::mem::take(&mut team_ctx.players[idx].perception);
            let act = ActuationView {
                can_kick: readiness.can_kick,
                relinquish_until: readiness.relinquish_until,
            };
            let snapshot =
                perception_owned.build_snapshot_with_act(slot_tick, engine, &*team_ctx, &act);
            if snapshot.me.has_ball { 
                dbg::note_has_ball(slot_tick, player_id); 
                dbg::set_focus(player_id);
            }

            let player = &mut team_ctx.players[idx];
            player.perception = perception_owned;

            let decision = player.decision.decide(
                slot_tick,
                player.id,
                &snapshot,
                &tactics,
                &player.ctx,
                act.can_kick,
                seed,
            );

            let apply_ctx = build_apply_context(&decision, &snapshot, player);

            if player
                .execution
                .apply(decision.clone(), slot_tick, &engine.pitch(), apply_ctx)
            {
                let message = decision_to_msg(&decision, &snapshot);
                let intent_id = decision.intent_id;
                team_ctx.comm_broker.enqueue(intent_id, player_id, message);
            }
        }

        self.phase_tick_mod ^= 1;
    }
}

fn build_apply_context(
    decision: &DecisionEnvelope,
    snapshot: &PerceptionSnapshot,
    agent: &PlayerAgent,
) -> ApplyContext {
    let target_point = resolve_target_point(decision, snapshot);
    let stamina = snapshot.me.stamina.clamp(0.0, 1.0);
    let pass_skill = agent.ctx.attrs.pass.clamp(0.0, 1.0);

    let mut weak_foot = false;
    if let Some(target) = target_point {
        let dir = target - snapshot.me.pos;
        if dir.norm_squared() > 1e-5 {
            let target_angle = dir.y.atan2(dir.x);
            let delta = wrap_angle(target_angle - snapshot.me.body_angle);
            weak_foot = infer_weak_foot(agent.ctx.attrs.foot, delta);
        }
    }

    ApplyContext {
        body_angle: snapshot.me.body_angle,
        player_pos: snapshot.me.pos,
        player_vel: snapshot.me.vel,
        stamina,
        pass_skill,
        weak_foot,
        turn_rate_max: compute_turn_rate(agent),
        target_point,
        ball_pos: Vec2 {
            x: snapshot.ball.pos.x,
            y: snapshot.ball.pos.y,
        },
    }
}

fn resolve_target_point(decision: &DecisionEnvelope, snapshot: &PerceptionSnapshot) -> Option<Vec2> {
    match &decision.decision {
        Decision::GroundPass { target_id, lead, .. } => {
            find_player_pos(snapshot, *target_id).map(|pos| pos + *lead)
        }
        Decision::ThroughBall { target_id, lead, .. } => {
            find_player_pos(snapshot, *target_id).map(|pos| pos + *lead)
        }
        Decision::LoftedPass { target_id, .. } => find_player_pos(snapshot, *target_id),
        Decision::Shoot { aim, .. } => Some(*aim),
        _ => None,
    }
}

fn find_player_pos(snapshot: &PerceptionSnapshot, id: u16) -> Option<Vec2> {
    if snapshot.me.id == id {
        return Some(snapshot.me.pos);
    }
    snapshot
        .mates
        .iter()
        .find(|p| p.id == id)
        .map(|p| p.pos)
}

fn compute_turn_rate(agent: &PlayerAgent) -> f32 {
    let omega = agent.execution.controllers.loco.turn_rate;
    if omega > 0.0 {
        omega
    } else {
        4.0
    }
}

fn wrap_angle(mut angle: f32) -> f32 {
    while angle > core::f32::consts::PI {
        angle -= 2.0 * core::f32::consts::PI;
    }
    while angle < -core::f32::consts::PI {
        angle += 2.0 * core::f32::consts::PI;
    }
    angle
}

fn infer_weak_foot(foot: Footed, delta: f32) -> bool {
    const DEAD_ZONE: f32 = 0.2; // radians
    match foot {
        Footed::Both => false,
        Footed::Right => delta < -DEAD_ZONE,
        Footed::Left => delta > DEAD_ZONE,
    }
}

pub fn decision_to_msg(
    decision: &DecisionEnvelope,
    snapshot: &PerceptionSnapshot,
) -> Option<TeamMessage> {
    match &decision.decision {
        Decision::GroundPass { target_id, pace, .. } |
        Decision::LoftedPass { target_id, pace, .. } |
        Decision::ThroughBall { target_id, pace, .. } => {
            let lane_id = snapshot.pass_options.iter()
                .find(|o| o.target_id == *target_id)
                .map_or(None, |o| Some(o.lane_id));

            Some(TeamMessage {
                tick: 0, // This will be set by the broker
                from: snapshot.me.id,
                ty: MsgType::PassIntent,
                payload: MsgPayload {
                    target: Some(*target_id),
                    strength: *pace,
                    lane: lane_id,
                    point: None,
                },
                ttl: 6,
                prio: 2,
            })
        }
        _ => None,
    }
}

/// 기존 스케줄러(레거시) - 기존 엔진 경로 호환용
#[derive(Default)]
pub struct Scheduler {
    tick: u32,
}

impl Scheduler {
    pub fn new() -> Self {
        Self { tick: 0 }
    }

    pub fn step(&mut self) {
        self.tick = self.tick.wrapping_add(1);
    }

    pub fn should_evaluate(&self, player_index: usize) -> bool {
        (player_index as u32 + self.tick) % AI_REEVAL_PERIOD == 0
    }
}
