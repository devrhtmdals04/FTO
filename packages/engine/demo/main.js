import init, { WasmEngine } from "../pkg/engine.js";

// Simple oblique projection for 2.5D feel
const DEG = Math.PI / 180;
const camera = { yaw: 0 * DEG, pitch: 12 * DEG, scale: 6 }; // 기본 2.5D 틸트 // px per meter (pitch lowered for gentle tilt)
const FIELD = { W: 105, H: 68 };
const GOAL_W = 7.32, GOAL_H = 2.44;
const PLAYER_RADIUS = 0.525; // meters
const BALL_RADIUS = 0.165; // meters
let jsTick = 0;

// --- Visual scale defaults from height/weight (BMI-aware) ---
function computeVisScale(height_cm, weight_kg) {
  // Returns a scale factor (1.0 = 100%) based on height and BMI.
  // Height dominates, BMI contributes mildly. Clamped to [0.75, 1.35].
  if (!height_cm && !weight_kg) return 1.0;
  const H0 = 180, BMI0 = 22;
  const h = Math.max(140, Math.min(210, height_cm || H0));
  const m = h / 100;
  const bmi = weight_kg ? Math.max(16, Math.min(32, weight_kg / (m * m))) : BMI0;
  const heightTerm = Math.pow(h / H0, 0.9);
  const bmiTerm = Math.pow(bmi / BMI0, 0.25);
  const s = heightTerm * bmiTerm;
  return Math.max(0.75, Math.min(1.35, s));
}


function project(x, y, z) {
  const c = Math.cos(camera.yaw), s = Math.sin(camera.yaw);
  const rx = x * c - y * s;
  const ry = x * s + y * c;

  // Make perspective strength proportional to the pitch angle
  const maxPerspectiveStrength = 0.4;
  const perspectiveStrength = maxPerspectiveStrength * Math.sin(camera.pitch);
  const perspective = 1 - perspectiveStrength * (ry / (FIELD.H / 2));

  const sx = rx * perspective * camera.scale;
  const syGround = ry * camera.scale * Math.cos(camera.pitch);
  const sy = syGround - z * perspective * camera.scale * Math.sin(camera.pitch);
  return { x: sx, y: -sy, yGround: -syGround };
}

// Snapshot decoder matching Rust serialization (LE):
// u32 tick, u32 ms, u8 phase, u16 home, u16 away,
// ball: i16[3] pos, i16[3] vel, u8 mode,
// players[22]: i16[2] pos, i16[2] vel, u16 stamina
function decodeSnapshot(bytes) {
  const posDiv = 20.0; // 1/0.05
  const velDiv = 50.0; // 1/0.02
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let o = 0;
  const u32 = () => { const v = dv.getUint32(o, true); o += 4; return v; };
  const u16 = () => { const v = dv.getUint16(o, true); o += 2; return v; };
  const u8  = () => { const v = dv.getUint8(o); o += 1; return v; };
  const i16 = () => { const v = dv.getInt16(o, true); o += 2; return v; };

  const tick = u32();
  const ms = u32();
  const phase = u8();
  const home = u16();
  const away = u16();
  const ball = {
    x: i16() / posDiv,
    y: i16() / posDiv,
    z: i16() / posDiv,
    vx: i16() / velDiv,
    vy: i16() / velDiv,
    vz: i16() / velDiv,
    mode: u8(),
  };
      const players = [];
      const N = 22;
      for (let i = 0; i < N; i++) {
        const px = i16() / posDiv, py = i16() / posDiv;
        const vx = i16() / velDiv, vy = i16() / velDiv;
        const stamina = u16();
        const vis_scale = u8(); // Read vis_scale
        const collider_radius_opt = i16(); // Read collider_radius_opt
        players.push({ px, py, vx, vy, stamina, vis_scale, collider_radius_opt });
      }  return { tick, ms, phase, home, away, ball, players };
}

function drawField(ctx) {
  const { W, H } = FIELD;
  ctx.strokeStyle = "#9ee6b8";
  ctx.lineWidth = 2;
  // Outline
  ctx.beginPath();
  const corners = [
    project(-W / 2, -H / 2, 0),
    project(W / 2, -H / 2, 0),
    project(W / 2, H / 2, 0),
    project(-W / 2, H / 2, 0),
  ];
  ctx.moveTo(corners[0].x, corners[0].y);
  for (let i = 1; i < corners.length; i++) ctx.lineTo(corners[i].x, corners[i].y);
  ctx.closePath(); ctx.stroke();
  // Midline
  const midA = project(0, -H / 2, 0), midB = project(0, H / 2, 0);
  ctx.beginPath(); ctx.moveTo(midA.x, midA.y); ctx.lineTo(midB.x, midB.y); ctx.stroke();
  // Penalty boxes
  drawRectGround(ctx, -W/2, -W/2 + 16.5, -40.32/2, 40.32/2);
  drawRectGround(ctx, W/2 - 16.5, W/2, -40.32/2, 40.32/2);
  // Goal boxes
  drawRectGround(ctx, -W/2, -W/2 + 5.5, -18.32/2, 18.32/2);
  drawRectGround(ctx, W/2 - 5.5, W/2, -18.32/2, 18.32/2);
  // Center circle (approx polygon)
  drawCircleGround(ctx, 0, 0, 9.15);
  // Grid overlay
  if (document.getElementById("dbg-grid").checked) drawGrid(ctx);
}

function drawRectGround(ctx, x0, x1, y0, y1) {
  const p = [project(x0, y0, 0), project(x1, y0, 0), project(x1, y1, 0), project(x0, y1, 0)];
  ctx.beginPath(); ctx.moveTo(p[0].x, p[0].y);
  for (let i = 1; i < 4; i++) ctx.lineTo(p[i].x, p[i].y);
  ctx.closePath(); ctx.stroke();
}

function drawCircleGround(ctx, cx, cy, r) {
  const steps = 64;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * 2 * Math.PI;
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    const p = project(x, y, 0);
    if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
}

function drawGrid(ctx) {
  const { W, H } = FIELD;
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.lineWidth = 1;
  for (let gx = -W / 2; gx <= W / 2 + 1e-3; gx += W / 8) {
    const a = project(gx, -H / 2, 0), b = project(gx, H / 2, 0);
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  }
  for (let gy = -H / 2; gy <= H / 2 + 1e-3; gy += H / 6) {
    const a = project(-W / 2, gy, 0), b = project(W / 2, gy, 0);
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  }
  ctx.restore();
}

async function run() {
  await init();

  const engine = new WasmEngine(42n);
  const allPlayersData = JSON.parse(engine.getPlayerDataJson());
  console.log("Fetched all player static data:", allPlayersData);

  const canvas = document.getElementById("pitch");
  // Debug HUD
  let hud = document.getElementById('debug-hud');
  if (!hud) {
    hud = document.createElement('div');
    hud.id = 'debug-hud';
    hud.style.position = 'fixed';
    hud.style.top = '12px';
    hud.style.right = '12px';
    hud.style.background = 'rgba(20,22,25,0.7)';
    hud.style.color = '#cfe9ff';
    hud.style.padding = '8px 12px';
    hud.style.font = '12px ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
    hud.style.borderRadius = '10px';
    hud.style.whiteSpace = 'pre';
    hud.style.pointerEvents = 'none';
    hud.style.zIndex = 1000;
    hud.textContent = 'HUD…';
    document.body.appendChild(hud);
  }

  const ctx = canvas.getContext("2d");
  // Stats
  let smoothedFps = 0;
  let lastFrameTs = performance.now();
  let lastRenderMs = 0;
  let lastSnapBytes = 0;
  let drawCalls = 0;

  const output = document.getElementById("output");
  const trail = [];
  let lastSnapshotData = null;

  // Fit canvas to container and scale camera to remove empty margins
  function fitCanvasAndCamera() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.floor(rect.width * dpr));
    const height = Math.max(1, Math.floor(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    // With perspective, the widest part of the field is at the bottom edge.
    const maxPerspectiveStrength = 0.4;
    const perspectiveStrength = maxPerspectiveStrength * Math.sin(camera.pitch);
    const perspectiveBottom = 1 + perspectiveStrength; // at ry = -FIELD.H / 2
    const projW = FIELD.W * perspectiveBottom;
    const projH = FIELD.H * Math.cos(camera.pitch);
    const scaleX = width / projW;
    const scaleY = height / projH;
    // Use slight safety margin to avoid clipping the lines
    camera.scale = Math.min(scaleX, scaleY) * 0.98;

    console.log(`fitCanvasAndCamera: canvas.width=${canvas.width}, canvas.height=${canvas.height}, camera.scale=${camera.scale.toFixed(2)}`);
  }
  fitCanvasAndCamera();
  window.addEventListener("resize", fitCanvasAndCamera);

  // View controls (tilt & yaw)
  const tiltInput = document.getElementById("cam-tilt");
  if (tiltInput) tiltInput.addEventListener("input", (e) => {
    camera.pitch = parseFloat(e.target.value) * DEG;
    fitCanvasAndCamera();
  });

  // Yaw slider (create if missing)
  let yawInput = document.getElementById("cam-yaw");
  if (!yawInput) {
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.bottom = '16px';
    panel.style.right = '16px';
    panel.style.background = 'rgba(20,22,25,0.7)';
    panel.style.backdropFilter = 'blur(4px)';
    panel.style.padding = '8px 12px';
    panel.style.borderRadius = '12px';
    panel.style.fontFamily = 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto';
    panel.style.color = '#e8f0f2';
    panel.style.zIndex = 1000;
    panel.innerHTML = '<label style="font-size:12px;display:block;margin-bottom:4px">Yaw <span id="cam-yaw-deg">0°</span></label>';
    yawInput = document.createElement('input');
    yawInput.type = 'range'; yawInput.min = '-60'; yawInput.max = '60'; yawInput.value = '0'; yawInput.step = '1';
    yawInput.id = 'cam-yaw';
    yawInput.style.width = '220px';
    panel.appendChild(yawInput);
    document.body.appendChild(panel);
  }
  const yawDegLabel = document.getElementById('cam-yaw-deg');
  yawInput.addEventListener('input', (e) => {
    const deg = parseFloat(e.target.value);
    camera.yaw = deg * DEG;
    if (yawDegLabel) yawDegLabel.textContent = `${deg.toFixed(0)}°`;
  });


  // Collapsible left sidebar
  const leftSidebar = document.getElementById("left-sidebar");
  const leftCollapseBtn = document.getElementById("left-collapse");
  if (leftCollapseBtn) {
    leftCollapseBtn.addEventListener("click", () => {
      leftSidebar.classList.toggle("collapsed");
      leftCollapseBtn.textContent = leftSidebar.classList.contains("collapsed") ? "⟩" : "⟨";
      fitCanvasAndCamera();
    });
  }

  // Panels toggle logic
  const panelIds = ["actions", "tactics", "debug", "metrics"];
  document.querySelectorAll(".toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.panel;
      const el = document.getElementById(`panel-${id}`);
      el.classList.toggle("hidden");
    });
  });
  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => btn.closest(".panel").classList.add("hidden"));
  });

  // Play / Step / Speed
  let playing = false;
  let speed = 1.0;
  const dtMs = 50; // 20Hz
  document.getElementById("btn-play").addEventListener("click", (e) => {
    playing = !playing; e.target.textContent = playing ? "Pause" : "Play";
  });
  document.getElementById("btn-step").addEventListener("click", () => {
    stepOnce();
    render();
  });
  document.getElementById("speed").addEventListener("change", (e) => {
    speed = parseFloat(e.target.value);
  });

  // Reset (initialize all to defaults)
  const resetBtn = document.getElementById("btn-reset");
  if (resetBtn) resetBtn.addEventListener("click", () => {
    // Playback
    playing = false; document.getElementById("btn-play").textContent = "Play";
    // Debug toggles
    document.getElementById("dbg-grid").checked = true;
    document.getElementById("dbg-trajectory").checked = true;
    document.getElementById("dbg-vectors").checked = false;
    // Speed
    const speedSel = document.getElementById("speed"); speedSel.value = "1"; speed = 1.0;
    // Tilt/Yaw
    if (tiltInput) { tiltInput.value = "0"; camera.pitch = 0 * DEG; }
    camera.yaw = 0;
    const yawInputEl = document.getElementById('cam-yaw');
    if (yawInputEl) { yawInputEl.value = '0'; const l = document.getElementById('cam-yaw-deg'); if (l) l.textContent = '0°'; }
    // Tactics sliders
    const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = String(v); };
    setVal("tx-line", 0.5); setVal("tx-width", 0.6); setVal("tx-press", 0.5);
    // Visual trail
    trail.length = 0;
    fitCanvasAndCamera();
  });

  // Modes (simple stubs sending commands a few ticks in future)
  let mode = null; // 'ground_pass' | 'lofted_pass' | 'shoot'
  document.getElementById("mode-pass").onclick = () => (mode = "ground_pass");
  document.getElementById("mode-loft").onclick = () => (mode = "lofted_pass");
  document.getElementById("mode-shoot").onclick = () => (mode = "shoot");
  canvas.addEventListener("click", (ev) => {
    console.log("Canvas clicked!");
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const clickX = (ev.clientX - rect.left) * dpr;
    const clickY = (ev.clientY - rect.top) * dpr;
    console.log(`Click coordinates: CSS(${ (ev.clientX - rect.left).toFixed(2)}, ${(ev.clientY - rect.top).toFixed(2)}) -> Scaled(${clickX.toFixed(2)}, ${clickY.toFixed(2)})`);

    // Check for ball click first
    if (lastSnapshotData) {
      const ball = lastSnapshotData.ball;
      const prj = project(ball.x, ball.y, ball.z);
      const ballScreenX = prj.x + canvas.width / 2;
      const ballScreenY = prj.y + canvas.height / 2;
      const distToBall = Math.hypot(clickX - ballScreenX, clickY - ballScreenY);

      console.log(`Click at (${clickX.toFixed(2)}, ${clickY.toFixed(2)}). Distance to ball: ${distToBall.toFixed(2)}`);

      // 화면상 볼 반지름을 고려한 동적 클릭 반경
      const ryB = ball.x * Math.sin(camera.yaw) + ball.y * Math.cos(camera.yaw);
      const perspB = 1 - (0.4 * Math.sin(camera.pitch)) * (ryB / (FIELD.H / 2));
      const screenBallR = BALL_RADIUS * perspB * camera.scale;
      if (distToBall < Math.max(10, screenBallR + 5)) {
        console.log(`%cBall clicked!`, 'color: yellow; font-weight: bold;');
        console.log(`Ball world coords: (${ball.x.toFixed(2)}, ${ball.y.toFixed(2)}, ${ball.z.toFixed(2)})`);
        console.log(`Ball screen coords: (${ballScreenX.toFixed(2)}, ${ballScreenY.toFixed(2)})`);
      }
    }

    // If in an action mode, perform the action
    if (mode) {
      console.log(`Action mode active: '${mode}'. Performing action.`);
      const sx = clickX - canvas.width / 2;
      const sy = clickY - canvas.height / 2;

      // Inverse of simple projection (approx for yaw=0)
      const ry = sy / (camera.scale * Math.cos(camera.pitch));
      const rx = sx / camera.scale;
      const x = rx, y = ry; // meters

      const applyTick = jsTick + 3;
      let payload;
      if (mode === "ground_pass") payload = { type: "ground_pass", tx: x, ty: y };
      else if (mode === "lofted_pass") payload = { type: "lofted_pass", tx: x, ty: y, loft: 0.5 };
      else payload = { type: "shoot", tx: x, ty: y, power: 0.8 };

      const envelope = { apply_tick: applyTick, ...payload };
      try { engine.command(envelope); } catch (e) { console.warn("cmd rejected", e); }
      mode = null; // Consume mode
      return;
    }

    // Otherwise, check for player clicks
    if (!lastSnapshotData) {
      console.warn("No snapshot data available for click detection.");
      return;
    }

    console.log("Checking for player click...");
    let clickedPlayer = null;
    let clickedPlayerIndex = -1;

    const playersSorted = lastSnapshotData.players
      .map((p, i) => ({...p, idx: i, prj: project(p.px, p.py, 0)}))
      .sort((a, b) => b.prj.yGround - a.prj.yGround);

    for (const p of playersSorted) {
        // Compute on-screen radius consistent with drawPlayers()
        const ry = p.px * Math.sin(camera.yaw) + p.py * Math.cos(camera.yaw);
        const persp = 1 - (0.4 * Math.sin(camera.pitch)) * (ry / (FIELD.H / 2));
        const staticData = allPlayersData?.[p.idx] ?? {};
        const hM = (staticData.height_cm ? staticData.height_cm / 100 : 1.8);
        const defaultScale = computeVisScale(staticData.height_cm, staticData.weight_kg);
        const visScale = (typeof p.vis_scale === "number" && p.vis_scale > 0) ? Math.max(0.5, p.vis_scale / 100) : defaultScale;
        const colliderRadiusM = (typeof p.collider_radius_opt === "number" && p.collider_radius_opt > 0) ? (p.collider_radius_opt / 100) : PLAYER_RADIUS;
        const screenRadius = colliderRadiusM * visScale * persp * camera.scale;
        const prjGround = project(p.px, p.py, 0);
        const prjTop    = project(p.px, p.py, hM);
        const bodyY = prjGround.y - Math.abs(prjGround.y - prjTop.y);

        const playerScreenX = prjGround.x + canvas.width / 2;
        const playerScreenY = bodyY + canvas.height / 2;
        const distToPlayer = Math.hypot(clickX - playerScreenX, clickY - playerScreenY);

        if (distToPlayer < Math.max(10, screenRadius + 4)) {
            clickedPlayer = p;
            clickedPlayerIndex = p.idx;
            break;
        }
    }
const infoPanel = document.getElementById('player-info');
    if (clickedPlayer) {
        const infoContent = document.getElementById('player-info-content');
        const team = clickedPlayerIndex < 11 ? 'Home' : 'Away';
        const staticPlayerData = allPlayersData[clickedPlayerIndex];

        let infoText = `Name: ${staticPlayerData.name}\nTeam: ${team}\nPos: (${clickedPlayer.px.toFixed(2)}, ${clickedPlayer.py.toFixed(2)})\nVel: (${clickedPlayer.vx.toFixed(2)}, ${clickedPlayer.vy.toFixed(2)})\nStamina: ${(clickedPlayer.stamina / 1000).toFixed(2)}

Ratings:\n`;
        for (const key in staticPlayerData) {
            if (typeof staticPlayerData[key] === 'number' && key !== 'height_cm' && key !== 'weight_kg' && key !== 'weak_foot') {
                infoText += `  ${key}: ${staticPlayerData[key]}\n`;
            }
        }
        infoText += `Height: ${staticPlayerData.height_cm} cm\n`;
        infoText += `Weight: ${staticPlayerData.weight_kg} kg\n`;
        infoText += `Foot: ${staticPlayerData.foot}\n`;
        infoText += `Weak Foot: ${staticPlayerData.weak_foot}\n`;

        infoContent.textContent = infoText;

        infoPanel.style.left = `${ev.clientX + 15}px`;
        infoPanel.style.top = `${ev.clientY}px`;
        infoPanel.classList.remove('hidden');
    } else {
        console.log("No player was clicked.");
        infoPanel.classList.add('hidden');
    }
  });

  // Tactics apply (right sidebar)
  const btnApplyTactics = document.getElementById("btn-apply-tactics");
  if (btnApplyTactics) btnApplyTactics.addEventListener("click", () => {
    const t = {
      line_height: parseFloat(document.getElementById("tx-line").value),
      team_width: parseFloat(document.getElementById("tx-width").value),
      press_intensity: parseFloat(document.getElementById("tx-press").value),
      build_up: 0.5, counter_press: 0.5, long_ball_bias: 0.5, overlap_fullbacks: 0.5, compactness: 0.5,
    };
    const envelope = { apply_tick: jsTick + 3, type: "tactics_set", value: t };
    try { engine.command(envelope); } catch (e) { console.warn("tactics rejected", e); }
  });

  function stepOnce() {
    engine.tick();
    jsTick++;
  }

  function drawPlayers(ctx, players, allPlayersData) {
    // Build projected list with depth key (yGround)
    const list = players.map((p, idx) => {
      const prj = project(p.px, p.py, 0);
      return { idx, prj, p, v: { x: p.vx, y: p.vy } };
    });
    list.sort((a, b) => a.prj.yGround - b.prj.yGround);

    const defaultHeightM = 1.8; // meters

    for (const item of list) {
      const { idx, prj, p, v } = item;
      const home = idx < 11; // assume 0..10 home, 11..21 away

      // Calculate perspective and screen radius at the player's position
            // Calculate perspective and screen radius at the player's position
      const ry = p.px * Math.sin(camera.yaw) + p.py * Math.cos(camera.yaw);
      const maxPerspectiveStrength = 0.4;
      const perspectiveStrength = maxPerspectiveStrength * Math.sin(camera.pitch);
      const perspective = 1 - perspectiveStrength * (ry / (FIELD.H / 2));

      const staticData = allPlayersData?.[idx] ?? {};
      const hM = (staticData.height_cm ? staticData.height_cm / 100 : defaultHeightM);
      const defaultScale = computeVisScale(staticData.height_cm, staticData.weight_kg);
      const visScale = (typeof p.vis_scale === "number" && p.vis_scale > 0) ? Math.max(0.5, p.vis_scale / 100) : defaultScale;
      const colliderRadiusM = (typeof p.collider_radius_opt === "number" && p.collider_radius_opt > 0)
        ? (p.collider_radius_opt / 100)  // cm → m
        : PLAYER_RADIUS;
      const screenRadius = colliderRadiusM * visScale * perspective * camera.scale;

      // Project the top of the player's head to find the height on screen (uses hM)
      const topPrj = project(p.px, p.py, hM);
      const screenHeight = Math.abs(prj.y - topPrj.y);

      // Shadow (at ground projection `prj.y`)

      // Shadow (at ground projection `prj.y`)
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.beginPath(); ctx.ellipse(prj.x, prj.y, screenRadius, screenRadius * 0.5, 0, 0, Math.PI * 2); ctx.fill(); drawCalls += 2;

      // The top of the cylinder should be "above" the shadow on screen (smaller Y value)
      const bodyY = prj.y - screenHeight;

      // Cylinder side (only if tall enough to be visible)
      if (screenHeight > 1) {
        ctx.fillStyle = home ? "#3a83dd" : "#dd4c4c"; // Darker side color
        ctx.fillRect(prj.x - screenRadius, bodyY, screenRadius * 2, screenHeight); drawCalls += 1;
      }

      // Body (top of the cylinder)
      ctx.fillStyle = home ? "#4aa3ff" : "#ff5c5c";
      ctx.strokeStyle = "#101419"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(prj.x, bodyY, screenRadius, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); drawCalls += 2;
      
      // Label (number or initials)
      ctx.font = `${Math.max(10, screenRadius * 1.2).toFixed(0)}px ui-sans-serif, -apple-system, Segoe UI, Roboto`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#0b0c0d";
      const label = (() => {
        const s = staticData || {};
        if (s.shirt_number != null) return String(s.shirt_number);
        if (s.number != null) return String(s.number);
        if (s.name) {
          const parts = String(s.name).trim().split(/\s+/);
          if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
          return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return String(idx + 1);
      })();
      ctx.fillText(label, prj.x, bodyY);
// Velocity vector (debug)
      if (document.getElementById("dbg-vectors").checked) {
        const tip = project(p.px + v.x, p.py + v.y, 0);
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(prj.x, prj.y); ctx.lineTo(tip.x, tip.y); ctx.stroke();
      }
    }
  }

  function drawBall(ctx, ball) {
    const prjG = project(ball.x, ball.y, 0);
    const prj = project(ball.x, ball.y, ball.z);

    // Calculate perspective and screen radius at the ball's position
    const ry = ball.x * Math.sin(camera.yaw) + ball.y * Math.cos(camera.yaw);
    const maxPerspectiveStrength = 0.4;
    const perspectiveStrength = maxPerspectiveStrength * Math.sin(camera.pitch);
    const perspective = 1 - perspectiveStrength * (ry / (FIELD.H / 2));
    const screenRadius = BALL_RADIUS * perspective * camera.scale;

    // Highlight Marker
    ctx.fillStyle = "rgba(255, 255, 0, 0.4)";
    ctx.beginPath();
    ctx.arc(prjG.x, prjG.y, screenRadius + 3, 0, Math.PI * 2);
    ctx.fill();

    // Shadow (darker when higher)
    const alpha = Math.max(0.2, 1.0 - ball.z / 10.0);
    ctx.fillStyle = `rgba(0,0,0,${alpha.toFixed(2)})`;
    ctx.beginPath(); ctx.ellipse(prjG.x, prjG.y, screenRadius, screenRadius * 0.5, 0, 0, Math.PI * 2); ctx.fill(); drawCalls += 2;

    const screenHeight = Math.abs(prjG.y - prj.y);

    // Cylinder side for the ball
    if (screenHeight > 0.5) {
        ctx.fillStyle = "#d0d0d0";
        const topY = Math.min(prj.y, prjG.y);
        ctx.fillRect(prj.x - screenRadius, topY, screenRadius * 2, screenHeight); drawCalls += 1;
    }

    // Ball (top of the cylinder)
    ctx.fillStyle = "#fff"; ctx.strokeStyle = "#111"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(prj.x, prj.y, screenRadius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }

  function drawTrail(ctx, pts) {
    if (pts.length < 2) return;
    ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
  }

  function drawGoal(ctx, side) {
    const x = (side === 'home' ? -FIELD.W / 2 : FIELD.W / 2);
    const y1 = -GOAL_W / 2;
    const y2 = GOAL_W / 2;

    // Calculate perspective for the posts
    const ry = y1 * Math.cos(camera.yaw); // Use one of the posts for perspective calc
    const maxPerspectiveStrength = 0.4;
    const perspectiveStrength = maxPerspectiveStrength * Math.sin(camera.pitch);
    const perspective = 1 - perspectiveStrength * (ry / (FIELD.H / 2));
    const postRadius = 0.1 * perspective * camera.scale;

    // Project the 4 corners of the goal mouth
    const bl = project(x, y1, 0);      // bottom-left
    const tl = project(x, y1, GOAL_H); // top-left
    const br = project(x, y2, 0);      // bottom-right
    const tr = project(x, y2, GOAL_H); // top-right

    ctx.fillStyle = "#efefef";

    // Draw left post as a rectangle
    const leftPostHeight = Math.abs(bl.y - tl.y);
    ctx.fillRect(bl.x - postRadius, bl.y - leftPostHeight, postRadius * 2, leftPostHeight);

    // Draw right post as a rectangle
    const rightPostHeight = Math.abs(br.y - tr.y);
    ctx.fillRect(br.x - postRadius, br.y - rightPostHeight, postRadius * 2, rightPostHeight);

    // Draw crossbar
    ctx.strokeStyle = "#efefef";
    ctx.lineWidth = postRadius * 2;
    ctx.beginPath();
    ctx.moveTo(bl.x, bl.y - leftPostHeight);
    ctx.lineTo(br.x, br.y - rightPostHeight);
    ctx.stroke();
  }

  function render() {
    const t0 = performance.now();
    drawCalls = 0;
    // Clear and translate origin
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // Field + markings
    drawField(ctx);
    // Far goal (away)
    drawGoal(ctx, 'away');

    // Decode snapshot and render entities
    const snapBytes = engine.snapshot();
    const data = decodeSnapshot(snapBytes);
    lastSnapBytes = snapBytes.length;
    lastSnapshotData = data;

    // Ball trajectory trail (ground projection)
    const ground = project(data.ball.x, data.ball.y, 0);
    trail.push({ x: ground.x, y: ground.y });
    if (trail.length > 120) trail.shift();

    // Draw players (sorted by ground depth)
    drawPlayers(ctx, data.players, allPlayersData);
    // Draw ball + shadow + trail (optional)
    drawBall(ctx, data.ball);
    if (document.getElementById("dbg-trajectory").checked) drawTrail(ctx, trail);

    // Near goal (home)
    drawGoal(ctx, 'home');

    ctx.restore();
    const t1 = performance.now();
    lastRenderMs = t1 - t0;
    // FPS from frame callback
    const nowTs = performance.now();
    const dt = nowTs - lastFrameTs;
    const instFps = dt > 0 ? 1000 / dt : 0;
    smoothedFps = smoothedFps ? (smoothedFps * 0.9 + instFps * 0.1) : instFps;
    lastFrameTs = nowTs;

    if (hud) {
      const yawDeg = (camera.yaw / DEG).toFixed(1);
      const pitchDeg = (camera.pitch / DEG).toFixed(1);
      hud.textContent =
`FPS   : ${smoothedFps.toFixed(1)}
Render: ${lastRenderMs.toFixed(2)} ms
Calls : ${drawCalls}
Bytes : ${lastSnapBytes}
Cam   : yaw ${yawDeg}°, pitch ${pitchDeg}°
Players: ${lastSnapshotData ? lastSnapshotData.players.length : 0}`;
    }


    const deltaBytes = engine.delta();
    output.textContent = `Tick: ${jsTick}\nSnapshot bytes: ${snapBytes.length}\nDelta bytes: ${deltaBytes.length}`;
  }

  // Main loop (rAF with fixed-step accumulator)
  let last = performance.now();
  let acc = 0;
  function frame(now) {
    const elapsed = now - last; last = now;
    acc += elapsed * speed;
    if (playing) {
      while (acc >= dtMs) { stepOnce(); acc -= dtMs; }
    }
    render();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

run().catch((err) => console.error("Failed to run WASM engine", err));
