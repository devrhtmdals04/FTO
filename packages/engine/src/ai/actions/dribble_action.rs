use crate::ai::fsm::{Action, ActionContext, ActionPayload, ActionUpdate};

#[derive(Default)]
pub struct DribbleAction;

impl Action for DribbleAction {
    fn begin(
        &mut self,
        _context: &mut ActionContext,
        _payload: &ActionPayload,
    ) -> Option<crate::commands::Cmd> {
        // Dribbling might have a specific plan in the future, e.g., a micro-plan.
        None
    }

    fn update(&mut self, context: &mut ActionContext) -> ActionUpdate {
        // For now, a simple dribble towards the opponent's goal.
        let dribble_dir =
            (context.perception.opp_goal.center - context.perception.me.pos).normalize();
        let dribble_vel = dribble_dir * crate::params::PLAYER_VMAX * 0.8;
        ActionUpdate::Move(dribble_vel)
    }

    fn is_done(&self) -> bool {
        // Dribbling is a continuous action that is only interrupted by a new decision.
        false
    }
}
