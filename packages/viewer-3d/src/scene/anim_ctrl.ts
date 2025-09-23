import * as THREE from "three";
import { ClipSet } from "./player_glb";

export class AnimCtrl {
  mixer: THREE.AnimationMixer;
  base: { idle?: THREE.AnimationAction; walk?: THREE.AnimationAction; run?: THREE.AnimationAction; } = {};
  act:  { kickL?: THREE.AnimationAction; kickR?: THREE.AnimationAction; header?: THREE.AnimationAction; trap?: THREE.AnimationAction; tackle?: THREE.AnimationAction; } = {};
  lockUntil = 0; // ms

  constructor(root: THREE.Object3D, mixer: THREE.AnimationMixer, clips: ClipSet) {
    this.mixer = mixer;
    // Base layer
    if (clips.idle) this.base.idle = mixer.clipAction(clips.idle).setEffectiveWeight(1).play();
    if (clips.walk) this.base.walk = mixer.clipAction(clips.walk).setEffectiveWeight(0).play();
    if (clips.run)  this.base.run  = mixer.clipAction(clips.run ).setEffectiveWeight(0).play();
    // Actions (LoopOnce + clamp)
    const reg = (name: keyof ClipSet, key: keyof AnimCtrl["act"])=>{
      const c = clips[name]; if (!c) return;
      const a = mixer.clipAction(c); a.setLoop(THREE.LoopOnce, 0); a.clampWhenFinished = true; a.enabled = true; a.setEffectiveWeight(0).play();
      this.act[key] = a;
    };
    reg("kickL", "kickL"); reg("kickR","kickR"); reg("header","header"); reg("trap","trap"); reg("tackle","tackle");
  }

  // 속도기반 가중치 (Idle/Walk/Run)
  setLocomotionBySpeed(speedMps: number) {
    const s = THREE.MathUtils.clamp(speedMps, 0, 7);
    const wIdle = THREE.MathUtils.clamp(1 - s/1.6, 0, 1);
    const wWalk = THREE.MathUtils.clamp(1 - Math.abs(s-2.5)/2.0, 0, 1);
    const wRun  = THREE.MathUtils.clamp((s-3.5)/3.0, 0, 1);
    this.base.idle?.setEffectiveWeight(wIdle);
    this.base.walk?.setEffectiveWeight(wWalk);
    this.base.run ?.setEffectiveWeight(wRun );
  }

  // 액션 재생 (겹침 방지 락)
  play(name: "kickL"|"kickR"|"header"|"trap"|"tackle", lockMs=250) {
    const now = performance.now();
    if (now < this.lockUntil) return;

    // Kick 카테고리 상호 배타
    if (name === "kickL" || name === "kickR") {
      this.fadeOutIfPlaying(this.act.kickL);
      this.fadeOutIfPlaying(this.act.kickR);
    }
    const a = this.act[name]; if (!a) return;
    a.reset(); a.setEffectiveTimeScale(1);
    a.fadeIn(0.08); a.play();
    // 자동 fadeOut
    const handler = (e:any)=>{ if (e.action===a){ a.fadeOut(0.08); this.mixer.removeEventListener("finished", handler);} };
    this.mixer.addEventListener("finished", handler);
    this.lockUntil = now + lockMs;
  }

  private fadeOutIfPlaying(a?: THREE.AnimationAction) {
    if (!a) return;
    if (a.getEffectiveWeight() > 0.01) a.fadeOut(0.05);
  }
}
