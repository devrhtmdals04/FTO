pub mod types;

pub use types::{
    Decision, DecisionEnvelope, Intent, IntentMemory, IntentTarget, IntentType, PlayerContext,
};

use crate::ai::coach;
use crate::ai::{PlayerId, Role, types as game_types};
use crate::ai::perception;
use crate::ai::debug::{self as dbg, DecKind, Reason};

#[derive(Default)]
pub struct DecisionModule {
    pub mem: IntentMemory,
    pub last_score: f32,
}

impl DecisionModule {
  pub fn decide(&mut self, tick: u64, pid: PlayerId, s: &perception::PerceptionSnapshot,
                tactics: &coach::TacticsView, _ctx: &PlayerContext, exec_can_kick: bool, rng_seed: u64)
                -> DecisionEnvelope {

    if s.me.has_ball && !exec_can_kick {
      return DecisionEnvelope {
        decision: Decision::Hold{ duration_ms: 140 },
        me_id: Some(pid),
        intent_id: compose_intent_id(pid, tick),
        min_hold_ms: 140,
        cooldown_ms: 60,
        score: 0.0,
      };
    }

    // 보유자 아닐 때는 기존 로직으로 분기 (여기선 패스만 다룸)
    if !s.me.has_ball || s.pass_options.is_empty() {
      return DecisionEnvelope { decision: Decision::Hold{duration_ms:160}, me_id: Some(pid), intent_id: 0, min_hold_ms:160, cooldown_ms: 80, score: 0.0 };
    }

    let pol = policy_for(s.role.base, s.game, tactics);
    let risk_cap = pol.pass_risk_max.min(tactics.pass_risk_max);

    // 1) 안전 필터 + 점수화
    let mut best_i = None;
    let mut best_u = f32::NEG_INFINITY;
    let mut any = false;
    for (i, o) in s.pass_options.iter().enumerate() {
        let p_keep = (1.0 - o.p_intercept) * o.p_receiver;
        let mut reason_code = None;
        if o.offside_on_arrival {
            reason_code = Some(Reason::OF);
        } else if o.p_intercept > risk_cap {
            reason_code = Some(Reason::RF);
        }
        if let Some(code) = reason_code {
            dbg::alert(tick, pid, code, &format!("tgt={},ty={:?},p_int={:.2},cap={:.2}", o.target_id, o.ty, o.p_intercept, risk_cap));
            continue;
        }
        any = true;
        let u = pol.weights.wT * o.xt_delta
            + pol.weights.wR * p_keep
            - pol.weights.wL * o.p_intercept * 0.35 // v0: 상대 xT 페널티 상수
            + pol.weights.wM * comm_bonus(&s.comm_bias, o.target_id, o.lane_id)
            + pol.weights.wS * shape_bonus(s, o);
        if u > best_u {
            best_u = u;
            best_i = Some(i);
        }
    }

    if !any {
        dbg::alert(tick, pid, Reason::NO, "");
    }

    // 2) ε-greedy (결정성 시드)
    let decision = if let Some(best_i) = best_i {
        let mut idx = best_i;
        let r = pcg_unit(rng_seed ^ ((pid as u64) << 16) ^ (tick >> 1));
        if r < pol.epsilon_base && s.pass_options.len() > 1 {
            idx = (r * s.pass_options.len() as f32) as usize;
        }
        let o = &s.pass_options[idx];

        // 3) Decision 매핑
        match o.ty {
            perception::PassType::Ground => {
                Decision::GroundPass { target_id: o.target_id, lead: o.lead, pace: o.pace }
            }
            perception::PassType::Lofted => {
                Decision::LoftedPass { target_id: o.target_id, apex: o.apex, pace: o.pace }
            }
            perception::PassType::Through => {
                Decision::ThroughBall { target_id: o.target_id, lead: o.lead, pace: o.pace }
            }
        }
    } else {
        Decision::Hold{duration_ms:160}
    };

    let env = DecisionEnvelope {
        decision,
        me_id: Some(pid),
        intent_id: compose_intent_id(pid, tick),
        min_hold_ms: 160,
        cooldown_ms: 120,
        score: best_u.max(0.0),
    };
    
    let kind = match &env.decision {
        Decision::GroundPass{..}  => DecKind::GP,
        Decision::ThroughBall{..} => DecKind::TP,
        Decision::LoftedPass{..}  => DecKind::LP,
        Decision::Hold{..}        => DecKind::HL,
        _ => DecKind::Other
    };
    dbg::note_decision(tick, pid, kind, env.decision.target_id() as i32, env.score);

    if s.me.has_ball && s.pass_options.len()>0 && matches!(kind, DecKind::HL|DecKind::Other) {
        dbg::alert(tick, pid, dbg::Reason::RF, "all_filtered_or_low_U");
    }

    env
  }
}

pub fn policy_for(
    _role: Role,
    _game: game_types::GameState,
    _tactics: &coach::TacticsView,
) -> game_types::RolePolicy {
    game_types::RolePolicy {
        weights: game_types::Weights {
            wT: 1.0,
            wG: 1.0,
            wR: 1.0,
            wL: 1.0,
            wS: 1.0,
            wF: 1.0,
            wC: 1.0,
            wM: 1.0,
        },
        pass_risk_max: 0.35,
        theta_shot: 0.12,
        epsilon_base: 0.05,
        min_hold_ms: 120,
        press_triggers: game_types::PressTriggers {
            on_backpass: true,
            on_bad_touch: true,
            on_hospital_pass: true,
        },
    }
}

fn comm_bonus(b:&crate::ai::comm::CommBias, target: PlayerId, lane:u8)->f32{
  let mut s=0.0; for (id,w) in &b.pass_bonus_to { if *id==target { s+=*w; } }
  for (ln,w) in &b.lane_bonus { if *ln==lane { s+=*w*0.5; } }
  s
}
fn shape_bonus(_s:&perception::PerceptionSnapshot,_o:&perception::PassOption)->f32{ 0.0 }
fn pcg_unit(seed:u64)->f32 {
  let mut x = seed.wrapping_add(0x9E3779B97F4A7C15);
  x = (x ^ (x >> 30)).wrapping_mul(0xBF58476D1CE4E5B9);
  x = (x ^ (x >> 27)).wrapping_mul(0x94D049BB133111EB);
  let y = x ^ (x >> 31);
  ((y as u64) as f64 / u64::MAX as f64) as f32
}
fn compose_intent_id(pid:PlayerId,tick:u64)->u32{ ((pid as u32) << 16) ^ (tick as u32) }
