
import type { PlayerInstruction, Tactic } from '../models/tactic';
import { FORMATION_PRESETS, FORMATION_PRESET_VALUES } from '../presets/formationPresets';
import { computeRoleLabelsForPhase } from '../utils/roleLabels';
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

.fto-tactics-editor-panel .selection-summary {
  border: 1px solid #444;
  border-radius: 6px;
  padding: 10px 12px;
  background: #222;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.fto-tactics-editor-panel .selection-summary__title {
  font-size: 14px;
  font-weight: 600;
}

.fto-tactics-editor-panel .selection-summary__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.fto-tactics-editor-panel .selection-summary__item {
  font-size: 13px;
  color: #ddd;
  display: flex;
  justify-content: space-between;
}

.fto-tactics-editor-panel .selection-summary__fallback {
  font-size: 13px;
  color: #888;
}

.fto-tactics-editor-panel .directives-section {
  border: 1px solid #444;
  border-radius: 6px;
  padding: 12px;
  background: #1f1f1f;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.directives-section__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
}

.directives-section__rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.directives-row {
  border: 1px solid #333;
  border-radius: 6px;
  padding: 8px;
  background: #272727;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
}

.directives-row label {
  font-size: 12px;
  color: #bbb;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.directives-row input,
.directives-row select {
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #444;
  background: #1c1c1c;
  color: #f0f0f0;
  font-size: 13px;
}

.directives-row__actions {
  display: flex;
  align-items: flex-end;
}

.directives-row__remove {
  border: 1px solid #555;
  background: rgba(220, 20, 60, 0.2);
  color: #ff8080;
  border-radius: 4px;
  padding: 6px 8px;
  cursor: pointer;
  font-size: 12px;
}

.directives-section__add {
  align-self: flex-end;
  border: 1px solid #4a8bff;
  background: rgba(74, 139, 255, 0.2);
  color: #b9d6ff;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 12px;
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
    const directivesContent = this.#renderDirectivesSection();
    const safeLabel = this.#escapeHtml(this.#tactic.label);

    this.#options.mount.innerHTML = `
      <div class="fto-tactics-editor-panel">
        <h3>${safeLabel}</h3>
        <div class="mode-tabs">
          ${this.#renderTabButton('Deffending')}
          ${this.#renderTabButton('transition')}
          ${this.#renderTabButton('Attacking')}
        </div>
        <div class="field-grid">
          ${activeContent}
          ${directivesContent}
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
    const selectionSummary = this.#renderSelectionSummary(phase);

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
      ${selectionSummary}
    `;
  };

  #getSlotLabelMap = (phase: 'Attacking' | 'Deffending'): Map<number, string> => {
    const data = this.#tactic[phase];
    return computeRoleLabelsForPhase(data.formation, data.customFormation);
  };

  #renderSelectionSummary = (phase: 'Attacking' | 'Deffending'): string => {
    const raw = this.#tactic.playerSelection;
    const selection = Array.isArray(raw) ? raw : [];
    if (selection.length === 0) {
      return `
        <div class="selection-summary">
          <div class="selection-summary__title">선발 선수</div>
          <div class="selection-summary__fallback">배치된 선수가 없습니다. 전술판에서 선수를 배치해주세요.</div>
        </div>
      `;
    }

    const labelMap = this.#getSlotLabelMap(phase);
    const items = selection
      .slice()
      .sort((a, b) => a.slotIndex - b.slotIndex)
      .map(entry => {
        const name = this.#escapeHtml(entry.playerName);
        const number = entry.playerNumber != null ? `#${entry.playerNumber}` : '-';
        const label = labelMap.get(entry.slotIndex) ?? `${entry.slotIndex + 1}번 슬롯`;
        return `<li class="selection-summary__item"><span>${label}</span><span>${number} ${name}</span></li>`;
      })
      .join('');

    return `
      <div class="selection-summary">
        <div class="selection-summary__title">선발 선수</div>
        <ul class="selection-summary__list">${items}</ul>
      </div>
    `;
  };

  #renderDirectivesSection = (): string => {
    const entries = this.#tactic.playerInstructions ?? [];
    if (entries.length === 0) {
      return `
        <div class="directives-section">
          <div class="directives-section__header">
            <span>개인 지침</span>
            <button class="directives-section__add" type="button" data-role="directive-add">+ 추가</button>
          </div>
          <div class="selection-summary__fallback">등록된 개인 지침이 없습니다.</div>
        </div>
      `;
    }

    const rows = entries
      .map((entry, index) => this.#renderDirectiveRow(entry, index))
      .join('');

    return `
      <div class="directives-section">
        <div class="directives-section__header">
          <span>개인 지침</span>
          <button class="directives-section__add" type="button" data-role="directive-add">+ 추가</button>
        </div>
        <div class="directives-section__rows">
          ${rows}
        </div>
      </div>
    `;
  };

  #renderDirectiveRow = (entry: PlayerInstruction, index: number): string => {
    const markingType = entry.directives.marking?.type ?? '';
    const markingTarget = entry.directives.marking?.type === 'man'
      ? entry.directives.marking.targetPlayerIndex
      : '';

    const pressingMode = entry.directives.pressing ? 'custom' : 'none';
    const pressingIntensity = entry.directives.pressing?.intensity ?? 0.5;
    const pressingTrigger = entry.directives.pressing?.trigger ?? 'always';

    const positioningType = entry.directives.positioning?.type ?? '';
    const positioningX = entry.directives.positioning?.type === 'hold_zone'
      ? entry.directives.positioning.x
      : 0.5;
    const positioningY = entry.directives.positioning?.type === 'hold_zone'
      ? entry.directives.positioning.y
      : 0.5;

    return `
      <div class="directives-row" data-directive-index="${index}">
        <label>
          선수 인덱스
          <input type="number" min="0" max="21" value="${entry.playerIndex}" data-role="directive-player-index">
        </label>
        <label>
          마킹
          <select data-role="directive-marking">
            <option value="" ${markingType === '' ? 'selected' : ''}>없음</option>
            <option value="zonal" ${markingType === 'zonal' ? 'selected' : ''}>지역 방어</option>
            <option value="man" ${markingType === 'man' ? 'selected' : ''}>대인 방어</option>
          </select>
        </label>
        <label>
          대상 인덱스
          <input type="number" min="0" max="21" value="${markingTarget}" data-role="directive-marking-target" ${markingType === 'man' ? '' : 'disabled'}>
        </label>
        <label>
          프레싱
          <select data-role="directive-pressing-mode">
            <option value="none" ${pressingMode === 'none' ? 'selected' : ''}>없음</option>
            <option value="custom" ${pressingMode === 'custom' ? 'selected' : ''}>사용</option>
          </select>
        </label>
        <label>
          강도
          <input type="number" min="0" max="1" step="0.05" value="${pressingIntensity.toFixed(2)}" data-role="directive-pressing-intensity" ${pressingMode === 'custom' ? '' : 'disabled'}>
        </label>
        <label>
          트리거
          <select data-role="directive-pressing-trigger" ${pressingMode === 'custom' ? '' : 'disabled'}>
            <option value="always" ${pressingTrigger === 'always' ? 'selected' : ''}>상시</option>
            <option value="near_ball" ${pressingTrigger === 'near_ball' ? 'selected' : ''}>볼 근처</option>
            <option value="on_touch" ${pressingTrigger === 'on_touch' ? 'selected' : ''}>터치 시</option>
          </select>
        </label>
        <label>
          포지셔닝
          <select data-role="directive-positioning">
            <option value="" ${positioningType === '' ? 'selected' : ''}>없음</option>
            <option value="hold_zone" ${positioningType === 'hold_zone' ? 'selected' : ''}>지점 유지</option>
            <option value="stay_wide" ${positioningType === 'stay_wide' ? 'selected' : ''}>넓게 유지</option>
            <option value="cut_inside" ${positioningType === 'cut_inside' ? 'selected' : ''}>안쪽 침투</option>
            <option value="overlap" ${positioningType === 'overlap' ? 'selected' : ''}>오버랩</option>
            <option value="underlap" ${positioningType === 'underlap' ? 'selected' : ''}>언더랩</option>
          </select>
        </label>
        <label>
          X
          <input type="number" min="0" max="1" step="0.01" value="${positioningX.toFixed(2)}" data-role="directive-positioning-coord" data-axis="x" ${positioningType === 'hold_zone' ? '' : 'disabled'}>
        </label>
        <label>
          Y
          <input type="number" min="0" max="1" step="0.01" value="${positioningY.toFixed(2)}" data-role="directive-positioning-coord" data-axis="y" ${positioningType === 'hold_zone' ? '' : 'disabled'}>
        </label>
        <div class="directives-row__actions">
          <button class="directives-row__remove" type="button" data-role="directive-remove">삭제</button>
        </div>
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

    this.#bindDirectiveListeners();
  };

  #bindDirectiveListeners = (): void => {
    this.#options.mount.querySelector('[data-role="directive-add"]')?.addEventListener('click', this.#handleDirectiveAdd);

    this.#options.mount.querySelectorAll<HTMLButtonElement>('[data-role="directive-remove"]').forEach(btn => {
      btn.addEventListener('click', this.#handleDirectiveRemove);
    });

    this.#options.mount.querySelectorAll<HTMLInputElement>('[data-role="directive-player-index"]').forEach(input => {
      input.addEventListener('change', this.#handleDirectivePlayerIndexChange);
    });

    this.#options.mount.querySelectorAll<HTMLSelectElement>('[data-role="directive-marking"]').forEach(select => {
      select.addEventListener('change', this.#handleDirectiveMarkingChange);
    });

    this.#options.mount.querySelectorAll<HTMLInputElement>('[data-role="directive-marking-target"]').forEach(input => {
      input.addEventListener('change', this.#handleDirectiveMarkingTargetChange);
    });

    this.#options.mount.querySelectorAll<HTMLSelectElement>('[data-role="directive-pressing-mode"]').forEach(select => {
      select.addEventListener('change', this.#handleDirectivePressingModeChange);
    });

    this.#options.mount.querySelectorAll<HTMLInputElement>('[data-role="directive-pressing-intensity"]').forEach(input => {
      input.addEventListener('change', this.#handleDirectivePressingIntensityChange);
    });

    this.#options.mount.querySelectorAll<HTMLSelectElement>('[data-role="directive-pressing-trigger"]').forEach(select => {
      select.addEventListener('change', this.#handleDirectivePressingTriggerChange);
    });

    this.#options.mount.querySelectorAll<HTMLSelectElement>('[data-role="directive-positioning"]').forEach(select => {
      select.addEventListener('change', this.#handleDirectivePositioningChange);
    });

    this.#options.mount.querySelectorAll<HTMLInputElement>('[data-role="directive-positioning-coord"]').forEach(input => {
      input.addEventListener('change', this.#handleDirectivePositioningCoordChange);
    });
  };

  #handleDirectiveAdd = (): void => {
    this.#updateTactic(draft => {
      if (!draft.playerInstructions) {
        draft.playerInstructions = [];
      }
      draft.playerInstructions.push({
        playerIndex: 0,
        directives: {},
      });
    });
  };

  #handleDirectiveRemove = (event: Event): void => {
    const index = this.#getDirectiveIndex(event.currentTarget as Element | null);
    if (index === null) return;
    this.#updateTactic(draft => {
      if (!draft.playerInstructions) return;
      draft.playerInstructions.splice(index, 1);
      if (draft.playerInstructions.length === 0) {
        draft.playerInstructions = [];
      }
    });
  };

  #handleDirectivePlayerIndexChange = (event: Event): void => {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;
    const index = this.#getDirectiveIndex(input);
    if (index === null) return;
    const raw = Number.parseInt(input.value, 10);
    const value = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 21) : 0;
    input.value = String(value);
    this.#updateDirective(index, entry => {
      entry.playerIndex = value;
    });
  };

  #handleDirectiveMarkingChange = (event: Event): void => {
    const select = event.target as HTMLSelectElement | null;
    if (!select) return;
    const index = this.#getDirectiveIndex(select);
    if (index === null) return;
    const value = select.value;

    this.#updateDirective(index, entry => {
      if (value === '') {
        delete entry.directives.marking;
        return;
      }
      if (value === 'zonal') {
        entry.directives.marking = { type: 'zonal' };
        return;
      }
      const prevTarget = entry.directives.marking?.type === 'man'
        ? entry.directives.marking.targetPlayerIndex
        : 0;
      entry.directives.marking = { type: 'man', targetPlayerIndex: prevTarget };
    });
  };

  #handleDirectiveMarkingTargetChange = (event: Event): void => {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;
    const index = this.#getDirectiveIndex(input);
    if (index === null) return;
    const raw = Number.parseInt(input.value, 10);
    const value = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 21) : 0;
    input.value = String(value);

    this.#updateDirective(index, entry => {
      entry.directives.marking = { type: 'man', targetPlayerIndex: value };
    });
  };

  #handleDirectivePressingModeChange = (event: Event): void => {
    const select = event.target as HTMLSelectElement | null;
    if (!select) return;
    const index = this.#getDirectiveIndex(select);
    if (index === null) return;
    const mode = select.value;

    this.#updateDirective(index, entry => {
      if (mode === 'none') {
        delete entry.directives.pressing;
      } else {
        const prev = entry.directives.pressing ?? { intensity: 0.5, trigger: 'always' as const };
        entry.directives.pressing = {
          intensity: this.#clamp01(prev.intensity ?? 0.5),
          trigger: prev.trigger ?? 'always',
        };
      }
    });
  };

  #handleDirectivePressingIntensityChange = (event: Event): void => {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;
    const index = this.#getDirectiveIndex(input);
    if (index === null) return;
    const raw = Number.parseFloat(input.value);
    const value = this.#clamp01(Number.isFinite(raw) ? raw : 0.5);
    input.value = value.toFixed(2);

    this.#updateDirective(index, entry => {
      entry.directives.pressing = {
        intensity: value,
        trigger: entry.directives.pressing?.trigger ?? 'always',
      };
    });
  };

  #handleDirectivePressingTriggerChange = (event: Event): void => {
    const select = event.target as HTMLSelectElement | null;
    if (!select) return;
    const index = this.#getDirectiveIndex(select);
    if (index === null) return;
    const trigger = select.value as 'always' | 'near_ball' | 'on_touch';

    this.#updateDirective(index, entry => {
      entry.directives.pressing = {
        intensity: entry.directives.pressing?.intensity ?? 0.5,
        trigger,
      };
    });
  };

  #handleDirectivePositioningChange = (event: Event): void => {
    const select = event.target as HTMLSelectElement | null;
    if (!select) return;
    const index = this.#getDirectiveIndex(select);
    if (index === null) return;
    const value = select.value;

    this.#updateDirective(index, entry => {
      switch (value) {
        case '':
          delete entry.directives.positioning;
          break;
        case 'hold_zone': {
          const prev = entry.directives.positioning?.type === 'hold_zone'
            ? entry.directives.positioning
            : { x: 0.5, y: 0.5 };
          entry.directives.positioning = {
            type: 'hold_zone',
            x: this.#clamp01(prev.x),
            y: this.#clamp01(prev.y),
          };
          break;
        }
        case 'stay_wide':
        case 'cut_inside':
        case 'overlap':
        case 'underlap':
          entry.directives.positioning = { type: value };
          break;
        default:
          break;
      }
    });
  };

  #handleDirectivePositioningCoordChange = (event: Event): void => {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;
    const index = this.#getDirectiveIndex(input);
    if (index === null) return;
    const axis = (input.dataset.axis as 'x' | 'y' | undefined) ?? 'x';
    const raw = Number.parseFloat(input.value);
    const value = this.#clamp01(Number.isFinite(raw) ? raw : 0.5);
    input.value = value.toFixed(2);

    this.#updateDirective(index, entry => {
      const current = entry.directives.positioning?.type === 'hold_zone'
        ? entry.directives.positioning
        : { x: 0.5, y: 0.5 };
      entry.directives.positioning = {
        type: 'hold_zone',
        x: axis === 'x' ? value : this.#clamp01(current.x),
        y: axis === 'y' ? value : this.#clamp01(current.y),
      };
    });
  };

  #getDirectiveIndex = (element: Element | null): number | null => {
    if (!element) return null;
    const row = element.closest('.directives-row') as HTMLElement | null;
    if (!row?.dataset.directiveIndex) return null;
    const index = Number.parseInt(row.dataset.directiveIndex, 10);
    return Number.isFinite(index) ? index : null;
  };

  #updateDirective = (index: number, mutate: (entry: PlayerInstruction) => void): void => {
    this.#updateTactic(draft => {
      if (!draft.playerInstructions) {
        draft.playerInstructions = [];
      }
      const entry = draft.playerInstructions[index];
      if (!entry) return;
      mutate(entry);
    });
  };

  #clamp01 = (value: number): number => {
    if (!Number.isFinite(value)) return 0;
    return Math.min(Math.max(value, 0), 1);
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
      draft[phase].customFormation = undefined;
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
