/// 2차 특징 계산 단계: 센싱 결과를 기반으로 파생 지표를 산출합니다.

use super::{MePercept, PassOption, PassType, PerceptionModule, PlayerPercept};
use crate::ai::coach::{TacticsView, XtGrid};
use crate::ai::decision::types::{TouchOption, TouchType};
use crate::ai::utility::math::{clamp, quant_u16_01};
use crate::ai::{PitchView, TeamId, Vec2};
use std::vec::Vec;
use crate::ai::debug::{self, ReasonCode};

impl PerceptionModule {
    pub(super) fn derive_pass_options(
        &mut self,
        _tick: u64,
        me: &MePercept,
        mates: &[PlayerPercept],
        opps: &[PlayerPercept],
        pitch: &PitchView,
        xt: &XtGrid,
        tactics: &TacticsView,
    ) -> Vec<PassOption> {
        const MAX_OPTS: usize = 8;
        let mut out = Vec::with_capacity(MAX_OPTS);

        // 1) 타깃 후보 추출: 전방·측면 우선, 거리 8~30m
        let mut candidates: Vec<&PlayerPercept> = mates
            .iter()
            .filter(|m| m.id != me.id)
            .filter(|m| forwardish(me, m)) // 전방성
            .filter(|m| dist2(me.pos, m.pos) < 30.0 * 30.0)
            .collect();

        candidates.sort_by(|a, b| {
            dist2(me.pos, a.pos)
                .partial_cmp(&dist2(me.pos, b.pos))
                .unwrap_or(std::cmp::Ordering::Equal)
        });
        candidates.truncate(6);

        for m in candidates {
            // 2) 타입별 궤도 프로토타입
            for &ty in &[PassType::Ground, PassType::Through, PassType::Lofted] {
                let (lead, pace, apex) = propose(me, m, ty);
                let recv = add(m.pos, lead);
                let dt = flight_time(me.pos, recv, pace, apex);
                let pint = intercept_prob(me.pos, recv, dt, opps);
                let prec = receiver_ctrl_prob(m, dt, opps);
                let xtd = xt.sample(recv, pitch) - xt.sample(me.pos, pitch);
                let off = predict_offside_on_arrival(me, m, lead, dt, opps);
                let lane = lane_of(me.pos, recv);

                let mut pace_q = quant_u16_01(pace);
                let mut apex_q = quant_u16_01(apex);
                if matches!(ty, PassType::Ground) {
                    apex_q = 0.0;
                }
                if matches!(ty, PassType::Through) {
                    pace_q = (pace_q * 1.05).min(1.0);
                }

                out.push(PassOption {
                    target_id: m.id,
                    ty,
                    lead,
                    pace: pace_q,
                    apex: apex_q,
                    dt_flight: dt,
                    p_intercept: pint,
                    p_receiver: prec,
                    xt_delta: xtd,
                    offside_on_arrival: off,
                    lane_id: lane,
                });
            }
        }

        // 3) 위험 필터(거친 1차): 전술 상한 사용
        let risk_max = tactics.pass_risk_max;
        out.retain(|o| !o.offside_on_arrival && o.p_intercept <= risk_max);

        // 4) 상위 N (xt_delta, p_keep 가중) 정렬
        out.sort_by(|a, b| pass_rank_key(b).partial_cmp(&pass_rank_key(a)).unwrap()); // 내림차순
        out.truncate(MAX_OPTS);

        if out.is_empty() {
            debug::alert(_tick, me.id, ReasonCode::NO, "");
        }

        out
    }

    pub(super) fn derive_touch_options(
        &mut self,
        _tick: u64,
        me: &MePercept,
        opps: &[PlayerPercept],
        pitch: &PitchView,
        xt: &XtGrid,
        _tactics: &TacticsView,
    ) -> Vec<TouchOption> {
        let mut out = Vec::with_capacity(4);

        let closest_opp_dist = opps.iter()
            .map(|o| dist2(me.pos, o.pos).sqrt())
            .fold(f32::INFINITY, f32::min);

        let p_turnover_base = (1.0 - (closest_opp_dist / 10.0)).clamp(0.0, 1.0);
        let current_xt = xt.sample(me.pos, pitch);

        // 1. ReceiveToFeet
        out.push(TouchOption {
            ty: TouchType::ReceiveToFeet,
            dir: Vec2::new(0.0, 0.0),
            p_turnover: p_turnover_base * 0.5,
            xt_delta: 0.0, // 제자리이므로 변화 없음
        });

        // 2. Carry
        let carry_dir = Vec2::new(me.body_angle.cos(), me.body_angle.sin());
        let carry_pos = add(me.pos, carry_dir);
        let carry_xt = xt.sample(carry_pos, pitch);
        out.push(TouchOption {
            ty: TouchType::Carry,
            dir: carry_dir,
            p_turnover: p_turnover_base * 0.7,
            xt_delta: carry_xt - current_xt,
        });

        // 3. ReceiveInBehind
        let behind_dir = Vec2::new(me.body_angle.cos(), me.body_angle.sin());
        let behind_pos = add(me.pos, Vec2::new(behind_dir.x * 3.0, behind_dir.y * 3.0)); // 3미터 앞으로
        let behind_xt = xt.sample(behind_pos, pitch);
        out.push(TouchOption {
            ty: TouchType::ReceiveInBehind,
            dir: behind_dir,
            p_turnover: p_turnover_base * 1.0,
            xt_delta: behind_xt - current_xt,
        });
        
        // 4. Shield
        out.push(TouchOption {
            ty: TouchType::Shield,
            dir: Vec2::new(0.0, 0.0),
            p_turnover: p_turnover_base * 0.2,
            xt_delta: -0.01, // 약간의 손실 감수
        });

        out
    }
}

#[inline]
fn pass_rank_key(o: &PassOption) -> f32 {
    let p_keep = (1.0 - o.p_intercept) * o.p_receiver;
    0.6 * o.xt_delta + 0.4 * p_keep
}

// --- 간단 근사 함수들 (MVP용) ---
fn dist2(a: Vec2, b: Vec2) -> f32 {
    let dx = a.x - b.x;
    let dy = a.y - b.y;
    dx * dx + dy * dy
}
fn add(a: Vec2, b: Vec2) -> Vec2 {
    Vec2 {
        x: a.x + b.x,
        y: a.y + b.y,
    }
}
fn forwardish(me: &MePercept, m: &PlayerPercept) -> bool {
    (m.pos.y - me.pos.y) * team_sign(me.team) > -1.0
}
fn team_sign(_t: TeamId) -> f32 {
    1.0
} // 방향 정규화(전/후반 전환은 나중에)
fn propose(_me: &MePercept, m: &PlayerPercept, ty: PassType) -> (Vec2, f32, f32) {
    match ty {
        PassType::Ground => (Vec2 { x: 0.0, y: 0.0 }, 0.55, 0.0),
        PassType::Lofted => (Vec2 { x: 0.0, y: 0.0 }, 0.62, 0.55),
        PassType::Through => {
            // 러너 속도 기반 선행 1.0~2.0m
            let lead = Vec2 {
                x: m.vel.x * 0.25,
                y: m.vel.y * 0.25,
            };
            (lead, 0.68, 0.20)
        }
    }
}
fn flight_time(from: Vec2, to: Vec2, pace: f32, apex: f32) -> f32 {
    let d = (to.x - from.x).hypot(to.y - from.y).max(0.1);
    // 간이 모델: 속도 계수로  m / (6+6*pace)  => 0.4~? s 범위
    d / (6.0 + 6.0 * pace) + 0.15 * apex
}
fn intercept_prob(from: Vec2, to: Vec2, dt: f32, opps: &[PlayerPercept]) -> f32 {
    // 최단 접근시간 대비 여유시간 시그모이드
    let mut worst: f32 = 0.0;
    for o in opps {
        let t_def = time_to_segment(o, from, to);
        let margin = dt - t_def;
        let p = 1.0 / (1.0 + (-6.0 * margin).exp()); // margin<0 → p↑
        worst = worst.max(p);
    }
    clamp(worst, 0.0, 1.0)
}
fn time_to_segment(_o: &PlayerPercept, _a: Vec2, _b: Vec2) -> f32 {
    // MVP: 거리 / vmax (vmax≈6.5m/s)
    0.0_f32.max(distance_point_to_segment(_o.pos, _a, _b) / 6.5)
}
fn distance_point_to_segment(p: Vec2, a: Vec2, b: Vec2) -> f32 {
    let ap = Vec2 {
        x: p.x - a.x,
        y: p.y - a.y,
    };
    let ab = Vec2 {
        x: b.x - a.x,
        y: b.y - a.y,
    };
    let t = ((ap.x * ab.x + ap.y * ab.y) / (ab.x * ab.x + ab.y * ab.y)).clamp(0.0, 1.0);
    let c = Vec2 {
        x: a.x + ab.x * t,
        y: a.y + ab.y * t,
    };
    (p.x - c.x).hypot(p.y - c.y)
}
fn receiver_ctrl_prob(m: &PlayerPercept, dt: f32, _opps: &[PlayerPercept]) -> f32 {
    // 간이: 몸각·속도 안정성 + 여유시간
    let speed = (m.vel.x * m.vel.x + m.vel.y * m.vel.y).sqrt();
    let s = 1.0 - (speed / 7.0).min(1.0);
    let t = (dt / 1.0).min(1.0);
    clamp(0.4 * s + 0.6 * t, 0.0, 1.0)
}
fn predict_offside_on_arrival(
    _me: &MePercept,
    _m: &PlayerPercept,
    _lead: Vec2,
    _dt: f32,
    _opps: &[PlayerPercept],
) -> bool {
    false // v0: 생략 (오프사이드 라인 정밀도는 v1에서)
}
fn lane_of(_from: Vec2, _to: Vec2) -> u8 {
    2
} // v0: 임의