import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { PlayerView, AnimEvent } from "../state";
import { loadPlayerModel, spawnPlayer, setTeamColor, applyTransform, PlayerInstance, updateDebugText } from "./player_glb";
import { loadAndAttachClips } from "./anim-binder";

// --- Animation Configuration ---
const animationConfig = {
  clipUrls: {
    Idle: "/assets/idle.glb",
    Run: "/assets/run.glb",
    Walk: "/assets/jog.glb", 
    KickR: "/assets/kick_r.glb",
  },
  eventMap: {
    KickL: { name: 'KickR', lockMs: 250 },
    KickR: { name: 'KickR', lockMs: 250 },
    Header: { name: 'Header', lockMs: 300 },
    Trap: { name: 'Trap', lockMs: 200 },
    Tackle: { name: 'Tackle', lockMs: 350 },
  },
  locomotionMap: {
    idle: 'Idle',
    walk: 'Walk',
    run: 'Run',
  }
};

export class PlayerSystem {
  group = new THREE.Group();
  ready = false;
  
  // Debug states
  isMasterDebug = false;
  private skeletonVisible = false;
  private playerModelVisible = true;
  private modelUrl: string = "/assets/player.glb";

  inst: PlayerInstance[] = [];
  ctrl: Record<string, THREE.AnimationAction>[] = [];

  private lockUntil: number[] = [];
  private isPlayerMoving: boolean[] = [];
  private playerIndexMap: number[] = [];

  destroy() {
    for (const p of this.inst) {
      this.group.remove(p.root);
    }
    this.inst = [];
    this.ctrl = [];
    this.lockUntil = [];
    this.isPlayerMoving = [];
    this.playerIndexMap = [];
    this.ready = false;
  }

  async init(playerCount: number = 22, modelUrl?: string) {
    console.log(`PlayerSystem.init() called with playerCount: ${playerCount}`);

    const resolvedModelUrl = modelUrl ?? this.modelUrl;
    this.modelUrl = resolvedModelUrl;

    const template = await loadPlayerModel(resolvedModelUrl);
    const loader = new GLTFLoader();

    this.lockUntil = new Array(playerCount).fill(0);
    this.isPlayerMoving = new Array(playerCount).fill(false);
    this.playerIndexMap = Array.from({ length: playerCount }, (_, i) => i);

    for (let i = 0; i < playerCount; i++) {
      const p = spawnPlayer(template, i < 11 ? 0 : 1);
      
      const actions = await loadAndAttachClips({
        loader,
        mixer: p.mixer,
        model: p.root,
        clipSources: animationConfig.clipUrls,
      });

      const { idle, walk, run } = animationConfig.locomotionMap;
      if (actions[idle]) actions[idle].setEffectiveWeight(1).play();
      if (actions[walk]) actions[walk].setEffectiveWeight(0).play();
      if (actions[run]) actions[run].setEffectiveWeight(0).play();

      Object.values(animationConfig.eventMap).forEach(eventInfo => {
        const action = actions[eventInfo.name];
        if (action) {
            action.setLoop(THREE.LoopOnce, 0);
            action.clampWhenFinished = true;
            action.enabled = true;
            action.setEffectiveWeight(0);
            action.play();
        }
      });

      this.inst.push(p);
      this.ctrl.push(actions);
      this.group.add(p.root);
    }
    this.ready = true;
  }

  getModelUrl(): string {
    return this.modelUrl;
  }

  setTeamColor(team: 0 | 1, color: THREE.ColorRepresentation) {
    for (let i = 0; i < 11; i++) {
      const idx = team === 0 ? i : 11 + i;
      if (this.inst[idx]) {
        setTeamColor(this.inst[idx], color);
      }
    }
  }

  // --- Debugging Methods ---

  toggleMasterDebug(force?: boolean): boolean {
    this.isMasterDebug = force ?? !this.isMasterDebug;
    console.log(`[Debug] Master Debug Mode: ${this.isMasterDebug}`);

    for (const p of this.inst) {
      if (p.debugText) p.debugText.visible = this.isMasterDebug;
    }

    if (!this.isMasterDebug) {
      this.toggleSkeleton(false);
      this.togglePlayerModel(true);
    }
    
    return this.isMasterDebug;
  }

  toggleSkeleton(force?: boolean) {
    this.skeletonVisible = force ?? !this.skeletonVisible;
    console.log(`[Debug] Skeletons visible: ${this.skeletonVisible}`);
    for (const p of this.inst) {
      if (p.skeletonHelper) {
        p.skeletonHelper.visible = this.skeletonVisible;
      }
    }
  }

  togglePlayerModel(force?: boolean) {
    this.playerModelVisible = force ?? !this.playerModelVisible;
    console.log(`[Debug] Player model visible: ${this.playerModelVisible}`);
    for (const p of this.inst) {
      const model = p.root.children[0];
      if (model) {
        model.visible = this.playerModelVisible;
      }
    }
  }

  update(view: PlayerView[], dt: number) {
    if (!this.ready) return;
    for (let i = 0; i < this.inst.length; i++) {
      const mappedIdx = this.playerIndexMap[i] ?? i;
      const v = view[mappedIdx];
      const p = this.inst[i];
      const actions = this.ctrl[i];
      if (!v || !p || !actions) continue;

      applyTransform(p, v);

      const speed = v.speed ?? 0;

      // --- Locomotion Blending ---
      const s = THREE.MathUtils.clamp(speed, 0, 7);
      const { idle, walk, run } = animationConfig.locomotionMap;

      const transitionStart = 1.0;
      const transitionEnd = 4.0;
      const wRun = THREE.MathUtils.smoothstep(s, transitionStart, transitionEnd);
      const wIdle = 1.0 - wRun;

      if (actions[idle]) actions[idle].setEffectiveWeight(wIdle);
      if (actions[run]) actions[run].setEffectiveWeight(wRun);
      if (actions[walk]) actions[walk].setEffectiveWeight(0); // Ensure walk is disabled

      if (this.isMasterDebug) {
        if (i === 0) {
            console.log(`[Debug] P${mappedIdx}: speed=${speed.toFixed(2)}, wIdle=${wIdle.toFixed(2)}, wRun=${wRun.toFixed(2)}`);
        }
        const actionName = this.getCurrentActionName(i);
        updateDebugText(p, actionName);
      }

      p.mixer.update(dt);
    }
  }

  setPlayerIndex(slot: number, playerIndex: number) {
    if (!Number.isInteger(slot) || slot < 0 || slot >= this.playerIndexMap.length) return;
    if (!Number.isInteger(playerIndex)) return;
    this.playerIndexMap[slot] = playerIndex;
  }

  resetPlayerIndexMap() {
    this.playerIndexMap = Array.from({ length: this.inst.length }, (_, i) => i);
  }

  applyEvents(events: AnimEvent[]) {
    if (!this.ready || !events) return;
    for (const e of events) {
      const eventInfo = animationConfig.eventMap[e.kind as keyof typeof animationConfig.eventMap];
      if (eventInfo) {
        this.playOneShot(e.pid, eventInfo.name, eventInfo.lockMs);
      }
    }
  }

  private playOneShot(pid: number, name: string, lockMs: number) {
    const now = performance.now();
    if (now < this.lockUntil[pid]) return;

    const actions = this.ctrl[pid];
    const action = actions[name];
    if (!action) return;

    if (name === 'KickL' || name === 'KickR') {
        const kickLAction = actions[animationConfig.eventMap.KickL.name];
        const kickRAction = actions[animationConfig.eventMap.KickR.name];
        if (kickLAction && kickLAction.getEffectiveWeight() > 0.01) kickLAction.fadeOut(0.05);
        if (kickRAction && kickRAction.getEffectiveWeight() > 0.01) kickRAction.fadeOut(0.05);
    }

    action.reset();
    action.setEffectiveTimeScale(1);
    action.fadeIn(0.08).play();
    this.lockUntil[pid] = now + lockMs;

    const mixer = this.inst[pid].mixer;
    const handler = (e: any) => {
        if (e.action === action) {
            action.fadeOut(0.08);
            mixer.removeEventListener("finished", handler);
        }
    };
    mixer.addEventListener("finished", handler);
  }

  private getCurrentActionName(pid: number): string {
    const actions = this.ctrl[pid];
    if (!actions) return 'UNKNOWN';

    for (const eventInfo of Object.values(animationConfig.eventMap)) {
        const action = actions[eventInfo.name];
        if (action && action.isRunning() && action.getEffectiveWeight() > 0.5) {
            return eventInfo.name.toUpperCase();
        }
    }

    let maxWeight = 0;
    let currentLocoAction = 'IDLE';
    const { idle, walk, run } = animationConfig.locomotionMap;

    const idleAction = actions[idle];
    if (idleAction) {
        const idleWeight = idleAction.getEffectiveWeight();
        if (idleWeight > maxWeight) {
            maxWeight = idleWeight;
            currentLocoAction = idle.toUpperCase();
        }
    }
    const walkAction = actions[walk];
    if (walkAction) {
        const walkWeight = walkAction.getEffectiveWeight();
        if (walkWeight > maxWeight) {
            maxWeight = walkWeight;
            currentLocoAction = walk.toUpperCase();
        }
    }
    const runAction = actions[run];
    if (runAction) {
        const runWeight = runAction.getEffectiveWeight();
        if (runWeight > maxWeight) {
            currentLocoAction = run.toUpperCase();
        }
    }
    
    return currentLocoAction;
  }

  setFarLOD(enabled: boolean) {
    this.group.visible = !enabled;
  }
}
