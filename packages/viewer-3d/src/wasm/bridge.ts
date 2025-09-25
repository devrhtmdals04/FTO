// NOTE: 실제 엔진 경로에 맞게 조정 (wasm-bindgen 출력)
import initWasm, { WasmEngine } from "../../../../packages/engine/pkg/engine.js";
// ↑ 모노레포 경로 예시. 프로젝트 구조에 맞춰 바꿔주세요.

import { SimView, PlayerView, TeamId } from "../state";

const VIEW_VERSION_EXPECTED = 2;
const PLAYER_VIEW_SIZE = 32; // x,y,hx,hy,vis,vis_y,vis_xz (7*f32) + team (u8) + padding (3*u8) = 32 bytes
const N_PLAYERS = 22;
const SIM_VIEW_SIZE = 4 + 4 + 12 + N_PLAYERS * PLAYER_VIEW_SIZE; // version+padding (4) + tick (4) + ball (12) + players (22*32)
const COMMAND_LEAD_TICKS = 3;

export interface TacticsPayload {
  line_height: number;
  press_intensity: number;
  team_width: number;
  build_up: number;
  counter_press: number;
  long_ball_bias: number;
  overlap_fullbacks: number;
  compactness: number;
}

export interface EngineBridge {
  step(): SimView;
  getTick(): number;
  getLastView(): SimView;
  toggleActions(enabled: boolean): void;
  sendGroundPass(target: { x: number; y: number }): void;
  sendLoftedPass(target: { x: number; y: number }, loft?: number): void;
  sendShoot(target: { x: number; y: number }, power?: number): void;
  setTactics(value: TacticsPayload): void;
}

function createEmptyView(): SimView {
  const players: PlayerView[] = Array.from({ length: N_PLAYERS }, (_, i) => ({
    x: 0,
    y: 0,
    h: [1, 0],
    vis: 1,
    team: (i < 11 ? 0 : 1) as TeamId,
  }));
  return { tick: 0, ball: { x: 0, y: 0, z: 0 }, players };
}

function parseSimView(viewData: Uint8Array): SimView {
  if (viewData.length < SIM_VIEW_SIZE) {
    throw new Error(`view data length ${viewData.length} < expected ${SIM_VIEW_SIZE}`);
  }
  const dv = new DataView(viewData.buffer, viewData.byteOffset, viewData.byteLength);

  let off = 0;

  const ver = dv.getUint8(off);
  off += 4; // consume version + padding
  if (ver !== VIEW_VERSION_EXPECTED) {
    throw new Error(`VIEW_VERSION mismatch: got ${ver}, expected ${VIEW_VERSION_EXPECTED}`);
  }

  const tick = dv.getUint32(off, true);
  off += 4;

  const ballX = dv.getFloat32(off, true);
  off += 4;
  const ballY = dv.getFloat32(off, true);
  off += 4;
  const ballZ = dv.getFloat32(off, true);
  off += 4;

  const players: PlayerView[] = new Array(N_PLAYERS);
  for (let i = 0; i < N_PLAYERS; i++) {
    const x = dv.getFloat32(off, true);
    off += 4;
    const y = dv.getFloat32(off, true);
    off += 4;
    const hx = dv.getFloat32(off, true);
    off += 4;
    const hy = dv.getFloat32(off, true);
    off += 4;
    const vis = dv.getFloat32(off, true);
    off += 4;
    const vis_y = dv.getFloat32(off, true);
    off += 4;
    const vis_xz = dv.getFloat32(off, true);
    off += 4;
    const team = dv.getUint8(off) as TeamId;
    off += 4; // team + padding

    const n = Math.hypot(hx, hy) || 1;
    players[i] = {
      x,
      y,
      h: [hx / n, hy / n],
      vis,
      vis_y,
      vis_xz,
      team: team === 0 ? 0 : 1,
    };
  }

  return {
    tick,
    ball: { x: ballX, y: ballY, z: ballZ },
    players,
  };
}

export async function createEngineBridge(seed: bigint = BigInt(42)): Promise<EngineBridge> {
  await initWasm();
  const engine = new WasmEngine(seed);
  console.log("WASM Engine initialized successfully.");

  let lastView: SimView = createEmptyView();
  let lastTick = 0;
  let actionsEnabled = true;

  const step = (): SimView => {
    engine.tick();
    const raw = engine.view();
    if (!raw || raw.length === 0) {
      return lastView;
    }
    try {
      lastView = parseSimView(raw);
      lastTick = lastView.tick;
    } catch (err) {
      console.warn("parseSimView failed", err);
    }
    return lastView;
  };

  const ensureTick = () => (lastTick === 0 ? COMMAND_LEAD_TICKS : lastTick + COMMAND_LEAD_TICKS);

  const sendCommand = (payload: Record<string, unknown>) => {
    const apply_tick = Math.max(ensureTick(), lastTick + 1);
    engine.command({ apply_tick, ...payload });
  };

  const bridge: EngineBridge = {
    step,
    getTick: () => lastTick,
    getLastView: () => lastView,
    toggleActions(enabled: boolean) {
      actionsEnabled = enabled;
      engine.set_actions_enabled(enabled);
    },
    sendGroundPass(target) {
      sendCommand({ type: "ground_pass", tx: target.x, ty: target.y });
    },
    sendLoftedPass(target, loft = 0.6) {
      sendCommand({ type: "lofted_pass", tx: target.x, ty: target.y, loft });
    },
    sendShoot(target, power = 0.8) {
      sendCommand({ type: "shoot", tx: target.x, ty: target.y, power });
    },
    setTactics(value: TacticsPayload) {
      sendCommand({ type: "tactics_set", value });
    },
  };

  // Ensure engine starts in actionsEnabled state
  bridge.toggleActions(actionsEnabled);

  return bridge;
}
