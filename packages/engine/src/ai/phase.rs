use crate::params::PITCH_W;
use crate::state::World;
use crate::types::{MatchPhase, TeamId};

/// Team-wide tactical phase used by the new AI pipeline.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum TeamPhase {
    KickoffAttack,
    KickoffDefense,
    SetPieceAttack,
    SetPieceDefense,
    BuildUp,
    Progression,
    FinalThird,
    HighBlock,
    MidBlock,
    LowBlock,
    Neutral,
}

impl TeamPhase {
    pub fn to_u8(self) -> u8 {
        match self {
            TeamPhase::KickoffAttack => 0,
            TeamPhase::KickoffDefense => 1,
            TeamPhase::SetPieceAttack => 2,
            TeamPhase::SetPieceDefense => 3,
            TeamPhase::BuildUp => 4,
            TeamPhase::Progression => 5,
            TeamPhase::FinalThird => 6,
            TeamPhase::HighBlock => 7,
            TeamPhase::MidBlock => 8,
            TeamPhase::LowBlock => 9,
            TeamPhase::Neutral => 10,
        }
    }

    pub fn from_u8(value: u8) -> Self {
        match value {
            0 => TeamPhase::KickoffAttack,
            1 => TeamPhase::KickoffDefense,
            2 => TeamPhase::SetPieceAttack,
            3 => TeamPhase::SetPieceDefense,
            4 => TeamPhase::BuildUp,
            5 => TeamPhase::Progression,
            6 => TeamPhase::FinalThird,
            7 => TeamPhase::HighBlock,
            8 => TeamPhase::MidBlock,
            9 => TeamPhase::LowBlock,
            _ => TeamPhase::Neutral,
        }
    }

    pub fn is_attacking(self) -> bool {
        matches!(
            self,
            TeamPhase::KickoffAttack
                | TeamPhase::SetPieceAttack
                | TeamPhase::BuildUp
                | TeamPhase::Progression
                | TeamPhase::FinalThird
        )
    }
}

/// Determines the current tactical phase for the given team.
pub fn evaluate_team_phase(world: &World, team: TeamId) -> TeamPhase {
    match world.match_phase {
        MatchPhase::PreKickoff | MatchPhase::Kickoff => {
            return if world.possession == team.index() as i8 {
                TeamPhase::KickoffAttack
            } else {
                TeamPhase::KickoffDefense
            };
        }
        MatchPhase::Corner => {
            return if world.possession == team.index() as i8 {
                TeamPhase::SetPieceAttack
            } else {
                TeamPhase::SetPieceDefense
            };
        }
        MatchPhase::Restart => {
            // Treat generic restarts as set-piece style moments.
            return if world.possession == team.index() as i8 {
                TeamPhase::SetPieceAttack
            } else {
                TeamPhase::SetPieceDefense
            };
        }
        MatchPhase::InPlay => { /* fall through */ }
    }

    let has_possession = world.possession == team.index() as i8;
    let ball_x = world.bx;

    // Convert the ball position into the team's perspective where positive X
    // always means the opponent's goal.
    let directional_ball_x = if team == TeamId::Home {
        ball_x
    } else {
        -ball_x
    };

    let half_pitch = PITCH_W * 0.5;
    let final_third_threshold = half_pitch - 18.0;
    let middle_third_threshold = 8.0;

    if has_possession {
        if directional_ball_x > final_third_threshold {
            TeamPhase::FinalThird
        } else if directional_ball_x > middle_third_threshold {
            TeamPhase::Progression
        } else {
            TeamPhase::BuildUp
        }
    } else {
        // No possession: decide which defensive block makes sense.
        if directional_ball_x > middle_third_threshold {
            TeamPhase::HighBlock
        } else if directional_ball_x > -middle_third_threshold {
            TeamPhase::MidBlock
        } else {
            TeamPhase::LowBlock
        }
    }
}
