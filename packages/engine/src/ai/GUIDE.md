새 의사결정·실행 파이프라인 구체화 가이드

  - 지금 상태 이해
    DecisionModule::decide 는 공 소유 여부를 확인한 뒤, 아직 점수화 로직이 없는 score_on_ball_decisions 결과를 사용하고, 없으면 기본 Hold 의도를 반환합
    니다 (packages/engine/src/ai/decision/mod.rs:20). 실행 측 ExecutionModule::substep 역시 생성된 의도가 있을 때만 controller가 Option<EngineCmd>를 내
    지만, 현재 controllers::update는 항상 None을 돌려 실제 엔진 명령이 나오지 않습니다 (packages/engine/src/ai/execution/runtime.rs:100).
  - 1단계: 최소 의사결정 채우기
      - packages/engine/src/ai/decision/scorers.rs 에서 기본 온볼 의사결정을 하나 이상 구현합니다. 예:

        Decision::GroundPass { target_id, lead, pace }
        Decision::Carry { dir, speed }
        를 상황에 따라 채택하도록 score_on_ball_decisions에서 후보 점수를 계산하세요. 초기에는 간단히 “가장 가까운 팀 동료에게 패스” 같은 규칙 기반으로
        시작해도 됩니다.
      - 공이 없는 상황에 대한 분기(else)도 작성해 SupportRun, Press 같은 행동을 반환하면 다음 단계에서 실행 모듈이 한층 풍부한 명령을 내릴 수 있습니다.
  - 2단계: 실행 컨트롤러 연결
      - packages/engine/src/ai/execution/runtime.rs 의 Controllers::update가 Option<EngineCmd>를 돌려주도록 구현합니다. 예를 들면:
          - Decision::Carry → EngineCmd::RunTo { point, max_speed }
          - Decision::FaceTo 형태를 새로 정의하거나 ThroughBall/Shoot를 EngineCmd::Shoot 등으로 변환.
      - 의도를 해석해 실제 좌표·속도를 만들어내는 로직(현재 빈 planner/controllers)을 작성해야 합니다. 최소 버전으로는 의도의 목적지/방향을 그대로 엔진
        커맨드에 매핑하고, 나중에 경로 계획이나 충돌 방지를 붙이면 됩니다.
  - 3단계: 커맨드 스트림 검증
      - ExecutionModule::substep 에서 EngineCmd가 생성되면 큐에 들어가 Engine::apply_engine_cmd 로 전달됩니다 (packages/engine/src/engine.rs:270).
      - 플레이어가 공을 가지고 있지 않은데 슛/패스를 시도하지 않는지, RunTo가 실제로 타깃 좌표를 향해 움직이는지 등 기본 시나리오를 테스트하세요. 기존
        Wasm 뷰나 테스트 하네스를 이용해 움직임이 발생하는지 확인하면 됩니다.
  - 4단계: 전술 연동 확장
      - 위 두 단계가 작동한 뒤 QuantifiedTactics 값을 활용해 의사결정에 가중치를 주거나 임계값을 조정하세요. 예: press_intensity가 높으면
        Decision::Press 우선순위를 높이는 식입니다.
      - 개인 지시(personal_instructions)도 의사결정 컨텍스트(PlayerContext)에 흡수해 역할별로 행동 패턴을 차별화하면 최종 목표에 가까워집니다.

  이렇게 최소한의 행동을 구현하고 점차 전술/컨트롤러 로직을 세분화하면, 새 AI 파이프라인이 실질적인 경기 동작을 만들어낼 수 있습니다.


  아주 구체적으로, “패스” 행동을 넣을 때 각 모듈이 맡는 일과 넘겨주는 데이터/함수 훅을 한 번에 정리해줄게. (우리가 이미 갖춘 스켈레톤에 그대로 끼워 넣는 형태)

0) 추가/확장 타입 (가볍게)
// ai/perception.rs
#[derive(Clone, Debug)]
pub struct PassOption {
  pub target_id: PlayerId,
  pub ty: PassType,              // Ground / Lofted / Through
  pub lead: Vec2,                // 수신 예측점 오프셋
  pub pace: f32,                 // 초기 속도(0..1 정규화)
  pub apex: f32,                 // Lofted/Through용
  pub p_intercept: f32,          // 차단 확률
  pub p_receiver: f32,           // 수신자 컨트롤 확률
  pub dt_flight: f32,            // 비행 시간(초)
  pub xt_delta: f32,             // 팀 xT 기대 상승
  pub offside_on_arrival: bool,  // 도착시점 오프사이드?
  pub lane_id: u8,               // 패싱 레인
  pub features: [f32; 8],        // 각/거리/가시/압박 등 캐시
}

#[derive(Clone, Copy, Debug)]
pub enum PassType { Ground, Lofted, Through }

// ai/decision.rs (유틸에 쓰기 위해)
#[derive(Clone, Debug)]
pub struct PassScore {
  pub option_idx: usize,
  pub score: f32,
}


PerceptionSnapshot에만 아래 한 줄 추가:

pub struct PerceptionSnapshot {
  /* ...기존 필드... */
  pub pass_options: smallvec::SmallVec<[PassOption; 8]>, // 상위 N개만
}

1) Perception — “패스 후보 만들어 Decision에 넘김”

역할

누구에게, 어떤 궤적으로, 어느 속도로 찔러야 할지 후보군을 만든다.

차단/오프사이드/수신준비/비행시간/xT 변화 등 핵심 특징을 수치화해 둔다.

핵심 로직 포인트

후보 타깃 선택: 근접/전방/각도/가시성으로 6~8명 후보 골라냄.

궤적 유형 분기:

Ground: 낮은 apex, 짧/중거리, 차단 라인 적음.

Lofted: 차단자 많거나 각도 좁을 때, 공중으로 넘김.

Through: 뒷공간 러너(+OverlapReq)에게 선행점 lead 포함.

p_intercept 근사: t_ball(d, pace, apex) vs 수비 최단접근시간 t_def(min) → σ(α*(t_ball - t_def)).

p_receiver: 수신자의 몸각/속도/첫터치 능력/압박으로 모델.

offside_on_arrival: 패스 순간 스냅샷 규정에 맞춰 도착시점 수신자 위치 예측.

xt_delta: 수신 예상점의 xT − 현재 xT.

CommBias 적용(수치화만): BallCall가 있는 타깃은 features[?]에 플래그/가중 추가.

출력

위의 pass_options 상위 N(보통 6~8개)만 PerceptionSnapshot에 포함.

2) Decision — “후보 점수화→선택→엔벨로프 생성”

역할

Perception이 건넨 pass_options를 정책/상황 가중치로 점수화하고 1개를 고른다.

핵심 로직 포인트

안전 게이트: option.p_intercept <= min(tactics.pass_risk_max, role_policy.pass_risk_max)만 통과,
offside_on_arrival == false만 유지.

유틸리티:

U = wT*xt_delta
  + wR*((1 - p_intercept)*p_receiver)          // P_keep
  - wL*(p_intercept * opp_xt_punish_estimate)  // 턴오버 리스크
  + wM*comm_bonus(target_id, lane_id)          // 콜/오버랩 가중
  + wS*shape_bonus_if_pass_fits_shape
  + wF*fatigue_bias
  + wC*context_bias(clock/score)


타입/파라미터 결정: option.ty/lead/pace/apex 그대로 사용(또는 미세 보정).

선택: ε-그리디 + 히스테리시스.

결과: Decision::GroundPass/LoftedPass/ThroughBall 중 하나로 DecisionEnvelope 생성.

min_hold_ms: 120–220ms (킥 모션 안정화)

cooldown_ms: 100–200ms (즉시 재패스 방지)

(선택) Outbox 메시지: 다음 사이클을 위한 PassIntent{to, eta} 전송 권장(아래 Comm 참고).

3) Communication — “콜을 가중치로, 의도를 팀에 공유”

역할

입력: BallCall/OverlapReq/ManOn 등 → Perception의 comm_bias에 반영.

출력(선택): 패스가 확정되면 다음 사이클을 위한 신호를 남김.

옵션 ①: 단순히 생략(수신자는 자체 Perception으로 예측).

옵션 ②: 메시지 추가:

// comm::messages.rs
MsgType::PassIntent  // (추가해도 됨. 이전 설계엔 없었지만 패스 상호작용 향상용)
payload: { target: Some(player_id), strength: pace, /* ETA 유사값을 strength로 encode or 확장필드 */ }
ttl: 4~6 ticks, prio: 2


효과: 수신자/근처 동료가 다음 10Hz 판단에서 ReceiveToFeet/ReceiveInBehind 가중 업.

4) Execution — “킥을 실제로 발사”

역할

자세/발 선택/접근 스텝/임팩트 타이밍을 20 Hz 제어로 맞추고, 적절한 엔진 커맨드 발행.

핵심 로직 포인트

Planner:

목표 체형각 세팅(공-타깃 방향 정렬 허용 오차).

접근 거리(0.5~0.9 m)와 임팩트 틱(now + n_subticks) 스케줄.

Controllers:

Locomotion: 가속/회전(최대 각속도)로 임팩트 포즈 달성.

BallControl: 임팩트 순간 pace/apex/lead를 엔진 단위로 변환.

EngineCmd 매핑:

Ground: EngineCmd::GroundPass{from, to, lead, pace}

Lofted: EngineCmd::LoftedPass{..., apex, pace}

Through: EngineCmd::ThroughBall{..., lead, pace}

제약:

임팩트 직전 수비가 경로를 막아 p_intercept 급상승하면, 마지막 순간 취소/드리블 전환(선택).

오프사이드 위험: 수신 ETA 재평가해 위험하면 낮은 pace/다른 옵션으로 리플랜(선택).

패스 발사 후:

의도 TTL 소진 → 자동으로 SupportRun 등으로 내부 fallback 전환(플래너 규칙).

5) Scheduler — “순서와 주파수 유지”

역할

틱 순서 보장: CommBroker.tick → Perception → Decision(Outbox enqueue) → Execution.apply

10 Hz에서 패스 결정, 20 Hz에서 임팩트까지 세밀 제어.

같은 틱에 다수가 메시지 보내도 결정적 정렬로 처리.

6) Coach/Tactics — “리스크·스타일 가이드”

역할

tactics.pass_risk_max, press_intensity, 라인/폭/컴팩트가 패스 빈도/성향에 영향.

RolePolicy의 theta_shot/weights로 “패스 vs 슈팅/드리블” 균형 튜닝.

상황 편향: 리드/언더독/종료 임박 시 전진 패스 가중 ↑ 또는 리스크 ↓.

7) Rules/Physics(엔진 측) — “판정과 궤도”

오프사이드 스냅샷: 킥 순간 기준.

공중 궤도: pace/apex → 초기 속도/스핀으로 변환(엔진).

인터셉션은 엔진에서 실제 충돌/접근으로 판정(우린 확률로만 예측).

8) 최소 연결 의사코드

Perception

fn derive_pass_options(snap_raw, team, tactics) -> SmallVec<[PassOption; 8]> {
  let mut opts = smallvec![];
  for mate in select_targets(snap_raw) {
    for &ty in &[PassType::Ground, PassType::Through, PassType::Lofted] {
      let (lead, pace, apex) = propose_trajectory(snap_raw, mate, ty);
      let dt = flight_time(lead, pace, apex);
      let p_int = intercept_prob(snap_raw, lead, pace, apex);
      let p_recv = receiver_control_prob(snap_raw, mate, dt);
      let xt = team.xt_grid.sample(predicted_receive_point(...), &snap_raw.pitch) - snap_raw.scores.xt_here;
      let off = predict_offside_on_arrival(...);
      opts.push(PassOption{ target_id: mate.id, ty, lead, pace, apex,
                            p_intercept:p_int, p_receiver:p_recv, dt_flight:dt,
                            xt_delta:xt, offside_on_arrival:off, lane_id: lane_of(...),
                            features: pack_features(...)} );
    }
  }
  keep_topn(opts, 8)
}


Decision

fn decide_pass(s: &PerceptionSnapshot, pol: &RolePolicy) -> Option<DecisionEnvelope> {
  let mut scored: Vec<PassScore> = vec![];
  for (i, o) in s.pass_options.iter().enumerate() {
    if o.offside_on_arrival || o.p_intercept > pol.pass_risk_max.min(s.tactics.pass_risk_max) { continue; }
    let p_keep = (1.0 - o.p_intercept) * o.p_receiver;
    let u = pol.weights.wT*o.xt_delta
          + pol.weights.wR*p_keep
          - pol.weights.wL*o.p_intercept * estimate_opp_xt_if_turnover(...)
          + comm_bonus(s.comm_bias, o.target_id, o.lane_id)*pol.weights.wM
          + shape_bonus(...)*pol.weights.wS;
    scored.push(PassScore{ option_idx:i, score:u });
  }
  let best = select_with_epsilon_hysteresis(&scored, ...)?;
  let o = &s.pass_options[best.option_idx];
  let decision = match o.ty {
    PassType::Ground  => Decision::GroundPass  { target_id:o.target_id, lead:o.lead, pace:o.pace },
    PassType::Lofted  => Decision::LoftedPass  { target_id:o.target_id, apex:o.apex, pace:o.pace },
    PassType::Through => Decision::ThroughBall { target_id:o.target_id, lead:o.lead, pace:o.pace },
  };
  Some(DecisionEnvelope{ decision, intent_id: new_intent_id(), min_hold_ms: 160, cooldown_ms:120, score: best.score })
}


Execution

fn apply_pass(env: &DecisionEnvelope) {
  // Planner: 임팩트 시간/포즈 계획
  // Controllers.update(): 임팩트 틱에 맞춰 EngineCmd::*Pass 발행
}


Communication (선택)

// Outbox: 패스 의도 공유
Some(TeamMessage{
  tick, from: me, ty: MsgType::PassIntent,
  payload: MsgPayload{ target: Some(o.target_id), strength: o.pace, point: None, lane: Some(o.lane_id) },
  ttl: 6, prio: 2
})

9) DoD 체크리스트 (패스 전용)

 같은 스냅샷/씨드에서 항상 같은 대상/타입/파라미터 선택.

 pass_risk_max를 낮추면 안정 패스 비율↑, 높이면 전진 패스/스루 비율↑.

 BallCall/OverlapReq가 있을 때 해당 대상/레인의 선택 확률↑.

 비행시간/오프사이드 예측이 실제 엔진 판정과 ±1틱 이내로 맞음.

 패스 직전 수비 접근 급상승 시 취소/대안 선택이 로그에서 확인됨(옵션).

 22명×10 Hz에서 후보 생성·스코어링 시간 예산 내.

—

요약하면,

Perception이 “누구에게/어떻게/얼마나 위험한지”를 수치화한 PassOption을 만들고,

Decision이 전술/상황 가중치로 점수화해 Ground/Lofted/Through 중 하나를 고르며,

Execution이 20 Hz로 임팩트까지 정밀 제어해서 엔진 커맨드를 발사하고,

Communication은 BallCall/OverlapReq로 가중치를 주고(선택적으로 PassIntent도 브로드캐스트),

Scheduler가 이 순서를 결정적으로 보장한다—가 패스 행동의 전체 파이프라인이야.