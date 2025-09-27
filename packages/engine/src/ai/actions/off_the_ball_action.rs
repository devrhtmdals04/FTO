use crate::ai::fsm::{Action, ActionContext, ActionPayload, ActionUpdate};
use crate::ai::utility::{make_move, player_nav};

#[derive(Default)]
pub struct OffTheBallAction;

impl Action for OffTheBallAction {
    fn begin(
        &mut self,
        _context: &mut ActionContext,
        _payload: &ActionPayload,
    ) -> Option<crate::commands::Cmd> {
        None
    }

    fn update(&mut self, context: &mut ActionContext) -> ActionUpdate {
        let nav = player_nav(context.perception.me.pos, context.perception.target_pos);
        let desired_vel = make_move(&nav, crate::params::PLAYER_VMAX, 5.0, 0.7);
        ActionUpdate::Move(desired_vel)
    }

    fn is_done(&self) -> bool {
        // Off-the-ball movement is a continuous state.
        false
    }
}
