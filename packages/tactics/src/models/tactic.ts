// 공격, 수비, 전환 시 스타일 정의
export type InPossessionStyle = 'default'; // 향후 '긴 패스 위주', '짧은 패스' 등 확장 가능
export type OutOfPossessionStyle = 'default'; // 향후 '강한 압박', '지역 방어' 등 확장 가능
export type TransitionStyle = 'press_on_heavy_touch' | 'fall_back';

/**
 * 공격 시(볼 소유 시) 전술 설정
 */
export interface InPossessionTactic {
  formation: string; // 예: "3-2-4-1"
  style: InPossessionStyle;
}

/**
 * 수비 시(볼 미소유 시) 전술 설정
 */
export interface OutOfPossessionTactic {
  formation: string; // 예: "4-4-2"
  style: OutOfPossessionStyle;
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
  in_possession: InPossessionTactic;
  out_of_possession: OutOfPossessionTactic;
  transition: TransitionTactic;
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
  in_possession: {
    formation: '4-4-2',
    style: 'default',
  },
  out_of_possession: {
    formation: '4-4-2',
    style: 'default',
  },
  transition: {
    on_loss: 'fall_back',
    on_win: 'fall_back',
  },
});