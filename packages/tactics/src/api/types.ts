import type { Tactic } from '../models/tactic';

/**
 * 전술 목록에 표시될 요약 정보
 */
export interface TacticSummary {
  readonly id: string;
  label: string;
  // 공격/수비 포메이션을 함께 표시하여 한눈에 파악하도록 함
  in_possession_formation: string;
  out_of_possession_formation: string;
}

/**
 * 엔진과 통신하기 위한 인터페이스 (계약서)
 */
export interface EngineBridge {
  /**
   * 저장된 모든 전술의 요약 목록을 불러옵니다.
   */
  listTactics(): Promise<TacticSummary[]>;

  /**
   * ID를 이용해 특정 전술의 상세 정보 전체를 불러옵니다.
   * @param id 불러올 전술의 ID
   */
  loadTactic(id: string): Promise<Tactic | null>;

  /**
   * 전술 객체 전체를 저장합니다. (생성 및 업데이트용)
   * @param tactic 저장할 Tactic 객체
   */
  saveTactic(tactic: Tactic): Promise<void>;

  /**
   * ID를 이용해 특정 전술을 삭제합니다.
   * @param id 삭제할 전술의 ID
   */
  deleteTactic(id: string): Promise<void>;
}