import { createEmptyTactic, Tactic } from '../models/tactic';
import type { TacticsStore, TacticsState } from '../state/tacticsStore';
import { PitchDisplay } from './PitchDisplay';

const STYLE_ELEMENT_ID = 'fto-tactics-panel-styles';
const TACTICS_PANEL_STYLES = `
[data-tactics-root] {
  position: fixed;
  top: 72px;
  right: 12px;
  z-index: 1200;
  pointer-events: none;
}

[data-tactics-root]:empty {
  display: none;
}

[data-tactics-root] .fto-tactics-panel {
  width: 360px;
  max-height: 70vh;
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 12px;
  padding: 16px;
  border-radius: 10px;
  background: rgba(12, 12, 12, 0.92);
  color: #f5f5f5;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);
  font-size: 14px;
  pointer-events: auto;
  overflow: hidden;
}

[data-tactics-root] .fto-tactics-panel > .close-btn {
  grid-column: 1 / -1;
  justify-self: end;
  border: none;
  background: transparent;
  color: inherit;
  font-size: 20px;
  cursor: pointer;
  line-height: 1;
}

[data-tactics-root] .fto-tactics-panel .list-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  min-height: 0;
}

[data-tactics-root] .fto-tactics-panel .list-section h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

[data-tactics-root] .fto-tactics-panel .list-section ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
}

[data-tactics-root] .fto-tactics-panel .tactic-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.12);
  cursor: pointer;
  transition: background 120ms ease;
}

[data-tactics-root] .fto-tactics-panel .tactic-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

[data-tactics-root] .fto-tactics-panel .tactic-item.active {
  outline: 2px solid rgba(88, 166, 255, 0.6);
}

[data-tactics-root] .fto-tactics-panel .tactic-item span {
  flex: 1 1 auto;
}

[data-tactics-root] .fto-tactics-panel .delete-btn {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
}

[data-tactics-root] .fto-tactics-panel .create-btn {
  align-self: flex-start;
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  cursor: pointer;
  background: rgba(88, 166, 255, 0.25);
  color: inherit;
  font-size: 14px;
  transition: background 120ms ease;
}

[data-tactics-root] .fto-tactics-panel .create-btn:hover {
  background: rgba(88, 166, 255, 0.35);
}

[data-tactics-root] .fto-tactics-panel .details-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
}

[data-tactics-root] .fto-tactics-panel .details-section h3 {
  margin: 0;
}

[data-tactics-root] .fto-tactics-panel .tactic-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

[data-tactics-root] .fto-tactics-panel .grid-span-2 {
  grid-column: span 2;
}

[data-tactics-root] .fto-tactics-panel label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
}

[data-tactics-root] .fto-tactics-panel input,
[data-tactics-root] .fto-tactics-panel select {
  width: 100%;
  border-radius: 6px;
  border: none;
  padding: 8px;
  font-size: 14px;
}

[data-tactics-root] .fto-tactics-panel .save-btn {
  align-self: flex-start;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  background: rgba(88, 166, 255, 0.35);
  color: inherit;
  cursor: pointer;
  font-size: 14px;
  transition: background 120ms ease;
  margin-top: 8px;
}

[data-tactics-root] .fto-tactics-panel .save-btn:hover {
  background: rgba(88, 166, 255, 0.45);
}

[data-tactics-root] .fto-tactics-panel .placeholder,
[data-tactics-root] .fto-tactics-panel .loader {
  border-radius: 6px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  font-size: 13px;
}

[data-tactics-root] .tab-nav {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

[data-tactics-root] .tab-btn {
  border: none;
  background: transparent;
  color: #a0a0a0;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  border-bottom: 2px solid transparent;
  transition: all 120ms ease;
}

[data-tactics-root] .tab-btn:hover {
  color: #f5f5f5;
}

[data-tactics-root] .tab-btn.active {
  color: #f5f5f5;
  font-weight: 600;
  border-bottom-color: rgba(88, 166, 255, 0.8);
}

[data-tactics-root] .tab-content {
  padding: 12px 4px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

[data-tactics-root] .pitch-container {
  background: #222;
  border-radius: 6px;
  padding: 8px;
  margin-bottom: 8px;
}
`;

export interface TacticsSettingsRootOptions {
  mount: HTMLElement;
  store: TacticsStore;
}

/**
 * 전술 설정 UI를 렌더링하고 상호작용을 처리하는 메인 클래스
 */
export class TacticsSettingsRoot {
  readonly #mount: HTMLElement;
  readonly #store: TacticsStore;
  readonly #unsubscribe: () => void;

  #activeDetailsTab: 'defense' | 'offense' | 'transition' = 'defense';
  #lastRenderedTacticId: string | null = null;

  constructor({ mount, store }: TacticsSettingsRootOptions) {
    this.#mount = mount;
    this.#store = store;

    this.#mount.dataset.tacticsRoot = 'true';
    this.#ensureStyles();

    // 스토어의 상태가 변경될 때마다 render 함수를 호출하도록 구독합니다.
    this.#unsubscribe = this.#store.subscribe(this.render);
    // 초기 데이터 로드
    this.#store.loadTactics();
  }

  /** 컴포넌트 파괴 시 이벤트 리스너를 정리합니다. */
  destroy = (): void => {
    this.#unsubscribe();
    this.#mount.innerHTML = '';
  };

  #ensureStyles = (): void => {
    const doc = this.#mount.ownerDocument ?? document;
    if (doc.getElementById(STYLE_ELEMENT_ID)) {
      return;
    }
    const style = doc.createElement('style');
    style.id = STYLE_ELEMENT_ID;
    style.textContent = TACTICS_PANEL_STYLES;
    doc.head.appendChild(style);
  };

  /** UI를 렌더링하는 메인 함수 */
  render = (state: TacticsState): void => {
    const { isOpen, tactics, activeTactic, isLoading } = state;

    if (activeTactic?.id !== this.#lastRenderedTacticId) {
      this.#activeDetailsTab = 'defense'; // 다른 전술 선택 시 탭 초기화
    }
    this.#lastRenderedTacticId = activeTactic?.id ?? null;

    // 패널이 닫혀있으면 아무것도 그리지 않습니다.
    if (!isOpen) {
      this.#mount.innerHTML = '';
      return;
    }

    // 전체 UI 구조를 innerHTML로 설정합니다.
    this.#mount.innerHTML = `
      <div class="tactics-panel fto-tactics-panel">
        <button class="close-btn">×</button>
        <div class="list-section">
          <h3>Tactics</h3>
          <ul>
            ${tactics.map(t => `
              <li class="tactic-item ${t.id === activeTactic?.id ? 'active' : ''}" data-id="${t.id}" data-label="${t.label}">
                <span>${t.label}</span>
                <button class="delete-btn" data-label="${t.label}">🗑️</button>
              </li>
            `).join('')}
          </ul>
          <button class="create-btn">+ New Tactic</button>
        </div>
        <div class="details-section">
          ${isLoading ? '<div class="loader">Loading...</div>' : ''}
          ${activeTactic ? this.#renderDetails(activeTactic) : '<div class="placeholder">Select or create a tactic.</div>'}
        </div>
      </div>
    `;

    // DOM이 생성된 후 이벤트 리스너와 하위 컴포넌트를 마운트합니다.
    this.#attachEventListeners();
    this.#mountSubComponents(state);
  };

  /** 전술 상세 편집 UI를 탭 구조로 렌더링합니다. */
  #renderDetails = (tactic: Tactic): string => {
    const tabContent = {
      defense: `
        <h4>Out of Possession (수비 시)</h4>
        <div class="pitch-container" data-mode="out_of_possession"></div>
        <label>Formation: <input type="text" name="out_of_possession.formation" value="${tactic.out_of_possession.formation}" /></label>
      `,
      offense: `
        <h4>In Possession (공격 시)</h4>
        <div class="pitch-container" data-mode="in_possession"></div>
        <label>Formation: <input type="text" name="in_possession.formation" value="${tactic.in_possession.formation}" /></label>
      `,
      transition: `
        <h4>Transition (공 뺏겼을 때)</h4>
        <label>On Loss:
          <select name="transition.on_loss">
            <option value="fall_back" ${tactic.transition.on_loss === 'fall_back' ? 'selected' : ''}>대형 유지 (Fall Back)</option>
            <option value="press_on_heavy_touch" ${tactic.transition.on_loss === 'press_on_heavy_touch' ? 'selected' : ''}>즉시 압박 (Press)</option>
          </select>
        </label>
      `,
    };

    return `
      <h3><input type="text" name="label" value="${tactic.label}" class="tactic-label-input"/></h3>
      <div class="tactic-details-tabs">
        <div class="tab-nav">
            <button class="tab-btn ${this.#activeDetailsTab === 'defense' ? 'active' : ''}" data-tab="defense">수비</button>
            <button class="tab-btn ${this.#activeDetailsTab === 'offense' ? 'active' : ''}" data-tab="offense">공격</button>
            <button class="tab-btn ${this.#activeDetailsTab === 'transition' ? 'active' : ''}" data-tab="transition">전환</button>
        </div>
        <div class="tab-content">
            ${tabContent[this.#activeDetailsTab]}
        </div>
      </div>
      <button class="save-btn">Save Changes</button>
    `;
  };

  #mountSubComponents = (state: TacticsState): void => {
    if (!state.activeTactic) return;

    const pitchContainer = this.#mount.querySelector<HTMLElement>('.pitch-container');
    if (pitchContainer) {
      const mode = pitchContainer.dataset.mode as 'in_possession' | 'out_of_possession' | undefined;
      if (mode) {
        new PitchDisplay({
          mount: pitchContainer,
          tactic: state.activeTactic,
          mode: mode,
        });
      }
    }
  };

  /** 생성된 DOM 요소에 이벤트 리스너를 연결합니다. */
  #attachEventListeners = (): void => {
    this.#mount.querySelector('.close-btn')?.addEventListener('click', this.#store.close);
    this.#mount.querySelector('.create-btn')?.addEventListener('click', this.#handleCreate);
    this.#mount.querySelector('.save-btn')?.addEventListener('click', this.#handleSave);

    this.#mount.querySelectorAll('.tactic-item').forEach(el => {
      el.addEventListener('click', () => this.#store.selectTactic((el as HTMLElement).dataset.id!));
    });

    this.#mount.querySelectorAll('.delete-btn').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        this.#handleDelete((el as HTMLElement).dataset.label!);
      });
    });

    this.#mount.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('change', this.#handleInputChange);
    });

    this.#mount.querySelectorAll('.tab-btn').forEach(el => {
      el.addEventListener('click', (e) => {
        const tab = (e.currentTarget as HTMLElement).dataset.tab;
        if (tab === 'defense' || tab === 'offense' || tab === 'transition') {
          this.#handleTabChange(tab);
        }
      });
    });
  };

  #handleCreate = () => {
    const label = prompt('New tactic name:');
    if (label) {
      const newTactic = createEmptyTactic(label);
      // 에디터에서 즉시 편집할 수 있도록 활성 전술로 설정하지만 아직 저장하지 않습니다.
      this.#store.setActiveTactic(newTactic);
    }
  };

  #handleSave = async () => {
    const tacticToSave = this.#store.snapshot.activeTactic;
    if (!tacticToSave) {
      alert('No active tactic to save.');
      return;
    }

    try {
      const response = await fetch('/api/save-preset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tacticToSave),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save preset: ${errorText}`);
      }

      // Reload tactics from source to reflect the change
      await this.#store.loadTactics();
      alert(`Tactic '${tacticToSave.label}' saved successfully!`);
    } catch (error) {
      console.error('Error saving tactic:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  #handleDelete = async (label: string) => {
    if (!label || !confirm(`Are you sure you want to delete the '${label}' preset?`)) {
      return;
    }

    try {
      const response = await fetch('/api/delete-preset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete preset: ${errorText}`);
      }

      await this.#store.loadTactics();
    } catch (error) {
      console.error('Error deleting tactic:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  #handleTabChange = (tab: 'defense' | 'offense' | 'transition') => {
    this.#activeDetailsTab = tab;
    this.render(this.#store.snapshot); // 새 탭을 활성화하여 다시 렌더링
  };

  /** 입력 필드 변경 시 스토어의 상태를 업데이트합니다. */
  #handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const path = target.name;
    const value = target.value;

    const activeTactic = this.#store.snapshot.activeTactic;
    if (!activeTactic) return;

    // 상태 불변성을 위해 깊은 복사를 합니다.
    const newTactic = JSON.parse(JSON.stringify(activeTactic));

    // 'a.b' 같은 경로를 해석하여 값을 설정합니다.
    let current = newTactic;
    const keys = path.split('.');
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;

    // 전체 Tactic 객체를 스토어에 업데이트합니다.
    this.#store.updateActiveTactic(newTactic);
  };
}
