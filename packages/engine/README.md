# Engine WASM Demo

간단한 브라우저 데모로 `WasmEngine`을 로드하고 스냅샷/델타를 호출하는 방법을 정리했습니다.

## 빌드 & 바인딩 생성

```bash
source "$HOME/.cargo/env"
cargo build --target wasm32-unknown-unknown --release
wasm-bindgen --target web --out-dir pkg target/wasm32-unknown-unknown/release/engine.wasm
```

위 명령은 `pkg/engine.js`와 함께 웹에서 사용할 수 있는 바인딩을 생성합니다.

## 데모 실행

```bash
cd packages/engine
python3 -m http.server 4173
```

브라우저에서 `http://localhost:4173/demo/`를 열면 `demo/index.html`이 로드되고, 콘솔과 페이지에서 스냅샷/델타 바이트 길이를 확인할 수 있습니다.

> 다른 정적 서버를 사용할 경우에도 루트가 `packages/engine`이 되도록 설정해 `demo/`와 `pkg/`를 동시에 노출해 주세요.

## 전술 템플릿 커스터마이징

엔진이 초기화될 때 사용하는 기본 전술은 `src/config/tactics_template.json`에 정의되어 있습니다.  
이 파일은 `TacticModel` 구조와 동일한 JSON 형식을 따르며, `engine.rs`에서 `include_str!`로 읽혀 양 팀에 동일하게 적용됩니다.

- 실제 전술 데이터를 사용하려면 해당 JSON을 복사 후 라인업/포메이션/개인 지시 등을 원하는 값으로 수정하세요.
- 필드 이름은 `src/types.rs`의 `Tactic`, `TeamTactic`, `PlayerInstruction` 구조와 일치해야 하며, 추가 필드는 허용되지 않습니다.
- 만약 팀별로 다른 전술이 필요하다면, 템플릿을 기반으로 별도 파일을 만들어 파싱하도록 코드를 확장할 수 있습니다.
