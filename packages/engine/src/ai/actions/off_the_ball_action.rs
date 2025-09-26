use crate::ai::fsm::{Action, ActionContext, ActionPayload, ActionUpdate};

#[derive(Default)]
pub struct OffTheBallAction;

impl Action for OffTheBallAction {
    fn begin(&mut self, _context: &mut ActionContext, _payload: &ActionPayload) -> Option<crate::commands::Cmd> {
        None
    }

    fn update(&mut self, context: &mut ActionContext) -> ActionUpdate {
        // Move towards the tactical formation anchor position.
        let desired_dir = (context.perception.formation_anchor - context.perception.me.pos).normalize();
        let speed_ratio = if (context.perception.formation_anchor - context.perception.me.pos).norm() > 5.0 {
            1.0 // Sprint if far away
        } else {
            0.7 // Jog if close
        };
        let desired_vel = desired_dir * crate::params::PLAYER_VMAX * speed_ratio;
        ActionUpdate::Move(desired_vel)
    }

    fn is_done(&self) -> bool {
        // Off-the-ball movement is a continuous state.
        false
    }
}
