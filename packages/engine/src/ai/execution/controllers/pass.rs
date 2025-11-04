use crate::ai::decision::Decision;
use crate::ai::{EngineCmd, PlayerId, Vec2};

#[derive(Clone, Debug, Default)]
pub struct PassController;

impl PassController {
    pub fn emit_pass_kick(
        &self,
        decision: &Decision,
        me_id: PlayerId,
        lead: Vec2,
        pace: f32,
        apex: f32,
    ) -> Option<EngineCmd> {
        match decision {
            Decision::GroundPass { target_id, .. } => Some(EngineCmd::GroundPass {
                from: me_id,
                to: *target_id,
                lead,
                pace,
            }),
            Decision::LoftedPass { target_id, .. } => Some(EngineCmd::LoftedPass {
                from: me_id,
                to: *target_id,
                apex,
                pace,
            }),
            Decision::ThroughBall { target_id, .. } => Some(EngineCmd::ThroughBall {
                from: me_id,
                to: *target_id,
                lead,
                pace,
            }),
            _ => None,
        }
    }
}
