use crate::ai::decision::{Decision, DecisionEnvelope, IntentTarget, IntentType};
use crate::ai::{EngineCmd, EngineCmdSink, PitchView, PlayerId, Vec2};

#[derive(Clone, Debug)]
pub struct IntentRuntime {
    pub ty: IntentType,
    pub target: IntentTarget,
    pub expiry_tick: u64,
    pub cooldown_until: u64,
}

impl IntentRuntime {
    pub fn expired(&self, tick: u64) -> bool {
        tick >= self.expiry_tick
    }

    pub fn from(env: DecisionEnvelope, now: u64) -> Self {
        let (ty, target) = match env.decision {
            Decision::GroundPass { target_id, .. }
            | Decision::LoftedPass { target_id, .. }
            | Decision::ThroughBall { target_id, .. } => {
                (IntentType::Pass, IntentTarget::Player(target_id))
            }
            Decision::Cross { .. } => (IntentType::Pass, IntentTarget::None),
            Decision::Shoot { .. } => (IntentType::Shoot, IntentTarget::None),
            Decision::Dribble { .. } => (IntentType::Dribble, IntentTarget::None),
            Decision::Carry { .. } => (IntentType::Carry, IntentTarget::None),
            Decision::Hold { .. } => (IntentType::Hold, IntentTarget::None),
            Decision::SupportRun { anchor, .. } => (IntentType::Support, IntentTarget::Point(anchor)),
            Decision::Overlap { lane_id } => (IntentType::Overlap, IntentTarget::Lane(lane_id)),
            Decision::Underlap { lane_id } => (IntentType::Underlap, IntentTarget::Lane(lane_id)),
            Decision::PinDefender { target_opp } => {
                (IntentType::Support, IntentTarget::Player(target_opp))
            }
            Decision::ReceiveToFeet { point } => (IntentType::Receive, IntentTarget::Point(point)),
            Decision::ReceiveInBehind { point } => (IntentType::Receive, IntentTarget::Point(point)),
            Decision::Press { target_opp, .. } => {
                (IntentType::Press, IntentTarget::Player(target_opp))
            }
            Decision::Jockey { .. } => (IntentType::Jockey, IntentTarget::None),
            Decision::Mark { target_opp, .. } => (IntentType::Mark, IntentTarget::Player(target_opp)),
            Decision::CoverShadow { line_to } => (IntentType::Cover, IntentTarget::Point(line_to)),
            Decision::BlockShot { line } => (IntentType::Block, IntentTarget::Point(line.b)),
            Decision::Tackle { target_opp, .. } => (IntentType::Tackle, IntentTarget::Player(target_opp)),
        };

        let hold_ticks = (env.min_hold_ms as u64 / 50).max(1);
        let cooldown_ticks = env.cooldown_ms as u64 / 50;

        Self {
            ty,
            target,
            expiry_tick: now + hold_ticks,
            cooldown_until: now + cooldown_ticks,
        }
    }
}

#[derive(Clone, Debug, Default)]
pub struct Planner {
    pub target_point: Option<Vec2>,
    pub eta_tick: u64,
    pub next_replan_tick: u64,
    pub pass_timing_tick: Option<u64>,
}

impl Planner {
    pub fn replan(&mut self, _intent: &IntentRuntime, _pitch: &PitchView) {
        // TODO: 경로 및 타임라인 계산
    }
}

#[derive(Clone, Debug, Default)]
pub struct LocomotionController {
    pub desired_vel: Vec2,
    pub max_speed: f32,
    pub accel: f32,
    pub turn_rate: f32,
    pub body_angle: f32,
}

#[derive(Clone, Debug, Default)]
pub struct BallControlController {
    pub first_touch_power: f32,
    pub kick_cooldown_until: u64,
    pub last_kick_tick: u64,
}

#[derive(Clone, Debug, Default)]
pub struct Controllers {
    pub loco: LocomotionController,
    pub ball: BallControlController,
}

impl Controllers {
    pub fn blocked(&self) -> bool {
        false
    }

    pub fn update(
        &mut self,
        _tick: u64,
        _planner: &mut Planner,
        _player_id: PlayerId,
    ) -> Option<EngineCmd> {
        None
    }
}

#[derive(Default)]
pub struct ExecutionModule {
    pub planner: Planner,
    pub controllers: Controllers,
    pub intent: Option<IntentRuntime>,
    pub last_decision: Option<DecisionEnvelope>,
}

impl ExecutionModule {
    pub fn apply(&mut self, dec: DecisionEnvelope, tick: u64, pitch: &PitchView) {
        let runtime = IntentRuntime::from(dec.clone(), tick);
        self.planner.replan(&runtime, pitch);
        self.intent = Some(runtime);
        self.last_decision = Some(dec);
    }

    pub fn substep(
        &mut self,
        tick: u64,
        player_id: PlayerId,
        engine: &mut dyn EngineCmdSink,
    ) {
        if let Some(intent) = &mut self.intent {
            if intent.expired(tick) || self.controllers.blocked() {
                self.intent = None;
                self.last_decision = None;
                return;
            }

            let mut emitted = false;

            if let Some(last) = &self.last_decision {
                match &last.decision {
                    decision::Decision::GroundPass {
                        target_id,
                        lead,
                        pace,
                    } => {
                        let cmd = EngineCmd::GroundPass {
                            from: player_id,
                            to: *target_id,
                            lead: *lead,
                            pace: *pace,
                        };
                        engine.push(cmd);
                        emitted = true;
                    }
                    _ => {}
                }
            }

            if !emitted {
                if let Some(cmd) = self
                    .controllers
                    .update(tick, &mut self.planner, player_id)
                {
                    engine.push(cmd);
                    emitted = true;
                }
            }

            if emitted {
                self.intent = None;
                self.last_decision = None;
            }
        }
    }
}
