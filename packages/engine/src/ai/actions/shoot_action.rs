use crate::ai::fsm::{Action, ActionContext, ActionPayload, ActionUpdate};
use crate::commands::Cmd;

// The ShootAction handler.
#[derive(Default)]
pub struct ShootAction {
    timer: u32,
}

impl Action for ShootAction {
    fn begin(&mut self, context: &mut ActionContext, _payload: &ActionPayload) -> Option<Cmd> {
        self.timer = 30; // Action lasts for 30 ticks (0.5 seconds)

        // Create a shoot command towards the opponent's goal center.
        // A more advanced implementation could aim for the most open part of the goal.
        Some(Cmd::Shoot {
            player_id: context.player_index as u8,
            tx: context.perception.opp_goal.center.x,
            ty: context.perception.opp_goal.center.y,
            power: 0.8, // Default high power
        })
    }

    fn update(&mut self, _context: &mut ActionContext) -> ActionUpdate {
        if self.timer > 0 {
            self.timer -= 1;
        }
        // In the future, this could handle logic for rebounds or follow-ups.
        ActionUpdate::None
    }

    fn is_done(&self) -> bool {
        self.timer == 0
    }
}
