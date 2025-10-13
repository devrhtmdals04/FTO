// 공격, 수비, 전환 시 스타일 정의
export type InPossessionStyle = 'default'; // 향후 '긴 패스 위주', '짧은 패스' 등 확장 가능
export type OutOfPossessionStyle = 'default'; // 향후 '강한 압박', '지역 방어' 등 확장 가능
export type TransitionStyle = 'press_on_heavy_touch' | 'fall_back';

export interface CustomFormationSlot{
  role: string;
  x: number;
  y: number;
  gridColumn?: number;
  gridRow?: number;
}

export type MarkingDirective =
  | { type: 'zonal' }
  | { type: 'man'; targetPlayerIndex: number };

export type PressTrigger = 'always' | 'near_ball' | 'on_touch';

export interface PressingDirective {
  intensity: number;
  trigger: PressTrigger;
}

export type PositioningDirective =
  | { type: 'hold_zone'; x: number; y: number }
  | { type: 'stay_wide' }
  | { type: 'cut_inside' }
  | { type: 'overlap' }
  | { type: 'underlap' };

const FORMATION_GRID_COLS = 5;
const FORMATION_GRID_ROWS = 6;

export interface PlayerDirectiveSet {
  marking?: MarkingDirective;
  pressing?: PressingDirective;
  positioning?: PositioningDirective;
}

export interface PlayerInstruction {
  playerIndex: number;
  directives: PlayerDirectiveSet;
}

export interface PlayerSelectionEntry {
  slotIndex: number;
  playerName: string;
  playerNumber?: number;
}

/**
 * 공격 시(볼 소유 시) 전술 설정
 */
export interface InPossessionTactic {
  formation: string; // 예: "3-2-4-1"
  style: InPossessionStyle;
  customFormation?: CustomFormationSlot[];
}

/**
 * 수비 시(볼 미소유 시) 전술 설정
 */
export interface OutOfPossessionTactic {
  formation: string; // 예: "4-4-2"
  style: OutOfPossessionStyle;
  customFormation?: CustomFormationSlot[];
}

/**
 * 전환 시(소유권 변경 시) 전술 설정
 */
export interface TransitionTactic {
  /**
   * 공을 뺏겼을 때의 반응
   * - press_on_heavy_touch: 즉시 재압박
   * - fall_back: 대형 유지 및 후퇴
   */
  on_loss: TransitionStyle;
  /**
   * 공을 뺏었을 때의 반응 (향후 확장용)
   * - press_on_heavy_touch: 빠른 역습
   * - fall_back: 점유율 유지
   */
  on_win: TransitionStyle;
}

/**
 * 전술 프리셋에 대한 전체 데이터 구조
 */
export interface Tactic {
  readonly id: string;
  label: string;
  Attacking: InPossessionTactic;
  Deffending: OutOfPossessionTactic;
  transition: TransitionTactic;
  playerInstructions?: PlayerInstruction[];
  playerSelection?: PlayerSelectionEntry[];
}

const makeId = () => `tactic-${Math.random().toString(36).slice(2, 10)}`;

/**
 * 새로운 빈 전술 프리셋을 생성하는 헬퍼 함수
 * @param label - 전술 이름
 * @returns Tactic 객체
 */
export const createEmptyTactic = (label = "New Tactic"): Tactic => ({
  id: makeId(),
  label,
  Attacking: {
    formation: '4-4-2',
    style: 'default',
  },
  Deffending: {
    formation: '4-4-2',
    style: 'default',
  },
  transition: {
    on_loss: 'fall_back',
    on_win: 'fall_back',
  },
  playerInstructions: [],
  playerSelection: [],
});

type LegacyPlayerSelection =
  | PlayerSelectionEntry[]
  | {
      Attacking?: PlayerSelectionEntry[];
      Deffending?: PlayerSelectionEntry[];
      attacking?: PlayerSelectionEntry[];
      deffending?: PlayerSelectionEntry[];
    };

export const normalizeTactic = (tactic: Tactic): Tactic => {
  const rawSelection = (tactic as unknown as { playerSelection?: LegacyPlayerSelection }).playerSelection;
  if (Array.isArray(rawSelection)) {
    tactic.playerSelection = rawSelection;
  } else if (rawSelection && typeof rawSelection === 'object') {
    const map = rawSelection as Exclude<LegacyPlayerSelection, PlayerSelectionEntry[]>;
    const att = map.Attacking ?? map.attacking;
    const def = map.Deffending ?? map.deffending;
    const merged = Array.isArray(att)
      ? att
      : Array.isArray(def)
        ? def
        : [];
    tactic.playerSelection = merged;
  } else if (!tactic.playerSelection) {
    tactic.playerSelection = [];
  }

  (['Attacking', 'Deffending'] as const).forEach((phase) => {
    const setup = tactic[phase];
    if (!setup?.customFormation) return;

    setup.customFormation = setup.customFormation.map((slot) => {
      const gridColumn = slot.gridColumn ?? Math.max(0, Math.min(FORMATION_GRID_COLS - 1, Math.round(slot.x * FORMATION_GRID_COLS - 0.5)));
      const gridRow = slot.gridRow ?? Math.max(0, Math.min(FORMATION_GRID_ROWS - 1, Math.round(slot.y * FORMATION_GRID_ROWS - 0.5)));
      const x = (gridColumn + 0.5) / FORMATION_GRID_COLS;
      const y = (gridRow + 0.5) / FORMATION_GRID_ROWS;

      return {
        ...slot,
        x,
        y,
        gridColumn,
        gridRow,
      };
    });
  });

  return tactic;
};
