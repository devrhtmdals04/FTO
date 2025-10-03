import type { EngineBridge, TacticSummary } from '../api/types';
import { Tactic, createEmptyTactic } from '../models/tactic';
import { PRESET_TACTICS } from '../presets';

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

  /**
   * 패널을 열고, 활성화된 전술이 없으면 첫번째 또는 새 전술을 활성화합니다.
   * 이미 열려있으면 닫습니다.
   */
  openAndEnsureTactic = async (): Promise<void> => {
    if (this.#state.isOpen) {
      this.close();
      return;
    }

    this.#update({ isLoading: true, isOpen: true });

    // 전술 목록이 비어있으면 로드합니다.
    let currentTactics = this.#state.tactics;
    if (currentTactics.length === 0) {
      currentTactics = await this.#fetchTacticsSummaries();
      this.#update({ tactics: currentTactics });
    }

    let tacticToSelect = this.#state.activeTactic;

    if (!tacticToSelect) {
      if (currentTactics.length > 0) {
        // 활성 전술이 없으면 목록의 첫 번째 전술을 선택합니다.
        const firstTacticId = currentTactics[0].id;
        tacticToSelect = await this.#loadTacticWithFallback(firstTacticId);
      } else {
        // 전술이 하나도 없으면 새로 생성합니다.
        tacticToSelect = createEmptyTactic('Default Tactic');
        await this.#bridge.saveTactic(tacticToSelect);
        const refreshed = await this.#fetchTacticsSummaries();
        currentTactics = refreshed;
        this.#update({ tactics: refreshed });
      }
    }

    this.#update({ activeTactic: tacticToSelect, isLoading: false });
  };

  // --- 데이터 관리 액션 ---

  /** 전술 목록을 비동기적으로 불러옵니다. */
  loadTactics = async (): Promise<void> => {
    this.#update({ isLoading: true });
    const fetched = await this.#fetchTacticsSummaries();
    const active = this.#state.activeTactic ? this.#toSummary(this.#state.activeTactic) : null;

    const merged = active
      ? [active, ...fetched.filter(t => t.id !== active.id)]
      : fetched;

    this.#update({ tactics: merged, isLoading: false });

    const activeId = active?.id ?? null;
    const hasActive = !!activeId && merged.some(t => t.id === activeId);

    if (!hasActive) {
      if (merged.length > 0) {
        await this.selectTactic(merged[0].id);
      } else {
        this.#update({ activeTactic: null });
      }
    }
  };

  /** 특정 전술을 활성화하여 편집 대상으로 설정합니다. */
  selectTactic = async (id: string | null): Promise<void> => {
    if (id === null) {
      this.#update({ activeTactic: null });
      return;
    }
    if (id === this.#state.activeTactic?.id) return;

    this.#update({ isLoading: true });
    const tactic = await this.#loadTacticWithFallback(id);
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

  /** 새 전술을 직접 활성화합니다. 저장되기 전 임시 편집용으로 사용합니다. */
  setActiveTactic = (tactic: Tactic | null): void => {
    if (tactic === null) {
      this.#update({ activeTactic: null });
      return;
    }

    const cloned = JSON.parse(JSON.stringify(tactic)) as Tactic;
    const summary = this.#toSummary(cloned);
    const others = this.#state.tactics.filter(t => t.id !== summary.id);
    const tactics = [summary, ...others];

    this.#update({ activeTactic: cloned, tactics });
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

    const summary = this.#toSummary(newActiveTactic);
    const others = this.#state.tactics.filter(t => t.id !== summary.id);
    const tactics = [summary, ...others];

    this.#update({ activeTactic: newActiveTactic, tactics });
  };

  #fetchTacticsSummaries = async (): Promise<TacticSummary[]> => {
    const fromBridge = await this.#bridge.listTactics();
    if (fromBridge.length > 0) {
      return fromBridge;
    }
    return this.#getPresetSummaries();
  };

  #loadTacticWithFallback = async (id: string): Promise<Tactic | null> => {
    const tactic = await this.#bridge.loadTactic(id);
    if (tactic) return tactic;
    return this.#findPresetById(id);
  };

  // --- 내부 상태 업데이트 헬퍼 ---
  #update(patch: Partial<TacticsState>): void {
    const next = { ...this.#state, ...patch } satisfies TacticsState;
    this.#state = next;
    this.#listeners.forEach((listener) => listener(next));
  }

  #toSummary(tactic: Tactic): TacticSummary {
    return {
      id: tactic.id,
      label: tactic.label,
      in_possession_formation: tactic.in_possession.formation,
      out_of_possession_formation: tactic.out_of_possession.formation,
    };
  }

  #getPresetSummaries(): TacticSummary[] {
    return Object.values(PRESET_TACTICS).map(t => this.#toSummary(t));
  }

  #findPresetById(id: string): Tactic | null {
    return Object.values(PRESET_TACTICS).find(t => t.id === id) ?? null;
  }
}
