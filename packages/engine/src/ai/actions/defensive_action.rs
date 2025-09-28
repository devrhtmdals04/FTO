use crate::ai::fsm::{Action, ActionContext, ActionUpdate, ActionPayload};

#[derive(Default)]
pub struct DefensiveAction;

impl Action for DefensiveAction {
    fn begin(&mut self, _context: &mut ActionContext, _payload: &ActionPayload) -> Option<crate::commands::Cmd> {
        None
    }

    fn update(&mut self, context: &mut ActionContext) -> ActionUpdate {
        // Simple logic: move towards the ball.
        // A better implementation would be to mark players or press the ball carrier.
        let ball_pos = context.perception.ball.pos;
        let my_pos = context.perception.me.pos;
        let move_dir = (ball_pos - my_pos).normalize();
        ActionUpdate::Move(move_dir)
    }

    fn is_done(&self) -> bool {
        // This action is never "done". The FSM will transition away when the team state changes.
        false
    }
}
