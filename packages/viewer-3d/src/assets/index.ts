import playerModelUrl from './player.glb?url';
import idleClipUrl from './idle.glb?url';
import runClipUrl from './run.glb?url';
import jogClipUrl from './jog.glb?url';
import kickRClipUrl from './kick_r.glb?url';

export const PLAYER_MODEL_URL: string = playerModelUrl;

export const DEFAULT_CLIP_URLS: Record<string, string> = {
  Idle: idleClipUrl,
  Run: runClipUrl,
  Walk: jogClipUrl,
  KickR: kickRClipUrl,
};
