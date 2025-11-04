// --- top-level: 모듈 트리와 공통 타입 ------------------------------

#[macro_use]
pub mod debug;
pub mod coach;
pub mod comm;
pub mod decision;
pub mod execution;
pub mod formations;
pub mod perception;
pub mod phase;
pub mod positioning;
pub mod scheduler;
pub mod types;
pub mod utility;
pub mod zones;

// 외부 엔진 브리지 방향의 최소 훅(필요시 엔진쪽에서 구현)
pub trait EngineView {
    fn tick(&self) -> u64;
    fn pitch(&self) -> PitchView;
    fn ball(&self) -> BallView;
    fn players(&self) -> &[EnginePlayerView]; // 22명 고정 가정 가능
}

pub trait EngineCmdSink {
    fn push(&mut self, cmd: EngineCmd);
}

// ----------- 공통 타입 --------------------------------------------------------
pub use crate::types::Vec2;

#[derive(Clone, Copy, Debug, Default)]
pub struct Vec3 {
    pub x: f32,
    pub y: f32,
    pub z: f32,
}

#[derive(Clone, Copy, Debug)]
pub struct Segment {
    pub a: Vec2,
    pub b: Vec2,
}

pub type PlayerId = u16;
pub type TeamId = u8;

#[derive(Clone, Copy, Debug)]
pub enum Footed {
    Right,
    Left,
    Both,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Role {
    Unknown,
    GK,
    RB,
    RCB,
    LCB,
    LB,
    CDM,
    RCM,
    LCM,
    RW,
    ST,
    LW,
}

impl Default for Role {
    fn default() -> Self {
        Role::Unknown
    }
}

#[derive(Clone, Copy, Debug)]
pub enum PhaseMode {
    InPossession,
    OutOfPossession,
    Transition,
    SetPiece,
}

#[derive(Clone, Copy, Debug)]
pub enum PressStyle {
    Curve,
    Direct,
    Delay,
}

#[derive(Clone, Copy, Debug)]
pub enum MarkSide {
    GoalSide,
    BallSide,
}

#[derive(Clone, Copy, Debug)]
pub enum CrossZone {
    Near,
    PenaltySpot,
    Far,
    Cutback,
}

#[derive(Clone, Copy, Debug, Default)]
pub struct PitchView {
    pub length: f32,
    pub width: f32,
    pub our_goal: Vec2,
    pub their_goal: Vec2,
}

#[derive(Clone, Copy, Debug)]
pub struct BallView {
    pub pos: Vec3,
    pub vel: Vec3,
}

#[derive(Clone, Copy, Debug, Default)]
pub struct EnginePlayerView {
    pub id: PlayerId,
    pub team: TeamId,
    pub pos: Vec2,
    pub vel: Vec2,
    pub body_angle: f32,
    pub has_ball: bool,
}

// 엔진으로 보낼 저수준 명령(Execution이 생성)
#[derive(Clone, Debug)]
pub enum EngineCmd {
    RunTo {
        id: PlayerId,
        point: Vec2,
        max_speed: f32,
    },
    FaceTo {
        id: PlayerId,
        dir: Vec2,
    },
    Shield {
        id: PlayerId,
        on: bool,
    },
    GroundPass {
        from: PlayerId,
        to: PlayerId,
        lead: Vec2,
        pace: f32,
    },
    LoftedPass {
        from: PlayerId,
        to: PlayerId,
        apex: f32,
        pace: f32,
    },
    ThroughBall {
        from: PlayerId,
        to: PlayerId,
        lead: Vec2,
        pace: f32,
    },
    Cross {
        from: PlayerId,
        zone: CrossZone,
        pace: f32,
    },
    Shoot {
        from: PlayerId,
        aim: Vec2,
        power: f32,
    },
    Tackle {
        id: PlayerId,
        target: PlayerId,
        lunge: bool,
    },
}

// 팀 컨텍스트(스케줄러가 들고 다님)
pub struct TeamCtx {
    pub team_id: TeamId,
    pub players: Vec<PlayerAgent>,
    pub comm_broker: comm::CommBroker,
    pub tactics: coach::TacticsView,
    pub xt_grid: coach::XtGrid,
    pub seed: u64,
}

// 개별 에이전트 — 각 모듈 보유
pub struct PlayerAgent {
    pub id: PlayerId,
    pub role: Role,
    pub ctx: decision::PlayerContext,
    pub perception: perception::PerceptionModule,
    pub decision: decision::DecisionModule,
    pub execution: execution::ExecutionModule,
    pub enabled: bool,
    pub slot_mask: u8,
}

impl PlayerAgent {
    pub fn slot(&self, tick: u64) -> bool {
        self.enabled && ((tick as u8) & 1) == self.slot_mask
    }
}

impl Default for TeamCtx {
    fn default() -> Self {
        Self {
            team_id: 0,
            players: Vec::new(),
            comm_broker: {
                let mut broker = comm::CommBroker::default();
                broker.inboxes = vec![comm::Inbox::default(); 11];
                broker
            },
            tactics: coach::TacticsView::default(),
            xt_grid: coach::XtGrid::default(),
            seed: 0,
        }
    }
}

impl Default for PlayerAgent {
    fn default() -> Self {
        Self {
            id: 0,
            role: Role::Unknown,
            ctx: decision::PlayerContext::default(),
            perception: perception::PerceptionModule::default(),
            decision: decision::DecisionModule::default(),
            execution: execution::ExecutionModule::default(),
            enabled: true,
            slot_mask: 0,
        }
    }
}

pub use decision::{Decision, DecisionEnvelope, Intent, IntentTarget, IntentType, PlayerContext};
pub use formations::PhaseLayout;
pub use coach::{kickoff_positions, set_piece_positions, PhaseFocus, QuantifiedTactics, TacticModel};
pub use scheduler::AiScheduler;
pub use phase::TeamPhase;
