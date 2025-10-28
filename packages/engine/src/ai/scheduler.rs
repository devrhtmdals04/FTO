use crate::ai::{EngineView, TeamCtx};
use crate::params::AI_REEVAL_PERIOD;

use super::comm::TeamMessage;
use super::perception::PerceptionSnapshot;
use super::decision::types::DecisionEnvelope;

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
            if !team_ctx.players[idx].slot(slot_tick) {
                continue;
            }

            let (intent_id, player_id, message) = {
                let mut perception_owned = {
                    let player = &mut team_ctx.players[idx];
                    core::mem::take(&mut player.perception)
                };

                let snapshot = perception_owned.build_snapshot(slot_tick, engine, &*team_ctx);

                let result = {
                    let player = &mut team_ctx.players[idx];
                    player.perception = perception_owned;

                    let decision = player.decision.decide(
                        slot_tick,
                        player.id,
                        &snapshot,
                        &tactics,
                        &player.ctx,
                        seed,
                    );

                    let message = decision_to_msg(&decision, &snapshot);
                    player
                        .execution
                        .apply(decision.clone(), slot_tick, &engine.pitch());

                    (decision.intent_id, player.id, message)
                };

                result
            };

            team_ctx.comm_broker.enqueue(intent_id, player_id, message);
        }

        self.phase_tick_mod ^= 1;
    }
}

pub fn decision_to_msg(decision: &DecisionEnvelope, snapshot: &PerceptionSnapshot) -> Option<TeamMessage> {
    let _ = (decision, snapshot);
    None
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
