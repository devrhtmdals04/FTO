
import type { Tactic } from '../models/tactic';
import { FORMATION_PRESETS, FORMATION_PRESET_VALUES } from '../presets/formationPresets';
import type { TacticsStore } from '../state/tacticsStore';

const STYLE_ELEMENT_ID = 'fto-tactics-editor-styles';
const TACTICS_EDITOR_STYLES = `
.fto-tactics-editor-panel {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.fto-tactics-editor-panel h3 {
  margin: 0;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
}

.fto-tactics-editor-panel .control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.fto-tactics-editor-panel label {
  font-size: 14px;
  font-weight: 500;
  color: #aaa;
}

.fto-tactics-editor-panel .mode-tabs {
  display: flex;
  gap: 8px;
}

.fto-tactics-editor-panel .mode-tab {
  flex: 1 1 auto;
  border: 1px solid #555;
  border-radius: 6px;
  background: #2a2a2a;
  color: #f0f0f0;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 12px;
  text-align: center;
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease;
}

.fto-tactics-editor-panel .mode-tab:hover {
  background: #333;
}

.fto-tactics-editor-panel .mode-tab.active {
  background: #3a76f7;
  border-color: #3a76f7;
  color: #fff;
}

.fto-tactics-editor-panel .field-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.fto-tactics-editor-panel input[type="text"] {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #555;
  background: #333;
  color: #f0f0f0;
  font-size: 15px;
}

.fto-tactics-editor-panel select {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #555;
  background: #333;
  color: #f0f0f0;
  font-size: 15px;
}

.fto-tactics-editor-panel .save-btn {
  border: none;
  border-radius: 6px;
  padding: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  background: #3a76f7;
  color: white;
  transition: background 150ms ease;
  margin-top: auto; /* Push save button to the bottom */
}

.fto-tactics-editor-panel .save-btn:hover {
  background: #4a85ff;
}
`;

export interface TacticsEditorOptions {
  mount: HTMLElement;
  store: TacticsStore;
  tactic: Tactic;
}

type EditorTab = 'Attacking' | 'Deffending' | 'transition';

const PHASE_LABELS: Record<EditorTab, string> = {
  Attacking: '공격',
  Deffending: '수비',
  transition: '전환',
};

const IN_POSSESSION_STYLE_OPTIONS = [
  { value: 'default', label: '기본' },
] as const;

const OUT_OF_POSSESSION_STYLE_OPTIONS = [
  { value: 'default', label: '기본' },
] as const;

const TRANSITION_STYLE_OPTIONS = [
  { value: 'press_on_heavy_touch', label: '즉시 재압박' },
  { value: 'fall_back', label: '라인 유지' },
] as const;

export class TacticsEditor {
  readonly #options: TacticsEditorOptions;
  #tactic: Tactic;
  #activeTab: EditorTab;

  constructor(options: TacticsEditorOptions) {
    this.#options = options;
    this.#tactic = options.tactic;
    this.#activeTab = this.#options.store.snapshot.editorTab;
    this.#ensureStyles();
    this.render();
  }

  #ensureStyles = (): void => {
    const doc = this.#options.mount.ownerDocument ?? document;
    if (doc.getElementById(STYLE_ELEMENT_ID)) return;
    const style = doc.createElement('style');
    style.id = STYLE_ELEMENT_ID;
    style.textContent = TACTICS_EDITOR_STYLES;
    doc.head.appendChild(style);
  };

  render = (): void => {
    const { displayMode, editorTab } = this.#options.store.snapshot;
    if (editorTab !== this.#activeTab) {
      this.#activeTab = editorTab;
    } else if (this.#activeTab !== 'transition') {
      this.#activeTab = displayMode;
    }

    const activeContent = this.#renderContent(this.#activeTab);
    const safeLabel = this.#escapeHtml(this.#tactic.label);

    this.#options.mount.innerHTML = `
      <div class="fto-tactics-editor-panel">
        <h3>${safeLabel}</h3>
        <div class="mode-tabs">
          ${this.#renderTabButton('Attacking')}
          ${this.#renderTabButton('Deffending')}
          ${this.#renderTabButton('transition')}
        </div>
        <div class="field-grid">
          ${activeContent}
        </div>
        <button class="save-btn" data-role="save">Save Tactic</button>
      </div>
    `;

    this.#attachEventListeners();
  };

  #renderTabButton = (tab: EditorTab): string => {
    const isActive = this.#activeTab === tab;
    return `<button type="button" class="mode-tab ${isActive ? 'active' : ''}" data-editor-tab="${tab}">${PHASE_LABELS[tab]}</button>`;
  };

  #renderContent = (tab: EditorTab): string => {
    if (tab === 'transition') {
      return this.#renderTransitionContent();
    }
    return this.#renderPhaseContent(tab);
  };

  #renderPhaseContent = (phase: 'Attacking' | 'Deffending'): string => {
    const target = this.#tactic[phase];
    const formationValue = this.#escapeHtml(target.formation);
    const phaseSlug = phase.toLowerCase();
    const presetSelectId = `formation-preset-select-${phaseSlug}`;
    const formationInputId = `formation-input-${phaseSlug}`;
    const styleSelectId = `style-select-${phaseSlug}`;
    const hasPreset = FORMATION_PRESET_VALUES.has(target.formation);
    const presetOptions = FORMATION_PRESETS
      .map(preset => {
        const isActive = preset.value === target.formation;
        const valueAttr = this.#escapeHtml(preset.value);
        const label = this.#escapeHtml(preset.label);
        return `<option value="${valueAttr}" ${isActive ? 'selected' : ''}>${label}</option>`;
      })
      .join('');
    const styleOptions = (phase === 'Attacking' ? IN_POSSESSION_STYLE_OPTIONS : OUT_OF_POSSESSION_STYLE_OPTIONS)
      .map(option => `<option value="${option.value}" ${option.value === target.style ? 'selected' : ''}>${this.#escapeHtml(option.label)}</option>`)
      .join('');
    const customSelected = hasPreset ? '' : 'selected';

    return `
      <div class="control-group">
        <label for="${presetSelectId}">포메이션 프리셋</label>
        <select id="${presetSelectId}" data-role="formation-select" data-phase="${phase}">
          <option value="__custom__" ${customSelected}>직접 입력</option>
          ${presetOptions}
        </select>
      </div>
      <div class="control-group">
        <label for="${formationInputId}">포메이션</label>
        <input type="text" id="${formationInputId}" data-role="formation-input" data-phase="${phase}" value="${formationValue}">
      </div>
      <div class="control-group">
        <label for="${styleSelectId}">스타일</label>
        <select id="${styleSelectId}" data-role="style-select" data-phase="${phase}">
          ${styleOptions}
        </select>
      </div>
    `;
  };

  #renderTransitionContent = (): string => {
    const { on_loss, on_win } = this.#tactic.transition;
    const lossOptions = this.#renderTransitionOptions(on_loss);
    const winOptions = this.#renderTransitionOptions(on_win);

    return `
      <div class="control-group">
        <label for="transition-loss-select">공을 잃었을 때</label>
        <select id="transition-loss-select" data-role="transition-loss">
          ${lossOptions}
        </select>
      </div>
      <div class="control-group">
        <label for="transition-win-select">공을 획득했을 때</label>
        <select id="transition-win-select" data-role="transition-win">
          ${winOptions}
        </select>
      </div>
    `;
  };

  #renderTransitionOptions = (active: string): string => {
    return TRANSITION_STYLE_OPTIONS
      .map(option => `<option value="${option.value}" ${option.value === active ? 'selected' : ''}>${this.#escapeHtml(option.label)}</option>`)
      .join('');
  };

  #attachEventListeners = (): void => {
    this.#options.mount.querySelectorAll<HTMLElement>('[data-editor-tab]').forEach(btn => {
      btn.addEventListener('click', this.#handleTabClick);
    });

    this.#options.mount.querySelectorAll<HTMLInputElement>('[data-role="formation-input"]').forEach(input => {
      input.addEventListener('change', this.#handleFormationChange);
    });

    this.#options.mount.querySelectorAll<HTMLSelectElement>('[data-role="formation-select"]').forEach(select => {
      select.addEventListener('change', this.#handleFormationPresetChange);
    });

    this.#options.mount.querySelectorAll<HTMLSelectElement>('[data-role="style-select"]').forEach(select => {
      select.addEventListener('change', this.#handleStyleChange);
    });

    this.#options.mount.querySelector('[data-role="transition-loss"]')?.addEventListener('change', this.#handleTransitionLossChange);
    this.#options.mount.querySelector('[data-role="transition-win"]')?.addEventListener('change', this.#handleTransitionWinChange);

    this.#options.mount.querySelector('[data-role="save"]')?.addEventListener('click', this.#handleSave);
  };

  #handleTabClick = (event: Event): void => {
    const target = event.currentTarget as HTMLElement | null;
    const tab = target?.dataset.editorTab as EditorTab | undefined;
    if (!tab || tab === this.#activeTab) {
      return;
    }

    this.#activeTab = tab;
    this.#options.store.setEditorTab(tab);
  };

  #handleFormationChange = (event: Event): void => {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;
    const phase = input.dataset.phase as 'Attacking' | 'Deffending' | undefined;
    if (!phase) return;

    this.#updateTactic(draft => {
      draft[phase].formation = input.value;
    });
  };

  #handleFormationPresetChange = (event: Event): void => {
    const select = event.target as HTMLSelectElement | null;
    if (!select) return;
    const phase = select.dataset.phase as 'Attacking' | 'Deffending' | undefined;
    if (!phase) return;

    const { value } = select;
    if (value === '__custom__') {
      const input = this.#options.mount.querySelector<HTMLInputElement>(`[data-role="formation-input"][data-phase="${phase}"]`);
      input?.focus();
      input?.select();
      return;
    }

    const input = this.#options.mount.querySelector<HTMLInputElement>(`[data-role="formation-input"][data-phase="${phase}"]`);
    if (input) {
      input.value = value;
    }

    this.#updateTactic(draft => {
      draft[phase].formation = value;
    });
  };

  #handleStyleChange = (event: Event): void => {
    const select = event.target as HTMLSelectElement | null;
    if (!select) return;
    const phase = select.dataset.phase as 'Attacking' | 'Deffending' | undefined;
    if (!phase) return;

    this.#updateTactic(draft => {
      draft[phase].style = select.value as Tactic['Attacking']['style'];
    });
  };

  #handleTransitionLossChange = (event: Event): void => {
    const select = event.target as HTMLSelectElement | null;
    if (!select) return;
    this.#updateTactic(draft => {
      draft.transition.on_loss = select.value as typeof draft.transition.on_loss;
    });
  };

  #handleTransitionWinChange = (event: Event): void => {
    const select = event.target as HTMLSelectElement | null;
    if (!select) return;
    this.#updateTactic(draft => {
      draft.transition.on_win = select.value as typeof draft.transition.on_win;
    });
  };

  #handleSave = (): void => {
    this.#options.store.saveTactic();
  };

  #updateTactic = (mutate: (draft: Tactic) => void): void => {
    const next = JSON.parse(JSON.stringify(this.#tactic)) as Tactic;
    mutate(next);
    this.#tactic = next;
    this.#options.store.updateActiveTactic(next);
  };

  #escapeHtml = (value: string): string => {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };
}
