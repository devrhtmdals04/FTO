export type EngineTrapSide = 'left' | 'right' | 'center' | 'auto';
export type EngineCounterPress = 'none' | 'contain' | 'hunt';
export type EngineCounterAttack = 'secure' | 'balanced' | 'fast';

export type EngineTacticStateKey =
  | 'buildUp'
  | 'progression'
  | 'creation'
  | 'highBlock'
  | 'midBlock'
  | 'lowBlock'
  | 'attackToDefense'
  | 'defenseToAttack'
  | 'setPlayAttack'
  | 'setPlayDefense';

export const ENGINE_STATE_KEYS: readonly EngineTacticStateKey[] = [
  'buildUp',
  'progression',
  'creation',
  'highBlock',
  'midBlock',
  'lowBlock',
  'attackToDefense',
  'defenseToAttack',
  'setPlayAttack',
  'setPlayDefense',
] as const;

export interface EngineStateParams {
  line_att?: number;
  line_height?: number;
  block_def?: number;
  team_width?: number;
  width?: number;
  compact_v?: number;
  compact_h?: number;
  press_intensity?: number;
  press_int?: number;
  tempo?: number;
  direct?: number;
  risk?: number;
  support_d?: number;
  gk_build?: number;
  trap_side?: EngineTrapSide;
  counterpress?: EngineCounterPress;
  counterattack?: EngineCounterAttack;
  rest_def_shape?: string;
  build_up?: number;
  counter_press?: number;
  long_ball_bias?: number;
  overlap_fullbacks?: number;
  compactness?: number;
  // Set-piece specific additions
  box_runs?: number;
  second_phase_ready?: boolean;
  marking?: 'zonal' | 'man' | 'zonal+2man';
  blocker_on_keeper?: boolean;
}

export interface EngineStateProfile {
  params: EngineStateParams;
  guidelines: string[];
}

export type EngineStatePresetMap = Record<EngineTacticStateKey, EngineStateProfile>;

const deepClone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const DEFAULT_ENGINE_STATE_PRESETS: EngineStatePresetMap = {
  buildUp: {
    params: {
      line_att: 0.25,
      width: 0.8,
      compact_v: 18,
      compact_h: 0.35,
      tempo: 0.55,
      direct: 0.3,
      risk: 0.35,
      support_d: 10,
      gk_build: 0.9,
      press_int: 0.1,
      trap_side: 'auto',
      counterpress: 'contain',
      counterattack: 'secure',
      rest_def_shape: '2-3',
    },
    guidelines: [
      'GK 참여로 CB split(자연 발생), 6번 단차 확보.',
      '1선 압박 유도 시 풀백/6번의 각도 있는 지원(8~12 m) 유지.',
      '중앙 위험 시 리사이클 우선(tempo↑ 없이 width로 탈압박).',
    ],
  },
  progression: {
    params: {
      line_att: 0.45,
      width: 0.75,
      compact_v: 16,
      compact_h: 0.4,
      tempo: 0.65,
      direct: 0.55,
      risk: 0.5,
      support_d: 11,
      gk_build: 0.4,
      press_int: 0.2,
      trap_side: 'auto',
      counterpress: 'contain',
      counterattack: 'balanced',
      rest_def_shape: '2-3',
    },
    guidelines: [
      '하프스페이스 우선: 8번/10번의 내부-외부 언더·오버랩 빈도 중간.',
      '스위치 플레이 가중치↑ (반대쪽 윙 페널티에어리어 에지까지 도달).',
    ],
  },
  creation: {
    params: {
      line_att: 0.7,
      width: 0.7,
      compact_v: 14,
      compact_h: 0.45,
      tempo: 0.72,
      direct: 0.7,
      risk: 0.65,
      support_d: 9,
      gk_build: 0.1,
      press_int: 0.25,
      trap_side: 'auto',
      counterpress: 'hunt',
      counterattack: 'fast',
      rest_def_shape: '3-2',
    },
    guidelines: [
      '박스 점유 4인 목표(ST+윙+역삼각 10번). 컷백/로우크로스 선호.',
      '리스크↑ 허용하되 잔여 3-2로 역습 차단(풀백 동시 전진 금지).',
    ],
  },
  highBlock: {
    params: {
      block_def: 0.75,
      width: 0.8,
      compact_v: 16,
      compact_h: 0.35,
      press_int: 0.85,
      trap_side: 'right',
      tempo: 0.4,
      direct: 0.35,
      risk: 0.3,
      support_d: 10,
      counterpress: 'hunt',
      counterattack: 'fast',
    },
    guidelines: [
      '트리거: GK→CB 패스, 백패스, 터치 미스 즉시 점프.',
      '터치라인 트랩: 윙/풀백이 측면 그물 형성, 반대쪽 6/8은 커버.',
    ],
  },
  midBlock: {
    params: {
      block_def: 0.55,
      width: 0.7,
      compact_v: 14,
      compact_h: 0.45,
      press_int: 0.55,
      trap_side: 'center',
      tempo: 0.38,
      direct: 0.4,
      risk: 0.3,
      support_d: 11,
      counterpress: 'contain',
      counterattack: 'balanced',
    },
    guidelines: [
      '중앙 압축 + 측면 유도(센터 트랩): 패스 각도 차단·커버 섀도.',
      '10번은 앵커 스크린, 윙은 풀백 높이에 맞춘 반프레스.',
    ],
  },
  lowBlock: {
    params: {
      block_def: 0.35,
      width: 0.6,
      compact_v: 12,
      compact_h: 0.55,
      press_int: 0.3,
      trap_side: 'center',
      tempo: 0.32,
      direct: 0.28,
      risk: 0.2,
      support_d: 12,
      counterpress: 'none',
      counterattack: 'fast',
    },
    guidelines: [
      '박스 수비 우선: 5레인 밀집, 크로스 차단 후 세컨볼 클리어.',
      '탈압박은 직선 역습(ST 타깃, 윙 침투), 풀백은 하프라인 이하 유지.',
    ],
  },
  attackToDefense: {
    params: {
      press_int: 0.7,
      trap_side: 'center',
      compact_v: 14,
      compact_h: 0.5,
      counterpress: 'hunt',
      support_d: 9,
    },
    guidelines: [
      '잃은 지점 반경 12 m 내 3인 압박(볼 캐리어+근접 옵션 2인 차단).',
      '6/CB는 즉시 골문 보호 삼각형 복구(세로 간격 12–14 m).',
    ],
  },
  defenseToAttack: {
    params: {
      tempo: 0.8,
      direct: 0.75,
      risk: 0.55,
      width: 0.8,
      counterattack: 'fast',
      support_d: 11,
      rest_def_shape: '2-3',
    },
    guidelines: [
      '첫 2패스 규칙: 전방/측면 우선, 반대 윙 스프린트 채널 개방.',
      '전개 실패 시 3패스 이내 안정 전환(Progression으로 복귀).',
    ],
  },
  setPlayAttack: {
    params: {
      risk: 0.65,
      tempo: 0.55,
      box_runs: 5,
      second_phase_ready: true,
      rest_def_shape: '3-2',
    },
    guidelines: [
      '코너: 근-원 궤적 혼합 + 세컨페이즈 탑 오브 박스 점유.',
      '프리킥 간접: 오프사이드 라인 타이밍에 맞춘 커브/컷백 패턴.',
    ],
  },
  setPlayDefense: {
    params: {
      compact_v: 10,
      compact_h: 0.6,
      line_att: 0.15,
      marking: 'zonal+2man',
      blocker_on_keeper: false,
      counterattack: 'balanced',
    },
    guidelines: [
      '혼합 마킹: 6야드 존 3인+키커 쪽 근포스트 1인, 2인은 타겟맨 추적.',
      '걷어낸 뒤 세컨볼 8/10번 회수 루트 마련(측면으로 탈압박).',
    ],
  },
};

export const createDefaultEngineStatePresets = (): EngineStatePresetMap => deepClone(DEFAULT_ENGINE_STATE_PRESETS);

export const normalizeEngineStatePresets = (raw: unknown): EngineStatePresetMap => {
  const base = createDefaultEngineStatePresets();
  if (!raw || typeof raw !== 'object') {
    return base;
  }

  for (const key of ENGINE_STATE_KEYS) {
    const entry = (raw as Record<string, unknown>)[key];
    if (!entry || typeof entry !== 'object') continue;

    const paramsRaw = (entry as { params?: unknown }).params;
    if (paramsRaw && typeof paramsRaw === 'object') {
      const merged: EngineStateParams = { ...base[key].params };
      for (const [paramKey, value] of Object.entries(paramsRaw as Record<string, unknown>)) {
        if (value === undefined || value === null) continue;
        if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
          (merged as Record<string, unknown>)[paramKey] = value;
        }
      }
      base[key].params = merged;
    }

    const guidelinesRaw = (entry as { guidelines?: unknown }).guidelines;
    if (Array.isArray(guidelinesRaw)) {
      const cleaned = guidelinesRaw
        .map(line => {
          if (typeof line === 'string') return line.trim();
          return String(line);
        })
        .filter(line => line.length > 0);
      if (cleaned.length > 0) {
        base[key].guidelines = cleaned;
      }
    }
  }

  return base;
};
