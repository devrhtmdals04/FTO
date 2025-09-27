import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createPitch } from './scene/pitch';
import { Ball } from './scene/ball';
import { PlayerSystem } from "./scene/player_system";
import { SimView, PlayerProfile } from "./state";
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

// --- Data Source ---
const source = createEngineBridge();

// --- UI Controls & State ---
const playerCountInput = document.getElementById('player-count') as HTMLInputElement;
const applyPlayerCountBtn = document.getElementById('apply-player-count');
const durationInput = document.getElementById('auto-play-duration') as HTMLInputElement;
const modeIndicatorDiv = document.getElementById('mode-indicator') as HTMLDivElement;
const debugControlsDiv = document.getElementById('debug-controls') as HTMLDivElement;
const playerModelInput = document.getElementById('player-model-url') as HTMLInputElement;
const applyPlayerModelBtn = document.getElementById('apply-player-model');
const playerProfileSelect = document.getElementById('player-profile-select') as HTMLSelectElement;
const debugInfoPanel = document.getElementById('debug-info-panel') as HTMLDivElement | null;

let isPaused = false;
let playUntil = 0; // Timestamp until which the simulation runs automatically
let playerProfiles: PlayerProfile[] = [];
let selectedProfileIndex: number | null = null;
let currentModelUrl = (playerModelInput?.value?.trim() || "/assets/player.glb");
let currentPlayerCount = parseInt(playerCountInput?.value ?? '1', 10) || 1;
let isDriveMode = false;

function updateUIMode(count: number) {
    const isDebug = count < 22;
    if (modeIndicatorDiv) {
        modeIndicatorDiv.textContent = isDebug ? `Debug Mode (${count} player${count > 1 ? 's' : ''})` : 'Simulation Mode';
    }
    if (debugControlsDiv) {
        debugControlsDiv.style.display = isDebug ? 'block' : 'none';
    }
    isPaused = isDebug;
    if (!isDebug && debugInfoPanel) {
        debugInfoPanel.style.display = 'none';
    }
    renderDebugInfoPanel();
}

function renderDebugInfoPanel() {
    if (!debugInfoPanel) return;
    if (!players.isMasterDebug) {
        debugInfoPanel.style.display = 'none';
        return;
    }

    const profile = (selectedProfileIndex != null) ? playerProfiles[selectedProfileIndex] : undefined;
    const teamLabel = profile ? (profile.team === 0 ? 'Home' : 'Away') : '';
    const footLabel = profile ? (profile.foot === 'L' ? 'Left' : 'Right') : '';
    const profileHtml = profile ? `
        <div><strong>${profile.name}</strong> — ${teamLabel} Team</div>
        <div>Height ${profile.height_cm} cm | Weight ${profile.weight_kg} kg</div>
        <div>Foot ${footLabel} | Weak Foot ${profile.weak_foot}</div>
        <div>Pace ${profile.pace} | Accel ${profile.accel} | Agility ${profile.agility} | Stamina ${profile.stamina} | Strength ${profile.strength}</div>
        <div>First Touch ${profile.first_touch} | Passing ${profile.passing} | Vision ${profile.vision}</div>
        <div>Finishing ${profile.finishing} | Shot Power ${profile.shot_power} | Heading ${profile.heading} | Jumping ${profile.jumping}</div>
        <div>Tackling ${profile.tackling} | Interception ${profile.interception}</div>
    ` : '<div>Select a player to see profile details.</div>';

    debugInfoPanel.innerHTML = `
        <strong>Debug Hotkeys:</strong><br>
        [T] Toggle Drive Mode<br>
        [1] Toggle Skeleton<br>
        [2] Toggle Model
        <hr>
        <strong>Player Profile</strong><br>
        ${profileHtml}
    `;
    debugInfoPanel.style.display = 'block';
}

function updatePlayerIndexMapping() {
  if (!players.ready) return;
  if (currentPlayerCount >= 22) {
    players.resetPlayerIndexMap();
    return;
  }
  players.resetPlayerIndexMap();
  if (selectedProfileIndex != null) {
    players.setPlayerIndex(0, selectedProfileIndex);
  }
}

async function restartPlayerSystem(modelUrlOverride?: string) {
  const count = parseInt(playerCountInput.value, 10) || 1;
  await source.ready();

  const previousModelUrl = players.getModelUrl();
  const requestedUrl = (modelUrlOverride ?? currentModelUrl).trim() || "/assets/player.glb";
  currentModelUrl = requestedUrl;
  if (playerModelInput && playerModelInput.value !== requestedUrl) {
    playerModelInput.value = requestedUrl;
  }

  players.destroy();

  try {
    await players.init(count, requestedUrl);
  } catch (err) {
    console.error(`Failed to load player model from '${requestedUrl}'`, err);
    if (previousModelUrl && previousModelUrl !== requestedUrl) {
      currentModelUrl = previousModelUrl;
      if (playerModelInput) {
        playerModelInput.value = previousModelUrl;
      }
      await players.init(count, previousModelUrl);
      if (typeof window !== 'undefined' && typeof window.alert === 'function') {
        window.alert(`Failed to load model from "${requestedUrl}". Reverting to "${previousModelUrl}".`);
      }
    } else {
      throw err;
    }
  }

  currentPlayerCount = count;
  updateUIMode(count);

  // Disable AI for all but the active players in debug mode
  for (let i = 0; i < 22; i++) {
    source.engine.set_ai_active(i, i < count);
  }

  players.setTeamColor(0, 0x1f77b4);
  players.setTeamColor(1, 0xd62728);
  updatePlayerIndexMapping();

  if (selectedProfileIndex != null && !playerProfiles[selectedProfileIndex]) {
    selectedProfileIndex = playerProfiles.length ? playerProfiles[0].index : null;
    if (playerProfileSelect && selectedProfileIndex != null) {
      playerProfileSelect.value = selectedProfileIndex.toString();
    }
  }

  renderDebugInfoPanel();
}

if (applyPlayerCountBtn) {
  applyPlayerCountBtn.addEventListener('click', () => {
    void restartPlayerSystem().catch(err => console.error('Failed to restart player system', err));
  });
}

if (applyPlayerModelBtn) {
  applyPlayerModelBtn.addEventListener('click', () => {
    const url = playerModelInput.value.trim();
    void restartPlayerSystem(url).catch(err => console.error('Failed to apply player model', err));
  });
  playerModelInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const url = playerModelInput.value.trim();
      void restartPlayerSystem(url).catch(err => console.error('Failed to apply player model', err));
    }
  });
}

if (playerProfileSelect) {
  playerProfileSelect.addEventListener('change', () => {
    const newIndex = parseInt(playerProfileSelect.value, 10);
    if (Number.isNaN(newIndex)) return;

    // In debug mode, ensure AI activation follows the selected player
    if (currentPlayerCount < 22) {
        // Deactivate AI for the old player, if there was one
        if (selectedProfileIndex != null) {
            source.engine.set_ai_active(selectedProfileIndex, false);
        }
        // Activate AI for the new player
        source.engine.set_ai_active(newIndex, true);
    }

    selectedProfileIndex = newIndex;
    updatePlayerIndexMapping();
    renderDebugInfoPanel();
  });
}

// Initial setup
await (async function(){
    await source.ready();
    playerProfiles = source.getPlayerProfiles();
    if (playerProfileSelect) {
        playerProfileSelect.innerHTML = '';
        playerProfiles.forEach(profile => {
            const option = document.createElement('option');
            const shirtNumber = (profile.index % 11) + 1;
            const teamLabel = profile.team === 0 ? 'Home' : 'Away';
            option.value = profile.index.toString();
            option.textContent = `${teamLabel} #${shirtNumber} — ${profile.name}`;
            playerProfileSelect.appendChild(option);
        });
        if (playerProfiles.length) {
            selectedProfileIndex = playerProfiles[0].index;
            playerProfileSelect.value = selectedProfileIndex.toString();
        }
    }

    const initialPlayerCount = parseInt(playerCountInput.value, 10) || 1;
    await players.init(initialPlayerCount, currentModelUrl);
    currentPlayerCount = initialPlayerCount;
    updateUIMode(initialPlayerCount);
    for (let i = 0; i < 22; i++) {
        source.engine.set_ai_active(i, i < initialPlayerCount);
    }
    players.setTeamColor(0, 0x1f77b4);
    players.setTeamColor(1, 0xd62728);
    updatePlayerIndexMapping();
    renderDebugInfoPanel();
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

  // DEBUG: Log speeds
  const ball_dx = curr.ball.x - prev.ball.x;
  const ball_dy = curr.ball.y - prev.ball.y;
  const ball_speed = Math.hypot(ball_dx, ball_dy) / DT;
  const player_speed = playerSpeeds[selectedProfileIndex ?? 0] ?? 0;
  console.log(`Ball Speed: ${ball_speed.toFixed(2)}, Player ${selectedProfileIndex} Speed: ${player_speed.toFixed(2)}`);
}

function updateDriveMode() {
    if (!isDriveMode || selectedProfileIndex == null) return;

    const controlledPlayer = curr.players[selectedProfileIndex];
    if (!controlledPlayer) return;

    // --- Player Control ---
    const playerParams = playerProfiles[selectedProfileIndex];
    const maxSpeed = playerParams ? playerParams.pace * 0.1 : 7.0; // Example conversion
    let vx = 0;
    let vy = 0;
    if (keyboardState['KeyW']) vy += 1;
    if (keyboardState['KeyS']) vy -= 1;
    if (keyboardState['KeyA']) vx -= 1;
    if (keyboardState['KeyD']) vx += 1;

    const moveVec = new THREE.Vector2(vx, vy);
    if (moveVec.length() > 0) {
        moveVec.normalize().multiplyScalar(maxSpeed);
    }

    source.engine.command({
        type: 'move_player',
        pid: selectedProfileIndex,
        vx: moveVec.x,
        vy: moveVec.y,
        apply_tick: curr.tick + 1
    });

    // --- Camera Control ---
    const playerPos = new THREE.Vector3(controlledPlayer.x, 1.0, controlledPlayer.y);
    const cameraOffset = new THREE.Vector3(0, 8, -15); // Behind and above
    
    // Apply player's orientation to the offset
    const playerOrientation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.atan2(controlledPlayer.h[0], controlledPlayer.h[1]));
    cameraOffset.applyQuaternion(playerOrientation);

    const cameraTarget = new THREE.Vector3().addVectors(playerPos, cameraOffset);
    
    camera.position.lerp(cameraTarget, 0.1);
    controls.target.lerp(playerPos, 0.1);
}

function frame(){
  const now = performance.now()/1000;
  const dt = now - last; 
  last = now;

  if (isDriveMode) {
    updateDriveMode();
  } else {
    updateCameraPosition(); // Original camera controls
  }

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

  players.update(interpPlayers, playerProfiles, dt);
  ball.update({
    x: THREE.MathUtils.lerp(prev.ball.x, curr.ball.x, a),
    y: THREE.MathUtils.lerp(prev.ball.y, curr.ball.y, a),
    z: THREE.MathUtils.lerp(prev.ball.z, curr.ball.z, a),
  });

  const newFps = 1 / dt;
  fps = fps * 0.95 + newFps * 0.05;
  
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

    if (event.code === 'KeyT') {
        isDriveMode = !isDriveMode;
        controls.enabled = !isDriveMode;
        if (selectedProfileIndex !== null) {
            source.engine.set_ai_active(selectedProfileIndex, !isDriveMode);
        }
        console.log(`Drive Mode ${isDriveMode ? 'ON' : 'OFF'}`);
    }

    // Master Debug Mode Toggle
    if (event.code === 'KeyM') {
        const isEnteringDebug = !players.isMasterDebug;
        playerCountInput.value = (isEnteringDebug ? 1 : 22).toString();
        void restartPlayerSystem().then(() => {
            players.toggleMasterDebug(isEnteringDebug);
            renderDebugInfoPanel();
        }).catch(err => console.error('Failed to toggle master debug', err));
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
    if (isPaused && !event.repeat && !isDriveMode) { // Disable S/D keys in drive mode
        const tick = curr.tick;
        let cmd = null;
        if (event.code === 'KeyJ') { // Shoot
            cmd = { apply_tick: tick + 2, type: "shoot", tx: 52.5, ty: 0.0, power: 0.8 };
        }
        if (event.code === 'KeyK') { // Pass
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
