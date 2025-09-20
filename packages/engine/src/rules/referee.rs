use crate::params::{GOAL_HEIGHT, GOAL_W, PITCH_W};
use crate::state::World;
use crate::types::{MatchPhase, TeamId};

pub fn update_referee(world: &mut World) {
    if check_goal(world) {
        world.match_phase = MatchPhase::Restart;
        world.reset_kickoff();
    }
}

fn check_goal(world: &mut World) -> bool {
    if world.bz > GOAL_HEIGHT {
        return false;
    }
    if world.by.abs() > GOAL_W * 0.5 {
        return false;
    }
    let half_w = PITCH_W * 0.5;
    if world.bx > half_w {
        world.home_score = world.home_score.saturating_add(1);
        world.possession = TeamId::Home.index() as i8;
        return true;
    }
    if world.bx < -half_w {
        world.away_score = world.away_score.saturating_add(1);
        world.possession = TeamId::Away.index() as i8;
        return true;
    }
    false
}
