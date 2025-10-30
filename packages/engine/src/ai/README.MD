전체 데이터 흐름(요약)
[Engine(World SoA, Rules, Physics)] 20 Hz
        │             ▲
        ▼             │ Commands (quantized)
 [AI Scheduler] 10 Hz ├─────────────────────────────────────────────┐
   per player         │                                             │
        │             │                                             │
        ├─► Perception (Sense→Derive→Blackboard) ────────────────┐  │
        │                │                                     │  │  │
        │                └─► Comm.Inbox 적용(사회적 신호)       │  │  │
        │                                                      │  │  │
        ├─► Decision (Generate→Score→Select) ─┬─► Comm.Outbox ─┘  │  │
        │                                      │                   │  │
        └─► Execution (Planner→Controllers→CmdQueue) ─────────────┘  │
                                                                      │
[Team Comm Broker (deterministic order)] ───► 각 선수 Inbox 업데이트 ┘

디렉터리/모듈 레이아웃
ai/
  scheduler.rs                 // 2틱마다 선수별 예산 분배/호출
  perception/
    mod.rs
    sense.rs                   // 1차 센싱(위치/속도/거리/시야 등)
    derive.rs                  // 2차 특징(xT, 레인, 압박, 오프사이드 등)
    blackboard.rs              // 선수별 스냅샷 캐시(PerceptionSnapshot)
    memory.rs                  // 단기기억(최근 터치, 콜, 위협 등)
  decision/
    ... (이전 답변 사양 그대로)
  execution/
    mod.rs
    planner.rs                 // 경로/도달점/타임라인(20 Hz)
    controllers.rs             // 이동/체형각/볼터치 제어기
    actions.rs                 // Decision→Atomic Command 변환
    queue.rs                   // 엔진 커맨드 큐 어댑터
    constraints.rs             // 충돌/룰 제약(슬라이딩 윈도우)
  comm/
    mod.rs
    messages.rs                // 메시지 타입/페이로드
    broker.rs                  // 팀 브로커(결정적 정렬)
    inbox.rs                   // 선수별 필터/TTL/가중치 변환
    policy.rs                  // 메시지 발신/수신 휴리스틱
  coach/
    tactics_view.rs            // 라인/폭/프레스/역할 뷰
    commands.rs                // 외부 지휘(전술 변경) 반영
  xt/
    grid.rs
  utility/
    math.rs, rng.rs, spatial.rs

1) Scheduler (10 Hz)
// ai/scheduler.rs
pub struct AiScheduler {
  phase_tick_mod: u8, // 0/1 교대 평가
}

impl AiScheduler {
  pub fn tick(&mut self, tick: u64, team_ctx: &mut TeamCtx, engine: &EngineView) {
    // 1) 팀 브로커(CommBroker) 먼저 tick → 이전 턴 Outbox를 정규화해 Inbox 반영
    team_ctx.comm_broker.tick(tick);

    // 2) 선수 루프(해당 틱 슬롯만: 홀수/짝수)
    for p in team_ctx.players.iter_mut().filter(|p| p.slot(tick)) {
      // Perception→Decision
      let snap = p.perception.build_snapshot(tick, engine, &team_ctx);
      let decision = p.decision.decide(tick, p.id, &snap, &team_ctx.tactics, &p.ctx, team_ctx.seed);
      // Decision에서 올라온 Outbox는 브로커에 등록
      team_ctx.comm_broker.enqueue(decision.intent_id, p.id, decision_to_msg(&decision, &snap));
      // Execution로 위임(즉시 계획 업데이트)
      p.execution.apply(decision, tick, engine.pitch());
    }

    // 3) 모든 선수 Execution는 20 Hz 서브틱에서 지속 업데이트(경로추종/속도/몸각)
  }
}


원칙: Comm → Perception → Decision → Outbox 등록 → Execution 순서 고정.

예산: 선수당 ~0.3–0.5 ms/10 Hz. 후보 수 상한으로 보장.

2) Perception
역할

엔진 SoA에서 정규화된 선수 스냅샷을 만든다.

팀/상대 공간구조(점유, 레인, 오프사이드, 압박), xT, 위협·기회 파생치.

Communication Inbox를 읽어 사회적 편향(예: “나한테 줘”, “오버랩 갈게”)을 수치화.

핵심 인터페이스
// ai/perception/blackboard.rs
pub struct PerceptionSnapshot { /* (이전 답변의 타입들) + 아래 추가 필드 */ 
  pub comm_bias: CommBias,       // 받은 콜을 수치화한 버프/디버프
  pub set_piece: Option<SetPieceCtx>,
  pub visibility: VisibilityMap, // 가시성/각도/차단 라인 요약
}

// ai/perception/mod.rs
pub struct PerceptionModule { mem: PerceptMemory, tmp: Scratch }
impl PerceptionModule {
  pub fn build_snapshot(
    &mut self, tick: u64, engine: &EngineView, team: &TeamCtx
  ) -> PerceptionSnapshot {
    let s1 = sense::sample(engine, self.mem.last_positions());
    let s2 = derive::features(&s1, &team.xt_grid, &team.tactics);
    let comm = team.comm_broker.inbox_for(self.mem.player_id).summarize(&s2);
    blackboard::compose(&s1, &s2, comm, tick)
  }
}

파생 규칙(샘플)

압박 스코어: 반경 R 내 상대 수·접근시간·각도(등지는지)로 pressure ∈ [0,1].

레인/패스 차단: 수비 접근시간 vs 공 비행시간으로 P_intercept.

오프사이드 라인: 상대 2번째 마지막 수비수 y를 스캔, 레인 overlap 마스킹.

Comm 적용:

BALL_CALL(from=t) → comm_bias.pass_bonus[t] += f(dist, angle)

OVERLAP_REQ → 해당 레인의 ΔxT_team 가중치 +α

MAN_ON → 보유자일 때 Hold/Shield 후보에 보너스

3) Decision

이전 답변의 G0~G4 파이프라인을 그대로 사용.

입력으로 snap.comm_bias를 받아 유틸리티 항에 합산:

U(a) += wM * Comm_bonus(a, snap.comm_bias)


선택된 행동은 Outbox로 변환될 수 있음(예: “나에게 패스해” 콜을 진짜 발신).

4) Communication
목표

팀 내 경량 브로드캐스트로 의도 공유와 중복 행동 해소(예: 동시 오버랩 방지).

결정성 보장: 같은 틱에 여러 메시지가 와도 정해진 순서로 처리.

메시지 타입/포맷
// ai/comm/messages.rs
#[repr(u8)]
pub enum MsgType {
  BallCall,         // 패스 요청
  OverlapReq,       // 오버랩 갈게
  UnderlapReq,
  SwitchCall,       // 측면 전환 신호
  ManOn,            // 압박 경고
  PressTrigger,     // 재압박 트리거 감지(백패스/터치미스)
  StepUp,           // 라인 올려
  HoldUp,           // 템포 늦춰
  CoverMe { lane: u8 },
  TargetMark { opp_id: u16 },
}

pub struct TeamMessage {
  pub tick: u64,
  pub from: u16,
  pub ty: MsgType,
  pub payload: MsgPayload,   // 소수 파라미터(점/아이디/레인/강도)
  pub ttl: u8,               // 틱 단위
  pub prio: u8,              // 0(낮음)~3(높음)
}

브로커(결정적 정렬)
// ai/comm/broker.rs
pub struct CommBroker { outbox: Vec<TeamMessage>, inbox: [SmallVec<TeamMessage>; 11] }

impl CommBroker {
  pub fn enqueue(&mut self, intent_id: u32, from: u16, msg: Option<TeamMessage>) { /* ... */ }

  pub fn tick(&mut self, tick: u64) {
    // 1) Outbox→정렬: (prio desc, tick asc, from asc, hash(payload) asc)
    // 2) TTL 감소/만료 제거
    // 3) 팀 전원 Inbox에 배포(가시성/거리 필터는 선수별 Inbox에서 적용)
  }

  pub fn inbox_for(&self, pid: u16) -> InboxView { /* ... */ }
}


수신 필터: 거리/각도/역할로 가중치화(무음/시야 외 메시지는 약한 영향).

중복 억제: 동일 레인에 OverlapReq가 N개면, Perception 단계에서 가장 근접 ETA 1명만 보너스 유지.

발신 정책(예)

BallCall: 수신자 후보의 P_receive * ΔxT가 임계↑일 때만 전송, 쿨다운 2 s.

PressTrigger: 상대의 백패스·터치미스 감지 시, 지역 반경 내 선수에만 TTL=6 틱으로 브로드캐스트.

5) Execution
역할

DecisionEnvelope → 저수준 계획/제어기로 번역.

20 Hz에서 경로추종/체형각을 미세 조정(Decision은 10 Hz로만 갱신).

룰·물리 제약(충돌/오프사이드/파울 위험)과 Intent TTL을 관리.

인터페이스
// ai/execution/mod.rs
pub struct ExecutionModule {
  planner: Planner,
  controllers: Controllers,
  intent: Option<IntentRuntime>, // 현재 수행중 의도
}

impl ExecutionModule {
  pub fn apply(&mut self, dec: DecisionEnvelope, tick: u64, pitch: &Pitch) {
    self.intent = Some(IntentRuntime::from(dec));
    self.planner.replan(self.intent.as_ref().unwrap(), pitch);
  }

  // 20 Hz 서브틱에서 호출
  pub fn substep(&mut self, tick: u64, engine: &mut EngineCmdSink) {
    if let Some(i) = &mut self.intent {
      if i.expired(tick) || self.controllers.blocked() { self.intent = None; return; }
      let ctrl = self.controllers.update(tick, &mut self.planner);
      queue::emit(engine, ctrl); // GroundPass/Shoot/Run 등으로 변환
    }
  }
}

구성요소

Planner:

오프볼: 도달점(anchor/point)로 경로(격자/회피) + ETA.

보유자: 패스/슈팅 시, 체형각 세팅 → 스텝수→접근거리→터치 타이밍 타임라인 생성.

Controllers:

Locomotion: 가/감속, 회전(최대 각속도) 제한.

Ball Control: 터치 강도/각도, 킥 파워→속도/스핀 맵핑.

Constraints:

안전거리, 동선 충돌 방지, 오프사이드 발생 직전 Stop/Hold(룰 위반 방지).

6) Coach / Tactics 연결

외부 UI/엔진 브리지 → coach::commands → tactics_view 최신화.

tactics_view는 Perception/Decision에서 가중치·임계값으로만 참조(하드 스위치 없음).

필요 시 팀 콜(StepUp, HoldUp)을 코치 채널에서 강제 브로드캐스트(높은 prio).

7) 결정성 & 성능 포인트

순서 고정: CommBroker.tick → Perception → Decision(Outbox enqueue) → Execution.apply.

정렬 규칙(브로커)으로 동일 틱 경쟁 상황 해소.

난수 사용은 Decision의 ε-greedy/타이브레이커 한정, 씨드는 (match_seed ^ pid<<16 ^ tick>>1) 패턴 고정.

후보 수 상한, 메시지 TTL, 경로 재계획 최소 간격(예: ≥100 ms)로 시간 예산 확보.

8) 테스트/계측(DoD)

 결정성: 동일 입력/씨드/틱 → 동일 메시지 정렬/같은 Decision/같은 Cmd 시퀀스.

 통신 효과: BallCall 케이스에서 수신자 가중치 상승 → 패스 확률 유의 증가.

 중복 억제: 오버랩 2인 동시 콜 → 1인만 보너스 남고 나머지는 Shape 유지.

 실패 복구: 패스 차단/컨트롤 미스 발생 시 Execution의 Fallback(최근 Anchor 복귀) 동작.

 성능: 22명×10 Hz 의사결정 + 22명×20 Hz 서브틱 제어 총 프레임 타임 예산 내.

 로그: tick, pid, inbox(top3), candidates(top5), chosen, U, ε, outbox? CSV.

9) 간단 시퀀스 예시
A) 측면 오버랩 생성→패스→크로스

CommBroker.tick: 없음.

Perception(윙백): 측면 라인 공간↑, 하프스페이스 동료 보유.

Decision(윙백): OverlapReq Outbox 전송 + 자신은 SupportRun.

Perception(윙어 보유자): Inbox에 OverlapReq 감지 → comm_bias로 Through/Carry 가중 ↑.

Decision(보유자): Carry로 각도 개선 후 ThroughBall 선택.

Execution: 윙백 런 ETA 동기화, 패스 타이밍 발사 → 수신 → Cross 실행.

B) 재압박 트리거

상대 백패스 감지 → PressTrigger 브로드캐스트(TTL=6, prio=3).

근처 3명이 Inbox로 받아 Press 후보에 +보너스, 한 명은 CoverShadow로 균형.

10) 최소 공개 API (엔진 브리지 관점)
pub trait AiHooks {
  fn ai_tick_10hz(&mut self, tick: u64, engine: &EngineView, sink: &mut EngineCmdSink);
  fn ai_subtick_20hz(&mut self, tick: u64, engine: &EngineView, sink: &mut EngineCmdSink);
}

pub struct TeamCtx {
  pub players: Vec<PlayerAgent>,
  pub comm_broker: CommBroker,
  pub tactics: TacticsView,
  pub xt_grid: XtGrid,
  pub seed: u64,
}


브라우저 루프: 매 틱 ai_subtick_20hz 호출, tick % 2 == 0이면 ai_tick_10hz도 호출.

한 줄 요약

Comm→Perception→Decision→Execution의 순서 고정과 결정적 브로커로 팀 내 신호를 수치화해 의사결정에 녹이고, Execution이 20 Hz로 세밀 제어를 맡는 얇은 후보 기반 유틸리티 + 경로/제어 분리 아키텍처가 전체 골격이야.


실행 예시)
시뮬레이션 타임라인 (예시)

표기 규칙

t=초 | tick=N (20 Hz → 한 틱 0.05 s)

AI: 10 Hz → 짝수 틱에서 결정(예시)

RW(#7) = 보유자, RB(#2)=오버랩, AM(#10)=하프스페이스, CF(#9)=박스 러너

A) 측면 오버랩 → 스루패스 → 크로스
t=60.00 | tick=1200 (의사결정 발화)

Perception(#7)

센싱: 자신 우측 터치라인 근처, 전방 18 m 공간. 근접 압박 1명(1.8 m).

레인/차단: AM(#10)에게 지상 패스 P_intercept≈0.10, RB(#2) 뒷공간 스루 P_intercept≈0.22.

xT: 현재 셀 0.03, 하프스페이스 전진 시 0.08(+0.05).

Comm.Inbox: OverlapReq(from:RB#2, TTL=6, prio=2) 도착 → 해당 레인 행동 보너스 부여.

Decision(#7)

후보 생성:

Carry(각도개선, 4 m) 2) ThroughBall→RB 3) Pass→AM 4) Hold 5) Dribble(내측, 3 m)

스코어(요지):

Carry: ΔxT +0.05, 압박 회피 ↑, U≈0.62

Through→RB: ΔxT +0.18 좋지만 P_intercept 0.22와 각도 미세 불리, U≈0.58

Pass→AM: 안정적 P_keep↑, U≈0.55

선택: Carry(4 m). (ε-greedy에서 ε 미발동, 히스테리시스 없음)

Outbox: (보내지 않음 — 이미 OverlapReq 수신 중)

Execution(#7)

Planner: 목표점(전진 4 m), 체형각 20° 내측으로 세팅, ETA≈0.6 s.

Controllers: 가속→회전→볼 터치 보호(Shield=false).

CmdQueue: RunTo{point=… , speed_profile=…}

t=60.05~60.10 | tick=1201~1202 (서브틱 제어 + 다음 의사결정)

Execution 서브틱(20 Hz): 이동/회전 미세 조정, 상대 접근 감시.
Perception 업데이트(#7 @tick1202)

위치 전진 + 각도 개선. RB(#2) 오버랩 가속 중.

새 레인 예측: Through→RB 차단 확률이 0.22→0.15로 하락, 패스각↑.

xT: 현재 셀 0.06, RB 수신 예상 셀 0.20(+0.14).

Comm.Inbox: 여전히 OverlapReq TTL=4.

Decision(#7 @tick1202)

후보: Through→RB, Carry(추가 2 m), Pass→AM, Hold

점수(요지):

Through→RB: ΔxT +0.14, P_keep≈0.85, Comm 보너스 +α → U≈0.73 (Top)

선택: ThroughBall→RB

Execution(#7)

Planner: 킥 시퀀스(체형각 정렬→접근 0.7 m→임팩트).

Controllers: 임팩트 타이밍 계산, 킥 파워/스핀 산출.

CmdQueue: ThroughBall{target=RB#2, lead=… , pace=… , apex=…}

t=60.15 | tick=1203 (볼 발사/비행)

Physics: 볼 비행 시작(지상/로프트 혼합, apex 0.6 m).
Communication

Broker: #7이 Outbox에 아무것도 올리지 않음.

Inbox: 주변 선수들은 이전 OverlapReq만 보유.

Execution(#7)

Intent TTL 남음(0.3 s): 패스 직후 **SupportRun(하프스페이스 진입)**로 내부 fallback 계획 전환(Planner 내부 규칙).

t=60.20~60.30 | tick=1204~1206

RB(#2)

Perception: 패스 선행점에 ETA 일치.

Decision: ReceiveInBehind(point=코너 인근) → 이어서 Cross(near-post, pace mid) 선택.

Execution: 원터치 크로스 계획(체형각 35°, 임팩트 타이밍 짧게).

CmdQueue: Cross{zone=Near, pace=mid}

CF(#9), LW(#11)

Comm.Broker: “SwitchCall” 없음, 대신 RB의 암묵적 크로스 상황으로 판단.

Perception: 박스 내 러닝 경로 충돌 방지.

Decision: PinDefender(#9) + ReceiveToFeet(컷백 포인트)(#11)로 분산.

t=60.35 | tick=1207

크로스 발사 → 박스 진입

CF(#9) 근접 수비 끌고 near-post 러닝, LW(#11)는 페널티 스팟 뒤 컷백 포인트 점유.

AM(#10)은 박스 외곽 2차 볼 대비 CoverShadow로 역습 대비.

t=60.40 | tick=1208 (유효 슈팅)

CF(#9)

Perception: 크로스 도달 0.1 s 전, xG_base≈0.22, P_block≈0.18, GK 오프셋 +0.02 → xG≈0.18.

Decision: Shoot(원터치, 파워 mid-high)

Execution: 임팩트 타이밍/발등각 세팅 → Shoot{aim=near-post, power=0.7}

결과: 유효슈팅(세이브 or 득점 여부는 물리/GK에 따름).
핵심은 Overlap→Through→Cross가 Comm 보너스와 레인/ΔxT 개선을 통해 결정적으로 엮였다는 점.

B) 전환 상황: 크로스 차단→상대 백패스→재압박
t=72.00 | tick=1440 (상대 진영)

우리 측 크로스가 차단되어 상대 좌측 풀백이 볼 소유.

CM(#8)

Perception: 상대가 압박 회피 실패 후 백패스. 이는 전술상 재압박 트리거.

Decision: PressTrigger 메시지 생성.

Comm.Outbox: PressTrigger{zone=좌측 1/3, TTL=6, prio=3}

CommBroker.tick

정렬(높은 prio 우선)→근처 선수 Inbox 배포.

t=72.05 | tick=1441 (주변 3명 반응)

RW(#7), RB(#2), CM(#8)

Inbox에 PressTrigger 수신 → Perception의 pressure_bias 상승.

각자 Decision:

#7: Press(target=상대 LB) (최단 경로 각도 유리)

#2: CoverShadow(line_to=LB→CM 패스레인) (중복 압박 방지)

#8: Mark(target=상대 CM) (탈압박 1st 옵션 봉쇄)

Comm.Outbox: #7은 ManOn 없음(적용대상 우리팀 없음), #2는 CoverMe(lane=2) 보냄.

Execution(서브틱)

20 Hz로 세 명이 각기 계획 수행. 팀 형태 붕괴를 막기 위해 Constraints에서 거리/라인 규칙 체크.

t=72.20 | tick=1444

압박 성공: 상대 LB의 터치 미스 유도 → 터치 길게 튀어 나감.

우리 RB(#2) 볼 선점 P_recover≈0.72 → Decision: **Carry(전진 5 m)**로 즉시 전환.

팀은 짧은 전환 공격으로 이어감.

플레이어(#7) 단일 로직 흐름 요약

Perception

센싱(거리/각도/속도) → 파생(레인, P_intercept, 압박, 오프사이드, xT) → Comm.Inbox 가중치 적용 → PerceptionSnapshot 생성.

Decision (10 Hz)

모드 게이트(Set-piece/GK 제외) → 후보 생성(패스/슈팅/드리블/오프볼/수비) →
유틸리티 U(a)=ΔxT + xG + P_keep − Risk_turnover + Shape/Fatigue/Context + Comm_bonus →
ε-greedy/히스테리시스/쿨다운 → 단일 DecisionEnvelope 선택 → (필요 시) Comm.Outbox 등록.

Execution (20 Hz)

Planner: 경로/타임라인/체형각/임팩트 계획 → Controllers: 가속/회전/볼터치 →
엔진 커맨드(정량 파라미터)로 발행. Intent TTL 동안 유지·미세조정, 실패 시 Fallback(앵커 복귀 등).

Communication

Broker가 Outbox를 결정적 순서로 정렬/배포 → Inbox 가중치가 다음 Perception/Decision에 반영 →
팀 동작(오버랩/커버/재압박)이 중복 없이 역할 분담되도록 유도. 
위 내용을 .md형식으로 가독성 있게 바꿔줘