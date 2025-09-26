import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { PlayerView } from "../state";

export interface PlayerInstance {
  root: THREE.Object3D;
  mixer: THREE.AnimationMixer;
  materials: THREE.MeshStandardMaterial[]; // 틴팅 대상 캐시

  // --- Debug Mode Objects ---
  debugMesh?: THREE.Mesh;
  debugText?: THREE.Sprite;
  skeletonHelper?: THREE.SkeletonHelper;
}

const modelCache = new Map<string, THREE.Object3D>();

// Helper to create a text sprite
function createActionTextSprite(text: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 128;
    canvas.height = 32;
    context.font = 'Bold 20px Arial';
    context.fillStyle = 'rgba(255, 255, 255, 0.9)';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(4, 1, 1.0);
    return sprite;
}


export async function loadPlayerModel(url = "/assets/player.glb"): Promise<THREE.Object3D> {
  if (modelCache.has(url)) {
    return modelCache.get(url)!;
  }

  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(url);

  const model = gltf.scene;
  model.traverse(o => {
    const m = o as THREE.Mesh;
    if (m.isMesh) {
      m.castShadow = true;
      m.receiveShadow = true;
      if (!(m.material instanceof THREE.MeshStandardMaterial)) {
        const newMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        (newMat as any).skinning = (m as any).isSkinnedMesh === true;
        m.material = newMat;
      }
    }
  });

  // Add BoxHelper to the template for debugging
  const boxHelper = new THREE.BoxHelper(model, 0xffff00); // Yellow box
  model.add(boxHelper);

  modelCache.set(url, model);

  return model;
}

export function spawnPlayer(template: THREE.Object3D, team: 0|1): PlayerInstance {
  const root = SkeletonUtils.clone(template);
  const mixer = new THREE.AnimationMixer(root);

  // Main model is the first child, hide helpers
  root.children.forEach((c, i) => {
      if (i > 0) c.visible = false; // Hide helpers like BoxHelper, AxesHelper
  });

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

  // --- Debug Objects ---
  const cylinderGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.8, 16); // radius, height
  const cylinderMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const debugMesh = new THREE.Mesh(cylinderGeo, cylinderMat);
  debugMesh.castShadow = true;
  debugMesh.receiveShadow = true;
  debugMesh.position.y = 1.8 / 2; // Center the cylinder
  debugMesh.visible = false;
  root.add(debugMesh);

  const debugText = createActionTextSprite("IDLE");
  debugText.position.y = 2.2; // Position above the player
  debugText.visible = false;
  root.add(debugText);

  const skeletonHelper = new THREE.SkeletonHelper(root);
  skeletonHelper.visible = false;
  root.add(skeletonHelper);

  const instance: PlayerInstance = { root, mixer, materials, debugMesh, debugText, skeletonHelper };

  // 초기 팀 컬러 (GLB 저지 및 디버그 실린더)
  setTeamColor(instance, team===0 ? 0x1f77b4 : 0xd62728);

  // 복제한 인스턴스에 포함된 모든 SkinnedMesh의 재질에 skinning=true 보장
  root.traverse((obj: any) => {
    if (obj.isSkinnedMesh) {
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((m: any) => {
        if ('skinning' in m && m.skinning !== true) m.skinning = true;
      });
    }
  });

  return instance;
}

export function setTeamColor(p: PlayerInstance, color: THREE.ColorRepresentation, emissive=0x000000) {
  // 1. 저지 색상 변경
  for (const mat of p.materials) {
    mat.color.set(color);
    mat.emissive.set(emissive);
  }
  // 2. 디버그 메쉬 색상 변경
  if (p.debugMesh) {
    (p.debugMesh.material as THREE.MeshStandardMaterial).color.set(color);
  }
}

// 뷰-기반 트랜스폼 적용 (스케일 포함)
export function applyTransform(p: PlayerInstance, view: PlayerView) {
  const y = view.vis_y ?? view.vis ?? 1.0;
  const xz = view.vis_xz ?? view.vis ?? 1.0;
  const yaw = -Math.atan2(view.h[1], view.h[0]) + Math.PI/2;

  p.root.position.set(view.x, 0, view.y);
  p.root.rotation.set(0, yaw, 0);
  p.root.scale.set(xz, y, xz); // Revert to scaling the whole root

  // Counteract root scaling for debug text sprite to maintain constant screen size
  if (p.debugText) {
      const baseSpriteScaleX = 4;
      const baseSpriteScaleY = 1;
      p.debugText.scale.set(baseSpriteScaleX / xz, baseSpriteScaleY / y, 1.0);
      
      // Position text above the scaled head height
      const headHeight = 1.8 * y;
      const textOffset = 0.4; // Desired offset in world units
      p.debugText.position.y = (headHeight + textOffset) / y; // Convert back to local space
  }
}

export function updateDebugText(p: PlayerInstance, text: string) {
    if (!p.debugText) return;

    const sprite = p.debugText;
    const canvas = (sprite.material.map as THREE.CanvasTexture).image as HTMLCanvasElement;
    const context = canvas.getContext('2d')!;

    // Clear and redraw text
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    sprite.material.map!.needsUpdate = true;
}
