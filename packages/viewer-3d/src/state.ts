export type TeamId = 0 | 1;

export interface PlayerView {
  x: number;  // meters
  y: number;  // meters
  h: [number, number]; // heading unit vector (hx, hy)
  vis: number; // vis_scale from PlayerParams (1.0 ~)
  team: TeamId;
  speed?: number; // Calculated speed from simulation
  // --- 확장(옵션) ---
  vis_y?: number;             // 키 스케일 (없으면 vis 사용)
  vis_xz?: number;            // 몸통 폭 스케일 (없으면 vis 사용)
}

export interface BallView {
  x: number; y: number; z: number; // meters
}

export interface SimView {
  tick: number;           // engine tick (20Hz)
  ball: BallView;
  players: PlayerView[];  // length 22
}

// (옵션) 엔진 애니 힌트 이벤트 ABI (엔진 미지원이면 사용 안 함)
export type AnimEventKind = "KickL"|"KickR"|"Header"|"Trap"|"Tackle";
export interface AnimEvent { tick: number; pid: number; kind: AnimEventKind; a?: number; b?: number; }