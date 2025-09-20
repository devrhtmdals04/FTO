# CODEx 실행지시서 v1 — 11v11 축구 엔진(WASM/P2P)

> 목표: **브라우저 2D 탑다운**, **20Hz 고정틱**, **P2P(호스트 권위)** 기준의 결정론 엔진을 Rust→WASM로 구현.
> 본 지시서는 **명령어 / 파일 생성 / 함수 시그니처 / DoD** 중심으로 작성됨. 상위 레포 구조는 모노레포(pnpm+turbo) 가정이나, 단일 패키지로도 수행 가능.

---

## 0) 사전 요구사항

* Node ≥ 20, pnpm ≥ 9, Rust stable, wasm32-unknown-unknown 타깃
* 브라우저: Chrome/Edge 최신

**검증 명령**

```
corepack enable
node -v && pnpm -v
rustup default stable
rustup target add wasm32-unknown-unknown
```

**DoD**: 버전 출력 및 타깃 추가 성공

---

## 1) 디렉터리 레이아웃 (엔진 중심)

```
packages/engine/
  src/
    lib.rs              // wasm_bindgen 공개 API
    engine.rs           // 틱 파이프라인 오케스트레이션
    state.rs            // SoA 월드/선수/팀/볼 상태
    params.rs           // 상수/튜닝
    types.rs            // enum/공용 타입
    rng.rs              // PCG 결정론 RNG
    spatial.rs          // 균일 그리드(8×6)
    physics/
      mod.rs
      player.rs         // 이동/회전/회피/스태미나
      ball.rs           // 2.5D 공중볼 + 바운스
      collisions.rs     // 원/캡슐 거리, 반사
    ai/
      mod.rs
      xt.rs             // 12×8 xT 테이블 및 보간
      utility.rs        // U_move/U_pass/U_shoot, 확률식
      scheduler.rs      // staggered 재평가(2틱 간격)
    rules/
      mod.rs
      offside.rs        // 패스 스냅샷 판정
      restarts.rs       // ThrowIn/Corner/GoalKick 상태머신
      referee.rs        // 득점/라인아웃/파울 기본
    tactics.rs          // 전술 파라미터 → 목표 라인/폭/컴팩트니스
    commands.rs         // 명령 버퍼(미래틱만), 검증/쿨다운
    snapshot.rs         // 스냅샷/델타(양자화 i16), BLAKE3 해시
  Cargo.toml
```

---

## 2) Cargo.toml (필수 의존)

```toml
[package]
name = "engine"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
rand = { version = "0.8", default-features = false }
rand_pcg = "0.3"
blake3 = { version = "1", default-features = false }
```

---

## 3) 상수/튜닝 — `params.rs`

```rust
pub const DT: f32 = 0.05;           // 20Hz
pub const PITCH_W: f32 = 105.0;     // m
pub const PITCH_H: f32 = 68.0;      // m
pub const GOAL_W: f32  = 7.32;      // m
pub const R_BODY: f32  = 0.35;      // player collider radius

// Player movement defaults (상한/하한은 선수 파라미터로 덮어씀)
pub const PLAYER_VMAX: f32 = 6.8;   // m/s
pub const PLAYER_AMAX: f32 = 4.5;   // m/s^2
pub const OMEGA_MAX: f32   = 6.0;   // rad/s 기본치

// Ball 2.5D
pub const G: f32 = 9.81;
pub const MU_AIR: f32 = 0.005;
pub const MU_GROUND: f32 = 0.02;
pub const MU_BOUNCE: f32 = 0.10;
pub const E_Z: f32 = 0.55;          // 수직 반발계수
pub const VZ_MIN: f32 = 1.0;        // 바운스 정지 임계

// Spatial grid
pub const GRID_X: usize = 8;  // ≈13m
pub const GRID_Y: usize = 6;  // ≈11m
pub const NEIGHBORS: usize = 6;

// AI
pub const AI_REEVAL_PERIOD: u32 = 2; // 11명/틱 재평가
pub const INTERCEPT_SAMPLES: usize = 12;
pub const INTERCEPT_TOPK: usize = 3;
```

**DoD**: 컴파일 성공

---

## 4) 상태/파라미터 — `state.rs`

```rust
pub const N_PLAYERS: usize = 22;

#[repr(C)]
pub struct World {
  pub tick: u32, pub ms: u32, pub seed: u64,
  // Ball (2.5D)
  pub bx: f32, pub by: f32, pub bvx: f32, pub bvy: f32,
  pub bz: f32, pub bvz: f32, pub bmode: u8, // 0=GROUND,1=AIR
  // Players SoA
  pub px: [f32; N_PLAYERS], pub py: [f32; N_PLAYERS],
  pub vx: [f32; N_PLAYERS], pub vy: [f32; N_PLAYERS],
  pub hx: [f32; N_PLAYERS], pub hy: [f32; N_PLAYERS],
  pub stamina: [f32; N_PLAYERS],
  pub role: [u8; N_PLAYERS], pub team: [u8; N_PLAYERS],
  // Meta
  pub goals_a: u8, pub goals_b: u8, pub phase: u8,
}

pub struct PlayerParams {
  pub v_max: f32, pub a_max: f32, pub omega_max: f32,
  pub stamina_max: f32, pub stamina_move_cost: f32, pub stamina_recovery: f32,
  pub ctrl_radius: f32, pub ctrl_angle_deg: f32,
  pub pass_err_sigma: f32, pub shot_err_sigma: f32,
  pub pass_speed_max: f32, pub shot_speed_max: f32,
  pub tackle_len: f32, pub tackle_rad: f32, pub foul_base: f32,
  pub collision_push: f32, pub intercept_react_ms: f32,
  pub weak_acc_mult: f32, pub weak_power_mult: f32, pub foot: u8,
}
```

**DoD**: SoA 구조 정의, 생성자에서 기본값으로 채워짐

---

## 5) 공개 API — `lib.rs`

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Engine { /* world, params, rng, buffers */ }

#[wasm_bindgen]
impl Engine {
  #[wasm_bindgen(constructor)]
  pub fn new(seed: u64) -> Engine;

  pub fn step(&mut self, dt_ms: u32);

  pub fn submit_cmd(&mut self, tick: u32, cmd_json: &str) -> bool;

  pub fn snapshot_ptr(&self) -> *const u8;
  pub fn snapshot_len(&self) -> usize;
  pub fn delta_since(&self, last_tick: u32) -> Vec<u8>;
  pub fn state_hash(&self, tick: u32) -> String;

  pub fn load_player_params(&mut self, idx: u32, params_json: &str) -> bool;
}
```

**DoD**: 빈 구현으로도 wasm 빌드 성공

---

## 6) 틱 파이프라인 — `engine.rs`

```rust
pub fn step(&mut self, dt_ms: u32) {
  // 1) 명령 적용 (tick-D)
  // 2) 전술 업데이트 (250ms 주기)
  // 3) AI 재평가 (subset, 11명/틱)
  // 4) player integrate (v/a/ω, separation)
  // 5) ball integrate (2.5D, bounce/land)
  // 6) rules/referee (offside, restarts, goals)
  // 7) spatial grid rebuild
  // 8) snapshot/delta/hash 업데이트
  // 9) tick++
}
```

**DoD**: 상기 호출 시 크래시 없이 진행, tick 증가 확인

---

## 7) 2.5D 볼 — `physics/ball.rs`

구현 포인트:

* 상태: `(x,y,vx,vy,z,vz,mode)`
* AIR: `vz += -G*DT; z += vz*DT; x += vx*DT; y += vy*DT;` (μ\_air 적용)
* 착지/바운스: `vz = -E_Z*vz; vx,vy *= (1-MU_BOUNCE);`; `|vz|<VZ_MIN → GROUND`
* GROUND: `vx,vy *= (1-MU_GROUND)`; 라인/플레이어 반사; 트래핑 규칙 훅
* **로프트 킥(set\_lofted)**:

```rust
pub fn set_lofted(x0:f32,y0:f32,x1:f32,y1:f32,loft:f32,speed_cap:f32)->(f32,f32,f32){
  let d = ((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0)).sqrt();
  let h = 0.8 + (3.0-0.8)*loft;         // apex
  let vz0 = (2.0*G*h).sqrt();
  let t  = 2.0*vz0/G;
  let vh = (d/t).clamp(8.0, speed_cap);
  let nx = (x1-x0)/d; let ny = (y1-y0)/d;
  (vh*nx, vh*ny, vz0)
}
```

**DoD**: 대칭 탄도 테스트에서 착지 오차 < 0.3m

---

## 8) 플레이어 이동/회전/회피 — `physics/player.rs`

* 속도형 PD: `a = clamp((v_desired - v)/τ, ±a_max)`; `v += a*DT`; `|v|≤v_max`
* 회전: `θ → θ_des`로 `Δθ ≤ ω_max*DT` 제한; `h=(cosθ,sinθ)` 업데이트
* 회피(Separation): 이웃 6명에 대해 `repulsion = k / max(ε, d - 2*R_BODY)` 누적
  **DoD**: 혼잡 구역에서 겹침 없이 이동, 속도/회전 상한 준수

---

## 9) 공간 인덱스 — `spatial.rs`

* 균일 그리드(8×6), 각 셀에 선수 인덱스 벡터
* 이웃 질의: 자기+8이웃 → 거리 상위 6명만 사용
  **DoD**: O(N) 삽입, 평균 근접 질의가 상수시간에 가까움

---

## 10) 전술/목표 위치 — `tactics.rs`

* 파라미터(8종): `line_height, press_intensity, team_width, build_up, counter_press, long_ball_bias, overlap_fullbacks, compactness`
* 출력: 팀별 **수비/미드 라인 x**, 폭(y 스케일), 레인 앵커 좌표
  **DoD**: 파라미터 변경 시 대형이 즉시/부드럽게 반영

---

## 11) AI — `ai/xt.rs`, `ai/utility.rs`, `ai/scheduler.rs`

* `xt.rs`: 12×8 테이블 상수 + 양선형 보간 함수
* `utility.rs`:

  * `p_pass(dist,angle,pressure,interceptors)` 로지스틱
  * `U_move = 1.2*xT - 0.8*pressure - 0.3*stamina_cost`
  * `U_pass = xT(teammate)*p_pass`; `U_shoot = 2.0*p_shot`
  * argmax로 행동 결정 → `v_desired`/패스/슛/태클 커맨드 생성
* `scheduler.rs`: 2틱 간격 라운드로빈(틱당 11명만 재평가)
  **DoD**: 압박↑/거리↑ 시 패스 확률 하향, 틱 예산 내 실행(≤2ms 목표)

---

## 12) 룰 — `rules/offside.rs`, `rules/restarts.rs`, `rules/referee.rs`

* 오프사이드: 패스 발생 틱에 스냅샷 → 공 x, 2nd-last 수비 x 비교
* 라인아웃/코너/골킥: XY 라인아웃 즉시 전환, 킥오프 후 InPlay 복귀
* 득점: 골라인 통과 & `z<2.44m` 조건
  **DoD**: 4가지 오프사이드 케이스, 라인아웃 케이스 단위테스트 통과

---

## 13) 명령 버퍼 — `commands.rs`

```rust
pub enum Cmd {
  TacticsSet(Tactics),
  RoleOverride{ pid:u8, params:RoleParams, ttl:u16 },
  LoftedPass{ tx:f32, ty:f32, loft:f32 },
  GroundPass{ tx:f32, ty:f32 },
  Shoot{ tx:f32, ty:f32, power:f32 },
}
```

규칙: **미래틱만 수용**, 전술 쿨다운 10틱, 레이트리밋 8req/s, 좌표 범위/속도상한 검증
**DoD**: 과거틱 입력 거부, 쿨다운/레이트리밋 동작 로그 확인

---

## 14) 스냅샷/델타/해시 — `snapshot.rs`

* 스냅샷(1Hz): `World` 필드 **수동 직렬화(LE)**
* 델타(매틱): 필드 변경 비트마스크 + i16 양자화 (pos 0.05m, vel 0.02m/s)
* 패킷 상한 512B 초과 시 강제 스냅샷
* 해시: `blake3`로 핵심 배열+tick → 10틱마다 노출
  **DoD**: 스냅샷 왕복 시 바이트 동일성, 델타 적용 후 동일 상태 복원

---

## 15) 선수 데이터 매핑(입력→런타임) — 함수 시그니처

* 입력 스키마(0–100): `pace, accel, agility, stamina, strength, first_touch, passing, vision, finishing, shot_power, tackling, interception` + `height_cm, weight_kg, foot, weak_foot(1..5)`

```rust
pub struct PlayerInput { /* 위 스키마에 맞게 정의 */ }

pub fn compute_params(inp:&PlayerInput) -> PlayerParams {
  // 제안된 수식에 따라 v_max/a_max/omega_max/ctrl_radius/ctrl_angle/
  // pass_err_sigma/shot_err_sigma/pass_speed_max/shot_speed_max/
  // tackle_len/tackle_rad/foul_base/collision_push/intercept_react_ms/
  // weak_acc_mult/weak_power_mult/foot 계산 후 반환
}
```

**DoD**: 평균치(60±10) 입력에서 파라미터가 권장 범위 내 산출

---

## 16) 테스트 — `tests/`

* `determinism.rs`: 동일 시드+입력 스트림 → `state_hash` 동일
* `physics_ball.rs`: AIR→바운스→GROUND 감쇠 검증, 착지 오차 < 0.3m
* `rules_offside.rs`: 참/거짓 4케이스
* `ai_pass.rs`: 거리/압박/차단자 증가에 따른 `p_pass` 단조 감소
* `snapshot_delta.rs`: 스냅샷/델타 왕복 일치
  **DoD**: 모든 테스트 통과, 총 실행시간 < 2s

---

## 17) 빌드/런 (WASM 단독 검증)

```
rustup target add wasm32-unknown-unknown
cargo build -p engine --target wasm32-unknown-unknown --release
```

**DoD**: `*.wasm` 생성, 내보낸 심볼 확인(`wasm-bindgen` 사용 시 JS 래퍼로 로딩 가능)

---

## 18) 성능/결정론 가드

* fast-math 금지, 반복 순서 고정(팀→포지션→id)
* 루프 내 동적 할당 금지, pre-alloc
* 틱당 FFI 경계 1회(스냅샷/델타), 컨트롤 채널은 별도(JSON)
* 메트릭: `cpu_ms(sim/ai)`, `tick_skew`, `hash_mismatch`
  **DoD**: p95 `sim+ai ≤ 5ms`, 드리프트 < 2틱

---

## 19) 확장 훅(후속 작업 슬롯)

* GK 세이브/펀치 디테일, 체스트 컨트롤, 세트피스 연출
* 호스트 마이그레이션(스냅샷 전송/권한 전환), 권위 서버(WS) 드라이버
* 포지션별 베이스 커브, 개성/성향치

---

### 제출 산출물

* `packages/engine` 전체 구현 + 단위테스트 + WASM 산출물
* 간단한 JS/TS 로더(선택)로 `step/snapshot` 호출 데모

> 의문사항은 본 문서의 섹션 번호/파일 경로 기준으로 질의.
