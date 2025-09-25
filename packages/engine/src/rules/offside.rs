use crate::state::World;
use crate::types::{MatchPhase, TeamId};
use std::vec::Vec;

pub fn check_offside(world: &World) -> bool {
    if world.match_phase != MatchPhase::InPlay {
        return false;
    }
    let team_idx = match world.possession {
        0 => TeamId::Home,
        1 => TeamId::Away,
        _ => return false,
    };
    let dir = if team_idx == TeamId::Home { 1.0 } else { -1.0 };
    let opponents = TeamId::opponent(team_idx);

    let mut defender_line: Vec<f32> = World::team_slice(opponents)
        .map(|idx| dir * world.px[idx])
        .collect();
    if defender_line.len() < 2 {
        return false;
    }
    defender_line.sort_by(|a, b| a.partial_cmp(b).unwrap_or(core::cmp::Ordering::Equal));
    let second_last = defender_line[defender_line.len().saturating_sub(2)];
    let ball_line = dir * world.bx;
    let offside_line = second_last.min(ball_line);

    for idx in World::team_slice(team_idx) {
        let player_line = dir * world.px[idx];
        if player_line > offside_line + 0.1 && dir * world.px[idx] > 0.0 {
            return true;
        }
    }
    false
}
