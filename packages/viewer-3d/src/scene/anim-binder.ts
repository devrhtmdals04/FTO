// 런타임에 base 모델 + 분리된 애니 GLB들을 합쳐서 actions로 붙여주는 유틸
import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

// --- Bone Name Normalization & Remapping ---

function normalizeKey(name: string): string {
  // Strip prefixes, then strip numbers, then clean up to a pure bone name
  return name
    .replace(/^(mixamorig:?)/i, '') // Strip mixamorig prefix first
    .replace(/\d+/g, '')           // Then, strip all digits
    .replace(/[^a-z]/gi, '')      // Finally, remove all non-alphabetic chars
    .toLowerCase();
}

function buildBoneMap(model: THREE.Object3D): Map<string, string> {
  const map = new Map<string, string>(); // normKey -> actual bone name
  model.traverse((o: any) => {
    if (o.isBone && o.name) {
      map.set(normalizeKey(o.name), o.name);
    }
  });
  //console.log('[anim-binder-debug] Built bone map:', JSON.stringify(Array.from(map.entries())));
  return map;
}

function remapClipTrackTargets(clip: THREE.AnimationClip, model: THREE.Object3D): THREE.AnimationClip {
  const boneMap = buildBoneMap(model);
  const tracks = clip.tracks.map((t) => {
    // 트랙명 예: "5Hips.quaternion", "mixamorig:Spine1.position"
    const m = /^([^.]*)\.(.*)$/.exec(t.name);
    if (!m) return t;
    const [, rawNode, path] = m;
    const key = normalizeKey(rawNode);
    const actual = boneMap.get(key);
    //console.log(`[anim-binder-debug] Remapping: raw='${rawNode}', norm='${key}', found='${actual}'`);
    if (!actual || actual === rawNode) return t;

    // 동일 타입 새 Track으로 교체 (three는 변경 불가라 새 인스턴스 필요)
    const ctor = (t as any).constructor;
    const remapped = new ctor(`${actual}.${path}`, (t as any).times, (t as any).values);
    (remapped as any).interpolation = (t as any).interpolation;
    return remapped;
  });

  return new THREE.AnimationClip(clip.name, clip.duration, tracks);
}

// --- Animation Clip Processing ---

export function sanitizeInPlace(clip: THREE.AnimationClip, opt: { removeRootPos?: boolean, rootName?: string } = {}): THREE.AnimationClip {
  if (!clip?.tracks || !opt.removeRootPos) return clip;
  const rootName = opt.rootName || 'Hips'; // 필요시 외부에서 hips 본 이름 주입
  const patt = new RegExp(`^${rootName.replace(/[.*+?^${}()|[\\\]]/g, '\$&')}\.position$`);
  const tracks = clip.tracks.filter(t => !patt.test(t.name));
  return new THREE.AnimationClip(clip.name, clip.duration, tracks);
}

export function quickSkeletonCheck(model: THREE.Object3D, clip: THREE.AnimationClip): void {
  const sample = clip.tracks
    .map(t => t.name.split('.')[0])
    .filter((n, i, a) => a.indexOf(n) === i)
    .slice(0, 6);

  const missing = sample.filter(boneName => !model.getObjectByName(boneName));
  if (missing.length) {
    console.warn('[anim-binder] skeleton name mismatch, missing bones:', JSON.stringify(missing));
  }
}

// --- Main Loader Function ---

type PolicyMode = 'inplace' | 'locomotion' | 'raw';

interface LoadAndAttachClipsParams {
    loader: GLTFLoader;
    mixer: THREE.AnimationMixer;
    model: THREE.Object3D;
    clipSources: Record<string, string> | string[];
    policy?: (name: string) => PolicyMode;
}

export async function loadAndAttachClips({ loader, mixer, model, clipSources, policy }: LoadAndAttachClipsParams): Promise<Record<string, THREE.AnimationAction>> {
  const entries = Array.isArray(clipSources)
    ? clipSources.map((url): [string, string] => [guessName(url), url])
    : Object.entries(clipSources);

  const actions: Record<string, THREE.AnimationAction> = {};
  for (const [name, url] of entries) {
    const gltf: GLTF = await new Promise((res, rej) => loader.load(url, res, undefined, rej));
    if (!gltf.animations?.length) {
      console.warn(`[anim-binder] ${name}: animations not found in`, url);
      continue;
    }
    
    let clip = gltf.animations[0].clone();
    clip.name = name;

    // ➊ 트랙 타깃을 모델 본 이름으로 리맵
    clip = remapClipTrackTargets(clip, model);

    // ➋ 정책에 따라 루트 Pos 제거(in-place)
    const mode = policy ? policy(name) : defaultPolicy(name);
    if (mode === 'inplace') clip = sanitizeInPlace(clip, { removeRootPos: true });

    // ➌ 경고는 리맵 후 재검사
    quickSkeletonCheck(model, clip);

    const action = mixer.clipAction(clip);
    if (name === 'Idle') action.play();
    actions[name] = action;
  }
  return actions;
}

function guessName(url: string): string {
  const f = url.split('?')[0].split('/').pop() || '';
  return f.replace(/\.(glb|gltf)$/i, '').toLowerCase()
          .replace(/[_-]/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase());
}

function defaultPolicy(name: string): PolicyMode {
  const n = name.toLowerCase();
  if (/(run|jog|walk|sprint)/.test(n)) return 'locomotion';
  if (/(kick|shoot|pass|tackle|header|celebrat|idle|turn|look|wave)/.test(n)) return 'inplace';
  return 'raw';
}