//! 이동/체형각/볼 터치 제어기를 담당하는 계층.

use crate::ai::{EngineCmd, PlayerId, Vec2};
use super::planner::Planner;

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

    pub fn update(&mut self, tick: u64, planner: &mut Planner, me_id: PlayerId) -> Option<EngineCmd> {
        if let Some(tk) = planner.pass_timing_tick {
            // 킥 하는 틱에는 이동/자세 명령을 내리지 않음
            if tick + 1 == tk {
                return None;
            }

            // 킥 이전에는 임시로 앞을 보도록 함
            if tick < tk {
                return Some(EngineCmd::FaceTo { id: me_id, dir: Vec2{x:1.0,y:0.0} });
            }
        }
        // 기본적으로 앞으로 달려가는 임시 명령
        Some(EngineCmd::RunTo { id: me_id, point: Vec2{x:1.0,y:0.0}, max_speed: self.loco.max_speed })
    }
}
