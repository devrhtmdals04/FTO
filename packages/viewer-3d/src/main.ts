import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createPitch } from './scene/pitch';
import { Ball } from './scene/ball';
import { PlayerSystem } from "./scene/player_system";
import { SimView, PlayerView, TeamId, BallView } from "./state";
import { HUD } from './scene/hud';
import { createEngineBridge, EngineBridge, TacticsPayload } from "./wasm/bridge"; // 실제 엔진 연결 시

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
const bridge: EngineBridge = await createEngineBridge();

// --- Game Loop ---
const SIM_DT = 1 / 60;
let acc = 0,
  last = performance.now() / 1000;
let prev: SimView = bridge.getLastView();
let curr: SimView = prev;
let actionsEnabled = true;
let activePreset = "Standard";

const TACTIC_PRESETS: Record<string, { label: string; value: TacticsPayload }> = {
  Digit1: {
    label: "Low Block",
    value: {
      line_height: 0.2,
      press_intensity: 0.3,
      team_width: 0.4,
      build_up: 0.35,
      counter_press: 0.2,
      long_ball_bias: 0.4,
      overlap_fullbacks: 0.1,
      compactness: 0.7,
    },
  },
  Digit2: {
    label: "Mid Block",
    value: {
      line_height: 0.45,
      press_intensity: 0.55,
      team_width: 0.55,
      build_up: 0.5,
      counter_press: 0.45,
      long_ball_bias: 0.35,
      overlap_fullbacks: 0.3,
      compactness: 0.6,
    },
  },
  Digit3: {
    label: "Balanced",
    value: {
      line_height: 0.5,
      press_intensity: 0.6,
      team_width: 0.6,
      build_up: 0.5,
      counter_press: 0.5,
      long_ball_bias: 0.4,
      overlap_fullbacks: 0.45,
      compactness: 0.5,
    },
  },
  Digit4: {
    label: "High Press",
    value: {
      line_height: 0.75,
      press_intensity: 0.85,
      team_width: 0.65,
      build_up: 0.55,
      counter_press: 0.8,
      long_ball_bias: 0.3,
      overlap_fullbacks: 0.5,
      compactness: 0.55,
    },
  },
  Digit5: {
    label: "Fast Break",
    value: {
      line_height: 0.6,
      press_intensity: 0.65,
      team_width: 0.75,
      build_up: 0.7,
      counter_press: 0.35,
      long_ball_bias: 0.7,
      overlap_fullbacks: 0.6,
      compactness: 0.45,
    },
  },
};
let fps = 0;

function stepSim() {
  prev = curr;
  curr = bridge.step();
}

function frame(){
  const now = performance.now()/1000; 
  const dt = now - last; 
  last = now; 
  acc += dt;

  while (acc >= SIM_DT) {
    stepSim(); 
    acc -= SIM_DT; 
  }
  const a = acc / SIM_DT;

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
  hud.update(curr.tick, fps, actionsEnabled, activePreset);

  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

// --- Keyboard Controls for Camera ---
const keyboardState: { [key: string]: boolean } = {};
window.addEventListener('keydown', (event) => {
  keyboardState[event.code] = true;

  if (event.code === 'KeyP') {
    players.toggleDebugMode();
  } else if (event.code === 'KeyT') {
    actionsEnabled = !actionsEnabled;
    bridge.toggleActions(actionsEnabled);
  } else if (TACTIC_PRESETS[event.code]) {
    const preset = TACTIC_PRESETS[event.code];
    bridge.setTactics(preset.value);
    activePreset = preset.label;
  }
});
window.addEventListener('keyup', (event) => {
  keyboardState[event.code] = false;
});

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

// --- Command helpers ---
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

function screenToPitchCoordinates(event: PointerEvent): { x: number; y: number } | null {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hit = new THREE.Vector3();
  if (raycaster.ray.intersectPlane(groundPlane, hit)) {
    return { x: hit.x, y: hit.z };
  }
  return null;
}

renderer.domElement.addEventListener('pointerdown', (event) => {
  if (event.button !== 0) return;
  const target = screenToPitchCoordinates(event);
  if (!target) return;

  if (event.shiftKey) {
    bridge.sendShoot(target, event.altKey ? 1.0 : 0.8);
  } else if (event.altKey) {
    bridge.sendLoftedPass(target, 0.65);
  } else {
    bridge.sendGroundPass(target);
  }
});

// --- Tactics presets ---
// Apply default tactics on start
const defaultPreset = TACTIC_PRESETS["Digit3"];
if (defaultPreset) {
  bridge.setTactics(defaultPreset.value);
  activePreset = defaultPreset.label;
}

// --- Start ---
requestAnimationFrame(frame);
