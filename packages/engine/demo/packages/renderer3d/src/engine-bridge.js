// packages/renderer3d/src/engine-bridge.js
// Robust engine↔renderer bridge with auto-detection + mock fallback

export class EngineBridge {
  constructor({ mode = 'auto', mockProvider } = {}) {
    this.mode = mode;
    this.mockProvider = mockProvider || this._defaultMock;
    this.status = 'init';
    this.connected = false;
    this.lastError = null;
    this._lastSnapshot = null;
    this._onMessage = (ev) => {
      const d = ev?.data;
      if (!d) return;
      if (d.type === 'FTO_SNAPSHOT' && d.payload) {
        this._lastSnapshot = d.payload;
        this.status = 'push:connected';
        this.connected = true;
      } else if (d.__fto === 'snapshot') {
        this._lastSnapshot = d;
        this.status = 'push:connected';
        this.connected = true;
      }
    };
  }

  async init() {
    window.addEventListener('message', this._onMessage);

    if (this.mode === 'mock') { this.status = 'mock'; return; }

    try {
      if (typeof window.getLatestSnapshot === 'function') {
        const probe = window.getLatestSnapshot();
        if (probe) { this.status = 'pull:getLatestSnapshot'; this.connected = true; return; }
      }
    } catch(e) { this.lastError = e; }

    try {
      if (window.engine && typeof window.engine.snapshot === 'function') {
        const probe = window.engine.snapshot();
        if (probe) { this.status = 'pull:engine.snapshot'; this.connected = true; return; }
      }
    } catch(e) { this.lastError = e; }

    try {
      if (window.engine?.getSnapshotBytes && typeof window.decodeSnapshot === 'function') {
        const bytes = window.engine.getSnapshotBytes();
        const probe = window.decodeSnapshot(bytes);
        if (probe) { this.status = 'pull:bytes+decode'; this.connected = true; return; }
      }
    } catch(e) { this.lastError = e; }

    this.status = 'push:awaiting';
  }

  getSnapshot() {
    try {
      switch (this.status) {
        case 'pull:getLatestSnapshot':
          return window.getLatestSnapshot();
        case 'pull:engine.snapshot':
          return window.engine.snapshot();
        case 'pull:bytes+decode': {
          const bytes = window.engine.getSnapshotBytes();
          return window.decodeSnapshot(bytes);
        }
        case 'push:connected':
          return this._lastSnapshot || this.mockProvider();
        case 'push:awaiting':
        case 'init':
        default:
          return this.mockProvider();
      }
    } catch (e) {
      this.lastError = e;
      return this.mockProvider();
    }
  }

  dispose() { window.removeEventListener('message', this._onMessage); }

  _defaultMock(t = performance.now() * 1e-3) {
    const r = 14, a1 = t * 0.55, a2 = t * 0.42;
    const p1 = { id: 1, team: 'A', pos: [ Math.cos(a1)*r, 0, Math.sin(a1)*r ],
                 yaw: a1 + Math.PI/2, speed: 5.5, action: 'Run', height_cm: 183, weight_kg: 78 };
    const p2 = { id: 2, team: 'B', pos: [ Math.cos(a2)*r, 0, Math.sin(a2)*r ],
                 yaw: a2 + Math.PI/2, speed: 3.2, action: 'Jog', height_cm: 176, weight_kg: 70 };
    return { time: t, ball: { pos: [0, 0.11, 0], spin: [0, 12, 0] }, players: [p1, p2] };
  }
}

export default EngineBridge;
