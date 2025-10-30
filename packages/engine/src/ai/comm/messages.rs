use crate::ai::{PlayerId, Vec2};

#[repr(u8)]
#[derive(Clone, Copy, Debug)]
pub enum MsgType {
    BallCall,
    OverlapReq,
    UnderlapReq,
    SwitchCall,
    ManOn,
    PressTrigger,
    StepUp,
    HoldUp,
    CoverMe,
    TargetMark,
    PassIntent,
}

#[derive(Clone, Copy, Debug, Default)]
pub struct MsgPayload {
    pub point: Option<Vec2>,
    pub lane: Option<u8>,
    pub target: Option<PlayerId>,
    pub strength: f32,
}

#[derive(Clone, Copy, Debug)]
pub struct TeamMessage {
    pub tick: u64,
    pub from: PlayerId,
    pub ty: MsgType,
    pub payload: MsgPayload,
    pub ttl: u8,
    pub prio: u8,
}
