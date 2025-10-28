pub mod messages;
pub mod broker;

pub use broker::{CommBroker, Inbox};
pub use messages::{MsgPayload, MsgType, TeamMessage};

use crate::ai::PlayerId;

#[derive(Clone, Debug, Default)]
pub struct CommBias {
    pub pass_bonus_to: Vec<(PlayerId, f32)>,
    pub lane_bonus: Vec<(u8, f32)>,
    pub press_bias: f32,
    pub tempo_bias: f32,
}
