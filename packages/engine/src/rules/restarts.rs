use crate::params::{PITCH_H, PITCH_W};
use crate::state::World;
use crate::types::MatchPhase;

pub fn handle_restarts(world: &mut World) {
    match world.match_phase {
        MatchPhase::PreKickoff => {
            if world.bvx.abs() > 0.01 || world.bvy.abs() > 0.01 {
                world.match_phase = MatchPhase::InPlay;
            }
        }
        MatchPhase::Restart => {
            if world.bvx.abs() > 0.01 || world.bvy.abs() > 0.01 {
                world.match_phase = MatchPhase::InPlay;
            }
        }
        MatchPhase::InPlay => {
            let half_w = PITCH_W * 0.5;
            let half_h = PITCH_H * 0.5;
            if world.bx.abs() > half_w || world.by.abs() > half_h {
                world.match_phase = MatchPhase::Restart;
                world.bvx = 0.0;
                world.bvy = 0.0;
            }
        }
        MatchPhase::Kickoff => {
            // If the ball has been touched (i.e., it's moving), the game is on.
            if world.bvx.abs() > 0.01 || world.bvy.abs() > 0.01 {
                world.match_phase = MatchPhase::InPlay;
                return;
            }

            // Reset ball position to the center at the start of a kickoff
            world.bx = 0.0;
            world.by = 0.0;
            world.bz = 0.2; // Slightly above ground
            world.bvx = 0.0;
            world.bvy = 0.0;
            world.bvz = 0.0;
        }
        MatchPhase::Corner => todo!(),
    }
}
