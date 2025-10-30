//! 패스/이동 경로 및 도달 타이밍 계획 모듈 (20Hz 업데이트 예정).

use super::runtime::IntentRuntime;
use crate::ai::decision::{IntentType};
use crate::ai::utility::math::REPLAN_MIN_SUBTICKS;
use crate::ai::{PitchView, Vec2};

#[derive(Clone, Debug, Default)]
pub struct Planner {
    pub target_point: Option<Vec2>,
    pub eta_tick: u64,
    pub next_replan_tick: u64,
    pub pass_timing_tick: Option<u64>,
}

impl Planner {
  pub fn replan(&mut self, i: &IntentRuntime, now_tick: u64, _pitch: &PitchView) {
    match i.ty {
      IntentType::Pass => {
        self.pass_timing_tick = Some(now_tick + 2); // 2 서브틱 후 임팩트
        self.eta_tick        = now_tick + 4;
      }
      _ => { self.pass_timing_tick = None; }
    }
    self.next_replan_tick = now_tick + REPLAN_MIN_SUBTICKS;
  }
}
