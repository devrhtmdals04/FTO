use crate::ai::fsm::{Action, ActionContext, ActionPayload, ActionUpdate};
use crate::commands::Cmd;

// The PassAction handler.
#[derive(Default)]
pub struct PassAction {
    timer: u32,
}

impl Action for PassAction {
    fn begin(&mut self, _context: &mut ActionContext, payload: &ActionPayload) -> Option<Cmd> {
        if let ActionPayload::Pass(target) = payload {
            self.timer = 20; // Duration of the pass action

            // Create a ground pass command towards the target player's position.
            let pass_target_pos = target.mate.pos;
            Some(Cmd::GroundPass { tx: pass_target_pos.x, ty: pass_target_pos.y })
        } else {
            // If called with an invalid payload, do nothing and end immediately.
            self.timer = 0;
            None
        }
    }

    fn update(&mut self, _context: &mut ActionContext) -> ActionUpdate {
        if self.timer > 0 {
            self.timer -= 1;
        }
        ActionUpdate::None
    }

    fn is_done(&self) -> bool {
        self.timer == 0
    }
}
