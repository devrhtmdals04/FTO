import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createPitch } from './scene/pitch';
import { Ball } from './scene/ball';
import { Players } from './scene/players';
import { HUD } from './scene/hud';
import { createEngineBridge } from './wasm/bridge';
import { mockSimSource } from './state';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a2a1a); // Dark green background

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 80, 100);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadows
document.getElementById('app')?.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableDamping = true;
controls.enableZoom = true;
controls.enablePan = true;

// Pitch
const pitch = createPitch();
scene.add(pitch);

// Ball
const ball = new Ball();
scene.add(ball.mesh);

// Players
const players = new Players(22);
scene.add(players.mesh);

// HUD
const hud = new HUD();

// --- Data Source Toggle ---
const engineToggle = document.createElement('div');
engineToggle.style.position = 'fixed';
engineToggle.style.bottom = '10px';
engineToggle.style.left = '10px';
engineToggle.style.backgroundColor = 'rgba(0,0,0,0.5)';
engineToggle.style.padding = '10px';
engineToggle.style.borderRadius = '5px';
engineToggle.style.color = 'white';
engineToggle.style.fontFamily = 'monospace';
engineToggle.innerHTML = `<label><input type="checkbox" id="use-engine-toggle" checked> Use Real Engine</label>`;
document.body.appendChild(engineToggle);
const useEngineToggle = document.getElementById('use-engine-toggle') as HTMLInputElement;

// Initialize both data sources
const getNextEngineView = createEngineBridge();
const getNextMockView = mockSimSource();

// Lights
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

// Keyboard state
const keyboardState: { [key: string]: boolean } = {};
window.addEventListener('keydown', (event) => {
  keyboardState[event.code] = true;
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

const clock = new THREE.Clock();
let fps = 0;

function animate() {
	requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const newFps = 1 / delta;
    fps = fps * 0.95 + newFps * 0.05;

    updateCameraPosition();

    // Update game state based on the toggle
    const useRealEngine = useEngineToggle.checked;
    const simView = useRealEngine ? getNextEngineView() : getNextMockView();

    if (simView) {
        ball.update(simView.ball);
        players.update(simView.players);
        hud.update(simView.tick, fps);
    }

    controls.update(delta);
	renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});