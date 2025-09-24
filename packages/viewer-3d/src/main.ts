import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createPitch } from './scene/pitch';
import { Ball } from './scene/ball';
import { PlayerSystem } from "./scene/player_system";
import { SimView, PlayerView, TeamId, BallView } from "./state";
import { HUD } from './scene/hud';
import { createEngineBridge } from "./wasm/bridge"; // 실제 엔진 연결 시

// --- Basic Scene Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a2a1a);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 80, 100);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.getElementById('app')?.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableDamping = true;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(-100, 100, 50);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.left = -100;
directionalLight.shadow.camera.right = 100;
directionalLight.shadow.camera.top = 100;
directionalLight.shadow.camera.bottom = -100;
scene.add(directionalLight);

// --- Scene Objects ---
const pitch = createPitch();
scene.add(pitch);

const ball = new Ball();
scene.add(ball.mesh);

const hud = new HUD();

const players = new PlayerSystem();
scene.add(players.group);
await players.init();

// Set team colors
players.setTeamColor(0, 0x1f77b4); // Team A: Blue
players.setTeamColor(1, 0xd62728); // Team B: Red

// --- Data Source ---
const source = createEngineBridge();

// --- Game Loop ---
const DT = 1/20; 
let acc = 0, last = performance.now()/1000;
let prev: SimView = source(), curr: SimView = prev;
let fps = 0;

function stepSim() { 
  prev = curr; 
  curr = source(); 
}

function frame(){
  const now = performance.now()/1000; 
  const dt = now - last; 
  last = now; 
  acc += dt;

  while (acc >= DT) { 
    stepSim(); 
    acc -= DT; 
  }
  const a = acc/DT;

  // Interpolate players
  const interpPlayers = curr.players.map((b,i)=>{
    const aP = prev.players[i];
    const x = THREE.MathUtils.lerp(aP.x, b.x, a);
    const y = THREE.MathUtils.lerp(aP.y, b.y, a);
    const hx = THREE.MathUtils.lerp(aP.h[0], b.h[0], a);
    const hy = THREE.MathUtils.lerp(aP.h[1], b.h[1], a);
    const n = Math.hypot(hx,hy)||1; 
    return { ...b, x, y, h: [hx/n, hy/n] as [number,number] };
  });

  // Update systems
  players.update(interpPlayers, dt);
  ball.update({
    x: THREE.MathUtils.lerp(prev.ball.x, curr.ball.x, a),
    y: THREE.MathUtils.lerp(prev.ball.y, curr.ball.y, a),
    z: THREE.MathUtils.lerp(prev.ball.z, curr.ball.z, a),
  });

  // (Option) Apply events from engine if available
  // if (curr.events) players.applyEvents(curr.events);

  // Update controls and HUD
  const newFps = 1 / dt;
  fps = fps * 0.95 + newFps * 0.05;
  updateCameraPosition();
  controls.update(dt);
  hud.update(curr.tick, fps);

  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

// --- Keyboard Controls for Camera ---
const keyboardState: { [key: string]: boolean } = {};
window.addEventListener('keydown', (event) => { 
    keyboardState[event.code] = true; 
    if (event.code === 'KeyP') {
        players.toggleDebugMode();
    }
});
window.addEventListener('keyup', (event) => { keyboardState[event.code] = false; });

const cameraMoveSpeed = 1.0;

function updateCameraPosition() {
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3().crossVectors(camera.up, forward).normalize();

    if (keyboardState['KeyW']) {
        camera.position.addScaledVector(forward, cameraMoveSpeed);
        controls.target.addScaledVector(forward, cameraMoveSpeed);
    }
    if (keyboardState['KeyS']) {
        camera.position.addScaledVector(forward, -cameraMoveSpeed);
        controls.target.addScaledVector(forward, -cameraMoveSpeed);
    }
    if (keyboardState['KeyA']) {
        camera.position.addScaledVector(right, cameraMoveSpeed);
        controls.target.addScaledVector(right, cameraMoveSpeed);
    }
    if (keyboardState['KeyD']) {
        camera.position.addScaledVector(right, -cameraMoveSpeed);
        controls.target.addScaledVector(right, -cameraMoveSpeed);
    }
}


// --- Window Resize ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Start ---
requestAnimationFrame(frame);