import type { EngineBridge, TacticSummary } from '../api/types';
import { Tactic, createEmptyTactic } from '../models/tactic';

/**
 * 스토어의 상태를 정의하는 인터페이스
 */
export interface TacticsState {
  readonly tactics: readonly TacticSummary[]; // 전술 요약 목록
  readonly activeTactic: Tactic | null; // 현재 활성화/편집 중인 전술의 전체 데이터
  readonly isLoading: boolean; // 데이터 로딩 중 상태
  readonly isOpen: boolean; // UI 패널 열림 상태
}

export type TacticsStoreListener = (state: TacticsState) => void;

const initialState: TacticsState = {
  tactics: [],
  activeTactic: null,
  isLoading: false,
  isOpen: false,
};

/**
 * 전술 데이터 관리 및 UI 상태를 총괄하는 스토어 클래스
 */
export class TacticsStore {
  #state: TacticsState = initialState;
  #listeners = new Set<TacticsStoreListener>();
  #bridge: EngineBridge;

  constructor(bridge: EngineBridge) {
    this.#bridge = bridge;
  }

  get snapshot(): TacticsState {
    return this.#state;
  }

  subscribe(listener: TacticsStoreListener): () => void {
    this.#listeners.add(listener);
    listener(this.#state);
    return () => {
      this.#listeners.delete(listener);
    };
  }

  // --- UI 상태 액션 ---
  open = () => this.#update({ isOpen: true });
  close = () => this.#update({ isOpen: false });
  toggle = () => this.#update({ isOpen: !this.#state.isOpen });

  // --- 데이터 관리 액션 ---

  /** 전술 목록을 비동기적으로 불러옵니다. */
  loadTactics = async (): Promise<void> => {
    this.#update({ isLoading: true });
    const tactics = await this.#bridge.listTactics();
    this.#update({ tactics, isLoading: false });
  };

  /** 특정 전술을 활성화하여 편집 대상으로 설정합니다. */
  selectTactic = async (id: string | null): Promise<void> => {
    if (id === null) {
      this.#update({ activeTactic: null });
      return;
    }
    if (id === this.#state.activeTactic?.id) return;

    this.#update({ isLoading: true });
    const tactic = await this.#bridge.loadTactic(id);
    this.#update({ activeTactic: tactic, isLoading: false });
  };

  /** 현재 활성화된 전술을 저장합니다. */
  saveTactic = async (): Promise<void> => {
    if (!this.#state.activeTactic) return;

    this.#update({ isLoading: true });
    await this.#bridge.saveTactic(this.#state.activeTactic);
    // 목록을 새로고침하여 변경사항(예: 이름)을 반영합니다.
    await this.loadTactics();
  };

  /** 새로운 전술을 생성하고 즉시 활성화합니다. */
  createTactic = async (label: string): Promise<void> => {
    this.#update({ isLoading: true });
    const newTactic = createEmptyTactic(label);
    await this.#bridge.saveTactic(newTactic);
    await this.loadTactics();
    await this.selectTactic(newTactic.id);
  };

  /** 특정 전술을 삭제합니다. */
  deleteTactic = async (id: string): Promise<void> => {
    this.#update({ isLoading: true });
    await this.#bridge.deleteTactic(id);
    // 삭제된 전술이 현재 활성 전술이었다면, 활성 전술을 비웁니다.
    if (this.#state.activeTactic?.id === id) {
      this.#update({ activeTactic: null });
    }
    await this.loadTactics();
  };

  /**
   * UI에서 편집 중인 활성 전술의 내용을 업데이트합니다. (저장 전 임시 변경)
   * @param patch 변경할 Tactic 데이터의 일부
   */
  updateActiveTactic = (patch: Partial<Tactic>): void => {
    if (!this.#state.activeTactic) return;

    // 복잡한 객체의 깊은 복사를 통해 상태 불변성을 유지합니다.
    const newActiveTactic = JSON.parse(JSON.stringify(this.#state.activeTactic));
    Object.assign(newActiveTactic, patch);

    this.#update({ activeTactic: newActiveTactic });
  };

  // --- 내부 상태 업데이트 헬퍼 ---
  #update(patch: Partial<TacticsState>): void {
    const next = { ...this.#state, ...patch } satisfies TacticsState;
    this.#state = next;
    this.#listeners.forEach((listener) => listener(next));
  }
}