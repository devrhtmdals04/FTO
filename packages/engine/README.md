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
