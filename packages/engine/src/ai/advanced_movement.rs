use crate::types::{TeamId, Vec2};

use super::perception::PerceptionSnapshot;
use super::phase::TeamPhase;

/// Returns a preferred target for advanced tactical movements. The current
/// implementation is intentionally lightweight and serves as a hook for future
/// logic such as coordinated line breaking or sweeper-keeper behaviour.
pub fn plan(team_phase: TeamPhase, perception: &PerceptionSnapshot, anchor: Vec2) -> Option<Vec2> {
    let direction = if perception.team_id == TeamId::Home {
        1.0
    } else {
        -1.0
    };
    match team_phase {
        TeamPhase::HighBlock => Some(anchor + Vec2::new(4.0 * direction, 0.0)),
        TeamPhase::LowBlock => Some(anchor - Vec2::new(3.0 * direction, 0.0)),
        TeamPhase::SetPieceAttack | TeamPhase::SetPieceDefense => Some(anchor),
        TeamPhase::KickoffAttack | TeamPhase::KickoffDefense => Some(anchor),
        _ => None,
    }
}
