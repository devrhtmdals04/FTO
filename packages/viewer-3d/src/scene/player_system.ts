import * as THREE from "three";
import { PlayerView, AnimEvent } from "../state";
import { loadPlayerTemplate, spawnPlayer, setTeamColor, applyTransform, PlayerInstance } from "./player_glb";
import { AnimCtrl } from "./anim_ctrl";

export class PlayerSystem {
  group = new THREE.Group();
  ready = false;

  inst: PlayerInstance[] = [];
  ctrl: AnimCtrl[] = [];
  prev = new Array(22).fill(null).map(()=>new THREE.Vector2());
  curr = new Array(22).fill(null).map(()=>new THREE.Vector2());

  async init() {
    const { template, clips } = await loadPlayerTemplate("/assets/player.glb");
    for (let i=0;i<22;i++){
      const p = spawnPlayer(template, clips, i<11 ? 0 : 1);
      this.inst.push(p);
      this.ctrl.push(new AnimCtrl(p.root, p.mixer, p.clips));
      this.group.add(p.root);
    }
    this.ready = true;
  }

  setTeamColor(team: 0|1, color: THREE.ColorRepresentation) {
    for (let i=0;i<11;i++){
      const idx = team===0 ? i : 11+i;
      setTeamColor(this.inst[idx], color);
    }
  }

  // view: 보간된 PlayerView[], dt: 초
  update(view: PlayerView[], dt: number) {
    if (!this.ready) return;
    for (let i=0;i<22;i++){
      const v = view[i]; const p = this.inst[i]; const c = this.ctrl[i];
      // 트랜스폼/스케일 적용
      applyTransform(p, v);

      // 속도 추정 (간단 차분)
      const pp = this.prev[i], cp = this.curr[i];
      pp.copy(cp); cp.set(v.x, v.y);
      const speed = (pp.x===0 && pp.y===0) ? 0 : cp.distanceTo(pp) / Math.max(dt, 1e-6);
      c.setLocomotionBySpeed(speed);

      p.mixer.update(dt);
    }
  }

  // 엔진 애니 힌트 이벤트 처리 (옵션)
  applyEvents(events: AnimEvent[]) {
    if (!this.ready || !events) return;
    for (const e of events) {
      const ctrl = this.ctrl[e.pid]; if (!ctrl) continue;
      if (e.kind==="KickL") ctrl.play("kickL", 250);
      else if (e.kind==="KickR") ctrl.play("kickR", 250);
      else if (e.kind==="Header") ctrl.play("header", 300);
      else if (e.kind==="Trap")   ctrl.play("trap",   200);
      else if (e.kind==="Tackle") ctrl.play("tackle", 350);
    }
  }

  // LOD: 멀면 가시성 축소 (필요시 캡슐 인스턴스와 토글)
  setFarLOD(enabled: boolean) {
    this.group.visible = !enabled;
  }
}
