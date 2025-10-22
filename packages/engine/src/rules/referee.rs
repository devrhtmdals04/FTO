use crate::params::{GOAL_HEIGHT, GOAL_W, PITCH_W};
use crate::state::World;
use crate::types::TeamId;

pub fn update_referee(world: &mut World) {
    if let Some(kickoff_team) = check_goal(world) {
        world.reset_kickoff(kickoff_team);
    }
}

fn check_goal(world: &mut World) -> Option<TeamId> {
    if world.bz > GOAL_HEIGHT {
        return None;
    }
    if world.by.abs() > GOAL_W * 0.5 {
        return None;
    }
    let half_w = PITCH_W * 0.5;
    if world.bx > half_w {
        world.home_score = world.home_score.saturating_add(1);
        return Some(TeamId::Away);
    }
    if world.bx < -half_w {
        world.away_score = world.away_score.saturating_add(1);
        return Some(TeamId::Home);
    }
    None
}
