# FTO

A 2D football engine written in Rust, compiled to WebAssembly.

---

## 프로젝트 구조 및 코드 흐름 (Korean)

이 문서는 Rust와 WebAssembly(WASM) 기반의 개발이 처음인 분들을 위해 작성되었습니다.

### 모듈 설명

`packages/engine/src` 디렉토리의 각 Rust 파일(모듈)은 다음과 같은 역할을 담당합니다.

-   `lib.rs`: Rust 라이브러리의 메인 진입점입니다. JavaScript와 상호작용할 `WasmEngine` 구조체를 정의하고, WASM API 함수들을 외부에 공개합니다.
-   `engine.rs`: 시뮬레이션의 핵심 엔진입니다. 메인 `tick()` 함수가 포함되어 있으며, 매 틱마다 AI, 물리, 규칙 등 다른 모든 모듈의 업데이트를 순서대로 지휘(오케스트레이션)합니다.
-   `state.rs`: 시뮬레이션의 모든 상태 정보(선수, 공, 점수, 시간 등)를 담고 있는 `World` 구조체를 정의합니다. 데이터 접근 효율을 위해 SoA(Structure of Arrays) 방식으로 설계되었습니다.
-   `params.rs`: 경기장 크기, 중력, 마찰 계수 등 시뮬레이션 전반에 사용되는 고정된 상수 값을 모아둔 파일입니다.
-   `types.rs`: `Vec2`(2차원 벡터), `TeamId` 등 여러 모듈에서 공통으로 사용하는 데이터 타입을 정의합니다.
-   `commands.rs`: JavaScript 데모 화면에서 발생한 사용자 입력(패스, 슛, 전술 변경 등)을 받아 처리하고 검증하는 역할을 합니다.
-   `snapshot.rs`: Rust 내부의 `World` 상태 전체를 압축된 바이트 배열(스냅샷)로 변환(직렬화)하는 역할을 합니다. 이 스냅샷은 JavaScript로 전송되어 화면을 그리는 데 사용됩니다.
-   `players.rs`: `능력치: 90`과 같은 상위 레벨의 선수 데이터를 `최고 속도: 8.5m/s`와 같은 시뮬레이션 내부 물리 파라미터로 변환하는 로직을 담고 있습니다.
-   `physics/`: 물리 계산을 담당하는 모듈입니다.
    -   `player.rs`: 선수의 가속, 회전, 이동 등 움직임을 처리합니다.
    -   `ball.rs`: 공의 비행, 바운드, 구름 등 2.5D 물리 효과를 처리합니다.
-   `ai/`: 인공지능을 담당하는 모듈입니다.
    -   `scheduler.rs`: 연산 부하를 줄이기 위해, 매 틱마다 일부 선수의 AI만 재평가하도록 순서를 관리합니다.
    -   `update_ai` (in `engine.rs`): 현재는 "공을 향해 움직인다"는 간단한 AI 로직이 구현되어 있습니다.
-   `rules/`: 축구 규칙을 처리하는 모듈입니다.
    -   `referee.rs`: 득점, 라인 아웃 등을 판정합니다.

### 코드 실행 흐름

브라우저의 데모 화면과 Rust 엔진은 다음과 같은 흐름으로 상호작용합니다.

1.  **초기화**
    1.  **JS**: 사용자가 데모 페이지를 열면, `main.js`가 컴파일된 WASM 모듈(`pkg/engine.js`)을 로드합니다.
    2.  **JS**: `new WasmEngine()`을 호출하여 Rust 엔진 인스턴스를 생성합니다.
    3.  **Rust**: `lib.rs`의 생성자가 `engine.rs`와 `state.rs`를 초기화하여, 선수와 공이 배치된 초기 `World` 상태를 만듭니다.

2.  **게임 루프 (1초에 60번 반복)**
    1.  **JS**: `requestAnimationFrame`이 매 프레임마다 `render` 함수를 호출합니다.
    2.  **JS**: `render` 함수는 `engine.tick()`을 호출하여 Rust 엔진의 시간을 한 단계 진행시킵니다.
    3.  **Rust**: `engine.tick()` 함수가 실행됩니다.
        -   AI가 선수들의 다음 행동(목표 속도)을 결정합니다.
        -   물리 엔진이 AI가 결정한 목표 속도에 따라 선수와 공을 실제로 움직입니다.
        -   심판이 규칙 위반이나 득점 상황을 확인합니다.
        -   이 모든 결과가 `World` 상태에 업데이트됩니다.
    4.  **JS**: `render` 함수가 `engine.snapshot()`을 호출하여 방금 업데이트된 `World`의 최신 상태를 바이트 배열(스냅샷) 형태로 전달받습니다.
    5.  **JS**: 전달받은 스냅샷을 디코딩하여 JavaScript 객체로 변환한 후, 이 데이터를 바탕으로 `canvas`에 선수, 공, 골대의 현재 위치를 그립니다.

3.  **사용자 입력 처리**
    1.  **JS**: 사용자가 데모 화면에서 "Ground Pass" 버튼을 누르고 필드를 클릭합니다.
    2.  **JS**: `main.js`는 `{ "type": "ground_pass", "tx": 10.0, "ty": -5.0 }`과 같은 JSON 커맨드 객체를 생성합니다.
    3.  **JS**: `engine.command(커맨드)`를 호출하여 Rust 엔진에 명령을 전달합니다.
    4.  **Rust**: `commands.rs`가 이 명령을 받아 버퍼에 저장해두었다가, 몇 틱 뒤의 미래에 `engine.tick()` 루프 안에서 안전하게 처리합니다.




### AI 개선 방향

현재 AI는 모든 선수가 공을 쫓아가는 단순한 로직으로 구현되어 있습니다. 더 현실적인 축구 AI를 만들기 위한 개선 방향은 다음과 같습니다. 모든 AI 로직은 `engine.rs`의 `update_ai` 메소드 내부에서 시작됩니다.

#### 1. 상황 인지 (Context Awareness)

가장 먼저, 우리 팀이 공을 가졌을 때(On-Ball)와 상대 팀이 공을 가졌을 때(Off-Ball)의 로직을 분리해야 합니다. `world.possession` 값을 확인하여 현재 공 소유권을 파악할 수 있습니다.

#### 2. 수비 시 움직임 (Off-Ball Logic)

공을 가지고 있지 않을 때, 모든 선수가 공을 향해 달려드는 것은 비효율적입니다. 대신, 각 선수는 자신의 포지션에 맞는 전략적인 위치로 움직여야 합니다.

-   **구현 아이디어**: `update_ai` 함수에서, 공을 가진 팀이 상대 팀일 경우, 각 선수는 공과 우리 팀 골대 사이의 경로를 차단하거나, 특정 상대 선수를 맨마킹하는 위치를 계산하여 `target_vel`을 설정합니다.

#### 3. 공격 시 움직임 (On-Ball Logic)

우리 팀 선수가 공을 가지고 있을 때, 그 선수는 **드리블, 패스, 슛** 중 가장 유리한 행동을 선택해야 합니다. 이를 위해 각 행동의 "가치(Utility)"를 계산하고 비교하는 시스템을 도입할 수 있습니다.

-   **슛 (Shoot)**: 골대까지의 거리와 각도를 고려하여 득점 확률을 계산하고, 이를 슛의 가치로 삼습니다.
-   **패스 (Pass)**: 각 팀원에게 패스했을 때의 이점을 계산합니다. 패스를 받을 팀원의 위치가 얼마나 좋은지(xT 값), 패스가 중간에 차단될 위험은 없는지 등을 종합하여 가장 좋은 패스 대상을 찾습니다.
-   **드리블 (Dribble/Move)**: 주변에 압박하는 상대 선수가 없는 경우, 더 좋은 위치로 공을 몰고 가는 것을 선택할 수 있습니다. 드리블 후의 위치가 현재보다 얼마나 더 위협적인지를 가치로 계산합니다.

-   **구현 아이디어**: `update_ai` 함수에서, 공을 가진 선수는 위 세 가지 행동의 가치를 모두 계산합니다. 그중 가장 가치가 높은 행동을 이번 틱의 최종 행동으로 결정합니다. 예를 들어, `if (슛 가치 > 패스 가치 && 슛 가치 > 드리블 가치)` 와 같은 조건문으로 구현할 수 있습니다.

#### 4. 패스/슛 실행

AI가 패스나 슛을 하기로 결정했다면, 실제로 공을 보내야 합니다. `engine.rs`에 있는 `apply_ball_command`와 유사한 헬퍼 함수를 호출하여, AI가 결정한 방향과 속도로 공의 속도(`bvx`, `bvy`, `bvz`)를 직접 변경해주면 됩니다.

---

## Development

This project uses Rust compiled to WebAssembly. After making any changes to the Rust source code in `packages/engine/src`, you must recompile the WebAssembly module for the changes to be reflected in the demo.

### One-Time Setup

Before you can build the project, you need to have the Rust toolchain (`rustup`, `cargo`) installed. You also need to install `wasm-pack`, a tool for building Rust-generated WebAssembly.

```sh
cargo install wasm-pack
```

### Building

To build the engine, run the following command from the root directory of the project:

```sh
wasm-pack build packages/engine --target web
```

This will compile the Rust code and place the necessary WebAssembly and JavaScript files in the `packages/engine/pkg` directory, which are used by the demo.

### Troubleshooting: `command not found`

If you encounter a `command not found` error when running `cargo` or `wasm-pack`, it is likely that your shell's `PATH` environment variable is not configured correctly. This commonly happens in a new shell session after installing Rust.

You can fix this for your current session by running:

```sh
source "$HOME/.cargo/env"
```

For a permanent fix, you should ensure the line `export PATH="$HOME/.cargo/bin:$PATH"` is added to your shell's configuration file (e.g., `~/.zshrc`, `~/.bash_profile`).