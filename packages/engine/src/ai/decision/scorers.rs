use super::passes;
use crate::ai::coach::TacticsView;
use crate::ai::decision::{DecisionEnvelope, PlayerContext};
use crate::ai::perception::PerceptionSnapshot;

/// Scores all possible on-ball decisions (pass, shoot, dribble, etc.)
/// and returns the one with the highest score.
pub fn score_on_ball_decisions(
    snap: &PerceptionSnapshot,
    tactics: &TacticsView,
    ctx: &PlayerContext,
    _rng_seed: u64,
) -> Option<DecisionEnvelope> {
    let mut best: Option<ScoredDecision> = None;

    if let Some(pass) = passes::best_ground_pass(snap, tactics, ctx) {
        let scored = ScoredDecision::from_pass(pass);
        match &best {
            Some(current) if current.score >= scored.score => {}
            _ => best = Some(scored),
        }
    }

    best.map(|sd| sd.envelope)
}

struct ScoredDecision {
    envelope: DecisionEnvelope,
    score: f32,
}

impl ScoredDecision {
    fn from_pass(option: passes::PassOption) -> Self {
        let envelope = DecisionEnvelope {
            decision: crate::ai::Decision::GroundPass {
                target_id: option.target_id,
                lead: option.lead,
                pace: option.pace,
            },
            intent_id: 1,
            min_hold_ms: 150,
            cooldown_ms: 0,
            score: option.score,
        };

        Self {
            envelope,
            score: option.score,
        }
    }
}
