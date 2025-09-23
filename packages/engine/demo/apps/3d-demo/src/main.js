// apps/3d-demo/src/main.js
// Entry point: EngineBridge + adapter + renderer + HUD + keybinds

import FtoRenderer3D from '../../../packages/renderer3d/src/fto-renderer3d.js';
import { toRendererSnapshot } from '../../../packages/renderer3d/src/snapshot-adapter.js';
import EngineBridge from '../../../packages/renderer3d/src/engine-bridge.js';

const params = new URLSearchParams(location.search);
const forceMock = params.get('mock') === '1';

async function initializeApp() {
  // Wait for window.engine to be available
  while (!window.engine || typeof window.engine.snapshot !== 'function') {
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 100ms
  }

  const bridge = new EngineBridge({ mode: 'auto' });
  await bridge.init();
  if (bridge.lastError) {
    console.error("EngineBridge connection error:", bridge.lastError);
  }

  const r3d = new FtoRenderer3D({
    canvas: document.getElementById('fto3d') || createCanvas(),
    assets: {
      baseModel: '/models/mixamo/player_base.glb',
      clips: {
        Idle: '/anims/mixamo/idle.glb',
        Jog:  '/anims/mixamo/jog.glb',
        Run:  '/anims/mixamo/run.glb',
        Kick: '/anims/mixamo/kick.glb',
      },
    },
    getSnapshot: () => toRendererSnapshot(bridge.getSnapshot()),
  });

  await r3d.init();
  r3d.start();
  r3d.setCameraPose({ x: 0, y: 35, z: 55, target: [0,0,0] });

  // HUD for bridge status
  const hud = document.createElement('div');
  hud.style.cssText = 'position:fixed;left:10px;top:10px;color:#cfe3ff;font:12px ui-sans-serif;padding:6px 8px;background:#0c1320;border-radius:8px;opacity:.9;z-index:1000';
  document.body.appendChild(hud);
  setInterval(()=>{ hud.textContent = `EngineBridge: ${bridge.status}${bridge.lastError? ' (err)': ''}`; }, 500);

  // Keybindings: K=kick (P1), 1/2/3 camera presets, M toggle mock
  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const k = e.key.toLowerCase();
    if (k === 'k') {
      const actor = r3d.players?.get(1) || r3d.players?.values()?.next()?.value; // player id 1 or first
      if (actor) actor.playOneShot('Kick');
    } else if (k === '1') {
      r3d.setCameraPose({ x: 0,  y: 35, z: 55, target:[0,0,0] });
    } else if (k === '2') {
      r3d.setCameraPose({ x: 55, y: 15, z: 0,  target:[0,0,0] });
    } else if (k === '3') {
      r3d.setCameraPose({ x: 0,  y: 95, z: 0,  target:[0,0,0] });
    } else if (k === 'm') {
      const url = new URL(location.href);
      url.searchParams.set('mock', url.searchParams.get('mock')==='1' ? '0':'1');
      location.href = url.toString();
    }
  });
}

initializeApp(); // Call the async initialization function

function createCanvas(){ const c=document.createElement('canvas'); c.id='fto3d'; c.style.cssText='width:100vw;height:100vh;display:block;'; document.body.appendChild(c); return c; }
