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
  targetMarker?: THREE.Object3D;
  controlRadiusCircle?: THREE.Mesh;
  perceptionRadiusCircle?: THREE.Line; // 시야 범위 원 추가
  commitAura?: THREE.Mesh;
  focusAura?: THREE.Mesh;
}

const modelCache = new Map<string, THREE.Object3D>();

// Helper to create a text sprite
function createActionTextSprite(): THREE.Sprite {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 256;
    canvas.height = 128;
    context.font = 'Bold 20px Arial';
    context.fillStyle = 'rgba(255, 255, 255, 0.9)';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(8, 4, 1.0);
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

  const debugText = createActionTextSprite();
  debugText.position.y = 2.2; // Position above the player
  debugText.visible = false;
  root.add(debugText);

  const skeletonHelper = new THREE.SkeletonHelper(root);
  skeletonHelper.visible = false;
  root.add(skeletonHelper);

  const circleGeo = new THREE.CircleGeometry(1, 32);
  circleGeo.rotateX(-Math.PI / 2);
  const circleMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.3 });
  const controlRadiusCircle = new THREE.Mesh(circleGeo, circleMat);
  controlRadiusCircle.visible = false;
  root.add(controlRadiusCircle);

  const auraInnerRadius = 0.45;
  const auraOuterRadius = 0.7;
  const auraGeo = new THREE.RingGeometry(auraInnerRadius, auraOuterRadius, 48);
  auraGeo.rotateX(-Math.PI / 2);
  const auraMat = new THREE.MeshBasicMaterial({
    color: 0x74c0fc,
    transparent: true,
    opacity: 0.0,
    side: THREE.DoubleSide,
    depthWrite: false,
    depthTest: false,
  });
  const commitAura = new THREE.Mesh(auraGeo, auraMat);
  commitAura.visible = false;
  commitAura.position.y = 0.02;
  root.add(commitAura);

  const focusInnerRadius = 0.35;
  const focusOuterRadius = 0.6;
  const focusGeo = new THREE.RingGeometry(focusInnerRadius, focusOuterRadius, 48);
  focusGeo.rotateX(-Math.PI / 2);
  const focusMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.0,
    side: THREE.DoubleSide,
    depthWrite: false,
    depthTest: false,
  });
  const focusAura = new THREE.Mesh(focusGeo, focusMat);
  focusAura.visible = false;
  focusAura.position.y = 0.021;
  root.add(focusAura);

  // Create vertices for a circle outline in a more robust way
  const points = [];
  const divisions = 64;
  for (let i = 0; i <= divisions; i++) {
      const angle = (i / divisions) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)));
  }
  const perceptionCircleGeo = new THREE.BufferGeometry().setFromPoints(points);

  const perceptionCircleMat = new THREE.LineBasicMaterial({ color: 0x8888ff, transparent: true, opacity: 0.5 });
  const perceptionRadiusCircle = new THREE.LineLoop(perceptionCircleGeo, perceptionCircleMat);
  perceptionRadiusCircle.visible = false;
  root.add(perceptionRadiusCircle);

  const instance: PlayerInstance = {
    root,
    mixer,
    materials,
    debugMesh,
    debugText,
    skeletonHelper,
    targetMarker: undefined,
    controlRadiusCircle,
    perceptionRadiusCircle, // 인스턴스에 추가
    commitAura,
    focusAura,
  };

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
      const baseSpriteScaleX = 8;
      const baseSpriteScaleY = 4;
      p.debugText.scale.set(baseSpriteScaleX / xz, baseSpriteScaleY / y, 1.0);
      
      // Position text above the scaled head height
      const headHeight = 1.8 * y;
      const textOffset = 0.4; // Desired offset in world units
      p.debugText.position.y = (headHeight + textOffset) / y; // Convert back to local space
  }
}

export function updateDebugText(p: PlayerInstance, lines: string[]) {
    if (!p.debugText) return;

    const sprite = p.debugText;
    const canvas = (sprite.material.map as THREE.CanvasTexture).image as HTMLCanvasElement;
    const context = canvas.getContext('2d')!;
    const lineHeight = 28;
    const padding = 4;

    // Clear and redraw text
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = 'Bold 24px Arial';
    context.fillStyle = 'rgba(255, 255, 255, 0.95)';
    context.textAlign = 'center';

    lines.forEach((line, index) => {
        context.fillText(line, canvas.width / 2, padding + (index * lineHeight));
    });

    sprite.material.map!.needsUpdate = true;
}

export function disposePlayer(p: PlayerInstance) {
  if (p.mixer) {
    p.mixer.stopAllAction();
    p.mixer.uncacheRoot(p.root);
  }

  p.root.traverse(object => {
    const mesh = object as THREE.Mesh;
    if (mesh.isMesh) {
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }
      const material = mesh.material as any;
      if (Array.isArray(material)) {
        material.forEach(mat => {
          if (mat.map) mat.map.dispose();
          mat.dispose();
        });
      } else if (material) {
        if (material.map) material.map.dispose();
        material.dispose();
      }
    }
  });
}
