use crate::ai::{EngineView, TeamCtx};
use crate::params::AI_REEVAL_PERIOD;

use super::comm::{MsgPayload, MsgType, TeamMessage};
use super::decision::Decision;
use super::decision::types::DecisionEnvelope;
use super::perception::{ActuationView, PerceptionSnapshot};
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

            if player.execution.apply(decision.clone(), slot_tick, &engine.pitch()) {
                let message = decision_to_msg(&decision, &snapshot);
                let intent_id = decision.intent_id;
                team_ctx.comm_broker.enqueue(intent_id, player_id, message);
            }
        }

        self.phase_tick_mod ^= 1;
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
