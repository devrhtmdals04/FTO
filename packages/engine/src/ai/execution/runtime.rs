use super::controllers::Controllers;
use super::planner::Planner;
use crate::ai::decision::{self, Decision, DecisionEnvelope, IntentTarget, IntentType};
use crate::ai::{EngineCmd, EngineCmdSink, PitchView, PlayerId};
use crate::ai::debug::{self as dbg};

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
            Decision::ReceiveInBehind { point } => {
                (IntentType::Receive, IntentTarget::Point(point))
            }
            Decision::Press { target_opp, .. } => {
                (IntentType::Press, IntentTarget::Player(target_opp))
            }
            Decision::Jockey { .. } => (IntentType::Jockey, IntentTarget::None),
            Decision::Mark { target_opp, .. } => (IntentType::Mark, IntentTarget::Player(target_opp)),
            Decision::CoverShadow { line_to } => (IntentType::Cover, IntentTarget::Point(line_to)),
            Decision::BlockShot { line } => (IntentType::Block, IntentTarget::Point(line.b)),
            Decision::Tackle { target_opp, .. } => {
                (IntentType::Tackle, IntentTarget::Player(target_opp))
            }
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

#[derive(Clone, Copy, Debug, Default)]
pub struct ExecReady {
    pub can_kick: bool,
    pub relinquish_until: u64,
}

#[derive(Default)]
pub struct ExecutionModule {
    pub me_id: PlayerId,
    pub planner: Planner,
    pub controllers: Controllers,
    pub intent: Option<IntentRuntime>,
    pub pending_env: Option<DecisionEnvelope>,
    pub last_apply_tick: u64,
    pub nk_reported: bool,
    pub ball_relinquish_until: u64,
}

impl ExecutionModule {
    pub fn apply(&mut self, env: DecisionEnvelope, tick: u64, pitch: &PitchView) -> bool {
        let is_pass = matches!(env.decision,
          Decision::GroundPass{..} | Decision::ThroughBall{..} | Decision::LoftedPass{..});

        // 🔒 패스 대기/쿨다운 중 새 패스 금지
        if is_pass {
          if self.pending_env.is_some() { return false; }
          if tick < self.controllers.ball.kick_cooldown_until { return false; }
        }

        self.me_id = env.me_id.unwrap_or(self.me_id);
        self.pending_env = Some(env.clone());
        let ir = IntentRuntime::from(env.clone(), tick);
        self.planner.replan(&ir, tick, pitch);
        self.intent = Some(ir);
        self.last_apply_tick = tick;
        self.nk_reported = false;
        true
    }

    pub fn readiness(&self, tick: u64) -> ExecReady {
        ExecReady {
            can_kick: tick >= self.controllers.ball.kick_cooldown_until
                && self.pending_env.is_none(),
            relinquish_until: self.ball_relinquish_until,
        }
    }

    pub fn substep(&mut self, tick: u64, _player_id: PlayerId, engine: &mut dyn EngineCmdSink) {
        if self.intent.is_none() { return; }

        if let Some(i) = &mut self.intent {
            if i.expired(tick) || self.controllers.blocked() {
                self.intent = None;
                self.pending_env = None;
                return;
            }

            let is_pass = matches!(self.intent.as_ref().unwrap().ty, decision::IntentType::Pass);

            if let Some(tk) = self.planner.pass_timing_tick {
                // 임팩트 프레임 조건
                if let Some(env) = &self.pending_env {
                    if tick == tk {
                        if self.controllers.ball.kick_cooldown_until <= tick {
                            dbg::note_emit(tick, self.me_id, &kind_from_env(&env), env.decision.target_id() as i32);

                            // 실제 발사
                            match &env.decision {
                                decision::Decision::GroundPass { target_id, lead, pace } => engine
                                    .push(EngineCmd::GroundPass {
                                        from: self.me_id,
                                        to: *target_id,
                                        lead: *lead,
                                        pace: *pace,
                                    }),
                                decision::Decision::LoftedPass { target_id, apex, pace } => engine
                                    .push(EngineCmd::LoftedPass {
                                        from: self.me_id,
                                        to: *target_id,
                                        apex: *apex,
                                        pace: *pace,
                                    }),
                                decision::Decision::ThroughBall { target_id, lead, pace } => engine
                                    .push(EngineCmd::ThroughBall {
                                        from: self.me_id,
                                        to: *target_id,
                                        lead: *lead,
                                        pace: *pace,
                                    }),
                                _ => {}
                            }
                            self.controllers.ball.kick_cooldown_until = tick + 3;
                            self.ball_relinquish_until = tick + 2; // suppress has_ball for two subticks
                            self.pending_env = None; // 더 못 쏘게 비움
                        } else {
                            dbg::note_emit_blocked(tick, self.me_id, "cooldown");
                        }
                    }
                }
            } else {
                if is_pass && !self.nk_reported {
                    if tick >= self.last_apply_tick + 1 {
                        dbg::alert(tick, self.me_id, dbg::Reason::NK, "planner_no_t_kick");
                        self.nk_reported = true; // 같은 의도에서 한 번만
                    }
                }
            }
            // 연속 제어 커맨드(자세/이동)
            if let Some(cmd) = self.controllers.update(tick, &mut self.planner, self.me_id) {
                engine.push(cmd);
            }
        }
    }
}

fn kind_from_env(env:&decision::DecisionEnvelope)->dbg::DecKind { match env.decision {
    decision::Decision::GroundPass{..}  => dbg::DecKind::GP,
    decision::Decision::ThroughBall{..} => dbg::DecKind::TP,
    decision::Decision::LoftedPass{..}  => dbg::DecKind::LP,
    decision::Decision::Hold{..}        => dbg::DecKind::HL,
    _ => dbg::DecKind::Other
}}
