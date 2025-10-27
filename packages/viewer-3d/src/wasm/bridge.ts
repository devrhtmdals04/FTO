import init, { WasmEngine } from "../../../../packages/engine/pkg/engine.js";
// ↑ 모노레포 경로 예시. 프로젝트 구조에 맞춰 바꿔주세요.

import { SimView, PlayerView, TeamId, PlayerProfile, PlayerClassJson } from "../state";

const VIEW_VERSION_EXPECTED = 3;
const PLAYER_VIEW_SIZE = 32; // x,y,hx,hy,vis,vis_y,vis_xz (7*f32) + team (u8) + padding (3*u8) = 32 bytes
const N_PLAYERS = 22;
const SIM_VIEW_SIZE = 4 + 4 + 12 + (N_PLAYERS * PLAYER_VIEW_SIZE) + 2; // version+padding (4) + tick (4) + ball (12) + players (22*32) + team_states(2)


function parseSimView(viewData: Uint8Array): SimView {
  if (viewData.length < SIM_VIEW_SIZE) {
    throw new Error(`view data length ${viewData.length} < expected ${SIM_VIEW_SIZE}`);
  }
  const dv = new DataView(viewData.buffer, viewData.byteOffset, viewData.byteLength);

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
    const perception_radius = dv.getFloat32(off, true); off += 4; // vis 필드를 perception_radius로 해석
    const vis_y  = dv.getFloat32(off, true); off += 4;
    const vis_xz = dv.getFloat32(off, true); off += 4;
    const team   = dv.getUint8(off);          off += 1;
    let hasBall = false;
    let state = 0;
    let role = 0;
    if (ver >= 3) {
      hasBall = dv.getUint8(off) !== 0; off += 1;
      state = dv.getUint8(off); off += 1;
      role = dv.getUint8(off); off += 1;
    } else {
      off += 3; // legacy padding
    }

    // heading 정규화(안전)
    const n = Math.hypot(hx, hy) || 1;
    players[i] = {
      x, y,
      h: [hx / n, hy / n],
      vis: perception_radius, // vis에 우선 값을 넣어둠 (하위 호환성)
      vis_y: vis_y, // vis_y 할당
      vis_xz: vis_xz, // vis_xz 할당
      team: (team === 0 ? 0 : 1) as TeamId,
      has_ball: hasBall,
      state: state,
      role: role,
      perception_radius: perception_radius, // 새로운 필드에 값 할당
    };
  }

  const home_team_phase = dv.getUint8(off); off += 1;
  const away_team_phase = dv.getUint8(off); off += 1;

  return {
    tick,
    ball: { x: ballX, y: ballY, z: ballZ },
    players,
    home_team_phase,
    away_team_phase,
  };
}

export function createEngineBridge() {
  // 초기화와 엔진 생성
  let ready = false;
  let engine: WasmEngine;
  let lastTick = 0;
  let playerProfiles: PlayerProfile[] = [];
  let xtMap: number[][] = [];

  const initFn = async () => {
    try {
      // In modern wasm-pack, the module is initialized on import.
      // We just need to instantiate the class.
      await init(); // Initialize the WASM module
      engine = new WasmEngine(BigInt(42)); // seed 예시
      const rawProfiles = engine.getPlayerClassesJson();
      if (rawProfiles) {
        try {
          const parsed = JSON.parse(rawProfiles) as PlayerClassJson[];
          parsed.sort((a, b) => a.index - b.index);
          playerProfiles = parsed.map((entry) => {
            const base = entry.base_stats;
            const profile: PlayerProfile = {
              ...base,
              index: entry.index,
              team: (entry.team === 0 ? 0 : 1) as TeamId,
              ctrl_radius: entry.params.ctrl_radius,
              role: entry.role,
              roleId: entry.role_id,
              quantifiedTactics: entry.quantified_tactics,
              personalInstructions: entry.personal_instructions ?? null,
              params: entry.params,
            };
            return profile;
          });
        } catch (profileErr) {
          console.error("Failed to parse player class data:", profileErr);
          playerProfiles = [];
        }
      }
      xtMap = engine.getXtMap();
      ready = true;
      console.log("WASM Engine initialized successfully.");
    } catch (e) {
      console.error("Failed to initialize WASM Engine:", e);
    }
  };

  const readyPromise = initFn();

  const get = (): SimView => {
    if (!ready) {
      // 초기 로딩 중엔 빈 모션
      return { tick: lastTick, ball: {x:0,y:0,z:0}, players: Array.from({length:22},(_,i)=>( 
        {x:0,y:0,h:[1,0],vis:1,team:(i<11?0:1), state: 0, role: 0} as PlayerView
      )), home_team_phase: 0, away_team_phase: 0 };
    }
    // 고정틱
    engine.tick();

    const viewData = engine.view();
    if (viewData.length === 0) {
        // 버퍼가 너무 작거나 다른 에러
        return { tick: lastTick, ball: {x:0,y:0,z:0}, players: Array.from({length:22},(_,i)=>( 
            {x:0,y:0,h:[1,0],vis:1,team:(i<11?0:1), state: 0, role: 0} as PlayerView
        )), home_team_phase: 0, away_team_phase: 0 };
    }

    const simView = parseSimView(viewData);
    lastTick = simView.tick;
    return simView;
  };

  return {
      get,
      ready: () => readyPromise,
      getPlayerProfiles: () => playerProfiles,
      getXtMap: () => xtMap,
      engine: new Proxy({}, {
          get: (target, prop) => {
              if (ready) {
                  return Reflect.get(engine, prop);
              }
              return () => console.warn("Engine not ready yet.");
          }
      }) as WasmEngine
  }
}
