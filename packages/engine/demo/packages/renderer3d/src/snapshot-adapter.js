// packages/renderer3d/src/snapshot-adapter.js
// Robust adapter to map your engine's snapshot → renderer snapshot

const TAU = Math.PI * 2;
const deg2rad = (d) => (d * Math.PI) / 180;

function vec3(a, b, c) {
  if (Array.isArray(a)) return [a[0] || 0, a[1] || 0, a[2] || 0];
  if (typeof a === 'object' && a) {
    if (Array.isArray(a.pos)) return vec3(a.pos);
    return [a.x ?? 0, a.y ?? 0, a.z ?? 0];
  }
  return [a || 0, b || 0, c || 0];
}

function magnitude3(v) {
  const [x, y, z] = vec3(v);
  return Math.hypot(x, y, z);
}

function coerceYaw(p) {
  if (p.yaw != null) return p.yaw;                          // radians
  if (p.heading != null) return Math.abs(p.heading) > TAU ? deg2rad(p.heading) : p.heading;
  if (p.heading_deg != null) return deg2rad(p.heading_deg);
  if (p.dir != null) return p.dir_deg ? deg2rad(p.dir) : p.dir;
  if (p.rotation?.y != null) return p.rotation.y;
  if (p.rot?.y != null) return p.rot.y;
  if (p.angle != null) return Math.abs(p.angle) > TAU ? deg2rad(p.angle) : p.angle;
  if (p.ang != null) return Math.abs(p.ang) > TAU ? deg2rad(p.ang) : p.ang;
  return 0;
}

function coerceSpeed(p) {
  if (p.speed != null) return p.speed;                      // m/s
  const v = p.vel ?? p.velocity ?? p.v3;                    // vector
  if (v) return magnitude3(v);
  const vx = p.vx ?? p.vx_mps, vy = p.vy, vz = p.vz ?? p.vz_mps;
  if (vx != null || vy != null || vz != null) return Math.hypot(vx || 0, vy || 0, vz || 0);
  if (typeof p.v === 'number') return p.v;                  // scalar speed
  return 0;
}

function coercePos(p) {
  if (p.pos) return vec3(p.pos);
  if (p.position) return vec3(p.position);
  return vec3(p.x, p.y, p.z);
}

function normalizePlayer(p, i = 0) {
  const pos = coercePos(p);
  const yaw = coerceYaw(p);
  const speed = coerceSpeed(p);
  const action = p.action ?? p.act ?? (speed < 0.2 ? 'Idle' : speed < 5 ? 'Jog' : 'Run');
  return {
    id: p.id ?? p.uid ?? p.name ?? i,
    team: p.team ?? p.t ?? 'A',
    pos,
    yaw,
    speed,
    action,
    height_cm: p.height_cm ?? p.h_cm ?? 180,
    weight_kg: p.weight_kg ?? p.w_kg ?? 75,
    footPhase: p.footPhase ?? p.phase ?? 0,
    footPin: p.footPin ?? null,
  };
}

export function toRendererSnapshot(engineSnap) {
  if (!engineSnap) return null;

  let snap = engineSnap;
  if (typeof engineSnap === 'string') {
    try {
      snap = JSON.parse(engineSnap);
    } catch (e) {
      console.error("Failed to parse engine snapshot JSON:", e);
      return null;
    }
  }

  const time = snap.time ?? snap.t ?? (performance?.now ? performance.now() / 1000 : Date.now() / 1000);

  const source = snap.players ?? snap.actors ?? snap.entities ?? snap.agents ?? [];
  const players = Array.isArray(source) ? source.map((p, i) => normalizePlayer(p, i)) : [];

  let ball = null;
  const b = snap.ball ?? snap.soccerBall ?? null;
  if (b) {
    const pos = b.pos ? vec3(b.pos) : vec3(b.x, b.y, b.z);
    const spin = b.spin ? vec3(b.spin) : vec3(b.wx, b.wy, b.wz);
    ball = { pos, spin };
  }

  return { time, ball, players };
}

export default toRendererSnapshot;
