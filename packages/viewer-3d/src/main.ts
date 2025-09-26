import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createPitch } from './scene/pitch';
import { Ball } from './scene/ball';
import { PlayerSystem } from "./scene/player_system";
import { SimView } from "./state";
import { HUD } from './scene/hud';
import { createEngineBridge } from "./wasm/bridge";

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
// ... shadow map settings ...
scene.add(directionalLight);

// --- Scene Objects ---
const pitch = createPitch();
scene.add(pitch);

const ball = new Ball();
scene.add(ball.mesh);

const hud = new HUD();

const players = new PlayerSystem();
scene.add(players.group);

// --- UI Controls & State ---
const playerCountInput = document.getElementById('player-count') as HTMLInputElement;
const applyPlayerCountBtn = document.getElementById('apply-player-count');
const durationInput = document.getElementById('auto-play-duration') as HTMLInputElement;
const modeIndicatorDiv = document.getElementById('mode-indicator') as HTMLDivElement;
const debugControlsDiv = document.getElementById('debug-controls') as HTMLDivElement;
const debugInfoPanel = document.getElementById('debug-info-panel');

let isPaused = false;
let playUntil = 0; // Timestamp until which the simulation runs automatically

function updateUIMode(count: number) {
    const isDebug = count < 22;
    if (modeIndicatorDiv) {
        modeIndicatorDiv.textContent = isDebug ? `Debug Mode (${count} player${count > 1 ? 's' : ''})` : 'Simulation Mode';
    }
    if (debugControlsDiv) {
        debugControlsDiv.style.display = isDebug ? 'block' : 'none';
    }
    isPaused = isDebug;
}

async function restartPlayerSystem() {
  const count = parseInt(playerCountInput.value, 10) || 1;
  players.destroy();
  await players.init(count);
  updateUIMode(count);

  // Disable AI for all but the active players in debug mode
  for (let i = 0; i < 22; i++) {
    source.engine.set_ai_active(i, i < count);
  }

  players.setTeamColor(0, 0x1f77b4);
  players.setTeamColor(1, 0xd62728);
}

if (applyPlayerCountBtn) {
  applyPlayerCountBtn.addEventListener('click', restartPlayerSystem);
}

// --- Data Source ---
const source = createEngineBridge();

// Initial setup
await (async function(){
    const initialPlayerCount = parseInt(playerCountInput.value, 10) || 1;
    await players.init(initialPlayerCount);
    updateUIMode(initialPlayerCount);
    for (let i = 0; i < 22; i++) {
        source.engine.set_ai_active(i, i < initialPlayerCount);
    }
    players.setTeamColor(0, 0x1f77b4);
    players.setTeamColor(1, 0xd62728);
})();


// --- Game Loop ---
const DT = 1/20; 
let acc = 0, last = performance.now()/1000;
let prev: SimView = source.get(), curr: SimView = prev;
let fps = 0;
const playerSpeeds = new Float32Array(22);

function stepSim() { 
  prev = curr; 
  curr = source.get(); 

  // Calculate true player speeds based on simulation step
  for (let i = 0; i < curr.players.length; i++) {
    const p_prev = prev.players[i];
    const p_curr = curr.players[i];
    if (p_prev && p_curr) {
      const dx = p_curr.x - p_prev.x;
      const dy = p_curr.y - p_prev.y;
      playerSpeeds[i] = Math.hypot(dx, dy) / DT;
    }
  }
}

function frame(){
  const now = performance.now()/1000;
  const dt = now - last; 
  last = now;

  let isAutoPlaying = playUntil > now;

  if (!isPaused || isAutoPlaying) {
    acc += dt;
    while (acc >= DT) { 
        stepSim(); 
        acc -= DT; 
    }
  }

  // Check if auto-play just finished in this frame
  if (!isAutoPlaying && playUntil > 0) {
      console.log("Auto-play finished.");
      playUntil = 0; // Mark as finished
      stepSim(); // Perform one final step to get the resting state
  }

  const a = isPaused ? 1 : acc/DT;

  // ... interpolation and rendering ...
  const interpPlayers = curr.players.map((b,i)=>{
    const aP = prev.players[i];
    if (!aP) return b;

    const speed = playerSpeeds[i] || 0;

    const x = THREE.MathUtils.lerp(aP.x, b.x, a);
    const y = THREE.MathUtils.lerp(aP.y, b.y, a);
    const hx = THREE.MathUtils.lerp(aP.h[0], b.h[0], a);
    const hy = THREE.MathUtils.lerp(aP.h[1], b.h[1], a);
    const n = Math.hypot(hx,hy)||1; 
    return { ...b, x, y, h: [hx/n, hy/n] as [number,number], speed };
  });

  players.update(interpPlayers, dt);
  ball.update({
    x: THREE.MathUtils.lerp(prev.ball.x, curr.ball.x, a),
    y: THREE.MathUtils.lerp(prev.ball.y, curr.ball.y, a),
    z: THREE.MathUtils.lerp(prev.ball.z, curr.ball.z, a),
  });

  const newFps = 1 / dt;
  fps = fps * 0.95 + newFps * 0.05;
  updateCameraPosition();
  controls.update(dt);
  hud.update(curr.tick, fps);

  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

// --- Keyboard Controls ---
const keyboardState: { [key: string]: boolean } = {};
window.addEventListener('keydown', (event) => { 
    if (event.target instanceof HTMLInputElement) return; // Ignore keypresses in input fields
    keyboardState[event.code] = true; 

    // Master Debug Mode Toggle
    if (event.code === 'KeyM') {
        const isEnteringDebug = !players.isMasterDebug;
        playerCountInput.value = (isEnteringDebug ? 1 : 22).toString();
        restartPlayerSystem().then(() => {
            players.toggleMasterDebug(isEnteringDebug);
            if (debugInfoPanel) {
                if (isEnteringDebug) {
                    debugInfoPanel.style.display = 'block';
                    debugInfoPanel.innerHTML = `
                        <strong>Debug Hotkeys:</strong><br>
                        [1] Toggle Skeleton<br>
                        [2] Toggle Model
                    `;
                } else {
                    debugInfoPanel.style.display = 'none';
                }
            }
        });
    }

    // Sub-debug toggles (only active in master debug mode)
    if (players.isMasterDebug) {
        if (event.code === 'Digit1') {
            players.toggleSkeleton();
        }
        if (event.code === 'Digit2') {
            players.togglePlayerModel();
        }
    }

    // Player commands (only in debug mode with 1 player)
    if (isPaused && !event.repeat) {
        const tick = curr.tick;
        let cmd = null;
        if (event.code === 'KeyD') { // Shoot
            cmd = { apply_tick: tick + 2, type: "shoot", tx: 52.5, ty: 0.0, power: 0.8 };
        }
        if (event.code === 'KeyS') { // Pass
            const p_pos = {x: curr.players[0].x, y: curr.players[0].y };
            cmd = { apply_tick: tick + 2, type: "ground_pass", tx: p_pos.x + 15, ty: p_pos.y };
        }
        if (cmd) {
            source.engine.command(cmd);
            const duration = parseFloat(durationInput.value) || 5;
            playUntil = performance.now()/1000 + duration;
            console.log(`Command sent, auto-playing for ${duration}s...`);
        }
    }
});
window.addEventListener('keyup', (event) => { keyboardState[event.code] = false; });

// ... camera and resize listeners ...
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
const cameraMoveSpeed = 1.0;
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Start ---
requestAnimationFrame(frame);