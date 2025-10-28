pub mod scorers;
pub mod types;

pub use types::{
    Decision, DecisionEnvelope, Intent, IntentMemory, IntentTarget, IntentType, PlayerContext,
};

use crate::ai::coach;
use crate::ai::perception::PerceptionSnapshot;
use crate::ai::{PlayerId, Role, types as game_types};

#[derive(Default)]
pub struct DecisionModule {
    pub mem: IntentMemory,
    pub last_score: f32,
}

impl DecisionModule {
    #[allow(clippy::too_many_arguments)]
    pub fn decide(
        &mut self,
        _tick: u64,
        _player_id: PlayerId,
        snap: &PerceptionSnapshot,
        tactics: &coach::TacticsView,
        ctx: &PlayerContext,
        rng_seed: u64,
    ) -> DecisionEnvelope {
        // 1. 공 소유 여부에 따라 의사결정 분기
        let best_decision_envelope = if snap.me.has_ball {
            scorers::score_on_ball_decisions(snap, tactics, ctx, rng_seed)
        } else {
            // TODO: 공이 없을 때의 의사결정 로직 추가
            None
        };

        // 2. 마땅한 행동이 없으면 Hold로 대체
        if let Some(envelope) = best_decision_envelope {
            self.last_score = envelope.score;
            envelope
        } else {
            let intent_id = self
                .mem
                .active
                .as_ref()
                .map(|intent| intent.intent_id)
                .unwrap_or(0);

            DecisionEnvelope {
                decision: Decision::Hold { duration_ms: 200 },
                intent_id,
                min_hold_ms: 150,
                cooldown_ms: 0,
                score: self.last_score,
            }
        }
    }
}

pub fn policy_for(
    _role: Role,
    _game: game_types::GameState,
    _tactics: &coach::TacticsView,
) -> game_types::RolePolicy {
    game_types::RolePolicy {
        weights: game_types::Weights {
            wT: 1.0,
            wG: 1.0,
            wR: 1.0,
            wL: 1.0,
            wS: 1.0,
            wF: 1.0,
            wC: 1.0,
            wM: 1.0,
        },
        pass_risk_max: 0.35,
        theta_shot: 0.12,
        epsilon_base: 0.05,
        min_hold_ms: 120,
        press_triggers: game_types::PressTriggers {
            on_backpass: true,
            on_bad_touch: true,
            on_hospital_pass: true,
        },
    }
}
