use crate::ai::decision::types::Decision;
use crate::ai::{EngineCmd, PlayerId, Vec2};

pub fn execute_touch_decision(decision: &Decision, player_id: PlayerId) -> Option<EngineCmd> {
    match decision {
        Decision::ReceiveToFeet { point } => Some(EngineCmd::RunTo {
            id: player_id,
            point: *point,
            max_speed: 0.0,
        }),
        Decision::ReceiveInBehind { point } => Some(EngineCmd::RunTo {
            id: player_id,
            point: *point,
            max_speed: 1.0,
        }),
        Decision::Carry { dir: _, speed } => Some(EngineCmd::RunTo {
            id: player_id,
            point: Vec2::new(0.0, 0.0), // This needs to be calculated
            max_speed: *speed,
        }),
        Decision::Dribble { dir: _, distance: _, shield: _ } => Some(EngineCmd::RunTo {
            id: player_id,
            point: Vec2::new(0.0, 0.0), // This needs to be calculated
            max_speed: 0.5,
        }),
        Decision::Shield { duration_ms: _ } => Some(EngineCmd::Shield {
            id: player_id,
            on: true,
        }),
        _ => None,
    }
}