import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { PlayerView } from "../state";

export interface ClipSet {
  idle?: THREE.AnimationClip;
  walk?: THREE.AnimationClip;
  run?: THREE.AnimationClip;
  kickL?: THREE.AnimationClip;
  kickR?: THREE.AnimationClip;
  header?: THREE.AnimationClip;
  trap?: THREE.AnimationClip;
  tackle?: THREE.AnimationClip;
}

export interface PlayerInstance {
  root: THREE.Object3D;
  mixer: THREE.AnimationMixer;
  clips: ClipSet;
  materials: THREE.MeshStandardMaterial[]; // 틴팅 대상 캐시
}

export async function loadPlayerTemplate(url="/assets/player_alt.glb") {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(url);

  const template = gltf.scene;
  template.traverse(o=>{
    const m = o as THREE.Mesh;
    if (m.isMesh) {
      m.castShadow = true; m.receiveShadow = true;
      // glTF 기본이 PBR이므로 MeshStandardMaterial 기대
      if (!(m.material instanceof THREE.MeshStandardMaterial)) {
        const newMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        (newMat as any).skinning = (m as any).isSkinnedMesh === true;
        m.material = newMat;
      }
    } 
  });

  // Add BoxHelper to the template for debugging
  const boxHelper = new THREE.BoxHelper(template, 0xffff00); // Yellow box
  template.add(boxHelper);

  // 클립 이름 매핑
  const clips: ClipSet = {};
  for (const c of gltf.animations || []) {
    const n = c.name.toLowerCase();
    if      (n.includes("idle"))   clips.idle   = c;
    else if (n.includes("walk"))   clips.walk   = c;
    else if (n.includes("run"))    clips.run    = c;
    else if (n.includes("kick_l")) clips.kickL  = c;
    else if (n.includes("kick_r")) clips.kickR  = c;
    else if (n.includes("header")) clips.header = c;
    else if (n.includes("trap"))   clips.trap   = c;
    else if (n.includes("tackle")) clips.tackle = c;
  }
  return { template, clips };
}

export function spawnPlayer(template: THREE.Object3D, clips: ClipSet, team: 0|1): PlayerInstance {
  const root = template.clone(true);
  const mixer = new THREE.AnimationMixer(root);

  // Add AxesHelper for debugging
  const axesHelper = new THREE.AxesHelper(5); // Size 5 for visibility
  root.add(axesHelper);

  console.log(`Spawned player root:`, root); // Re-add this log

  // 틴팅 대상(상의/저지로 추정되는 메쉬) — 이름 규칙은 파일에 맞춰 보정 가능
  const materials: THREE.MeshStandardMaterial[] = [];
  root.traverse(o=>{
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    const name = (m.name||"").toLowerCase();
    if (name.includes("jersey") || name.includes("shirt") || name.includes("body") || name.includes("torso")) {
      const mm = (m.material as THREE.MeshStandardMaterial).clone(); // 개별 인스턴스 색
      m.material = mm;
      materials.push(mm);
    }
  });

  // 기본 포즈: idle (없으면 walk/run 중 하나)
  const base = clips.idle ?? clips.walk ?? clips.run;
  if (base) mixer.clipAction(base).setEffectiveWeight(1).play();

  // 초기 팀 컬러
  setTeamColor({ materials } as PlayerInstance, team===0 ? 0x1f77b4 : 0xd62728);

  return { root, mixer, clips, materials };
}

export function setTeamColor(p: PlayerInstance, color: THREE.ColorRepresentation, emissive=0x000000) {
  for (const mat of p.materials) {
    mat.color.set(color);
    mat.emissive.set(emissive);
  }
}

// 뷰-기반 트랜스폼 적용 (스케일 포함)
export function applyTransform(p: PlayerInstance, view: PlayerView) {
  const y = view.vis_y ?? view.vis ?? 1.0;
  const xz = view.vis_xz ?? view.vis ?? 1.0;
  const yaw = Math.atan2(view.h[1], view.h[0]) - Math.PI/2;

  p.root.position.set(view.x, 0, view.y);
  p.root.rotation.set(0, yaw, 0);
  p.root.scale.set(xz, y, xz);

  //console.log(`Player ${p.root.name || p.root.uuid} position: (${view.x}, ${view.y})`); // Add this line
}
