use crate::commands::Cmd;

use super::decision::PlayerAction;

pub fn into_command(player_index: usize, action: PlayerAction) -> Option<Cmd> {
    match action {
        PlayerAction::None => None,
        PlayerAction::MoveTo(target) => Some(Cmd::MovePlayerTarget {
            pid: player_index as u8,
            tx: target.x,
            ty: target.y,
        }),
        PlayerAction::GroundPass { target, .. } => Some(Cmd::GroundPass {
            player_id: player_index as u8,
            tx: target.x,
            ty: target.y,
        }),
        PlayerAction::Shoot { target } => Some(Cmd::Shoot {
            player_id: player_index as u8,
            tx: target.x,
            ty: target.y,
            power: 0.75,
        }),
    }
}
