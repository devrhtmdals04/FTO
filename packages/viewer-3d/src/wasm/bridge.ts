// NOTE: 실제 엔진 경로에 맞게 조정 (wasm-bindgen 출력)
import initWasm, { WasmEngine } from "../../../../packages/engine/pkg/engine.js";
// ↑ 모노레포 경로 예시. 프로젝트 구조에 맞춰 바꿔주세요.

import { SimView, PlayerView, TeamId } from "../state";

const VIEW_VERSION_EXPECTED = 2;
const PLAYER_VIEW_SIZE = 32; // x,y,hx,hy,vis,vis_y,vis_xz (7*f32) + team (u8) + padding (3*u8) = 32 bytes
const N_PLAYERS = 22;
const SIM_VIEW_SIZE = 4 + 4 + 12 + (N_PLAYERS * PLAYER_VIEW_SIZE); // version+padding (4) + tick (4) + ball (12) + players (22*32)

function parseSimView(ptr: number, len: number, memory: WebAssembly.Memory): SimView {
  if (len < SIM_VIEW_SIZE) {
    throw new Error(`view_copy len ${len} < expected ${SIM_VIEW_SIZE}`);
  }
  const dv = new DataView(memory.buffer, ptr, len);

  let off = 0;

  // 0) 버전 + 패딩
  const ver = dv.getUint8(off); off += 1;
  off += 3; // padding for 4-byte alignment
  if (ver !== VIEW_VERSION_EXPECTED) {
    throw new Error(`VIEW_VERSION mismatch: got ${ver}, expected ${VIEW_VERSION_EXPECTED}`);
  }

  // 1) tick (LE)
  const tick = dv.getUint32(off, true); off += 4;

  // 2) ball (x,y,z) — LE float32
  const ballX = dv.getFloat32(off, true); off += 4;
  const ballY = dv.getFloat32(off, true); off += 4;
  const ballZ = dv.getFloat32(off, true); off += 4;

  // 3) players 22 * 32B
  const players: PlayerView[] = new Array(N_PLAYERS);
  for (let i = 0; i < N_PLAYERS; i++) {
    const x      = dv.getFloat32(off, true); off += 4;
    const y      = dv.getFloat32(off, true); off += 4;
    const hx     = dv.getFloat32(off, true); off += 4;
    const hy     = dv.getFloat32(off, true); off += 4;
    const vis    = dv.getFloat32(off, true); off += 4;
    const vis_y  = dv.getFloat32(off, true); off += 4;
    const vis_xz = dv.getFloat32(off, true); off += 4;
    const team   = dv.getUint8(off);          off += 1;
    off += 3; // pad

    // heading 정규화(안전)
    const n = Math.hypot(hx, hy) || 1;
    players[i] = {
      x, y,
      h: [hx / n, hy / n],
      vis,
      vis_y,
      vis_xz,
      team: (team === 0 ? 0 : 1) as TeamId,
    };
  }

  return {
    tick,
    ball: { x: ballX, y: ballY, z: ballZ },
    players,
  };
}

export function createEngineBridge() {
  // 초기화와 엔진 생성
  let ready = false;
  let engine: WasmEngine;
  let lastTick = 0;

  // @ts-ignore (wasm JS glue가 메모리 export함)
  let memory: WebAssembly.Memory;
  let scratchPtr: number;
  let scratchCap: number;

  const init = async () => {
    try {
      const wasm = await initWasm();
      // @ts-ignore
      memory = wasm.memory; // wasm-bindgen glue가 export한 memory
      engine = new WasmEngine(BigInt(42)); // seed 예시

      // Allocate scratch buffer in WASM memory
      // __wbindgen_malloc is internal, but used for performance here
      scratchPtr = (wasm as any).__wbindgen_malloc(SIM_VIEW_SIZE);
      scratchCap = SIM_VIEW_SIZE;

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

    const bytesWritten = engine.view_copy(scratchPtr, scratchCap);
    if (bytesWritten === 0) {
        // 버퍼가 너무 작거나 다른 에러
        return { tick: lastTick, ball: {x:0,y:0,z:0}, players: Array.from({length:22},(_,i)=>( 
            {x:0,y:0,h:[1,0],vis:1,team:(i<11?0:1)} as PlayerView
        )) };
    }

    const simView = parseSimView(scratchPtr, bytesWritten, memory);
    lastTick = simView.tick;
    return simView;
  };
}