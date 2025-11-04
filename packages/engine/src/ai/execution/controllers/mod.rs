//! 이동/체형각/볼 터치 제어기를 담당하는 계층.

pub mod touch;
pub mod pass;

use crate::ai::decision::{DecisionEnvelope, IntentTarget};
use crate::ai::{EngineCmd, PlayerId, Vec2, IntentType};
use super::runtime::IntentRuntime;
use super::planner::Planner;

#[derive(Clone, Debug, Default)]
pub struct LocomotionController {
    pub desired_vel: Vec2,
    pub max_speed: f32,
    pub accel: f32,
    pub turn_rate: f32,
    pub body_angle: f32,
    pub face_dir: Option<Vec2>,
    pub target: Option<Vec2>,
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
    pub pass: pass::PassController,
}

impl Controllers {
    pub fn blocked(&self) -> bool {
        false
    }

    pub fn update(
        &mut self,
        tick: u64,
        planner: &mut Planner,
        me_id: PlayerId,
        intent: Option<&IntentRuntime>,
        decision_env: Option<&DecisionEnvelope>,
    ) -> Option<EngineCmd> {
        if let Some(env) = decision_env {
            if let Some(cmd) = touch::execute_touch_decision(&env.decision, me_id) {
                return Some(cmd);
            }
        }

        let mut desired_face = self.loco.face_dir;

        if let Some(intent) = intent {
            match intent.ty {
                IntentType::Hold => {
                    if let Some(mut dir) = self.loco.face_dir {
                        if dir.norm_squared() < 1e-6 {
                            dir = Vec2 { x: 1.0, y: 0.0 };
                        }
                        return Some(EngineCmd::FaceTo { id: me_id, dir });
                    }
                    return None;
                },
                IntentType::Receive => {
                    self.loco.target = planner.target_point;
                    if let Some(target_point) = self.loco.target {
                        if let IntentTarget::Point(ball_intercept_point) = intent.target {
                            self.loco.face_dir = Some((ball_intercept_point - target_point).normalize());
                        }
                        return Some(EngineCmd::RunTo { id: me_id, point: target_point, max_speed: self.loco.max_speed });
                    }
                    return None;
                },
                _ => {}
            }
        }

        if let Some(tk) = planner.pass_timing_tick {
            // 킥 하는 틱에는 이동/자세 명령을 내리지 않음
            if tick + 1 == tk {
                return None;
            }
            if tick < tk && desired_face.is_none() {
                desired_face = Some(Vec2 { x: 1.0, y: 0.0 });
            }
        }

        if let Some(mut dir) = desired_face {
            if dir.norm_squared() < 1e-6 {
                dir = Vec2 { x: 1.0, y: 0.0 };
            }
            return Some(EngineCmd::FaceTo { id: me_id, dir });
        }
        // 기본적으로 앞으로 달려가는 임시 명령
        //Some(EngineCmd::RunTo { id: me_id, point: Vec2{x:1.0,y:0.0}, max_speed: self.loco.max_speed })
        None
    }
}


