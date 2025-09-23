export type TeamId = 0 | 1;

export interface PlayerView {
  x: number;  // meters
  y: number;  // meters
  h: [number, number]; // heading unit vector (hx, hy)
  vis: number; // vis_scale from PlayerParams (1.0 ~)
  team: TeamId;
}

export interface BallView {
  x: number; y: number; z: number; // meters
}

export interface SimView {
  tick: number;           // engine tick (20Hz)
  ball: BallView;
  players: PlayerView[];  // length 22
}

// ---- (임시) mock ticker: 엔진 연결 전 데모용 ----
export function mockSimSource(): () => SimView {
  const N = 22;
  const players: PlayerView[] = Array.from({length: N}, (_,i)=>(
    {
      x: (i < 11 ? -20 : 20) + (i % 5) * 8 - 16,
      y: (i % 11) * 6 - 30,
      h: [i < 11 ? 1 : -1, 0],
      vis: 1.0,
      team: (i < 11 ? 0 : 1) as TeamId
    }
  ));
  let t = 0;
  return () => {
    t++;
    const ball: BallView = { x: Math.sin(t*0.04)*25, y: Math.cos(t*0.04)*20, z: Math.max(0, Math.sin(t*0.08)*2) };
    // 간단 이동
    players.forEach((p,k)=>{
        p.x += p.h[0] * 0.05 * Math.sin(t*0.01 + k);
        p.y += p.h[1] * 0.05 * Math.sin(t*0.01 + k);
        const angle = t*0.01 + k;
        p.h = [Math.cos(angle), Math.sin(angle)];
    });
    return { tick: t, ball, players };
  };
}