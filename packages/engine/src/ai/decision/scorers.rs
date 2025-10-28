use crate::ai::coach::TacticsView;
use crate::ai::decision::{DecisionEnvelope, PlayerContext};
use crate::ai::perception::PerceptionSnapshot;

/// Scores all possible on-ball decisions (pass, shoot, dribble, etc.)
/// and returns the one with the highest score.
pub fn score_on_ball_decisions(
    _snap: &PerceptionSnapshot,
    _tactics: &TacticsView,
    _ctx: &PlayerContext,
    _rng_seed: u64,
) -> Option<DecisionEnvelope> {
    // TODO: 각 행동 후보(패스, 슛, 드리블 등)에 대한 점수 계산 로직 구현
    // let pass_options = score_pass_options(snap, tactics, ctx, rng_seed);
    // let shoot_options = score_shoot_options(snap, tactics, ctx, rng_seed);
    // ...

    // 임시로 아무것도 반환하지 않음
    None
}
