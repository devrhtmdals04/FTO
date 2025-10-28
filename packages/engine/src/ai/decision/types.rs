use crate::ai::{types as game_types, CrossZone, Footed, MarkSide, PlayerId, Vec2};
use crate::ai::Segment;
use crate::ai::PressStyle;

#[derive(Clone, Copy, Debug)]
pub enum Decision {
    GroundPass { target_id: PlayerId, lead: Vec2, pace: f32 },
    LoftedPass { target_id: PlayerId, apex: f32, pace: f32 },
    ThroughBall { target_id: PlayerId, lead: Vec2, pace: f32 },
    Cross { zone: CrossZone, pace: f32 },
    Shoot { aim: Vec2, power: f32 },
    Dribble { dir: Vec2, distance: f32, shield: bool },
    Carry { dir: Vec2, speed: f32 },
    Hold { duration_ms: u16 },
    SupportRun { anchor: Vec2, lane_id: u8 },
    Overlap { lane_id: u8 },
    Underlap { lane_id: u8 },
    PinDefender { target_opp: PlayerId },
    ReceiveToFeet { point: Vec2 },
    ReceiveInBehind { point: Vec2 },
    Press { target_opp: PlayerId, approach: PressStyle },
    Jockey { line: Vec2, body_angle: f32 },
    Mark { target_opp: PlayerId, side: MarkSide },
    CoverShadow { line_to: Vec2 },
    BlockShot { line: Segment },
    Tackle { target_opp: PlayerId, lunge: bool },
}

#[derive(Clone, Debug)]
pub struct DecisionEnvelope {
    pub decision: Decision,
    pub intent_id: u32,
    pub min_hold_ms: u16,
    pub cooldown_ms: u16,
    pub score: f32,
}

#[derive(Clone, Copy, Debug)]
pub enum IntentType {
    Pass,
    Shoot,
    Dribble,
    Carry,
    Hold,
    Support,
    Overlap,
    Underlap,
    Receive,
    Press,
    Jockey,
    Mark,
    Cover,
    Block,
    Tackle,
}

impl Default for IntentType {
    fn default() -> Self {
        IntentType::Hold
    }
}

#[derive(Clone, Debug)]
pub enum IntentTarget {
    None,
    Player(PlayerId),
    Point(Vec2),
    Lane(u8),
}

impl Default for IntentTarget {
    fn default() -> Self {
        IntentTarget::None
    }
}

#[derive(Clone, Debug, Default)]
pub struct Intent {
    pub intent_id: u32,
    pub ty: IntentType,
    pub target: IntentTarget,
    pub hold_until: u64,
    pub cooldown_until: u64,
}

#[derive(Clone, Debug, Default)]
pub struct IntentMemory {
    pub active: Option<Intent>,
}

impl IntentMemory {
    pub fn clear(&mut self) {
        self.active = None;
    }
}

#[derive(Clone, Debug)]
pub struct PlayerAttrs {
    pub speed: f32,
    pub accel: f32,
    pub pass: f32,
    pub shoot: f32,
    pub dribble: f32,
    pub stamina_max: f32,
    pub height: f32,
    pub weight: f32,
    pub foot: Footed,
}

impl Default for PlayerAttrs {
    fn default() -> Self {
        Self {
            speed: 0.0,
            accel: 0.0,
            pass: 0.0,
            shoot: 0.0,
            dribble: 0.0,
            stamina_max: 1.0,
            height: 1.75,
            weight: 70.0,
            foot: Footed::Right,
        }
    }
}

#[derive(Clone, Debug)]
pub struct PlayerContext {
    pub attrs: PlayerAttrs,
    pub stamina: f32,
    pub yellow_cards: u8,
    pub red_card: bool,
}

impl Default for PlayerContext {
    fn default() -> Self {
        Self {
            attrs: PlayerAttrs::default(),
            stamina: 1.0,
            yellow_cards: 0,
            red_card: false,
        }
    }
}

pub type RolePolicy = game_types::RolePolicy;
