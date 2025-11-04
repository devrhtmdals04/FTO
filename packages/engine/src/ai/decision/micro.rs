use crate::ai::{PlayerId, Vec2};

#[derive(Clone, Debug)]
pub struct MicroAction {
    pub kind: MicroActionKind,
    pub until: u64,
}

#[derive(Clone, Debug)]
pub enum MicroActionKind {
    Orient { aim: Vec2 },
    LateralCarry { dir: Vec2, dur_ms: i32 },
    Shield { dur_ms: i32, face: Vec2 },
    Delay { dur_ms: i32 },
    GateWatch { target: PlayerId, deadline: u64 },
    PassRequest { to: PlayerId },
    TriggerRun { runner: PlayerId },
    MicroHold { dur_ms: i32 },
}

impl MicroActionKind {
    pub fn short_str(&self) -> &'static str {
        match self {
            MicroActionKind::Orient { .. } => "orient",
            MicroActionKind::LateralCarry { .. } => "lat_carry",
            MicroActionKind::Shield { .. } => "shield",
            MicroActionKind::Delay { .. } => "delay",
            MicroActionKind::GateWatch { .. } => "gate_watch",
            MicroActionKind::PassRequest { .. } => "pass_req",
            MicroActionKind::TriggerRun { .. } => "trig_run",
            MicroActionKind::MicroHold { .. } => "hold",
        }
    }
}
