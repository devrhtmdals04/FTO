// NOTE: 실제 엔진 경로에 맞게 조정 (wasm-bindgen 출력)
import initWasm, { WasmEngine } from "../../../../packages/engine/pkg/engine.js";
// ↑ 모노레포 경로 예시. 프로젝트 구조에 맞춰 바꿔주세요.

import { SimView, PlayerView, TeamId } from "../state";

const SIM_VIEW_SIZE = 544; // tick:u32 + ball:f32*3 + players:22 * (x,y,hx,hy,vis):f32*5 + team:u8 + pad:u8*3
const PLAYER_VIEW_SIZE = 24;
const N_PLAYERS = 22;

export function createEngineBridge() {
  // 초기화와 엔진 생성
  let ready = false;
  let engine: WasmEngine;
  let lastTick = 0;

  // @ts-ignore (wasm JS glue가 메모리 export함)
  let memory: WebAssembly.Memory;
  let viewBuffer: Uint8Array;

  const init = async () => {
    try {
      const wasm = await initWasm();
      // @ts-ignore
      memory = wasm.memory; // wasm-bindgen glue가 export한 memory
      engine = new WasmEngine(BigInt(42)); // seed 예시

      // SimView 데이터를 받을 버퍼 할당
      viewBuffer = new Uint8Array(SIM_VIEW_SIZE);

      ready = true;
      console.log("WASM Engine initialized successfully.");
    } catch (e) {
      console.error("Failed to initialize WASM Engine:", e);
    }
  };

  // 즉시 kick
  if (!ready) { void init(); }

  // 반환: 호출 시 SimView 한 프레임
  return (): SimView => {
    if (!ready) {
      // 초기 로딩 중엔 빈 모션
      return { tick: lastTick, ball: {x:0,y:0,z:0}, players: Array.from({length:22},(_,i)=>(
        {x:0,y:0,h:[1,0],vis:1,team:(i<11?0:1)} as PlayerView
      )) };
    }
    // 고정틱
    engine.tick();

    const bytesWritten = engine.view_copy(viewBuffer);
    if (bytesWritten === 0) {
        // 버퍼가 너무 작거나 다른 에러
        return { tick: lastTick, ball: {x:0,y:0,z:0}, players: Array.from({length:22},(_,i)=>(
            {x:0,y:0,h:[1,0],vis:1,team:(i<11?0:1)} as PlayerView
        )) };
    }

    const view = new DataView(viewBuffer.buffer);
    const tick = view.getUint32(0, true);
    lastTick = tick;

    const ball = {
        x: view.getFloat32(4, true),
        y: view.getFloat32(8, true),
        z: view.getFloat32(12, true),
    };

    const players: PlayerView[] = [];
    for (let i = 0; i < N_PLAYERS; i++) {
        const offset = 16 + i * PLAYER_VIEW_SIZE;
        players.push({
            x: view.getFloat32(offset, true),
            y: view.getFloat32(offset + 4, true),
            h: [view.getFloat32(offset + 8, true), view.getFloat32(offset + 12, true)],
            vis: view.getFloat32(offset + 16, true),
            team: view.getUint8(offset + 20) as TeamId,
        });
    }

    return { tick, ball, players };
  };
}