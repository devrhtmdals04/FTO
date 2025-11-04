AI Pipeline Overview
====================

이 문서는 `packages/engine/src/ai` 트리의 전체 흐름과 주요 시나리오를 Markdown 형식으로 정리한 참고 자료입니다. 코드를 수정할 때는 이 문서와 `ai/GUIDE.md`를 함께 유지보수하세요.

전체 데이터 흐름
----------------

```
[Engine(World, Physics, Rules)] 20 Hz
        ▲             │ EngineCmd
        │             │
        │     ┌───────┴───────────────────────────────┐
        │     │                                       │
        ▼     │                               ┌───────┴────────┐
[AI Scheduler] 10 Hz per player ─────────────▶│Team CommBroker│
        │     │                               └───────┬────────┘
        │     │                                       │ Inbox 업데이트
        │     │                                       │
        │  ┌──┴────────────┐                          │
        ├─▶│Perception     │ (Sense → Derive → Merge Comm Bias)
        │  └──┬────────────┘
        │     │ PerceptionSnapshot
        │  ┌──┴────────────┐
        ├─▶│Decision       │ (Goal→Factor→Affordance Planner)
        │  └──┬────────────┘
        │     │ DecisionEnvelope + optional Comm outbox
        │  ┌──┴────────────┐
        └─▶│Execution      │ (Planner → Controllers → CmdQueue)
           └───────────────┘
```

디렉터리 레이아웃
------------------

```
ai/
  scheduler.rs           // 10 Hz 슬롯 스케줄링 + CommBroker tick
  perception/
    mod.rs               // 스냅샷 조립
    derive.rs            // xT, 패스 후보, 압박, 오프사이드 등
    blackboard.rs        // PerceptionSnapshot 정의
    memory.rs            // 단기 기억 (최근 터치/콜 등)
  decision/
    mod.rs               // Goal→Factor→Affordance 의사결정 엔트리
    factors.rs           // PassFactors 계산
    micro.rs             // MicroActionKind 정의
    effect.rs            // MicroAction → Δfactor 근사
    planner.rs           // enumerate_actions / progress / risk / score
    scorers.rs           // 공 없는 상황 터치 스코어러
    types.rs             // Decision, IntentMemory 등 공용 타입
  execution/
    runtime.rs           // Planner/Controllers 호출
    controllers/**       // 이동/체형각/볼 컨트롤
  comm/
    broker.rs, inbox.rs, messages.rs  // 팀 메시징 인프라
  coach/
    tactics_view.rs, commands.rs      // 외부 전술 뷰/명령
  utility/, xt/, formations.rs        // 수학/그리드/포메이션 유틸
```

스케줄러 (10 Hz)
----------------

`AiScheduler::tick`은 짝수/홀수 슬롯을 나눠 선수별 계산 예산을 절반으로 유지합니다.

1. `CommBroker::tick`으로 이전 턴 Outbox를 Inbox에 반영.
2. 슬롯에 해당하는 선수만 순회 → `perception.build_snapshot` → `decision.decide`.
3. 결정된 Outbox 메시지가 있으면 브로커에 enqueue.
4. `execution.apply`로 Intent를 전달하고 20 Hz 서브틱에서 Planner/Controller가 후속 처리.

> **예산 목표**: 선수당 0.3~0.5 ms/10 Hz. 후보 수 제한과 조기 리턴으로 보장합니다.

퍼셉션
-------

- Sense 단계에서 엔진 SoA 데이터를 가져오고, Derive 단계에서 xT·압박·패스 후보 등 2차 특징을 계산합니다.
- CommBroker Inbox를 적용해 `comm_bias`를 계산하고 `PerceptionSnapshot`을 생성합니다.
- `pass_options`와 `touch_options`는 Decision 단계가 바로 사용할 수 있는 형태로 정규화되어 있습니다.

결정 (Goal→Factor→Affordance)
------------------------------

1. `pick_best_pass`가 Perception이 준 패스 후보 중 리스크 게이트를 통과한 옵션을 선택합니다.
2. `quantify_pass_factors`가 `PassFactors`(orient/lane/recv/offs/gate/press/kick) 갭을 채웁니다.
3. 모든 갭이 0 이하이고 킥이 가능하면 즉시 `fire_pass`.
4. 그렇지 않으면 `enumerate_actions`가 MicroAction 후보를 만들고 `score_action`이 가치(진전/시간/위험)를 계산합니다.
5. 최고 행동을 `IntentMemory`에 커밋하고 매 틱 재평가합니다. 점수가 악화되면 커밋을 해제하고 다른 행동을 선택합니다.
6. 갭이 해소되면 `fire_pass`가 Ground/Lofted/Through 패스를 발사합니다.

대기 모드에서는 간단한 `Decision::FindSpace`를 반환하지만, 동일 패턴으로 `ReceiveFactors` 등을 도입할 수 있습니다.

커밋/로그 규약
---------------

`dbg::alert`로 출력되는 주요 로그는 다음과 같습니다.

| 로그 문자열 | 의미 |
| ----------- | ---- |
| `DBG:PASS_FACTORS pid=? option=? orient=.. lane=.. recv=.. offs=.. gate=.. press=.. kick=..` | 현재 패스 옵션의 갭 상태 |
| `DBG:PASS_ACT pid=? kind=? score=.. until=..` | 새 마이크로 행동 커밋 |
| `DBG:PASS_ACT_EVAL pid=? kind=? score=.. prev=..` | 커밋 유지 여부 재평가 |
| `DBG:PASS_COMMIT_DROP pid=? kind=? reason=...` | 커밋 해제 |
| `DBG:PASS_FIRE pid=? ty=? target=? score=..` | 실제 패스 발사 |
| `DBG:PASS_LOW_CONF pid=? reason=` | 후보는 있지만 신뢰도 부족 |

CLI나 리플레이 툴에서 접두어로 필터링하면 쉽게 확인할 수 있습니다. 로그 문구가 바뀌면 README와 GUIDE를 동시에 수정하세요.

커뮤니케이션
-------------

- 메시지 타입: `BallCall`, `OverlapReq`, `PressTrigger`, `ManOn`, `CoverMe`, `TargetMark` 등.
- `CommBroker::enqueue(intent_id, from, msg)`로 Outbox에 넣고, `tick` 시점에 우선순위(높음→낮음), 틱, 발신자 ID, 페이로드 해시 순서로 정렬합니다.
- Inbox는 거리/시야/역할 기반 필터링 후 `comm_bias`를 계산해 Perception에 제공합니다.

실행 (Execution)
----------------

`DecisionEnvelope` → Planner/Controller → `EngineCmd` 큐 순으로 진행됩니다.  
Intent TTL 동안 Planner는 궤적/체형각을 유지하고, 실패 시 fallback (예: SupportRun)으로 전환합니다.

샘플 시나리오
--------------

### A. 사이드 오버랩 → 쓰루패스 → 크로스

| 시간 | 이벤트 |
| ---- | ------ |
| `t=60.00` (tick 1200) | RW(#7)이 네 번째 `BallCall`을 받음 → PerceptionSnapshot에 comm_bias 반영 |
| `t=60.05` (tick 1201) | Decision: 오버랩 전개. RW는 `ReceiveToFeet`, AM(#10)은 `Delay`, LB(#3)는 `Overlap` 선택. CommBroker에 OverlapReq/SupportRun 메시지 발생 |
| `t=60.10` (tick 1202) | RW(#7)에 대해 `quantify_pass_factors` 결과 주요 갭 `lane_gap=0.22`, `gate_gap_ms=180`. MicroAction 후보: `LateralCarry`, `Orient`, `PassRequest`, `TriggerRun` |
| | `score_action`이 `LateralCarry(dir=우측, dur=240ms)`를 최선으로 평가 → 커밋 (`IntentMemory`) → `Carry` 커맨드 실행 |
| | 디버그: `DBG:PASS_FACTORS` → `DBG:PASS_ACT ... kind=LateralCarry ...` |
| `t=60.12` | 커리어 진행 중. gate/gap 감소, `DBG:PASS_ACT_EVAL` 로그로 점수 모니터링 |
| `t=60.15` | 모든 갭이 충족되고 킥 가능 → `fire_pass`가 GroundPass 실행. `DBG:PASS_FIRE ... ty=Ground` |
| `t=60.20~60.30` | 수신자 RB(#2)가 `ReceiveInBehind` → 즉시 `Cross`로 이어감 |
| `t=60.35` | Cross 발사, 박스 진입 |
| `t=60.40` | CF(#9) `Shoot` → 유효 슈팅 발생 |

### B. 재압박 트리거 대응

| 시간 | 이벤트 |
| ---- | ------ |
| `t=72.00` | 우리 팀 크로스가 차단 → 상대 풀백이 볼 소유 |
| `t=72.02` | CM(#8)이 상대의 백패스를 감지 → `PressTrigger` 메시지 Outbox |
| `t=72.05` | CommBroker가 메시지를 배포. RW(#7)는 `Press`, RB(#2)는 `CoverShadow`, CM(#8)은 `Mark` 결정 |
| `t=72.20` | 압박 성공, 상대 터치 미스 → RB(#2)가 1차 볼 회수 확률 0.72 |
| `t=72.25` | RB(#2) Decision: `Carry(전진 5m)`로 전환 → 빠른 역습 시도 |

단일 플레이어 흐름
------------------

1. **Perception** : Sense → Derive → Comm merge → `PerceptionSnapshot`.
2. **Decision** : 패스 목표의 `PassFactors` 계산 → MicroAction 후보 → 점수화 → 커밋/발사 → (필요 시) Comm Outbox.
3. **Execution** : Intent Planner가 체형각/속도를 맞추고 Controllers가 20 Hz로 명령 발행.
4. **Communication** : Outbox 메시지가 브로커를 통해 정렬/배포되어 다른 선수의 `comm_bias`에 반영.

테스트
------

- `cargo test`
- `cargo check --target wasm32-unknown-unknown`
- `wasm-pack build --target web` (샌드박스에서는 `wasm-opt`가 차단될 수 있습니다. 필요 시 `Cargo.toml`에서 비활성화)

문서 유지보수 팁
----------------

- MicroActionKind/Faction/Fator를 추가하거나 이름을 바꿀 때는 README와 GUIDE를 동시에 업데이트합니다.
- 로그 문자열이 바뀔 때는 `디버그 로그 규약` 표를 갱신합니다.
- 테스트 경로가 바뀌면 `테스트` 섹션에 새 명령을 추가하세요.

