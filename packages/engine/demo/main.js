/*
 * FTO main.js — engine client renderer (consolidated, compat-ready)
 * - 2.5D projection (yaw/pitch/pan/zoom)
 * - 3D pitch/goal/ball
 * - Height/weight → per-player body model
 * - Limb animation (legs IK, arm swing, stance lock)
 * - HUD (FPS, render ms, draw-calls, snapshot bytes, counts)
 * - Mouse/keyboard camera (orbit/pan/zoom) — no HTML changes required
 */

// =========================
// Adapter: hook into your engine (safe fallbacks)
// =========================
function getAllPlayersData() {
  try {
    if (typeof engine !== 'undefined' && engine.getPlayerDataJson) {
      return JSON.parse(engine.getPlayerDataJson());
    }
  } catch (e) { console.warn('getPlayerDataJson failed:', e); }
  return [];
}

function getLatestSnapshot() {
  try {
    let raw = null, bytesLen = 0;
    if (typeof engine !== 'undefined') {
      if (engine.getSnapshotBytes && typeof decodeSnapshot === 'function') {
        const bytes = engine.getSnapshotBytes();
        bytesLen = (bytes && bytes.length) || 0;
        raw = decodeSnapshot(bytes);
      } else if (engine.getLatestSnapshotJson) {
        const j = engine.getLatestSnapshotJson();
        bytesLen = (typeof j === 'string') ? j.length : 0;
        raw = JSON.parse(j);
      }
    }
    if (!raw) return null;
    const snap = normalizeSnapshot(raw);
    snap.__bytesLen = bytesLen;
    return snap;
  } catch (e) {
    console.warn('getLatestSnapshot failed:', e);
    return null;
  }
}

// Normalize various engine snapshot shapes to { players:[{px,py,vx,vy}], ball:{x,y,z} }
function normalizeSnapshot(s) {
  const asArr = (x)=> Array.isArray(x) ? x : (x ? [x] : []);
  const rawPlayers = s.players ?? s.p ?? s.P ?? s.entities?.players ?? s.actors ?? s.objs ?? [];
  const players = asArr(rawPlayers).map(p => ({
    px: +(p.px ?? p.x ?? p.pos?.x ?? p.position?.x ?? 0),
    py: +(p.py ?? p.y ?? p.pos?.y ?? p.position?.y ?? 0),
    vx: +(p.vx ?? p.v?.x ?? p.vel?.x ?? 0),
    vy: +(p.vy ?? p.v?.y ?? p.vel?.y ?? 0),
    vis_scale: p.vis_scale ?? p.vs ?? undefined,
    collider_radius_opt: p.collider_radius_opt ?? p.r ?? undefined,
  })).filter(p => Number.isFinite(p.px) && Number.isFinite(p.py));

  const b = s.ball ?? s.b ?? s.entities?.ball ?? s.sphere ?? null;
  const ball = b ? {
    x: +(b.x ?? b.px ?? b.pos?.x ?? 0),
    y: +(b.y ?? b.py ?? b.pos?.y ?? 0),
    z: +(b.z ?? b.pz ?? b.pos?.z ?? BALL_RADIUS)
  } : null;

  return { players, ball };
}

// =========================
// Canvas & camera
// =========================
const DEG = Math.PI/180;
const canvas = (function(){
  return document.getElementById('canvas') || document.querySelector('canvas') || (function(){
    const c=document.createElement('canvas'); c.id='canvas';
    c.style.cssText='position:fixed;inset:0;background:#0b1114;display:block;';
    document.body.appendChild(c); return c; })();
})();
const ctx = canvas.getContext('2d');

// Global camera (safe extend)
const camera = (globalThis.camera ??= {
  yaw: -10*DEG, pitch: 12*DEG, scale: 130,
  targetYaw: -10*DEG, targetPitch: 12*DEG, targetScale: 130,
  minPitch: 0*DEG, maxPitch: 55*DEG,
  minScale: 60, maxScale: 260,
  target: {x:0, y:0},
  damping: 12,
  follow: false
});

function cameraUpdate(dt){
  const a = 1 - Math.exp(-camera.damping * dt);
  camera.yaw += (camera.targetYaw - camera.yaw)*a;
  camera.pitch += (camera.targetPitch - camera.pitch)*a;
  camera.scale += (camera.targetScale - camera.scale)*a;
  if (camera.follow && typeof globalThis.__getFollowTarget === 'function'){
    const pt = globalThis.__getFollowTarget();
    if (pt) { camera.target.x += (pt.x - camera.target.x)*a; camera.target.y += (pt.y - camera.target.y)*a; }
  }
  camera.pitch = Math.max(camera.minPitch, Math.min(camera.maxPitch, camera.pitch));
  camera.targetPitch = Math.max(camera.minPitch, Math.min(camera.maxPitch, camera.targetPitch));
  camera.scale = Math.max(camera.minScale, Math.min(camera.maxScale, camera.scale));
  camera.targetScale = Math.max(camera.minScale, Math.min(camera.maxScale, camera.targetScale));
}

function fitCanvasAndCamera(){
  const dpr = devicePixelRatio||1, r = canvas.getBoundingClientRect();
  const W = Math.max(1, Math.floor(r.width*dpr));
  const H = Math.max(1, Math.floor(r.height*dpr));
  if (canvas.width!==W||canvas.height!==H){ canvas.width=W; canvas.height=H; }
}
window.addEventListener('resize', fitCanvasAndCamera);
fitCanvasAndCamera();

// World → screen (oblique 2.5D) with pan/orbit
function project(x,y,z){
  const c=Math.cos(camera.yaw), s=Math.sin(camera.yaw);
  const dx = x - camera.target.x, dy = y - camera.target.y;
  const rx=dx*c - dy*s; const ry=dx*s + dy*c; // rotate around Z
  const px = rx * camera.scale;
  const py = (ry*Math.cos(camera.pitch) - z*Math.sin(camera.pitch)) * camera.scale;
  const yGround = ry * Math.cos(camera.pitch) * camera.scale;
  return {x:px, y:py, yGround};
}
function persp(ry){
  const k = 0.40*Math.sin(camera.pitch);
  return 1 - k * (ry / (FIELD.H/2));
}

// =========================
// Camera interactions (mouse/keyboard)
// =========================
(function cameraControls(){
  const el = canvas;
  el.addEventListener('wheel', e=>{
    camera.targetScale = Math.max(camera.minScale, Math.min(camera.maxScale, camera.targetScale * (e.deltaY<0? 1.08: 1/1.08)));
    e.preventDefault();
  }, {passive:false});
  el.addEventListener('contextmenu', e=> e.preventDefault());
  let drag=null;
  el.addEventListener('pointerdown', e=>{
    el.setPointerCapture(e.pointerId);
    drag = {x:e.clientX, y:e.clientY, mode: (e.button===1 || e.button===2 || e.altKey || e.ctrlKey || e.metaKey)? 'pan' : 'orbit'};
  });
  el.addEventListener('pointermove', e=>{
    if(!drag) return; const dx=e.clientX-drag.x, dy=e.clientY-drag.y; drag.x=e.clientX; drag.y=e.clientY;
    if (drag.mode==='orbit'){
      camera.targetYaw += dx*0.005; camera.targetPitch = Math.max(camera.minPitch, Math.min(camera.maxPitch, camera.targetPitch + dy*0.003));
    } else {
      const c=Math.cos(camera.yaw), s=Math.sin(camera.yaw);
      const drx = -dx / camera.scale; const dry = -dy / (camera.scale*Math.cos(camera.pitch)+1e-6);
      const wx = drx*c + dry*s; const wy = -drx*s + dry*c;
      camera.target.x += wx; camera.target.y += wy;
    }
  });
  const stop = ()=>{ drag=null; };
  el.addEventListener('pointerup', stop);
  el.addEventListener('pointercancel', stop);
  document.addEventListener('keydown', (e)=>{
    if (e.target && (e.target.tagName==='INPUT' || e.target.tagName==='TEXTAREA')) return;
    const set=(yawDeg,pitchDeg)=>{ camera.targetYaw=yawDeg*DEG; camera.targetPitch=pitchDeg*DEG; };
    switch(e.key){
      case '1': set(0,12); break;      // Side view
      case '2': set(-35,16); break;    // Corner left
      case '3': set(35,16); break;     // Corner right
      case '4': set(90,10); break;     // Endline
      case '0': camera.target.x=0; camera.target.y=0; camera.targetScale=130; set(-10,12); camera.follow=false; break;
      case '+': case '=': camera.targetScale = Math.min(camera.maxScale, camera.targetScale*1.08); break;
      case '-': case '_': camera.targetScale = Math.max(camera.minScale, camera.targetScale/1.08); break;
      case 'f': case 'F': camera.follow = !camera.follow; break;
    }
  });
})();

// =========================
// Field & goal constants (safe globals)
// =========================
const FIELD = (globalThis.FIELD ?? { W: 105, H: 68 });
const BALL_RADIUS = (globalThis.BALL_RADIUS ?? 0.110); // m (~size 5 radius)
const GOAL = (globalThis.GOAL ?? { W: 7.32, H: 2.44, D: 2.0, THICK: 0.12 });
const PITCH = { LINE: 0.12, CIRCLE_R: 9.15, CORNER_R: 1.0, PEN_DEPTH: 16.5, PEN_WIDTH: 40.32, GOAL_AREA_DEPTH: 5.5, GOAL_AREA_WIDTH: 18.32, PEN_SPOT: 11.0, D_RADIUS: 9.15 };

// =========================
// Body model & helpers
// =========================
const BODY = { AVG_H:1.80, AVG_M:75.0, BASE_VMAX:7.6 };
function clamp(x,a,b){ return Math.max(a, Math.min(b,x)); }
function computeBodyModel(staticData){
  const h = (staticData?.height_cm ?? 180)/100;
  const m = (staticData?.weight_kg ?? 75);
  const bmi = m/(h*h); const hN=h/BODY.AVG_H;
  const vis = clamp(Math.pow(hN,0.50)*Math.pow(bmi/23,0.25), 0.85, 1.25);
  let radius = 0.50*(0.85 + 0.30*(hN-1.0) + 0.15*(bmi/23-1.0)); radius = clamp(radius,0.42,0.60);
  const thigh=0.245*h, shin=0.246*h, upper=0.186*h, fore=0.146*h;
  const hipZ=0.53*h, shoulderZ=0.82*h;
  const shoulderW=0.22*h*clamp(Math.pow(bmi/23,0.12),0.9,1.12); const hipW=0.18*h*clamp(Math.pow(bmi/23,0.10),0.9,1.10);
  return {height_m:h, mass_kg:m, bmi, visScale:vis, radius_m:radius, thigh, shin, upper, fore, hipZ, shoulderZ, shoulderW, hipW};
}
function rot2(vx,vy, a){ const c=Math.cos(a), s=Math.sin(a); return {x:vx*c - vy*s, y:vx*s + vy*c}; }
function twoBoneIK(H,F,L1,L2,bendForward=1){
  const dx=F.x-H.x, dy=F.y-H.y; let d=Math.hypot(dx,dy); d=clamp(d, Math.abs(L1-L2)+1e-4, L1+L2-1e-4);
  const ux=dx/d, uy=dy/d; const A=Math.acos((L1*L1 + d*d - L2*L2)/(2*L1*d));
  const c=Math.cos(A), s=Math.sin(A)*bendForward; const kx=ux*c - uy*s, ky=ux*s + uy*c;
  return {K:{x:H.x + kx*L1, y:H.y + ky*L1}, F:{x:F.x,y:F.y}};
}
function drawCapsulePX(ctx, A, B, pxRadius, color){ ctx.strokeStyle=color; ctx.lineCap='round'; ctx.lineWidth=pxRadius*2; ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.stroke(); }

// =========================
// 3D pitch / goals / ball
// =========================
function _line3(ctx, a, b, wPx, color){ const A=project(a.x,a.y,a.z||0), B=project(b.x,b.y,b.z||0); ctx.strokeStyle=color; ctx.lineWidth=wPx; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.stroke(); }
function drawPitch3D(ctx){
  ctx.save(); ctx.translate(canvas.width/2, canvas.height/2);
  const C=[project(-FIELD.W/2,-FIELD.H/2,0),project(FIELD.W/2,-FIELD.H/2,0),project(FIELD.W/2,FIELD.H/2,0),project(-FIELD.W/2,FIELD.H/2,0)];
  const g=ctx.createLinearGradient(C[0].x,C[0].y,C[2].x,C[2].y); g.addColorStop(0,'#0e5a2e'); g.addColorStop(1,'#126a35');
  ctx.fillStyle=g; ctx.beginPath(); ctx.moveTo(C[0].x,C[0].y); for(let i=1;i<4;i++) ctx.lineTo(C[i].x,C[i].y); ctx.closePath(); ctx.fill();
  const px = Math.max(1, PITCH.LINE * camera.scale);
  // outer
  _line3(ctx,{x:-FIELD.W/2,y:-FIELD.H/2,z:0},{x:FIELD.W/2,y:-FIELD.H/2,z:0},px,'#fff');
  _line3(ctx,{x:FIELD.W/2,y:-FIELD.H/2,z:0},{x:FIELD.W/2,y:FIELD.H/2,z:0},px,'#fff');
  _line3(ctx,{x:FIELD.W/2,y:FIELD.H/2,z:0},{x:-FIELD.W/2,y:FIELD.H/2,z:0},px,'#fff');
  _line3(ctx,{x:-FIELD.W/2,y:FIELD.H/2,z:0},{x:-FIELD.W/2,y:-FIELD.H/2,z:0},px,'#fff');
  // halfway
  _line3(ctx,{x:0,y:-FIELD.H/2,z:0},{x:0,y:FIELD.H/2,z:0},px,'#fff');
  // center circle
  (function(){ const r=PITCH.CIRCLE_R, steps=80; let prev=null; for(let i=0;i<=steps;i++){ const t=(i/steps)*Math.PI*2; const P=project(r*Math.cos(t), r*Math.sin(t),0); if(prev){ ctx.beginPath(); ctx.moveTo(prev.x,prev.y); ctx.lineTo(P.x,P.y); ctx.strokeStyle='#fff'; ctx.lineWidth=px; ctx.stroke(); } prev=P; } const S=project(0,0,0); ctx.beginPath(); ctx.arc(S.x,S.y,px*0.8,0,Math.PI*2); ctx.fillStyle='#fff'; ctx.fill(); })();
  // boxes both sides (goals on X = ±W/2)
  function rect(x1,y1,x2,y2){ _line3(ctx,{x:x1,y:y1,z:0},{x:x2,y:y1,z:0},px,'#fff'); _line3(ctx,{x:x2,y:y1,z:0},{x:x2,y:y2,z:0},px,'#fff'); _line3(ctx,{x:x2,y:y2,z:0},{x:x1,y:y2,z:0},px,'#fff'); _line3(ctx,{x:x1,y:y2,z:0},{x:x1,y:y1,z:0},px,'#fff'); }
  const xFar = -FIELD.W/2, xNear = FIELD.W/2;
  rect(xFar, -PITCH.PEN_WIDTH/2, xFar+PITCH.PEN_DEPTH,  PITCH.PEN_WIDTH/2);
  rect(xNear-PITCH.PEN_DEPTH, -PITCH.PEN_WIDTH/2, xNear, PITCH.PEN_WIDTH/2);
  rect(xFar, -PITCH.GOAL_AREA_WIDTH/2, xFar+PITCH.GOAL_AREA_DEPTH,  PITCH.GOAL_AREA_WIDTH/2);
  rect(xNear-PITCH.GOAL_AREA_DEPTH, -PITCH.GOAL_AREA_WIDTH/2, xNear, PITCH.GOAL_AREA_WIDTH/2);
  // penalty spots
  const SP_F=project(xFar+PITCH.PEN_SPOT,0,0), SP_N=project(xNear-PITCH.PEN_SPOT,0,0);
  ctx.beginPath(); ctx.arc(SP_F.x,SP_F.y,px*0.8,0,Math.PI*2); ctx.fillStyle='#fff'; ctx.fill();
  ctx.beginPath(); ctx.arc(SP_N.x,SP_N.y,px*0.8,0,Math.PI*2); ctx.fill();
  // D arcs
  function arcD(xSign){
    const r=PITCH.D_RADIUS; const cx=(xSign<0? xFar+PITCH.PEN_SPOT : xNear-PITCH.PEN_SPOT); const steps=64; let prev=null;
    const startAngle = xSign < 0 ? -Math.PI/2 : Math.PI/2; const endAngle = xSign < 0 ? Math.PI/2 : 3*Math.PI/2;
    for(let i=0;i<=steps;i++){
      const t=startAngle+(i/steps)*(endAngle-startAngle); const x=cx+r*Math.cos(t); const y=r*Math.sin(t); const P=project(x,y,0);
      if ((xSign<0 && x > xFar+PITCH.PEN_DEPTH) || (xSign>0 && x < xNear-PITCH.PEN_DEPTH)){
        if(prev){ ctx.beginPath(); ctx.moveTo(prev.x,prev.y); ctx.lineTo(P.x,P.y); ctx.strokeStyle='#fff'; ctx.lineWidth=px; ctx.stroke(); } prev=P;
      } else prev=null;
    }
  }
  arcD(-1); arcD(+1);
  // corners
  function corner(xSign,ySign){ const cx=(xSign<0? -FIELD.W/2:FIELD.W/2), cy=(ySign<0? -FIELD.H/2:FIELD.H/2); const steps=24; let prev=null; for(let i=0;i<=steps;i++){ const t=(i/steps)*(Math.PI/2); const x=cx+(xSign>0? -1:+1)*PITCH.CORNER_R*Math.cos(t); const y=cy+(ySign>0? -1:+1)*PITCH.CORNER_R*Math.sin(t); const P=project(x,y,0); if(prev){ ctx.beginPath(); ctx.moveTo(prev.x,prev.y); ctx.lineTo(P.x,P.y); ctx.strokeStyle='#fff'; ctx.lineWidth=px; ctx.stroke(); } prev=P; } }
  corner(-1,-1); corner(+1,-1); corner(-1,+1); corner(+1,+1);
  ctx.restore();
}

function drawGoal3D(ctx, side){
  ctx.save(); ctx.translate(canvas.width/2, canvas.height/2);
  const xLine = (side==='away'? -FIELD.W/2 : FIELD.W/2);
  const depth = GOAL.D, half = GOAL.W/2, h=GOAL.H, t=GOAL.THICK;
  const px = Math.max(2, t * camera.scale);
  // posts & bar
  _line3(ctx,{x:xLine,y:-half,z:0},{x:xLine,y:-half,z:h},px,'#fff');
  _line3(ctx,{x:xLine,y: half,z:0},{x:xLine,y: half,z:h},px,'#fff');
  _line3(ctx,{x:xLine,y:-half,z:h},{x:xLine,y: half,z:h},px,'#fff');
  // back frame (depth along X)
  const sgn = (side==='away'? +1 : -1);
  _line3(ctx,{x:xLine,y:-half,z:0},{x:xLine+sgn*depth,y:-half,z:0},1,'#d9d9d9');
  _line3(ctx,{x:xLine,y: half,z:0},{x:xLine+sgn*depth,y: half,z:0},1,'#d9d9d9');
  _line3(ctx,{x:xLine,y:-half,z:h},{x:xLine+sgn*depth,y:-half,z:h},1,'#d9d9d9');
  _line3(ctx,{x:xLine,y: half,z:h},{x:xLine+sgn*depth,y: half,z:h},1,'rgba(217,217,217,0.9)');
  // simple net grid
  const cols=7, rows=4;
  for(let i=0;i<=cols;i++){ const u=-half + (i/cols)*GOAL.W; _line3(ctx,{x:xLine,y:u,z:0},{x:xLine+sgn*depth,y:u,z:h},0.8,'rgba(240,240,240,0.6)'); }
  for(let j=0;j<=rows;j++){ const v=(j/rows)*h; _line3(ctx,{x:xLine,y:-half,z:v},{x:xLine,y: half,z:v},0.8,'rgba(240,240,240,0.6)'); _line3(ctx,{x:xLine+sgn*depth,y:-half,z:v},{x:xLine+sgn*depth,y: half,z:v},0.8,'rgba(240,240,240,0.6)'); }
  ctx.restore();
}

function drawBall3D(ctx, ball){
  const z = (typeof ball.z==='number'? ball.z : BALL_RADIUS);
  const P = project(ball.x, ball.y, z); const ry = ball.x*Math.sin(camera.yaw)+ball.y*Math.cos(camera.yaw);
  const R = BALL_RADIUS * persp(ry) * camera.scale;
  ctx.save(); ctx.translate(canvas.width/2, canvas.height/2);
  const lx=0.6, ly=-0.3, lz=0.74; const shade = 0.25 + 0.75*Math.max(0, (lx*Math.cos(camera.yaw) + ly*Math.sin(camera.yaw))*Math.cos(camera.pitch) + lz*Math.sin(camera.pitch));
  ctx.fillStyle=`rgb(${Math.round(255*shade)},${Math.round(255*shade)},${Math.round(255*shade)})`;
  ctx.beginPath(); ctx.arc(P.x,P.y,R,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#111'; ctx.lineWidth=Math.max(1,R*0.06);
  ctx.beginPath(); ctx.ellipse(P.x,P.y,R*0.95,R*0.55,camera.yaw,0,Math.PI*2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(P.x,P.y,R*0.95,R*0.55,camera.yaw+Math.PI/2,0,Math.PI*2); ctx.stroke();
  ctx.restore();
}

// =========================
// Players (3D limbs)
// =========================
function drawPlayers3D(ctx, players, allPlayersData){
  const list = players.map((p, idx) => ({ idx, p, prj: project(p.px, p.py, 0) }));
  list.sort((a,b)=> a.prj.yGround - b.prj.yGround);
  for (const it of list){
    const idx = it.idx; const p = it.p; const home = idx<11;
    const staticData = allPlayersData[idx] || {};
    const B = computeBodyModel(staticData);
    if (!window.__anim) window.__anim = new Array(22).fill(0).map(()=>({φ:0,lastHeading:0,foot:{L:{anchX:0,anchY:0,locked:false},R:{anchX:0,anchY:0,locked:false}}}));
    const st = window.__anim[idx];
    const s = Math.hypot(p.vx||0, p.vy||0);
    const θgoal = s>0.2 ? Math.atan2(p.vy||0, p.vx||0) : st.lastHeading;
    st.lastHeading = st.lastHeading + (((θgoal - st.lastHeading + Math.PI)%(2*Math.PI))-Math.PI) * 0.15;
    const vmax=BODY.BASE_VMAX; const L=(0.65 + 0.40*Math.min(1,s/vmax))*B.height_m;
    const fCad = Math.max(1.2, Math.min(3.4, (s>0.01)? s/Math.max(0.25,L) : 1.2));
    st.φ = (st.φ + (2*Math.PI) * fCad * ((window.__animDtMs||16)/1000))%(2*Math.PI);
    const SR = 0.65 - 0.25 * Math.min(1, s/vmax); const stepWidth=(0.12 - 0.06*Math.min(1,s/vmax))*B.height_m;
    const θ = st.lastHeading; const fwd={x:Math.cos(θ), y:Math.sin(θ)}, side={x:-Math.sin(θ), y:Math.cos(θ)};
    const hip={x:p.px,y:p.py,z:B.hipZ}, shoulder={x:p.px,y:p.py,z:B.shoulderZ};
    const hipL={x:hip.x+side.x*(B.hipW/2), y:hip.y+side.y*(B.hipW/2), z:hip.z};
    const hipR={x:hip.x-side.x*(B.hipW/2), y:hip.y-side.y*(B.hipW/2), z:hip.z};
    const shL={x:shoulder.x+side.x*(B.shoulderW/2), y:shoulder.y+side.y*(B.shoulderW/2), z:shoulder.z};
    const shR={x:shoulder.x-side.x*(B.shoulderW/2), y:shoulder.y-side.y*(B.shoulderW/2), z:shoulder.z};
    const TWO=2*Math.PI, norm=(x)=>((x%TWO)+TWO)%TWO; const φL=norm(st.φ), φR=norm(st.φ+Math.PI), φStance=SR*TWO;
    const Ls = φL<φStance, Rs = φR<φStance; const ease=(t)=>t*t*(3-2*t);
    const swingT=(φX)=>{ const d=(1-SR); if(d<=0) return 0; const t=(norm(φX)-φStance)/(d*TWO); return clamp(t,0,1); };
    function footTarget(sign, stance, t){ const baseLat=sign*stepWidth/2; const offs= stance ? -0.15*L : (-0.5 + ease(t))*L; return {x:hip.x+fwd.x*offs+side.x*baseLat, y:hip.y+fwd.y*offs+side.y*baseLat}; }
    const tL=swingT(φL), tR=swingT(φR); const tgtL=footTarget(+1,Ls,tL), tgtR=footTarget(-1,Rs,tR);
    if(Ls && !st.foot.L.locked){ st.foot.L.locked=true; st.foot.L.anchX=tgtL.x; st.foot.L.anchY=tgtL.y; } if(!Ls) st.foot.L.locked=false;
    if(Rs && !st.foot.R.locked){ st.foot.R.locked=true; st.foot.R.anchX=tgtR.x; st.foot.R.anchY=tgtR.y; } if(!Rs) st.foot.R.locked=false;
    const footL = Ls ? {x:st.foot.L.anchX, y:st.foot.L.anchY} : {x:tgtL.x,y:tgtL.y};
    const footR = Rs ? {x:st.foot.R.anchX, y:st.foot.R.anchY} : {x:tgtR.x,y:tgtR.y};
    const ry = p.px*Math.sin(camera.yaw) + p.py*Math.cos(camera.yaw); const scale = persp(ry) * camera.scale;
    const visScale = (typeof p.vis_scale==='number' && p.vis_scale>0)? Math.max(0.5, p.vis_scale/100) : B.visScale;
    const colliderRadiusM = (typeof p.collider_radius_opt==='number' && p.collider_radius_opt>0)? (p.collider_radius_opt/100) : B.radius_m;
    const limbPx = Math.max(3, Math.min(14, 1.2*colliderRadiusM*visScale*scale)); const shinPx=limbPx*0.85, armPx=limbPx*0.7, torsoPx=limbPx*1.4;
    const legL = twoBoneIK({x:hipL.x,y:hipL.y}, footL, B.thigh, B.shin, +1); const legR = twoBoneIK({x:hipR.x,y:hipR.y}, footR, B.thigh, B.shin, +1);
    const armAmp=(Math.PI/10)*Math.min(1,s/vmax); const armL_dir=rot2(fwd.x,fwd.y, Math.sin(st.φ+Math.PI)*armAmp); const armR_dir=rot2(fwd.x,fwd.y, Math.sin(st.φ)*armAmp);
    const elbowL={x:shL.x+armL_dir.x*B.upper,y:shL.y+armL_dir.y*B.upper,z:shL.z-0.02*B.height_m}; const elbowR={x:shR.x+armR_dir.x*B.upper,y:shR.y+armR_dir.y*B.upper,z:shR.z-0.02*B.height_m};
    const handL={x:elbowL.x+armL_dir.x*B.fore,y:elbowL.y+armL_dir.y*B.fore,z:elbowL.z-0.02*B.height_m}; const handR={x:elbowR.x+armR_dir.x*B.fore,y:elbowR.y+armR_dir.y*B.fore,z:elbowR.z-0.02*B.height_m};
    ctx.save(); ctx.translate(canvas.width/2, canvas.height/2);
    // shadow
    const prjG=project(p.px,p.py,0); const radPx=colliderRadiusM*visScale*scale; ctx.fillStyle='rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(prjG.x,prjG.y, radPx, radPx*0.5, 0, 0, Math.PI*2); ctx.fill();
    const farFirst=(camera.yaw>0)? 'R':'L'; const order=farFirst==='L'? ['L','R'] : ['R','L']; const P3=(pt)=>project(pt.x,pt.y,pt.z||0);
    function drawLeg(tag){ const hipPt=(tag==='L'? hipL:hipR); const knee2=(tag==='L'? legL.K:legR.K); const foot2=(tag==='L'? legL.F:legR.F); const zK=hipPt.z-0.02*B.height_m; const swingLift=(tag==='L'? (1-Ls): (1-Rs))? (0.10*B.height_m*Math.sin(Math.PI*(tag==='L'? tL:tR))) : 0; const zF=swingLift; const A1=P3({x:hipPt.x,y:hipPt.y,z:hipPt.z}), B1=P3({x:knee2.x,y:knee2.y,z:zK}), A2=P3({x:knee2.x,y:knee2.y,z:zK}), B2=P3({x:foot2.x,y:foot2.y,z:zF}); drawCapsulePX(ctx,A1,B1,shinPx, home? '#7ab5ff':'#ff8a7a'); drawCapsulePX(ctx,A2,B2,shinPx, home? '#7ab5ff':'#ff8a7a'); }
    drawLeg(order[0]);
    // torso
    drawCapsulePX(ctx, P3({x:hip.x,y:hip.y,z:hip.z}), P3({x:shoulder.x,y:shoulder.y,z:shoulder.z}), torsoPx, home? '#4aa3ff':'#ff5c5c');
    // arms
    drawCapsulePX(ctx, P3(shL), P3(elbowL), armPx, '#ffd27a'); drawCapsulePX(ctx, P3(elbowL), P3(handL), armPx, '#ffd27a');
    drawCapsulePX(ctx, P3(shR), P3(elbowR), armPx, '#ffd27a'); drawCapsulePX(ctx, P3(elbowR), P3(handR), armPx, '#ffd27a');
    // head
    const headTop=P3({x:shoulder.x,y:shoulder.y,z:shoulder.z + 0.13*B.height_m}); ctx.fillStyle='#ffffff'; ctx.strokeStyle='#101419'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.arc(headTop.x, headTop.y, limbPx*0.9, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    // label
    const label = (staticData.number!=null)? String(staticData.number) : (staticData.name? (staticData.name.split(' ').map(s=>s[0]).join('').toUpperCase()).slice(0,2) : String(idx+1));
    ctx.font = `${Math.max(10, limbPx * 1.2)}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.lineWidth=3; ctx.strokeStyle='rgba(0,0,0,0.55)'; ctx.fillStyle='#fff'; ctx.strokeText(label, headTop.x, headTop.y); ctx.fillText(label, headTop.x, headTop.y);
    drawLeg(order[1]);
    ctx.restore();
    if (window.__drawStats) window.__drawStats.calls += 10;
  }
}

// =========================
// HUD (no HTML edits)
// =========================
(function ensureHUD(){
  if (!window.__hud){
    const hud = document.createElement('div'); hud.id='hud-overlay';
    hud.style.cssText='position:fixed; right:8px; top:8px; z-index:9999; background:rgba(0,0,0,0.55); color:#fff; padding:8px 10px; border-radius:8px; font:12px/1.3 ui-monospace,Menlo,monospace; pointer-events:none; white-space:pre;';
    document.body.appendChild(hud);
    window.__hud = hud; window.__fps=0; window.__frames=0; window.__fpsT0=performance.now(); window.__lastRenderMs=0; window.__lastSnapshotBytes=0; window.__drawStats={calls:0};
    window.__updateHud = ()=>{
      window.__frames++; const now=performance.now(); const dt=now-window.__fpsT0; if (dt>=500){ window.__fps = window.__frames*1000/dt; window.__frames=0; window.__fpsT0=now; }
      const yawDeg=(camera.yaw/DEG).toFixed(1);
      const txt = `FPS ${window.__fps.toFixed(1)} | render ${window.__lastRenderMs.toFixed(2)} ms\n`+
        `draw-calls ~${window.__drawStats.calls} | snap ${window.__lastSnapshotBytes} B\n`+
        `players ${window.__playersCount||0} | ball ${(window.__ballPresent?'✔':'—')}\n`+
        `yaw ${yawDeg}°, pitch ${(camera.pitch/DEG).toFixed(1)}°`;
      window.__hud.textContent = txt;
    };
  }
})();

// =========================
// Main loop
// =========================
const allPlayersData = getAllPlayersData();
window.__anim = new Array(22).fill(0).map(()=>({φ:0,lastHeading:0,foot:{L:{anchX:0,anchY:0,locked:false},R:{anchX:0,anchY:0,locked:false}}}));

function renderFrame(){
  const t0 = performance.now();
  const snap = getLatestSnapshot();
  const now = performance.now(); window.__animDtMs = (window.__animLastT? (now-window.__animLastT) : 16); window.__animLastT = now;
  cameraUpdate(Math.min(0.033, (window.__animDtMs)/1000));

  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawPitch3D(ctx);
  drawGoal3D(ctx,'away');
  if (snap && snap.players) drawPlayers3D(ctx, snap.players, allPlayersData);
  if (snap && snap.ball) drawBall3D(ctx, snap.ball);
  drawGoal3D(ctx,'home');

  window.__playersCount = (snap && snap.players && snap.players.length) || 0;
  window.__ballPresent = !!(snap && snap.ball);
  window.__lastSnapshotBytes = (snap && snap.__bytesLen) || 0;
  window.__lastRenderMs = performance.now() - t0;
  if (window.__updateHud) window.__updateHud();
  requestAnimationFrame(renderFrame);
}
requestAnimationFrame(renderFrame);
