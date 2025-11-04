AI 모듈 작업 가이드 (2024-04 업데이트)
======================================

이 문서는 `packages/engine/src/ai` 아래 모듈들이 어떻게 맞물려 동작하는지, 그리고 새 의사결정 루프(Goal→Factor→Affordance)를 확장할 때 어디를 수정해야 하는지 정리한 최신 레퍼런스 문서입니다.

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
  scheduler.rs           // 10Hz 슬롯 스케줄링 + CommBroker tick
  perception/
    mod.rs               // 스냅샷 조립(Engine → Sense → Derive → Comm merge)
    derive.rs            // xT, 패스 후보, 압박 등 2차 특징
    sense.rs             // (필요 시) 원시 샘플링 훅
    blackboard.rs        // PerceptionSnapshot 정의
    memory.rs            // 단기 기억(최근 터치/콜 등)
  decision/
    mod.rs               // Goal→Factor→Affordance 루프 엔트리
    factors.rs           // PassFactors 계산(갭 슬레이브)
    micro.rs             // MicroActionKind 정의
    effect.rs            // MicroAction → Δfactor 근사
    planner.rs           // progress / risk / enumerate_actions / scoring
    scorers.rs           // 공 없는 상황 기본 터치 스코어러
    types.rs             // Decision/Intent/Context 타입 묶음
  execution/
    runtime.rs           // Planner/Controllers를 호출하는 메인 런타임
    controllers/…        // 이동/보디 컨트롤/패스 발사 등 서브 모듈
  comm/
    mod.rs, broker.rs, inbox.rs, messages.rs  // 팀 내 메시징 인프라
  coach/
    tactics_view.rs, commands.rs              // 외부 전술 정보 뷰/명령
  utility/, xt/, formations.rs …             // 공용 수학/그리드 유틸
```

새 패스 의사결정 루프
----------------------

### 1. Goal

현재 v0는 “패스를 발사할지, 아니면 단기 마이크로 행동으로 패스 가능성을 높일지”가 단일 Goal입니다. 공을 보유한 플레이어는 `DecisionModule::decide_pass_inference`에서 항상 동일 루프를 탑니다.

### 2. Factors (`decision/factors.rs`)

`PassFactors`는 7개의 갭을 추적합니다.

| 필드 | 의미 |
| ---- | ---- |
| `orient_gap` | 필요한 회전 시간 – 남은 여유 |
| `lane_gap` | 차단 확률 – 허용 리스크 상한 |
| `recv_gap` | 최소 수신 확률 – 실제 수신 확률 |
| `offs_gap` | 요구 오프사이드 여유 – 현재 여유 |
| `gate_gap_ms` | 창문이 열릴 때까지 남은 시간 |
| `press_gap` | 현지 압박 – 허용치 |
| `kick_gap` | 킥 가능 여부 (0: 가능, 1: 불가) |

`quantify_pass_factors`는 최신 스냅샷과 패스 옵션에서 위 값을 채웁니다. 오프사이드/압박 추정은 피치 기하/수비 위치를 이용합니다.

### 3. Affordance (`decision/micro.rs`, `decision/effect.rs`)

`MicroActionKind`는 짧은 조작 단위를 정의합니다 (예: `Orient`, `LateralCarry`, `Shield`, `Delay`, `TriggerRun`, `MicroHold`).  
`predict_effect`는 각 행동이 `PassFactors`를 얼마나 줄이는지 빠르게 근사합니다. 정확하진 않아도 “갭을 줄이는 방향/부호”가 맞으면 루프는 자정됩니다.

### 4. Planner (`decision/planner.rs`)

핵심 함수:

- `enumerate_actions` : 현재 갭과 패스 옵션을 바탕으로 5~8개의 마이크로 행동 후보를 생성합니다.
- `progress` : Δfactor가 갭을 얼마나 줄였는지 0~1 스케일로 환산합니다.
- `time_cost_ms` / `risk` : 행동 소요 시간과 위험 비용을 추정합니다.
- `score_action` : `(progress / time) - λ * risk` 공식을 이용해 행동 가치를 산출합니다.

`DecisionModule::decide_pass_inference`는 최고 점수 행동을 커밋하고, 2~6틱 동안 유지하려 시도합니다. 갭이 악화되거나 점수가 떨어지면 즉시 커밋을 폐기하고 재선택합니다.

### 5. Commit / Intent Memory

`IntentMemory`는 `Intent::Micro` 상태를 저장합니다. 각 커밋은:

- `action` : 실행 중인 MicroAction
- `baseline_gap`, `baseline_score` : 커밋 당시 값
- `last_score` : 직전 틱 재평가 점수

매 틱 재평가 → 스코어가 음수/급락/비정상일 때 즉시 드롭 → 새 행동 선택.  
모든 갭이 충족되고 킥이 가능하면 `fire_pass`로 실제 패스를 발사합니다.

### 6. Off-ball 분기

현재는 간단한 `Decision::FindSpace` 대체지만, 동일 패턴으로 `ReceiveFactors` 등을 설계해 확장할 수 있습니다.

디버그 로그 규약
-----------------

`ai/debug.rs`의 `dbg::alert`를 통해 결정적 문자열 로그를 남길 수 있습니다. 새 결정 루프와 맞춘 표준 문자열은 다음과 같습니다.

| 코드 | 의미 | 호출 위치 |
| ---- | ---- | --------- |
| `DBG:PASS_FACTORS pid=? option=? orient=.. lane=.. recv=.. offs=.. gate=.. press=.. kick=..` | 현재 패스 옵션의 갭 상태를 기록 | `DecisionModule::decide_pass_inference` |
| `DBG:PASS_ACT pid=? kind=? score=.. until=..` | 선택된 마이크로 행동과 점수 | 커밋 직후 |
| `DBG:PASS_ACT_EVAL pid=? kind=? score=.. prev=..` | 커밋 유지 여부 판단 시 | 커밋 재평가 시 |
| `DBG:PASS_COMMIT_DROP pid=? kind=? reason=` | 점수 악화 등으로 커밋 중단 | 커밋 드롭 시 |
| `DBG:PASS_FIRE pid=? ty=? target=? score=..` | 실제 패스 발사 기록 | `fire_pass` |
| `DBG:PASS_LOW_CONF pid=? reason=` | 여전히 갭이 크거나 신뢰도가 낮을 때 | 선택 로직에서 필요 시 |

CLI/리플레이 도구에서 동일한 접두어를 필터링하면 특정 행동의 추세를 빠르게 분석할 수 있습니다. 로그 포맷을 바꾸면 `README`와 이 문서를 함께 갱신하세요.

문서/코드 싱크 체크리스트
-------------------------

- 새 MicroActionKind를 추가한 경우:  
  `micro.rs`, `effect.rs`, `planner.rs`(enumerate + scoring), `decision/mod.rs`(match arms), `README.MD`/본 가이드에 설명 추가.
- 새 Factor를 추가한 경우:  
  `PassFactors`, `quantify_pass_factors`, `all_ok`, `progress`, 디버그 로그, 테스트 케이스, 문서 테이블 동시 업데이트.
- 로그 메시지 바뀔 때:  
  `ai/README.MD`와 본 가이드의 디버그 섹션을 함께 수정.

테스트 & 성능
-------------

- `cargo test` : 유닛/통합 테스트(22명 + 전술 초기화 등)를 항상 통과해야 합니다.  
- `cargo check --target wasm32-unknown-unknown` : wasm 빌드 확인.  
- `wasm-pack build --target web` : 현재 샌드박스에서는 `wasm-opt`가 차단될 수 있으니 필요 시 `Cargo.toml`에서 끌 수 있습니다.
- 성능 목표: 20 Hz × 22명 기준 0.3 ms/player 내에 Decision 루프를 유지하는 것이 1차 목표입니다. 마이크로 행동 후보 수를 제한하고, 로그 레벨이 낮을 때는 `dbg::alert` 호출 빈도를 줄이세요.

추가 확장 포인트
----------------

- `quantify_pass_factors`에 계수/휴리스틱을 더 정확히 넣고 싶다면, `perception/derive.rs`에서 미리 계산한 통계를 넘겨 재사용하세요.
- `planner::risk`는 현재 상수 기반입니다. 압박/차단 모델이나 전술 상태에 따라 λ 값을 조정하려면 `tactics_view`나 `GameState`를 전달해 다이나믹하게 계산할 수 있습니다.
- Execution 페이즈는 아직 v0(패스 발사용 커맨드 매핑)에 가깝습니다. Planner/Controller를 확장할 때는 `execution/runtime.rs`에 새 Intent 타입을 매핑하고, `execution/controllers/` 폴더에 세부 제어 로직을 추가하면 됩니다.

이 문서는 항상 코드와 동기화되어야 합니다. 문서 내용을 바꿀 때는 `README.MD`도 함께 확인해 주세요. Pull Request 체크리스트에 “Guide/README 업데이트 여부” 항목을 포함시키는 것을 권장합니다.

