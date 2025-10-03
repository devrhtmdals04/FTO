import * as THREE from 'three';

import { Ball } from '../scene/ball';
import { HUD } from '../scene/hud';
import { createPitch } from '../scene/pitch';
import { PlayerSystem } from '../scene/player_system';
import { PlayerProfile, PlayerView, SimView } from '../state';
import { createEngineBridge } from '../wasm/bridge';
import { createSceneContext, SceneContext } from './sceneContext';

import { TacticsSettingsRoot, TacticsStore } from 'tactics';

const MAX_PLAYERS = 22;
const STEP_DT = 1 / 20;
const DEFAULT_MODEL_URL = '/assets/player.glb';
const CAMERA_MOVE_SPEED = 1.0;
const DRIVE_LOOKAHEAD_SECONDS = 0.6;

function createEmptySimView(): SimView {
  const players: PlayerView[] = Array.from({ length: MAX_PLAYERS }, (_, i) => ({
    x: 0,
    y: 0,
    h: [1, 0],
    vis: 1,
    team: (i < 11 ? 0 : 1),
    has_ball: false,
  }));
  return { tick: 0, ball: { x: 0, y: 0, z: 0 }, players };
}

interface UIElements {
  playerCountInput: HTMLInputElement | null;
  applyPlayerCountBtn: HTMLElement | null;
  modeIndicator: HTMLDivElement | null;
  debugControls: HTMLDivElement | null;
  playerModelInput: HTMLInputElement | null;
  applyPlayerModelBtn: HTMLElement | null;
  playerProfileSelect: HTMLSelectElement | null;
  debugInfoPanel: HTMLDivElement | null;
}

interface DebugHotkey {
  code: string;
  keyLabel: string;
  description: string;
  handler: () => void | Promise<void>;
  condition?: () => boolean;
  suppressRepeat?: boolean;
  preventDefault?: boolean;
  showInPanel?: boolean;
}

type EngineBridge = ReturnType<typeof createEngineBridge>;

export class ViewerApp {
  private readonly source: EngineBridge = createEngineBridge();
  private readonly players = new PlayerSystem();
  private readonly ball = new Ball();
  private readonly hud = new HUD();

  private tacticsStore: TacticsStore | null = null;
  private tacticsRoot: TacticsSettingsRoot | null = null;

  private sceneContext!: SceneContext;
  private readonly keyboardState: Record<string, boolean> = {};
  private readonly playerSpeeds = new Float32Array(MAX_PLAYERS);

  private ui: UIElements;
  private debugHotkeys: DebugHotkey[] = [];
  private readonly generalDebugHotkeys: Array<{ label: string; description: string }> = [
    { label: 'Space', description: 'Toggle Pause' },
    { label: 'O', description: 'Toggle Tactics Panel' },
  ];

  private prev: SimView = createEmptySimView();
  private curr: SimView = this.prev;

  private playerProfiles: PlayerProfile[] = [];
  private selectedProfileIndex: number | null = null;
  private driveTarget: THREE.Vector2 | null = null;

  private acc = 0;
  private last = 0;
  private fps = 0;
  private frameHandle: number | null = null;

  private isPaused = false;
  private isDriveMode = false;
  private currentPlayerCount = 1;
  private currentModelUrl: string;

  constructor(private readonly mount: HTMLElement, private readonly doc: Document = document) {
    this.ui = this.resolveUIElements();
    this.currentModelUrl = (this.ui.playerModelInput?.value?.trim() || DEFAULT_MODEL_URL);
    this.debugHotkeys = this.createDebugHotkeys();
  }

  async init(): Promise<void> {
    this.sceneContext = createSceneContext(this.mount);
    this.last = performance.now() / 1000;

    const tacticsMount = this.doc.getElementById('tactics-root');
    if (tacticsMount instanceof HTMLElement) {
      this.tacticsStore = new TacticsStore(this.source);
      this.tacticsRoot = new TacticsSettingsRoot({ mount: tacticsMount, store: this.tacticsStore });
    }

    this.sceneContext.scene.add(createPitch());
    this.sceneContext.scene.add(this.ball.mesh);
    this.sceneContext.scene.add(this.players.group);

    this.bindUIEvents();
    this.bindGlobalEvents();

    await this.source.ready();
    this.playerProfiles = this.source.getPlayerProfiles();
    this.populatePlayerProfileSelect();

    const initialCount = this.getRequestedPlayerCount();
    await this.players.init(initialCount, this.currentModelUrl);
    this.currentPlayerCount = initialCount;
    this.syncAiActive(initialCount);
    this.players.setTeamColor(0, 0x1f77b4);
    this.players.setTeamColor(1, 0xd62728);

    this.prev = this.source.get();
    this.curr = this.prev;

    this.updateUIMode(initialCount);
    this.ensureSelectedProfile();
    this.updatePlayerIndexMapping();
    this.renderDebugInfoPanel();
  }

  start(): void {
    if (this.frameHandle === null) {
      this.frameHandle = requestAnimationFrame(this.onFrame);
    }
  }

  dispose(): void {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('keydown', this.handleKeyDown, true);
    window.removeEventListener('keyup', this.handleKeyUp, true);

    this.ui.applyPlayerCountBtn?.removeEventListener('click', this.handleApplyPlayerCount);
    this.ui.applyPlayerModelBtn?.removeEventListener('click', this.handleApplyPlayerModel);
    this.ui.playerModelInput?.removeEventListener('keydown', this.handlePlayerModelInputKey);
    this.ui.playerProfileSelect?.removeEventListener('change', this.handleProfileChange);

    this.tacticsRoot?.destroy();

    if (this.frameHandle !== null) {
      cancelAnimationFrame(this.frameHandle);
      this.frameHandle = null;
    }
  }

  private readonly onFrame = () => {
    const now = performance.now() / 1000;
    const dt = now - this.last;
    this.last = now;

    if (this.isDriveMode) {
      this.updateDriveMode();
    } else {
      this.updateCameraPosition();
    }

    if (!this.isPaused) {
      this.acc += dt;
      while (this.acc >= STEP_DT) {
        this.stepSimulation();
        this.acc -= STEP_DT;
      }
    }

    const alpha = this.isPaused ? 1 : this.acc / STEP_DT;
    const interpolatedPlayers = this.interpolatePlayers(alpha);

    this.players.update(interpolatedPlayers, this.playerProfiles, dt);
    this.ball.update({
      x: THREE.MathUtils.lerp(this.prev.ball.x, this.curr.ball.x, alpha),
      y: THREE.MathUtils.lerp(this.prev.ball.y, this.curr.ball.y, alpha),
      z: THREE.MathUtils.lerp(this.prev.ball.z, this.curr.ball.z, alpha),
    });

    if (dt > 0) {
      const newFps = 1 / dt;
      this.fps = this.fps * 0.95 + newFps * 0.05;
    }

    this.sceneContext.controls.update(dt);
    this.hud.update(this.curr.tick, this.fps);
    this.sceneContext.renderer.render(this.sceneContext.scene, this.sceneContext.camera);

    this.frameHandle = requestAnimationFrame(this.onFrame);
  };

  private stepSimulation(): void {
    this.prev = this.curr;
    this.curr = this.source.get();
    this.updatePlayerSpeeds();
  }

  private interpolatePlayers(alpha: number): PlayerView[] {
    return this.curr.players.map((currPlayer, index) => {
      const prevPlayer = this.prev.players[index];
      if (!prevPlayer) {
        return currPlayer;
      }

      const hx = THREE.MathUtils.lerp(prevPlayer.h[0], currPlayer.h[0], alpha);
      const hy = THREE.MathUtils.lerp(prevPlayer.h[1], currPlayer.h[1], alpha);
      const headingNorm = Math.hypot(hx, hy) || 1;

      return {
        ...currPlayer,
        x: THREE.MathUtils.lerp(prevPlayer.x, currPlayer.x, alpha),
        y: THREE.MathUtils.lerp(prevPlayer.y, currPlayer.y, alpha),
        h: [hx / headingNorm, hy / headingNorm],
        speed: this.playerSpeeds[index] || 0,
        has_ball: currPlayer.has_ball,
      };
    });
  }

  private updatePlayerSpeeds(): void {
    for (let i = 0; i < this.curr.players.length; i++) {
      const prevPlayer = this.prev.players[i];
      const currPlayer = this.curr.players[i];
      if (!prevPlayer || !currPlayer) {
        this.playerSpeeds[i] = 0;
        continue;
      }
      const dx = currPlayer.x - prevPlayer.x;
      const dy = currPlayer.y - prevPlayer.y;
      this.playerSpeeds[i] = Math.hypot(dx, dy) / STEP_DT;
    }
  }

  private updateDriveMode(): void {
    if (!this.players.ready) {
      return;
    }
    if (!this.isDriveMode || this.selectedProfileIndex == null) {
      return;
    }

    const controlledPlayer = this.curr.players[this.selectedProfileIndex];
    const profile = this.playerProfiles[this.selectedProfileIndex];
    if (!controlledPlayer || !profile) {
      return;
    }

    const maxSpeed = profile.pace * 0.1;
    const forwardInput = (this.keyboardState['KeyW'] ? 1 : 0) + (this.keyboardState['KeyS'] ? -1 : 0);
    const strafeInput = (this.keyboardState['KeyD'] ? 1 : 0) + (this.keyboardState['KeyA'] ? -1 : 0);

    const forwardDir = new THREE.Vector2(controlledPlayer.h[0], controlledPlayer.h[1]);
    if (forwardDir.lengthSq() < 1e-6) {
      forwardDir.set(0, 1);
    } else {
      forwardDir.normalize();
    }
    const rightDir = new THREE.Vector2(-forwardDir.y, forwardDir.x);

    const moveInput = new THREE.Vector2(0, 0)
      .add(forwardDir.clone().multiplyScalar(forwardInput))
      .add(rightDir.clone().multiplyScalar(strafeInput));
    const playerPos2D = new THREE.Vector2(controlledPlayer.x, controlledPlayer.y);
    let commandTarget = playerPos2D.clone();
    let moveDir: THREE.Vector2 | null = null;

    if (moveInput.lengthSq() > 0) {
      moveDir = moveInput.clone().normalize();
      const lookAhead = Math.max(maxSpeed * DRIVE_LOOKAHEAD_SECONDS, 2.0);
      commandTarget = playerPos2D.clone().add(moveDir.clone().multiplyScalar(lookAhead));
      this.driveTarget = commandTarget.clone();
      if (this.selectedProfileIndex != null) {
        this.players.setMoveTarget(
          this.selectedProfileIndex,
          new THREE.Vector3(commandTarget.x, 0, commandTarget.y),
          moveDir,
        );
      }
    } else {
      this.driveTarget = null;
      if (this.selectedProfileIndex != null) {
        this.players.setMoveTarget(this.selectedProfileIndex, null);
      }
    }

    console.log({
      driveMode: this.isDriveMode,
      selectedPid: this.selectedProfileIndex,
      forwardInput,
      strafeInput,
      moveInput: { x: moveInput.x, y: moveInput.y },
      commandTarget: { x: commandTarget.x, y: commandTarget.y },
      tick: this.curr.tick,
    });

    this.source.engine.command({
      type: 'move_player',
      pid: this.selectedProfileIndex,
      tx: commandTarget.x,
      ty: commandTarget.y,
      apply_tick: this.curr.tick + 1,
    });

    const playerPosition = new THREE.Vector3(controlledPlayer.x, 1.0, controlledPlayer.y);
    const cameraOffset = new THREE.Vector3(0, 8, -15);
    const orientation = Math.atan2(controlledPlayer.h[0], controlledPlayer.h[1]);
    cameraOffset.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), orientation));

    const targetPosition = new THREE.Vector3().addVectors(playerPosition, cameraOffset);
    this.sceneContext.camera.position.lerp(targetPosition, 0.1);
    this.sceneContext.controls.target.lerp(playerPosition, 0.1);
  }

  private updateCameraPosition(): void {
    const forward = new THREE.Vector3();
    this.sceneContext.camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3().crossVectors(this.sceneContext.camera.up, forward).normalize();

    if (this.keyboardState['KeyW']) {
      this.sceneContext.camera.position.addScaledVector(forward, CAMERA_MOVE_SPEED);
      this.sceneContext.controls.target.addScaledVector(forward, CAMERA_MOVE_SPEED);
    }
    if (this.keyboardState['KeyS']) {
      this.sceneContext.camera.position.addScaledVector(forward, -CAMERA_MOVE_SPEED);
      this.sceneContext.controls.target.addScaledVector(forward, -CAMERA_MOVE_SPEED);
    }
    if (this.keyboardState['KeyA']) {
      this.sceneContext.camera.position.addScaledVector(right, CAMERA_MOVE_SPEED);
      this.sceneContext.controls.target.addScaledVector(right, CAMERA_MOVE_SPEED);
    }
    if (this.keyboardState['KeyD']) {
      this.sceneContext.camera.position.addScaledVector(right, -CAMERA_MOVE_SPEED);
      this.sceneContext.controls.target.addScaledVector(right, -CAMERA_MOVE_SPEED);
    }
  }

  private bindUIEvents(): void {
    this.ui.applyPlayerCountBtn?.addEventListener('click', this.handleApplyPlayerCount);
    this.ui.applyPlayerModelBtn?.addEventListener('click', this.handleApplyPlayerModel);
    this.ui.playerModelInput?.addEventListener('keydown', this.handlePlayerModelInputKey);
    this.ui.playerProfileSelect?.addEventListener('change', this.handleProfileChange);
  }

  private bindGlobalEvents(): void {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('keydown', this.handleKeyDown, true);
    window.addEventListener('keyup', this.handleKeyUp, true);
  }

  private readonly handleResize = () => {
    const { camera, renderer } = this.sceneContext;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  private readonly handleKeyDown = (event: KeyboardEvent) => {
    if (event.target instanceof HTMLInputElement) {
      return;
    }

    this.keyboardState[event.code] = true;

    if (event.code === 'Space') {
      event.preventDefault();
      this.isPaused = !this.isPaused;
      return;
    }

    const matchedHotkey = this.debugHotkeys.find((hotkey) => {
      if (hotkey.code !== event.code) {
        return false;
      }
      if (hotkey.suppressRepeat !== false && event.repeat) {
        return false;
      }
      if (hotkey.condition && !hotkey.condition()) {
        return false;
      }
      return true;
    });

    if (matchedHotkey) {
      if (matchedHotkey.preventDefault !== false) {
        event.preventDefault();
      }
      const result = matchedHotkey.handler();
      if (result instanceof Promise) {
        void result.catch((err) => console.error('Debug hotkey failed', err));
      }
    }
  };

  private readonly handleKeyUp = (event: KeyboardEvent) => {
    this.keyboardState[event.code] = false;
  };

  private readonly handleApplyPlayerCount = () => {
    void this.restartPlayerSystem().catch(err => console.error('Failed to restart player system', err));
  };

  private readonly handleApplyPlayerModel = () => {
    const desiredUrl = this.ui.playerModelInput?.value?.trim();
    void this.restartPlayerSystem(desiredUrl).catch(err => console.error('Failed to apply player model', err));
  };

  private readonly handlePlayerModelInputKey = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const desiredUrl = this.ui.playerModelInput?.value?.trim();
      void this.restartPlayerSystem(desiredUrl).catch(err => console.error('Failed to apply player model', err));
    }
  };

  private readonly handleProfileChange = () => {
    const value = this.ui.playerProfileSelect?.value;
    if (!value) {
      return;
    }
    const idx = parseInt(value, 10);
    if (Number.isNaN(idx)) {
      return;
    }
    this.setSelectedProfileIndex(idx, false);
  };

  private async restartPlayerSystem(modelUrlOverride?: string): Promise<void> {
    await this.source.ready();

    const requestedCount = this.getRequestedPlayerCount();
    const previousUrl = this.players.getModelUrl();
    const effectiveUrl = (modelUrlOverride ?? this.currentModelUrl).trim() || DEFAULT_MODEL_URL;

    this.currentModelUrl = effectiveUrl;
    if (this.ui.playerModelInput && this.ui.playerModelInput.value !== effectiveUrl) {
      this.ui.playerModelInput.value = effectiveUrl;
    }

    this.players.destroy();

    try {
      await this.players.init(requestedCount, effectiveUrl);
    } catch (err) {
      console.error(`Failed to load player model from '${effectiveUrl}'`, err);
      if (previousUrl && previousUrl !== effectiveUrl) {
        this.currentModelUrl = previousUrl;
        if (this.ui.playerModelInput) {
          this.ui.playerModelInput.value = previousUrl;
        }
        await this.players.init(requestedCount, previousUrl);
        if (typeof window !== 'undefined' && typeof window.alert === 'function') {
          window.alert(`Failed to load model from "${effectiveUrl}". Reverting to "${previousUrl}".`);
        }
      } else {
        throw err;
      }
    }

    this.currentPlayerCount = requestedCount;
    this.updateUIMode(requestedCount);
    this.syncAiActive(requestedCount);
    this.players.setTeamColor(0, 0x1f77b4);
    this.players.setTeamColor(1, 0xd62728);

    this.ensureSelectedProfile();
    this.updatePlayerIndexMapping();
    this.renderDebugInfoPanel();
  }

  private updatePlayerIndexMapping(): void {
    if (!this.players.ready) {
      return;
    }
    this.players.resetPlayerIndexMap();
    if (this.currentPlayerCount < MAX_PLAYERS && this.selectedProfileIndex != null) {
      this.players.setPlayerIndex(0, this.selectedProfileIndex);
    }
  }

  private syncAiActive(activeCount: number): void {
    for (let i = 0; i < MAX_PLAYERS; i++) {
      this.source.engine.set_ai_active(i, i < activeCount);
    }
  }

  private ensureSelectedProfile(): void {
    if (this.selectedProfileIndex != null && this.playerProfiles[this.selectedProfileIndex]) {
      return;
    }
    if (this.playerProfiles.length) {
      this.setSelectedProfileIndex(this.playerProfiles[0].index);
    } else {
      this.setSelectedProfileIndex(null);
    }
  }

  private setSelectedProfileIndex(index: number | null, updateSelect = true): void {
    const previous = this.selectedProfileIndex;
    if (previous === index) {
      return;
    }

    if (this.isDriveMode) {
      if (previous != null) {
        this.source.engine.set_ai_active(previous, true);
      }
      if (index != null) {
        this.source.engine.set_ai_active(index, false);
      }
    }

    this.selectedProfileIndex = index;

    if (updateSelect && this.ui.playerProfileSelect) {
      this.ui.playerProfileSelect.value = index != null ? index.toString() : '';
    }
    if (previous != null) {
      this.players.setMoveTarget(previous, null);
    }
    if (index != null) {
      if (this.driveTarget) {
        const player = this.curr.players[index];
        const target2D = new THREE.Vector2(this.driveTarget.x, this.driveTarget.y);
        let dir: THREE.Vector2 | null = null;
        if (player) {
          dir = new THREE.Vector2(target2D.x - player.x, target2D.y - player.y);
          if (dir.lengthSq() > 1e-6) {
            dir.normalize();
          } else {
            dir = null;
          }
        }
        this.players.setMoveTarget(
          index,
          new THREE.Vector3(target2D.x, 0, target2D.y),
          dir ?? undefined,
        );
      } else {
        this.players.setMoveTarget(index, null);
      }
    }
    this.updatePlayerIndexMapping();
    this.renderDebugInfoPanel();
  }

  private populatePlayerProfileSelect(): void {
    const select = this.ui.playerProfileSelect;
    if (!select) {
      return;
    }
    select.innerHTML = '';
    this.playerProfiles.forEach(profile => {
      const option = document.createElement('option');
      const shirtNumber = (profile.index % 11) + 1;
      const teamLabel = profile.team === 0 ? 'Home' : 'Away';
      option.value = profile.index.toString();
      option.textContent = `${teamLabel} #${shirtNumber} — ${profile.name}`;
      select.appendChild(option);
    });
    if (this.playerProfiles.length) {
      this.setSelectedProfileIndex(this.playerProfiles[0].index);
    }
  }

  private updateUIMode(count: number): void {
    const isDebug = count < MAX_PLAYERS;
    if (this.ui.modeIndicator) {
      const suffix = count > 1 ? 's' : '';
      this.ui.modeIndicator.textContent = isDebug
        ? `Debug Mode (${count} player${suffix})`
        : 'Simulation Mode';
    }
    if (this.ui.debugControls) {
      this.ui.debugControls.style.display = isDebug ? 'block' : 'none';
    }
    if (!isDebug) {
      this.setDriveMode(false);
    }
    if (!isDebug && this.ui.debugInfoPanel) {
      this.ui.debugInfoPanel.style.display = 'none';
    }
  }

  private renderDebugInfoPanel(): void {
    const panel = this.ui.debugInfoPanel;
    if (!panel) {
      return;
    }
    if (!this.players.isMasterDebug || this.selectedProfileIndex == null) {
      panel.style.display = 'none';
      if (this.selectedProfileIndex != null) {
        this.players.setMoveTarget(this.selectedProfileIndex, null);
      }
      return;
    }

    const profile = this.playerProfiles[this.selectedProfileIndex];
    const teamLabel = profile ? (profile.team === 0 ? 'Home' : 'Away') : '';
    const footLabel = profile ? (profile.foot === 'L' ? 'Left' : 'Right') : '';

    const dynamicHotkeys = this.debugHotkeys
      .filter((hotkey) => hotkey.showInPanel !== false)
      .filter((hotkey) => !hotkey.condition || hotkey.condition())
      .map((hotkey) => ({ label: hotkey.keyLabel, description: hotkey.description }));

    const hotkeysHtml = [...this.generalDebugHotkeys, ...dynamicHotkeys]
      .map((entry) => `<div class="hotkey-line"><span class="hotkey-key">${entry.label}</span><span>${entry.description}</span></div>`)
      .join('');

    const driveTarget = this.driveTarget;

    const profileHtml = profile
      ? `
      <div class="profile-name">${profile.name}</div>
      <div class="profile-meta">${teamLabel} - Foot ${footLabel} - Weak ${profile.weak_foot}</div>
      <div class="profile-meta">Height ${profile.height_cm} cm - Weight ${profile.weight_kg} kg</div>
      <div class="profile-stats">Pace ${profile.pace} - Accel ${profile.accel} - Stamina ${profile.stamina}</div>
      <div class="profile-stats">Passing ${profile.passing} - Vision ${profile.vision} - Finishing ${profile.finishing}</div>
      <div class="profile-stats">Control Radius: ${profile.ctrl_radius.toFixed(2)}m</div>
    `
      : '<div class="profile-empty">Select a player to see profile details.</div>';

    const driveTargetHtml = driveTarget
      ? `<hr><div class="profile-meta">Drive Target: (${driveTarget.x.toFixed(2)}, ${driveTarget.y.toFixed(2)})</div>`
      : '';

    panel.innerHTML = `
      <strong>Debug Hotkeys:</strong><br>
      ${hotkeysHtml}
      <hr>
      <strong>Player Profile</strong><br>
      ${profileHtml}
      ${driveTargetHtml}
    `;
    panel.style.display = 'block';
  }

  private playerHasBall(): boolean {
    if (this.selectedProfileIndex === null) {
      return false;
    }
    const player = this.curr.players[this.selectedProfileIndex];
    return player ? player.has_ball : false;
  }

  private createDebugHotkeys(): DebugHotkey[] {
    return [
      {
        code: 'KeyM',
        keyLabel: 'M',
        description: 'Toggle Master Debug Mode',
        handler: () => this.handleMasterDebugToggle(),
        suppressRepeat: true,
      },
      {
        code: 'KeyO',
        keyLabel: 'O',
        description: 'Toggle Tactics Panel',
        handler: () => {
          this.tacticsStore?.toggle();
        },
        suppressRepeat: true,
        showInPanel: true,
      },
      {
        code: 'KeyT',
        keyLabel: 'T',
        description: 'Toggle Drive Mode',
        handler: () => this.setDriveMode(!this.isDriveMode),
        suppressRepeat: true,
        condition: () => this.currentPlayerCount < MAX_PLAYERS && this.selectedProfileIndex != null,
      },
      {
        code: 'Digit1',
        keyLabel: '1',
        description: 'Toggle Skeleton',
        handler: () => {
          this.players.toggleSkeleton();
          this.renderDebugInfoPanel();
        },
        suppressRepeat: true,
        condition: () => this.players.isMasterDebug,
      },
      {
        code: 'Digit2',
        keyLabel: '2',
        description: 'Toggle Player Model',
        handler: () => {
          this.players.togglePlayerModel();
          this.renderDebugInfoPanel();
        },
        suppressRepeat: true,
        condition: () => this.players.isMasterDebug,
      },
      {
        code: 'KeyJ',
        keyLabel: 'J',
        description: 'Queue Shoot Command',
        handler: () => {
          if (this.selectedProfileIndex === null) return;
          const tick = this.curr.tick;
          this.source.engine.command({
            apply_tick: tick + 2,
            type: 'shoot',
            pid: this.selectedProfileIndex,
            tx: 52.5,
            ty: 0.0,
            power: 1.0,
          });
        },
        suppressRepeat: true,
        condition: () => this.isDriveMode && this.playerHasBall(),
      },
      {
        code: 'KeyK',
        keyLabel: 'K',
        description: 'Queue Ground Pass Command',
        handler: () => {
          if (this.selectedProfileIndex === null) return;

          const controlledPlayer = this.curr.players[this.selectedProfileIndex];
          if (!controlledPlayer) return;

          let closestTeammate = null;
          let minDistanceSq = Infinity;

          for (let i = 0; i < this.curr.players.length; i++) {
            if (i === this.selectedProfileIndex) continue;
            const p = this.curr.players[i];
            if (p.team !== controlledPlayer.team) continue;

            const dx = p.x - controlledPlayer.x;
            const dy = p.y - controlledPlayer.y;
            const distanceSq = dx * dx + dy * dy;

            if (distanceSq < minDistanceSq) {
              minDistanceSq = distanceSq;
              closestTeammate = p;
            }
          }

          if (closestTeammate) {
            const tick = this.curr.tick;
            this.source.engine.command({
              apply_tick: tick + 2,
              type: 'ground_pass',
              pid: this.selectedProfileIndex,
              tx: closestTeammate.x,
              ty: closestTeammate.y,
            });
          }
        },
        suppressRepeat: true,
        condition: () => this.isDriveMode && this.playerHasBall(),
      },
    ];
  }

  private async handleMasterDebugToggle(): Promise<void> {
    const enteringDebug = !this.players.isMasterDebug;
    if (this.ui.playerCountInput) {
      this.ui.playerCountInput.value = enteringDebug ? '1' : MAX_PLAYERS.toString();
    }
    await this.restartPlayerSystem();
    this.players.toggleMasterDebug(enteringDebug);
    this.renderDebugInfoPanel();
  }

  private setDriveMode(enabled: boolean): void {
    if (enabled === this.isDriveMode) {
      return;
    }
    this.isDriveMode = enabled;
    this.sceneContext.controls.enabled = !enabled;
    if (enabled && this.isPaused) {
      this.isPaused = false;
    }
    this.driveTarget = null;
    if (this.selectedProfileIndex != null) {
      this.source.engine.set_ai_active(this.selectedProfileIndex, !enabled);
      this.players.setMoveTarget(this.selectedProfileIndex, null);
    }
  }

  private getRequestedPlayerCount(): number {
    const rawValue = this.ui.playerCountInput?.value ?? '1';
    const parsed = parseInt(rawValue, 10);
    if (Number.isNaN(parsed) || parsed <= 0) {
      return 1;
    }
    return Math.min(parsed, MAX_PLAYERS);
  }

  private resolveUIElements(): UIElements {
    return {
      playerCountInput: this.doc.getElementById('player-count') as HTMLInputElement | null,
      applyPlayerCountBtn: this.doc.getElementById('apply-player-count'),
      modeIndicator: this.doc.getElementById('mode-indicator') as HTMLDivElement | null,
      debugControls: this.doc.getElementById('debug-controls') as HTMLDivElement | null,
      playerModelInput: this.doc.getElementById('player-model-url') as HTMLInputElement | null,
      applyPlayerModelBtn: this.doc.getElementById('apply-player-model'),
      playerProfileSelect: this.doc.getElementById('player-profile-select') as HTMLSelectElement | null,
      debugInfoPanel: this.doc.getElementById('debug-info-panel') as HTMLDivElement | null,
    };
  }
}