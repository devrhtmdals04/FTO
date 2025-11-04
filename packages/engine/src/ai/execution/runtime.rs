use super::constraints::{self, EmissionDecision, EmissionInput, EmissionOutcome, EmissionSurface, SkillProfile};
use super::controllers::Controllers;
use super::planner::Planner;
use crate::ai::decision::{self, Decision, DecisionEnvelope, IntentTarget, IntentType};
use crate::ai::debug::{self as dbg};
use crate::ai::{EngineCmdSink, PitchView, PlayerId, Vec2};
use crate::params::DT;

#[derive(Clone, Debug, Default)]
pub struct ApplyContext {
    pub body_angle: f32,
    pub player_pos: Vec2,
    pub player_vel: Vec2,
    pub stamina: f32,
    pub pass_skill: f32,
    pub weak_foot: bool,
    pub turn_rate_max: f32,
    pub target_point: Option<Vec2>,
    pub ball_pos: Vec2,
}

#[derive(Clone, Debug, Default)]
pub struct PendingEmission {
    body_angle: f32,
    player_pos: Vec2,
    player_vel: Vec2,
    stamina: f32,
    pass_skill: f32,
    weak_foot: bool,
    turn_rate_max: f32,
    target_point: Option<Vec2>,
}

impl PendingEmission {
    fn speed(&self) -> f32 {
        self.player_vel.norm()
    }

    fn target_angle(&self) -> Option<f32> {
        self.target_point.map(|p| {
            let dir = p - self.player_pos;
            dir.y.atan2(dir.x)
        })
    }

    fn skill_profile(&self) -> SkillProfile {
        SkillProfile {
            pass_control: self.pass_skill,
            weak_foot: self.weak_foot,
            stamina: self.stamina,
        }
    }

    fn face_dir(&self) -> Option<Vec2> {
        self.target_point.map(|p| (p - self.player_pos).normalize())
    }

    fn rotate_target(&self, target: Vec2, angle: f32) -> Vec2 {
        if angle.abs() < 1e-4 {
            return target;
        }
        let offset = target - self.player_pos;
        if offset.norm_squared() < 1e-8 {
            return target;
        }
        self.player_pos + rotate_vec(offset, angle)
    }
}

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
            Decision::Shield { .. } => (IntentType::Hold, IntentTarget::None),
            Decision::FindSpace { .. } => (IntentType::Support, IntentTarget::None),
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
    pending_emit: Option<PendingEmission>,
    pending_outcome: Option<EmissionOutcome>,
    pub last_apply_tick: u64,
    pub nk_reported: bool,
    pub ball_relinquish_until: u64,
}

impl ExecutionModule {
    pub fn apply(
        &mut self,
        env: DecisionEnvelope,
        tick: u64,
        pitch: &PitchView,
        context: ApplyContext,
    ) -> bool {
        let is_pass = matches!(
            env.decision,
            Decision::GroundPass { .. }
                | Decision::ThroughBall { .. }
                | Decision::LoftedPass { .. }
        );

        // 🔒 패스 대기/쿨다운 중 새 패스 금지
        if is_pass {
            if self.pending_env.is_some() {
                return false;
            }
            if tick < self.controllers.ball.kick_cooldown_until {
                return false;
            }
        }

        self.me_id = env.me_id.unwrap_or(self.me_id);
        self.pending_env = Some(env.clone());
        self.pending_outcome = None;
        self.pending_emit = None;
        self.controllers.loco.face_dir = None;

        if matches!(
            env.decision,
            Decision::GroundPass { .. }
                | Decision::LoftedPass { .. }
                | Decision::ThroughBall { .. }
                | Decision::Shoot { .. }
        ) {
            self.pending_emit = Some(PendingEmission {
                body_angle: context.body_angle,
                player_pos: context.player_pos,
                player_vel: context.player_vel,
                stamina: context.stamina,
                pass_skill: context.pass_skill,
                weak_foot: context.weak_foot,
                turn_rate_max: context.turn_rate_max.max(0.0),
                target_point: context.target_point,
            });
        } else if matches!(env.decision, Decision::Hold { .. }) {
            let dir = (context.ball_pos - context.player_pos).normalize();
            if dir.norm_squared() > 1e-6 {
                self.controllers.loco.face_dir = Some(dir);
            }
            else {
                self.controllers.loco.face_dir = Some(Vec2 { x: 1.0, y: 0.0 });
            }
        }

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

            self.update_emission_window(tick);

            let is_pass = matches!(self.intent.as_ref().unwrap().ty, decision::IntentType::Pass);

            if let Some(tk) = self.planner.pass_timing_tick {
                // 임팩트 프레임 조건
                if let Some(env) = &self.pending_env {
                    if tick == tk {
                        if self.controllers.ball.kick_cooldown_until <= tick {
                            let outcome = if let Some(outcome) = self.pending_outcome {
                                outcome
                            } else {
                                dbg::note_emit_blocked(tick, self.me_id, "constraint_pending");
                                self.planner.pass_timing_tick = Some(tick + 1);
                                return;
                            };
                            let jitter_angle = self.sample_jitter_angle(tick, outcome);
                            let pending_snapshot = self.pending_emit.clone();
                            dbg::note_emit(tick, self.me_id, &kind_from_env(&env), env.decision.target_id() as i32);

                            let penalty_scale = outcome.penalty.power_scale;
                            let pace_scale = if matches!(outcome.surface, EmissionSurface::Forward)
                            {
                                1.0
                            } else {
                                penalty_scale
                            };

                            // 실제 발사
                            if let Some(cmd) = self.controllers.pass.emit_pass_kick(
                                &env.decision,
                                self.me_id,
                                jittered_lead(pending_snapshot.as_ref(), env.decision.lead(), jitter_angle),
                                (env.decision.pace() * pace_scale).max(0.0),
                                env.decision.apex(),
                            ) {
                                engine.push(cmd);
                            }

                            let cooldown_extra = match outcome.surface {
                                EmissionSurface::Forward => 0,
                                EmissionSurface::SideLeft | EmissionSurface::SideRight => 1,
                                EmissionSurface::Backheel => 2,
                            };
                            self.controllers.ball.kick_cooldown_until = tick + 3 + cooldown_extra as u64;
                            self.ball_relinquish_until = tick + 2; // suppress has_ball for two subticks
                            self.pending_env = None; // 더 못 쏘게 비움
                            self.pending_emit = None;
                            self.pending_outcome = None;
                            self.controllers.loco.face_dir = None;
                        } else {
                            dbg::note_emit_blocked(tick, self.me_id, "cooldown");
                        }
                    }
                }
            } else {
                if is_pass && !self.nk_reported {
                    if tick >= self.last_apply_tick + 1 {
                        dbg::reason(tick, self.me_id as usize, "planner_no_t_kick");
                        self.nk_reported = true; // 같은 의도에서 한 번만
                    }
                }
            }
            // 연속 제어 커맨드(자세/이동)
            let intent_ref = self.intent.as_ref();
            if let Some(cmd) = self
                .controllers
                .update(tick, &mut self.planner, self.me_id, intent_ref, self.pending_env.as_ref())
            {
                engine.push(cmd);
            }
        }
    }

    fn update_emission_window(&mut self, tick: u64) {
        let Some(env) = self.pending_env.as_ref() else {
            return;
        };

        if !matches!(
            env.decision,
            Decision::GroundPass { .. }
                | Decision::LoftedPass { .. }
                | Decision::ThroughBall { .. }
                | Decision::Shoot { .. }
        ) {
            return;
        }

        let Some(pending) = self.pending_emit.as_ref() else {
            return;
        };

        if let Some(dir) = pending.face_dir() {
            self.controllers.loco.face_dir = Some(dir);
        }

        let Some(target_angle) = pending.target_angle() else {
            return;
        };
        let Some(tk) = self.planner.pass_timing_tick else {
            return;
        };

        let runup_ticks = if tk > tick {
            (tk - tick) as u8
        } else {
            0
        };

        let input = EmissionInput {
            body_angle: pending.body_angle,
            target_angle,
            runup_ticks,
            dt: DT,
            turn_rate_max: pending.turn_rate_max.max(0.0),
            speed: pending.speed(),
            skill: pending.skill_profile(),
        };

        match constraints::evaluate(&input) {
            EmissionDecision::Emit(outcome) => {
                self.pending_outcome = Some(outcome);
            }
            EmissionDecision::NeedTurn { add_ticks } => {
                self.pending_outcome = None;
                let new_tick = if tk <= tick {
                    tick + add_ticks as u64
                } else {
                    tk + add_ticks as u64
                };
                self.planner.pass_timing_tick = Some(new_tick);
            }
        }
    }

    fn sample_jitter_angle(&self, tick: u64, outcome: EmissionOutcome) -> f32 {
        let scale = outcome.penalty.angle_jitter;
        if scale <= 1e-5 {
            return 0.0;
        }
        let seed = jitter_seed(self.me_id, tick, outcome.surface);
        scale * sample_unit(seed)
    }
} fn kind_from_env(env:&decision::DecisionEnvelope)->dbg::DecKind { match env.decision {
    decision::Decision::GroundPass{..}  => dbg::DecKind::GP,
    decision::Decision::ThroughBall{..} => dbg::DecKind::TP,
    decision::Decision::LoftedPass{..}  => dbg::DecKind::LP,
    decision::Decision::Hold{..}        => dbg::DecKind::HL,
    _ => dbg::DecKind::Other
}}

fn jittered_lead(pending: Option<&PendingEmission>, base_lead: Vec2, angle: f32) -> Vec2 {
    if angle.abs() < 1e-4 {
        return base_lead;
    }
    if let Some(pending) = pending {
        if let Some(target) = pending.target_point {
            let rotated = pending.rotate_target(target, angle);
            let receiver_est = target - base_lead;
            return rotated - receiver_est;
        }
    }
    base_lead
}

// fn jittered_aim(pending: Option<&PendingEmission>, base_aim: Vec2, angle: f32) -> Vec2 {
//     if angle.abs() < 1e-4 {
//         return base_aim;
//     }
//     if let Some(pending) = pending {
//         return pending.rotate_target(base_aim, angle);
//     }
//     base_aim
// }

fn rotate_vec(vec: Vec2, angle: f32) -> Vec2 {
    let cos = angle.cos();
    let sin = angle.sin();
    Vec2::new(vec.x * cos - vec.y * sin, vec.x * sin + vec.y * cos)
}

fn jitter_seed(player_id: PlayerId, tick: u64, surface: EmissionSurface) -> u64 {
    let base = (tick << 17) ^ ((player_id as u64) << 9) ^ surface_code(surface) as u64;
    mix64(base)
}

fn surface_code(surface: EmissionSurface) -> u8 {
    match surface {
        EmissionSurface::Forward => 1,
        EmissionSurface::SideLeft => 2,
        EmissionSurface::SideRight => 3,
        EmissionSurface::Backheel => 4,
    }
}

fn mix64(mut x: u64) -> u64 {
    x ^= x >> 30;
    x = x.wrapping_mul(0xBF58476D1CE4E5B9);
    x ^= x >> 27;
    x = x.wrapping_mul(0x94D049BB133111EB);
    x ^ (x >> 31)
}

fn sample_unit(seed: u64) -> f32 {
    let bits = mix64(seed);
    let fraction = (bits as f64) / (u64::MAX as f64);
    (fraction as f32) * 2.0 - 1.0
}