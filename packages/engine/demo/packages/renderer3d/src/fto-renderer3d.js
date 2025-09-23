// packages/renderer3d/src/fto-renderer3d.js
// Three.js renderer for FTO engine snapshots (players + ball + pitch)

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
// 혹은 three 최신 문서 경로를 쓸 땐: import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';


// --- Field & pitch metrics (meters) ---
export const WORLD = {
  FIELD: { W: 105, H: 68 },
  GOAL:  { W: 7.32, H: 2.44, D: 1.5, THICK: 0.12 },
  BALL:  { R: 0.11, M: 0.43 },
};
export const PITCH = {
  LINE: 0.12,                // line thickness
  CIRCLE_R: 9.15,            // center circle radius
  PEN_WIDTH: 40.32,          // penalty area width
  PEN_DEPTH: 16.5,           // penalty area depth
  GOAL_AREA_WIDTH: 18.32,    // goal area width
  GOAL_AREA_DEPTH: 5.5,      // goal area depth
  PEN_SPOT: 11.0,            // penalty mark distance from goal line
  D_RADIUS: 9.15,            // penalty arc radius
  CORNER_R: 1.0,             // corner arc radius
};

const CLIP_BASE_SPEED = { Idle:0.0, Jog:3.2, Run:6.5, Sprint:8.5, Kick:0.0 };
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const toVec3 = (arr, target = new THREE.Vector3()) => (!arr? target.set(0,0,0) : target.set(arr[0]||0, arr[1]||0, arr[2]||0));

function sanitizeInPlace(clip) {
  if (!clip?.tracks) return clip;
  const tracks = clip.tracks.filter(t => !/Hips\.position$/.test(t.name));
  return new THREE.AnimationClip(clip.name, clip.duration, tracks);
}

class ResourceCache {
  constructor({ dracoDecoderPath }={}) {
    this.gltf = new GLTFLoader();
    if (dracoDecoderPath) {
      const draco = new DRACOLoader();
      draco.setDecoderPath(dracoDecoderPath);
      this.gltf.setDRACOLoader(draco);
    }
    this.cache = new Map();
  }
  async loadGLB(url) {
    if (this.cache.has(url)) return this.cache.get(url);
    const gltf = await new Promise((res,rej)=>this.gltf.load(url, res, undefined, rej));
    this.cache.set(url, gltf);
    return gltf;
  }
}

class StadiumFactory {
  constructor(scene){ this.scene = scene; this.group = new THREE.Group(); scene.add(this.group); }

  build() {
    const { W, H } = WORLD.FIELD;

    // Grass plane
    const grass = new THREE.Mesh(
      new THREE.PlaneGeometry(W, H),
      new THREE.MeshStandardMaterial({ color: 0x2d7d40, roughness: 1 })
    );
    grass.rotation.x = -Math.PI/2;
    grass.receiveShadow = true;
    this.group.add(grass);

    const lineY = 0.006; // slightly above grass

    // Helper: fat line between two points (XZ plane)
    const addLine = (x1,z1,x2,z2,thickness= PITCH.LINE) => {
      const dx = x2 - x1, dz = z2 - z1;
      const len = Math.hypot(dx, dz);
      const geo = new THREE.PlaneGeometry(len, thickness);
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const m = new THREE.Mesh(geo, mat);
      m.position.set((x1+x2)/2, lineY, (z1+z2)/2);
      m.rotation.x = -Math.PI/2;
      m.rotation.z = Math.atan2(dz, dx);
      m.renderOrder = 2;
      this.group.add(m);
      return m;
    };

    // Outer rectangle
    addLine(-W/2, -H/2,  W/2, -H/2);
    addLine( W/2, -H/2,  W/2,  H/2);
    addLine( W/2,  H/2, -W/2,  H/2);
    addLine(-W/2,  H/2, -W/2, -H/2);

    // Halfway line
    addLine(0, -H/2, 0, H/2);

    // Center circle & spot
    this.addRing(0, 0, PITCH.CIRCLE_R - PITCH.LINE/2, PITCH.CIRCLE_R + PITCH.LINE/2);
    this.addSpot(0, 0, PITCH.LINE*0.7);

    // Boxes & spots
    const box = (sign) => {
      const xGoal = sign < 0 ? -W/2 : W/2;
      const s = sign; // -1 left goal, +1 right goal
      // Penalty box
      this.addRect(
        xGoal, -PITCH.PEN_WIDTH/2,
        xGoal - s*PITCH.PEN_DEPTH, PITCH.PEN_WIDTH/2
      );
      // Goal area
      this.addRect(
        xGoal, -PITCH.GOAL_AREA_WIDTH/2,
        xGoal - s*PITCH.GOAL_AREA_DEPTH, PITCH.GOAL_AREA_WIDTH/2
      );
      // Penalty spot
      this.addSpot(xGoal - s*PITCH.PEN_SPOT, 0, PITCH.LINE*0.7);
      // D arc
      const cx = xGoal - s*PITCH.PEN_SPOT;
      const dx = Math.abs(PITCH.PEN_SPOT - PITCH.PEN_DEPTH); // x-dist from arc center to pen line
      const angle = Math.acos(dx / PITCH.D_RADIUS); // half angle of the arc
      const thetaStart = s < 0 ? -angle : Math.PI - angle;
      const thetaLen = angle * 2;
      this.addRing(cx, 0, PITCH.D_RADIUS - PITCH.LINE/2, PITCH.D_RADIUS + PITCH.LINE/2, thetaStart, thetaLen);
    };
    box(-1); box(+1);

    // Corners (quarter-ring)
    const corner = (sx, sz) => {
      const cx = sx * (W/2 - 0.001);
      const cz = sz * (H/2 - 0.001);
      const start = sz>0 ? (sx>0 ? Math.PI : Math.PI*1.5) : (sx>0 ? Math.PI/2 : 0);
      const len   = Math.PI/2;
      this.addRing(cx, cz, 0, PITCH.CORNER_R*2, start, len, true);
    };
    corner(-1,-1); corner(+1,-1); corner(-1,+1); corner(+1,+1);

    // Goals (simple posts + bar + back depth)
    this.addGoals();

    return this.group;
  }

  addRect(x1,z1,x2,z2){
    const addEdge = (a,b,c,d) => this.group.add(this._edge(a,b,c,d));
    addEdge(x1,z1, x2,z1);
    addEdge(x2,z1, x2,z2);
    addEdge(x2,z2, x1,z2);
    addEdge(x1,z2, x1,z1);
  }
  _edge(x1,z1,x2,z2){
    const dx = x2-x1, dz = z2-z1, len = Math.hypot(dx,dz);
    const geo = new THREE.PlaneGeometry(len, PITCH.LINE);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const m = new THREE.Mesh(geo, mat);
    m.position.set((x1+x2)/2, 0.006, (z1+z2)/2);
    m.rotation.x = -Math.PI/2; m.rotation.z = Math.atan2(dz,dx);
    m.renderOrder = 2; return m;
  }

  addRing(cx, cz, rIn, rOut, thetaStart=0, thetaLen=Math.PI*2, thin=false){
    const y = 0.006 + (thin? 0.0001 : 0);
    const geo = new THREE.RingGeometry(rIn, rOut, 64, 1, thetaStart, thetaLen);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const m = new THREE.Mesh(geo, mat);
    m.position.set(cx, y, cz);
    m.rotation.x = -Math.PI/2;
    m.renderOrder = 2;
    this.group.add(m);
    return m;
  }

  addSpot(x, z, r){
    const geo = new THREE.CircleGeometry(r, 24);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, 0.006, z);
    m.rotation.x = -Math.PI/2;
    m.renderOrder = 3;
    this.group.add(m);
    return m;
  }

  addGoals(){
    const { W } = WORLD.FIELD;
    const G = WORLD.GOAL;
    const postR = 0.06;

    const make = (sign) => {
      const xLine = sign * (W/2 + postR); // Place posts just outside the field
      const group = new THREE.Group();

      const postGeoV = new THREE.CylinderGeometry(postR, postR, G.H, 8);
      const postMat  = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
      const barGeo   = new THREE.CylinderGeometry(postR, postR, G.W, 8);

      // Frame: posts + bars
      const lp = new THREE.Mesh(postGeoV, postMat); lp.position.set(xLine, G.H/2, -G.W/2);
      const rp = new THREE.Mesh(postGeoV, postMat); rp.position.set(xLine, G.H/2,  G.W/2);
      const bar= new THREE.Mesh(barGeo,  postMat);  bar.rotation.x = Math.PI/2; bar.position.set(xLine, G.H, 0);
      [lp, rp, bar].forEach(m=>{ m.castShadow=true; m.receiveShadow=true; });

      const depth = G.D * sign;
      const backL = new THREE.Mesh(postGeoV, postMat); backL.position.set(xLine+depth, G.H/2, -G.W/2);
      const backR = new THREE.Mesh(postGeoV, postMat); backR.position.set(xLine+depth, G.H/2,  G.W/2);
      const backBar = new THREE.Mesh(barGeo, postMat); backBar.rotation.x = Math.PI/2; backBar.position.set(xLine+depth, G.H, 0);
      [backL, backR, backBar].forEach(m=>{ m.castShadow=true; m.receiveShadow=true; });

      // Net
      const netMat = new THREE.MeshBasicMaterial({ color: 0xcccccc, wireframe: true, side: THREE.DoubleSide });
      const netGeo = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        xLine,       0,   -G.W/2, // 0: flb
        xLine,       0,    G.W/2, // 1: frb
        xLine,       G.H, -G.W/2, // 2: flt
        xLine,       G.H,  G.W/2, // 3: frt
        xLine+depth, 0,   -G.W/2, // 4: blb
        xLine+depth, 0,    G.W/2, // 5: brb
        xLine+depth, G.H, -G.W/2, // 6: blt
        xLine+depth, G.H,  G.W/2, // 7: brt
      ]);
      netGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      netGeo.setIndex([
        // left side
        0, 4, 6, 0, 6, 2,
        // right side
        1, 3, 7, 1, 7, 5,
        // back
        4, 5, 7, 4, 7, 6,
        // top
        2, 6, 7, 2, 7, 3,
        // bottom
        0, 5, 4, 0, 1, 5
      ]);
      const net = new THREE.Mesh(netGeo, netMat);
      net.receiveShadow = true;

      group.add(lp, rp, bar, backL, backR, backBar, net);
      this.group.add(group);
    };

    make(-1);
    make(+1);
  }

}

class BallActor {
  constructor(scene) {
    const geo = new THREE.SphereGeometry(WORLD.BALL.R, 24, 18);
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(0, WORLD.BALL.R, 0);
    this.mesh.castShadow = true; this.mesh.receiveShadow = true;
    scene.add(this.mesh);

    this.spin = new THREE.Vector3();
    this.tmpV = new THREE.Vector3();
  }
  updateFromSnap(ballSnap, dt) {
    if (!ballSnap) return;
    this.mesh.position.fromArray(ballSnap.pos || [0, WORLD.BALL.R, 0]);
    toVec3(ballSnap.spin, this.spin);
    const ang = this.spin.length();
    if (ang > 1e-3) {
      this.tmpV.copy(this.spin).normalize();
      this.mesh.rotateOnAxis(this.tmpV, ang * dt);
    }
  }
}

class PlayerActor {
  static async create({ scene, res, baseModelUrl, clipUrls, id }) {
    const gltf = await res.loadGLB(baseModelUrl);
    const model = SkeletonUtils.clone(gltf.scene);
    model.traverse(o=>{ if (o.isMesh){ o.castShadow = o.receiveShadow = true; o.frustumCulled=false; }});
    scene.add(model);

    const mixer = new THREE.AnimationMixer(model);
    const actions = {};
    for (const [name, url] of Object.entries(clipUrls)) {
      const a = await res.loadGLB(url);
      if (!a.animations?.length) continue;
      let clip = a.animations[0];
      clip.name = name;
      if (name === 'Kick') clip = sanitizeInPlace(clip);
      actions[name] = mixer.clipAction(clip);
      if (name === 'Idle') actions[name].play();
    }
    return new PlayerActor(model, mixer, actions, id);
  }

  constructor(model, mixer, actions, id) {
    this.id = id;
    this.model = model;
    this.mixer = mixer;
    this.actions = actions;
    this.active = 'Idle';
    this.hasAppliedBody = false;
    this.oneShot = null;
    this.prevAction = 'Idle';

    this.bones = {
      hips: model.getObjectByName('mixamorig:Hips') || model.getObjectByName('Hips'),
      footL: model.getObjectByName('mixamorig:LeftFoot') || model.getObjectByName('LeftFoot'),
      footR: model.getObjectByName('mixamorig:RightFoot') || model.getObjectByName('RightFoot'),
      upperLegL: model.getObjectByName('mixamorig:LeftUpLeg') || model.getObjectByName('LeftUpLeg'),
      lowerLegL: model.getObjectByName('mixamorig:LeftLeg') || model.getObjectByName('LeftLeg'),
      upperLegR: model.getObjectByName('mixamorig:RightUpLeg') || model.getObjectByName('RightUpLeg'),
      lowerLegR: model.getObjectByName('mixamorig:RightLeg') || model.getObjectByName('RightLeg'),
    };
  }

  applyBodyParams(height_cm=180, weight_kg=75) {
    const REF_H=180, REF_BMI=23;
    const heightScale = height_cm/REF_H;
    const bmi = weight_kg/Math.pow(height_cm/100,2);
    const bulk = clamp(1 + 0.02*(bmi-REF_BMI), 0.85, 1.25);
    this.model.scale.set(1, heightScale, 1);
    const girth=(b,k=1)=>{ if(!b) return; const s=Math.pow(bulk,k); b.scale.set(s,b.scale.y,s); };
    const { upperLegL, upperLegR, lowerLegL, lowerLegR } = this.bones;
    girth(upperLegL,1.1); girth(upperLegR,1.1); girth(lowerLegL,1.05); girth(lowerLegR,1.05);
    this.hasAppliedBody = true;
  }

  setAction(name, fade=0.14) {
    if (name === this.active) return;
    const cur = this.actions[this.active];
    const nxt = this.actions[name];
    if (!nxt) return;
    nxt.reset().play();
    if (cur) cur.crossFadeTo(nxt, fade, false);
    this.active = name;
  }

  playOneShot(name, fade=0.14){
    const a = this.actions[name];
    if (!a || this.oneShot) return;
    this.oneShot = name;
    this.prevAction = this.active;
    a.reset(); a.enabled = true; a.setLoop(THREE.LoopOnce,1); a.clampWhenFinished = true;
    this.setAction(name, fade);
    const onFinished = (e)=>{
      if (e.action !== a) return;
      this.mixer.removeEventListener('finished', onFinished);
      this.oneShot = null;
      this.setAction(this.prevAction || 'Idle', 0.18);
    };
    this.mixer.addEventListener('finished', onFinished);
  }

  syncLocomotionSpeed(name, speed){
    const act = this.actions[name]; if(!act) return;
    const base = CLIP_BASE_SPEED[name] ?? 0; const rate = base>0 ? clamp(speed/base, 0.5, 1.6) : 1.0;
    act.timeScale = rate;
  }

  updateFromSnap(snap, dt){
    if (!snap) return;
    if (!this.hasAppliedBody) this.applyBodyParams(snap.height_cm, snap.weight_kg);

    this.model.position.fromArray(snap.pos || [0,0,0]);
    this.model.rotation.set(0, snap.yaw || 0, 0);

    if (this.oneShot){ this.mixer.update(dt); return; }

    const v = snap.speed || 0;
    let desired = 'Idle';
    if (v >= 0.2 && v < 5) desired = 'Jog';
    else if (v >= 5) desired = 'Run';

    if (snap.action === 'Kick' && this.actions['Kick']) desired = 'Jog';

    this.setAction(desired);
    this.syncLocomotionSpeed(desired, v);
    this.mixer.update(dt);
  }
}

export class FtoRenderer3D {
  constructor({ canvas, assets, getSnapshot, onReady, onError }={}){
    this.canvas = canvas || this.#createCanvas();
    this.assets = assets || {};
    this.getSnapshot = getSnapshot || (()=>null);
    this.onReady = onReady; this.onError = onError;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias:true, alpha:false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);
    this.renderer.shadowMap.enabled = true;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x101418);

    const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 500);
    this.camera.position.set(0, 35, 55); this.camera.lookAt(0,0,0);

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.maxPolarAngle = Math.PI*0.49;
    this.controls.minDistance = 10; this.controls.maxDistance = 180;

    const hemi = new THREE.HemisphereLight(0xcfd8ff, 0x0a3a1a, 0.5); this.scene.add(hemi);
    const dir  = new THREE.DirectionalLight(0xffffff, 1.0);
    dir.position.set(-30,50,20); dir.castShadow = true;
    dir.shadow.camera.left=-80; dir.shadow.camera.right=80; dir.shadow.camera.top=80; dir.shadow.camera.bottom=-80;
    dir.shadow.mapSize.set(2048,2048); this.scene.add(dir);

    this.res = new ResourceCache({ dracoDecoderPath: this.assets.dracoDecoderPath });

    this.stadium = new StadiumFactory(this.scene);
    this.stadium.build();

    this.players = new Map();
    this.ball = new BallActor(this.scene);

    this.clock = new THREE.Clock();
    this.running = false;
    this._onResize = () => this.#resize();
    window.addEventListener('resize', this._onResize);
  }

  async init(){
    try{
      if (this.assets.baseModel) await this.res.loadGLB(this.assets.baseModel);
      if (this.assets.clips) await Promise.all(Object.values(this.assets.clips).map(u=>this.res.loadGLB(u)));
      this.onReady && this.onReady();
    }catch(e){ console.error('[FTO3D:init]', e); this.onError && this.onError(e); throw e; }
  }

  async ensurePlayer(id, initialSnap){
    if (this.players.has(id)) return this.players.get(id);
    const actor = await PlayerActor.create({
      scene: this.scene, res: this.res,
      baseModelUrl: this.assets.baseModel, clipUrls: this.assets.clips, id
    });
    if (initialSnap?.pos) actor.model.position.fromArray(initialSnap.pos);
    if (initialSnap?.yaw!=null) actor.model.rotation.set(0, initialSnap.yaw, 0);
    this.players.set(id, actor);
    return actor;
  }

  setCameraPose({x,y,z,target=[0,0,0]}){
    if (x!=null) this.camera.position.x=x; if (y!=null) this.camera.position.y=y; if (z!=null) this.camera.position.z=z;
    const t = new THREE.Vector3(...target); this.camera.lookAt(t); this.controls.target.copy(t);
  }

  start(){ if(this.running) return; this.running=true; this.clock.start(); this.#loop(); }
  stop(){ this.running=false; this.clock.stop(); }

  async #loop(){
    if(!this.running) return; requestAnimationFrame(()=>this.#loop());
    const dt = this.clock.getDelta(); this.controls.update();
    const snap = this.getSnapshot ? this.getSnapshot() : null;
    if (snap) await this.#applySnapshot(snap, dt);
    this.renderer.render(this.scene, this.camera);
  }

  async #applySnapshot(snap, dt){
    if (snap.ball) this.ball.updateFromSnap(snap.ball, dt);
    const arr = snap.players || [];
    for (let i=0;i<arr.length;i++){
      const p = arr[i]; const id = p.id ?? p.uid ?? p.name ?? `P${i}`;
      const actor = await this.ensurePlayer(id, p);
      if (p.action === 'Kick') actor.playOneShot('Kick');
      actor.updateFromSnap(p, dt);
    }
  }

  #resize(){
    const w=this.canvas.clientWidth, h=this.canvas.clientHeight; if (!w||!h) return;
    this.renderer.setSize(w,h,false); this.camera.aspect=w/h; this.camera.updateProjectionMatrix();
  }

  #createCanvas(){ const c=document.createElement('canvas'); c.id='fto3d'; c.style.cssText='width:100%;height:100%;display:block;'; document.body.appendChild(c); return c; }
}

export default FtoRenderer3D;
