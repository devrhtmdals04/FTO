
import type {
  InPossessionTactic,
  PlayerInstruction,
  Tactic,
  PhaseSetting,
  InPossessionStyle,
  OutOfPossessionStyle,
} from '../models/tactic';
import type {
  EngineCounterAttack,
  EngineCounterPress,
  EngineStateParams,
  EngineTacticStateKey,
  EngineTrapSide,
} from '../models/engineParams';
import { createDefaultEngineStatePresets } from '../models/engineParams';
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

.fto-tactics-editor-panel .sub-tabs {
    display: flex;
    gap: 6px;
    background: #222;
    padding: 6px;
    border-radius: 6px;
}

.fto-tactics-editor-panel .sub-tab {
    flex: 1 1 auto;
    border: 1px solid #444;
    border-radius: 4px;
    background: #333;
    color: #ccc;
    font-size: 12px;
    padding: 6px 8px;
    text-align: center;
    cursor: pointer;
}

.fto-tactics-editor-panel .sub-tab.active {
    background: #4a85ff;
    border-color: #4a85ff;
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

.engine-state-section {
  border: 1px solid #444;
  border-radius: 6px;
  padding: 12px;
  background: #1f1f1f;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.engine-state-section__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: #f0f0f0;
}

.engine-state-section__fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.engine-state-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.engine-state-field label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #bbb;
}

.engine-state-field__value {
  color: #fff;
  font-weight: 600;
}

.engine-state-field input[type="range"] {
  width: 100%;
}

.engine-state-field input[type="number"],
.engine-state-field input[type="text"],
.engine-state-field select {
  width: 100%;
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #444;
  background: #1c1c1c;
  color: #f0f0f0;
  font-size: 13px;
}

.engine-state-field__checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #ddd;
}

.engine-state-field__hint {
  font-size: 11px;
  color: #777;
}

.engine-state-section__guidelines {
  margin: 0;
  padding-left: 18px;
  color: #999;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
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

type EditorTab = 'InPossession' | 'OutOfPossession' | 'Transitions' | 'SetPieces';
type InPossessionPhase = keyof Tactic['inPossession'];
type OutOfPossessionPhase = keyof Tactic['outOfPossession'];
type SetPiecePhase = keyof Tactic['setPieces'];

const PHASE_LABELS: Record<EditorTab, string> = {
  InPossession: '인포제션',
  OutOfPossession: '아웃오브포제션',
  Transitions: '전환',
  SetPieces: '세트피스',
};

const IN_POSSESSION_PHASE_LABELS: Record<InPossessionPhase, string> = {
    buildUp: '빌드업',
    progression: '전개',
    creation: '창출',
};

const OUT_OF_POSSESSION_PHASE_LABELS: Record<OutOfPossessionPhase, string> = {
    highBlock: '높은 블록',
    midBlock: '중간 블록',
    lowBlock: '낮은 블록',
};

const SET_PIECE_PHASE_LABELS: Record<SetPiecePhase, string> = {
    attacking: '공격 세트피스',
    defending: '수비 세트피스',
};

const TRANSITION_STYLE_OPTIONS = [
  { value: 'press_on_heavy_touch', label: '즉시 재압박' },
  { value: 'fall_back', label: '라인 유지' },
] as const;

const ENGINE_STATE_DEFAULT_PRESETS = createDefaultEngineStatePresets();

type EngineFieldType = 'slider' | 'number' | 'select' | 'text' | 'checkbox';

interface EngineFieldConfig {
  readonly key: keyof EngineStateParams;
  readonly label: string;
  readonly type: EngineFieldType;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly options?: ReadonlyArray<{ value: string; label: string }>;
  readonly help?: string;
  readonly format?: (value: number) => string;
}

const TRAP_SIDE_OPTIONS: ReadonlyArray<{ value: EngineTrapSide; label: string }> = [
  { value: 'auto', label: '자동' },
  { value: 'left', label: '좌측' },
  { value: 'center', label: '중앙' },
  { value: 'right', label: '우측' },
];

const COUNTERPRESS_OPTIONS: ReadonlyArray<{ value: EngineCounterPress; label: string }> = [
  { value: 'none', label: '없음' },
  { value: 'contain', label: '유도' },
  { value: 'hunt', label: '집중 압박' },
];

const COUNTERATTACK_OPTIONS: ReadonlyArray<{ value: EngineCounterAttack; label: string }> = [
  { value: 'secure', label: '안정' },
  { value: 'balanced', label: '균형' },
  { value: 'fast', label: '속공' },
];

const MARKING_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: 'zonal', label: '존' },
  { value: 'man', label: '맨투맨' },
  { value: 'zonal+2man', label: '혼합(2인)' },
];

const ENGINE_STATE_LABELS: Record<EngineTacticStateKey, string> = {
  buildUp: '빌드업 상태 파라미터',
  progression: '전개 상태 파라미터',
  creation: '창출 상태 파라미터',
  highBlock: '하이 블록',
  midBlock: '미드 블록',
  lowBlock: '로우 블록',
  attackToDefense: '공격 → 수비 전환',
  defenseToAttack: '수비 → 공격 전환',
  setPlayAttack: '공격 세트피스',
  setPlayDefense: '수비 세트피스',
};

const formatPercent = (value: number): string => `${Math.round(value * 100)}%`;
const formatMeter = (value: number): string => `${value.toFixed(1)} m`;

const IN_POSSESSION_ENGINE_FIELDS: EngineFieldConfig[] = [
  { key: 'line_att', label: '라인 높이', type: 'slider', min: 0, max: 1, step: 0.01, format: formatPercent },
  { key: 'width', label: '팀 폭', type: 'slider', min: 0, max: 1, step: 0.01, format: formatPercent },
  { key: 'tempo', label: '템포', type: 'slider', min: 0, max: 1, step: 0.01, format: formatPercent },
  { key: 'direct', label: '직선성', type: 'slider', min: 0, max: 1, step: 0.01, format: formatPercent },
  { key: 'risk', label: '리스크', type: 'slider', min: 0, max: 1, step: 0.01, format: formatPercent },
  { key: 'support_d', label: '지원 거리', type: 'slider', min: 6, max: 18, step: 0.5, format: formatMeter },
  { key: 'gk_build', label: 'GK 빌드업 개입', type: 'slider', min: 0, max: 1, step: 0.01, format: formatPercent },
  { key: 'trap_side', label: '트랩 방향', type: 'select', options: TRAP_SIDE_OPTIONS },
  { key: 'counterpress', label: '역압박', type: 'select', options: COUNTERPRESS_OPTIONS },
  { key: 'counterattack', label: '역습 모드', type: 'select', options: COUNTERATTACK_OPTIONS },
  { key: 'rest_def_shape', label: '잔여 수비 구조', type: 'text' },
];

const OUT_OF_POSSESSION_ENGINE_FIELDS: EngineFieldConfig[] = [
  { key: 'block_def', label: '블록 라인', type: 'slider', min: 0, max: 1, step: 0.01, format: formatPercent },
  { key: 'width', label: '팀 폭', type: 'slider', min: 0, max: 1, step: 0.01, format: formatPercent },
  { key: 'press_int', label: '압박 강도', type: 'slider', min: 0, max: 1, step: 0.01, format: formatPercent },
  { key: 'compact_v', label: '세로 컴팩트', type: 'slider', min: 8, max: 24, step: 1, format: formatMeter },
  { key: 'compact_h', label: '가로 컴팩트', type: 'slider', min: 0, max: 1, step: 0.01, format: formatPercent },
  { key: 'support_d', label: '지원 거리', type: 'slider', min: 6, max: 18, step: 0.5, format: formatMeter },
  { key: 'trap_side', label: '트랩 방향', type: 'select', options: TRAP_SIDE_OPTIONS },
  { key: 'counterpress', label: '역압박', type: 'select', options: COUNTERPRESS_OPTIONS },
  { key: 'counterattack', label: '역습 모드', type: 'select', options: COUNTERATTACK_OPTIONS },
];

const TRANSITION_ENGINE_FIELDS: Record<'attackToDefense' | 'defenseToAttack', EngineFieldConfig[]> = {
  attackToDefense: [
    { key: 'press_int', label: '재압박 강도', type: 'slider', min: 0, max: 1, step: 0.01, format: formatPercent },
    { key: 'trap_side', label: '트랩 방향', type: 'select', options: TRAP_SIDE_OPTIONS },
    { key: 'counterpress', label: '역압박', type: 'select', options: COUNTERPRESS_OPTIONS },
    { key: 'compact_v', label: '세로 컴팩트', type: 'slider', min: 8, max: 24, step: 1, format: formatMeter },
    { key: 'compact_h', label: '가로 컴팩트', type: 'slider', min: 0, max: 1, step: 0.01, format: formatPercent },
    { key: 'support_d', label: '지원 거리', type: 'slider', min: 6, max: 18, step: 0.5, format: formatMeter },
  ],
  defenseToAttack: [
    { key: 'tempo', label: '템포', type: 'slider', min: 0, max: 1, step: 0.01, format: formatPercent },
    { key: 'direct', label: '직선성', type: 'slider', min: 0, max: 1, step: 0.01, format: formatPercent },
    { key: 'risk', label: '리스크', type: 'slider', min: 0, max: 1, step: 0.01, format: formatPercent },
    { key: 'width', label: '팀 폭', type: 'slider', min: 0, max: 1, step: 0.01, format: formatPercent },
    { key: 'counterattack', label: '역습 모드', type: 'select', options: COUNTERATTACK_OPTIONS },
    { key: 'support_d', label: '지원 거리', type: 'slider', min: 6, max: 18, step: 0.5, format: formatMeter },
    { key: 'rest_def_shape', label: '잔여 수비 구조', type: 'text' },
  ],
};

const SET_PIECE_ATTACK_FIELDS: EngineFieldConfig[] = [
  { key: 'risk', label: '리스크', type: 'slider', min: 0, max: 1, step: 0.01, format: formatPercent },
  { key: 'tempo', label: '템포', type: 'slider', min: 0, max: 1, step: 0.01, format: formatPercent },
  { key: 'box_runs', label: '박스 침투 인원', type: 'number', min: 0, max: 6, step: 1 },
  { key: 'second_phase_ready', label: '세컨 페이즈 준비', type: 'checkbox' },
  { key: 'rest_def_shape', label: '잔여 수비 구조', type: 'text' },
];

const SET_PIECE_DEFENSE_FIELDS: EngineFieldConfig[] = [
  { key: 'compact_v', label: '세로 컴팩트', type: 'slider', min: 6, max: 20, step: 1, format: formatMeter },
  { key: 'compact_h', label: '가로 컴팩트', type: 'slider', min: 0, max: 1, step: 0.01, format: formatPercent },
  { key: 'line_att', label: '라인 높이', type: 'slider', min: 0, max: 1, step: 0.01, format: formatPercent },
  { key: 'marking', label: '마킹', type: 'select', options: MARKING_OPTIONS },
  { key: 'blocker_on_keeper', label: '골키퍼 차단', type: 'checkbox' },
  { key: 'counterattack', label: '역습 모드', type: 'select', options: COUNTERATTACK_OPTIONS },
];

const ENGINE_FIELD_CONFIG: Record<EngineTacticStateKey, EngineFieldConfig[]> = {
  buildUp: IN_POSSESSION_ENGINE_FIELDS,
  progression: IN_POSSESSION_ENGINE_FIELDS,
  creation: IN_POSSESSION_ENGINE_FIELDS,
  highBlock: OUT_OF_POSSESSION_ENGINE_FIELDS,
  midBlock: OUT_OF_POSSESSION_ENGINE_FIELDS,
  lowBlock: OUT_OF_POSSESSION_ENGINE_FIELDS,
  attackToDefense: TRANSITION_ENGINE_FIELDS.attackToDefense,
  defenseToAttack: TRANSITION_ENGINE_FIELDS.defenseToAttack,
  setPlayAttack: SET_PIECE_ATTACK_FIELDS,
  setPlayDefense: SET_PIECE_DEFENSE_FIELDS,
};

export class TacticsEditor {
  readonly #options: TacticsEditorOptions;
  #tactic: Tactic;
  #activeTab: EditorTab;
  #activeInPossessionPhase: InPossessionPhase;
  #activeOutOfPossessionPhase: OutOfPossessionPhase;
  #activeSetPiecePhase: SetPiecePhase;

  constructor(options: TacticsEditorOptions) {
    this.#options = options;
    this.#tactic = options.tactic;
    this.#activeTab = 'InPossession'; // Default tab
    this.#activeInPossessionPhase = 'buildUp'; // Default sub-phase
    this.#activeOutOfPossessionPhase = 'midBlock';
    this.#activeSetPiecePhase = 'attacking';
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
    const activeContent = this.#renderContent(this.#activeTab);
    const directivesContent = this.#renderDirectivesSection();
    const safeLabel = this.#escapeHtml(this.#tactic.label);

    this.#options.mount.innerHTML = `
      <div class="fto-tactics-editor-panel">
        <h3>${safeLabel}</h3>
        <div class="mode-tabs">
          ${this.#renderTabButton('InPossession')}
          ${this.#renderTabButton('OutOfPossession')}
          ${this.#renderTabButton('Transitions')}
          ${this.#renderTabButton('SetPieces')}
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
    switch (tab) {
      case 'InPossession':
        return this.#renderInPossessionContent();
      case 'OutOfPossession':
        return this.#renderOutOfPossessionContent();
      case 'Transitions':
        return this.#renderTransitionContent();
      case 'SetPieces':
        return this.#renderSetPiecesContent();
      default:
        return '';
    }
  };

  #renderInPossessionContent = (): string => {
    const phase = this.#activeInPossessionPhase;
    const phaseData = this.#tactic.inPossession[phase];

    const subTabs = (Object.keys(this.#tactic.inPossession) as InPossessionPhase[])
        .map(p => `<button class="sub-tab ${p === phase ? 'active' : ''}" data-in-possession-phase="${p}">${IN_POSSESSION_PHASE_LABELS[p]}</button>`)
        .join('');

    return `
        <div class="control-group">
            <div class="sub-tabs">${subTabs}</div>
        </div>
        ${this.#renderSlider('defensiveLine', '수비 라인', phaseData.defensiveLine, 0, 1, 0.01, 'inPossession', phase)}
        ${this.#renderSlider('width', '공격 폭', phaseData.width, 0, 1, 0.01, 'inPossession', phase)}
        ${this.#renderSlider('pressingIntensity', '압박 강도', phaseData.pressingIntensity, 0, 1, 0.01, 'inPossession', phase)}
        ${this.#renderEngineStateSection(this.#engineKeyForInPossession(phase))}
        ${this.#renderSelectionSummary('inPossession', phase)}
    `;
  };

  #renderOutOfPossessionContent = (): string => {
    const phase = this.#activeOutOfPossessionPhase;
    const phaseData = this.#tactic.outOfPossession[phase];

    const subTabs = (Object.keys(this.#tactic.outOfPossession) as OutOfPossessionPhase[])
        .map(p => `<button class="sub-tab ${p === phase ? 'active' : ''}" data-out-of-possession-phase="${p}">${OUT_OF_POSSESSION_PHASE_LABELS[p]}</button>`)
        .join('');

    return `
        <div class="control-group">
            <div class="sub-tabs">${subTabs}</div>
        </div>
        ${this.#renderSlider('defensiveLine', '수비 라인', phaseData.defensiveLine, 0, 1, 0.01, 'outOfPossession', phase)}
        ${this.#renderSlider('width', '수비 폭', phaseData.width, 0, 1, 0.01, 'outOfPossession', phase)}
        ${this.#renderSlider('pressingIntensity', '압박 강도', phaseData.pressingIntensity, 0, 1, 0.01, 'outOfPossession', phase)}
        ${this.#renderEngineStateSection(this.#engineKeyForOutOfPossession(phase))}
        ${this.#renderSelectionSummary('outOfPossession', phase)}
    `;
  };

  #renderSetPiecesContent = (): string => {
    const phase = this.#activeSetPiecePhase;
    const phaseData = this.#tactic.setPieces[phase];

    const subTabs = (Object.keys(this.#tactic.setPieces) as SetPiecePhase[])
        .map(p => `<button class="sub-tab ${p === phase ? 'active' : ''}" data-set-piece-phase="${p}">${SET_PIECE_PHASE_LABELS[p]}</button>`)
        .join('');

    return `
        <div class="control-group">
            <div class="sub-tabs">${subTabs}</div>
        </div>
        ${this.#renderSlider('defensiveLine', '수비 라인', phaseData.defensiveLine, 0, 1, 0.01, 'setPieces', phase)}
        ${this.#renderSlider('width', '폭', phaseData.width, 0, 1, 0.01, 'setPieces', phase)}
        ${this.#renderSlider('pressingIntensity', '압박 강도', phaseData.pressingIntensity, 0, 1, 0.01, 'setPieces', phase)}
        ${this.#renderEngineStateSection(this.#engineKeyForSetPiece(phase))}
    `;
  };

  #renderSlider = (id: string, label: string, value: number, min: number, max: number, step: number, majorPhase: 'inPossession' | 'outOfPossession' | 'setPieces', minorPhase: string): string => {
    return `
        <div class="control-group">
            <label for="slider-${id}-${minorPhase}">${label}: ${value.toFixed(2)}</label>
            <input 
                type="range" 
                id="slider-${id}-${minorPhase}" 
                min="${min}" 
                max="${max}" 
                step="${step}" 
                value="${value}"
                data-role="slider"
                data-major-phase="${majorPhase}"
                data-minor-phase="${minorPhase}"
                data-property="${id}"
            />
        </div>
    `;
  }

  #getSlotLabelMap = (majorPhase: 'inPossession' | 'outOfPossession', minorPhase: keyof Tactic['inPossession'] | keyof Tactic['outOfPossession']): Map<number, string> => {
    let data;
    switch (majorPhase) {
        case 'inPossession':
            data = this.#tactic.inPossession[minorPhase as keyof Tactic['inPossession']];
            break;
        case 'outOfPossession':
            data = this.#tactic.outOfPossession[minorPhase as keyof Tactic['outOfPossession']];
            break;
    }
    return computeRoleLabelsForPhase(data.formation, data.customFormation);
  };

  #renderSelectionSummary = (majorPhase: 'inPossession' | 'outOfPossession', minorPhase: keyof Tactic['inPossession'] | keyof Tactic['outOfPossession']): string => {
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

    const labelMap = this.#getSlotLabelMap(majorPhase, minorPhase);
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

  #renderEngineStateSection = (stateKey: EngineTacticStateKey): string => {
    const fields = ENGINE_FIELD_CONFIG[stateKey] ?? [];
    if (fields.length === 0) return '';

    const preset = this.#tactic.engineStatePresets?.[stateKey];
    const guidelines = (preset?.guidelines?.length ? preset?.guidelines : ENGINE_STATE_DEFAULT_PRESETS[stateKey]?.guidelines) ?? [];
    const fieldMarkup = fields.map(field => this.#renderEngineField(stateKey, field)).join('');
    const guidelinesMarkup = guidelines.length
      ? `<ul class="engine-state-section__guidelines">${guidelines
          .map(line => `<li>${this.#escapeHtml(line)}</li>`)
          .join('')}</ul>`
      : '';

    return `
      <div class="engine-state-section" data-engine-state="${stateKey}">
        <div class="engine-state-section__header">${ENGINE_STATE_LABELS[stateKey] ?? stateKey}</div>
        <div class="engine-state-section__fields">
          ${fieldMarkup}
        </div>
        ${guidelinesMarkup}
      </div>
    `;
  };

  #renderEngineField = (stateKey: EngineTacticStateKey, field: EngineFieldConfig): string => {
    const raw = this.#getEngineParamValue(stateKey, field.key);
    const defaultRaw = ENGINE_STATE_DEFAULT_PRESETS[stateKey]?.params?.[field.key];
    const inputId = `engine-${stateKey}-${String(field.key)}`;

    if (field.type === 'slider') {
      const fallback = typeof defaultRaw === 'number' ? defaultRaw : field.min ?? 0;
      const numeric = typeof raw === 'number' && Number.isFinite(raw) ? raw : fallback;
      const clamped = this.#clampEngineNumber(numeric, field);
      const display = field.format ? field.format(clamped) : clamped.toFixed(field.step && field.step < 1 ? 2 : 0);
      return `
        <div class="engine-state-field">
          <label for="${inputId}"><span>${field.label}</span><span class="engine-state-field__value">${display}</span></label>
          <input
            type="range"
            id="${inputId}"
            min="${field.min ?? 0}"
            max="${field.max ?? 1}"
            step="${field.step ?? 0.01}"
            value="${clamped}"
            data-role="engine-range"
            data-engine-state-key="${stateKey}"
            data-engine-param="${String(field.key)}"
          />
          ${field.help ? `<div class="engine-state-field__hint">${this.#escapeHtml(field.help)}</div>` : ''}
        </div>
      `;
    }

    if (field.type === 'number') {
      const fallback = typeof defaultRaw === 'number' ? defaultRaw : field.min ?? 0;
      const numeric = typeof raw === 'number' && Number.isFinite(raw) ? raw : fallback;
      return `
        <div class="engine-state-field">
          <label for="${inputId}">${field.label}</label>
          <input
            type="number"
            id="${inputId}"
            value="${numeric}"
            ${field.min !== undefined ? `min="${field.min}"` : ''}
            ${field.max !== undefined ? `max="${field.max}"` : ''}
            ${field.step !== undefined ? `step="${field.step}"` : ''}
            data-role="engine-number"
            data-engine-state-key="${stateKey}"
            data-engine-param="${String(field.key)}"
          />
          ${field.help ? `<div class="engine-state-field__hint">${this.#escapeHtml(field.help)}</div>` : ''}
        </div>
      `;
    }

    if (field.type === 'select') {
      const options = field.options ?? [];
      const fallback = typeof defaultRaw === 'string' ? defaultRaw : options[0]?.value ?? '';
      const current = typeof raw === 'string' ? raw : fallback;
      const optionsMarkup = options
        .map(option => `<option value="${option.value}" ${option.value === current ? 'selected' : ''}>${this.#escapeHtml(option.label)}</option>`)
        .join('');
      return `
        <div class="engine-state-field">
          <label for="${inputId}">${field.label}</label>
          <select
            id="${inputId}"
            data-role="engine-select"
            data-engine-state-key="${stateKey}"
            data-engine-param="${String(field.key)}"
          >
            ${optionsMarkup}
          </select>
        </div>
      `;
    }

    if (field.type === 'text') {
      const fallback = typeof defaultRaw === 'string' ? defaultRaw : '';
      const value = typeof raw === 'string' ? raw : fallback;
      return `
        <div class="engine-state-field">
          <label for="${inputId}">${field.label}</label>
          <input
            type="text"
            id="${inputId}"
            value="${this.#escapeHtml(value)}"
            data-role="engine-text"
            data-engine-state-key="${stateKey}"
            data-engine-param="${String(field.key)}"
          />
        </div>
      `;
    }

    // checkbox
    const fallback = typeof defaultRaw === 'boolean' ? defaultRaw : false;
    const checked = typeof raw === 'boolean' ? raw : fallback;
    return `
      <div class="engine-state-field">
        <label class="engine-state-field__checkbox">
          <input
            type="checkbox"
            id="${inputId}"
            ${checked ? 'checked' : ''}
            data-role="engine-toggle"
            data-engine-state-key="${stateKey}"
            data-engine-param="${String(field.key)}"
          />
          <span>${field.label}</span>
        </label>
      </div>
    `;
  };

  #getEngineParamValue = (stateKey: EngineTacticStateKey, key: keyof EngineStateParams): unknown => {
    const preset = this.#tactic.engineStatePresets?.[stateKey];
    if (preset && preset.params && Object.prototype.hasOwnProperty.call(preset.params, key)) {
      return (preset.params as Record<string, unknown>)[key];
    }
    const fallback = ENGINE_STATE_DEFAULT_PRESETS[stateKey]?.params;
    return fallback ? (fallback as Record<string, unknown>)[key] : undefined;
  };

  #engineKeyForInPossession = (phase: InPossessionPhase): EngineTacticStateKey => {
    switch (phase) {
      case 'progression':
        return 'progression';
      case 'creation':
        return 'creation';
      case 'buildUp':
      default:
        return 'buildUp';
    }
  };

  #engineKeyForOutOfPossession = (phase: OutOfPossessionPhase): EngineTacticStateKey => {
    switch (phase) {
      case 'highBlock':
        return 'highBlock';
      case 'lowBlock':
        return 'lowBlock';
      case 'midBlock':
      default:
        return 'midBlock';
    }
  };

  #engineKeyForSetPiece = (phase: SetPiecePhase): EngineTacticStateKey => {
    return phase === 'attacking' ? 'setPlayAttack' : 'setPlayDefense';
  };

  #getEngineFieldConfig = (stateKey: EngineTacticStateKey, param: keyof EngineStateParams): EngineFieldConfig | undefined => {
    const fields = ENGINE_FIELD_CONFIG[stateKey] ?? [];
    return fields.find(field => field.key === param);
  };

  #clampEngineNumber = (value: number, field: EngineFieldConfig): number => {
    if (!Number.isFinite(value)) return field.min ?? 0;
    let result = value;
    if (field.min !== undefined) {
      result = Math.max(result, field.min);
    }
    if (field.max !== undefined) {
      result = Math.min(result, field.max);
    }
    return result;
  };

  #ensureEnginePreset = (draft: Tactic, stateKey: EngineTacticStateKey) => {
    if (!draft.engineStatePresets) {
      draft.engineStatePresets = createDefaultEngineStatePresets();
    }
    if (!draft.engineStatePresets[stateKey]) {
      const defaults = createDefaultEngineStatePresets();
      draft.engineStatePresets[stateKey] = defaults[stateKey];
    }
    return draft.engineStatePresets[stateKey];
  };

  #updateEngineParam = (stateKey: EngineTacticStateKey, param: keyof EngineStateParams, value: unknown): void => {
    this.#updateTactic(draft => {
      const preset = this.#ensureEnginePreset(draft, stateKey);
      if (!preset.params) {
        preset.params = {};
      }
      (preset.params as Record<string, unknown>)[param as string] = value as unknown;
    });
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
    const { on_loss, on_win } = this.#tactic.transitions;
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
      ${this.#renderEngineStateSection('attackToDefense')}
      ${this.#renderEngineStateSection('defenseToAttack')}
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

    this.#options.mount.querySelectorAll<HTMLElement>('[data-in-possession-phase]').forEach(btn => {
        btn.addEventListener('click', this.#handleInPossessionPhaseClick);
    });

    this.#options.mount.querySelectorAll<HTMLElement>('[data-out-of-possession-phase]').forEach(btn => {
        btn.addEventListener('click', this.#handleOutOfPossessionPhaseClick);
    });

    this.#options.mount.querySelectorAll<HTMLElement>('[data-set-piece-phase]').forEach(btn => {
        btn.addEventListener('click', this.#handleSetPiecePhaseClick);
    });

    this.#options.mount.querySelectorAll<HTMLInputElement>('[data-role="slider"]').forEach(input => {
        input.addEventListener('input', this.#handleSliderChange);
    });

    this.#options.mount.querySelectorAll<HTMLInputElement>('[data-role="engine-range"]').forEach(input => {
      input.addEventListener('input', this.#handleEngineRangeInput);
    });

    this.#options.mount.querySelectorAll<HTMLInputElement>('[data-role="engine-number"]').forEach(input => {
      input.addEventListener('change', this.#handleEngineNumberChange);
    });

    this.#options.mount.querySelectorAll<HTMLSelectElement>('[data-role="engine-select"]').forEach(select => {
      select.addEventListener('change', this.#handleEngineSelectChange);
    });

    this.#options.mount.querySelectorAll<HTMLInputElement>('[data-role="engine-toggle"]').forEach(input => {
      input.addEventListener('change', this.#handleEngineToggleChange);
    });

    this.#options.mount.querySelectorAll<HTMLInputElement>('[data-role="engine-text"]').forEach(input => {
      input.addEventListener('change', this.#handleEngineTextChange);
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
    this.render();
  };

  #handleInPossessionPhaseClick = (event: Event): void => {
    const target = event.currentTarget as HTMLElement | null;
    const phase = target?.dataset.inPossessionPhase as InPossessionPhase | undefined;
    if (!phase || phase === this.#activeInPossessionPhase) {
        return;
    }
    this.#activeInPossessionPhase = phase;
    this.render();
  };

  #handleOutOfPossessionPhaseClick = (event: Event): void => {
    const target = event.currentTarget as HTMLElement | null;
    const phase = target?.dataset.outOfPossessionPhase as OutOfPossessionPhase | undefined;
    if (!phase || phase === this.#activeOutOfPossessionPhase) {
        return;
    }
    this.#activeOutOfPossessionPhase = phase;
    this.render();
  };

  #handleSetPiecePhaseClick = (event: Event): void => {
    const target = event.currentTarget as HTMLElement | null;
    const phase = target?.dataset.setPiecePhase as SetPiecePhase | undefined;
    if (!phase || phase === this.#activeSetPiecePhase) {
        return;
    }
    this.#activeSetPiecePhase = phase;
    this.render();
  };

  #handleSliderChange = (event: Event): void => {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;

    const majorPhase = input.dataset.majorPhase as 'inPossession' | 'outOfPossession' | 'setPieces';
    const minorPhase = input.dataset.minorPhase as string;
    const property = input.dataset.property as keyof PhaseSetting;
    const value = Number.parseFloat(input.value);

    if (!majorPhase || !minorPhase || !property || !Number.isFinite(value)) return;

    this.#updateTactic(draft => {
      let phase: PhaseSetting | undefined;
      switch (majorPhase) {
        case 'inPossession':
          phase = draft.inPossession[minorPhase as InPossessionPhase];
          break;
        case 'outOfPossession':
          phase = draft.outOfPossession[minorPhase as OutOfPossessionPhase];
          break;
        case 'setPieces':
          phase = draft.setPieces[minorPhase as SetPiecePhase];
          break;
      }

      if (phase && property in phase && typeof (phase as any)[property] === 'number') {
        (phase as any)[property] = value;
      }
    });
  };

  #handleEngineRangeInput = (event: Event): void => {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;
    const stateKey = input.dataset.engineStateKey as EngineTacticStateKey | undefined;
    const param = input.dataset.engineParam as keyof EngineStateParams | undefined;
    if (!stateKey || !param) return;
    const field = this.#getEngineFieldConfig(stateKey, param);
    if (!field) return;
    const value = Number.parseFloat(input.value);
    if (!Number.isFinite(value)) return;
    const clamped = this.#clampEngineNumber(value, field);
    this.#updateEngineParam(stateKey, param, clamped);
  };

  #handleEngineNumberChange = (event: Event): void => {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;
    const stateKey = input.dataset.engineStateKey as EngineTacticStateKey | undefined;
    const param = input.dataset.engineParam as keyof EngineStateParams | undefined;
    if (!stateKey || !param) return;
    const field = this.#getEngineFieldConfig(stateKey, param);
    if (!field) return;
    const value = Number.parseFloat(input.value);
    if (!Number.isFinite(value)) return;
    const clamped = this.#clampEngineNumber(value, field);
    this.#updateEngineParam(stateKey, param, clamped);
  };

  #handleEngineSelectChange = (event: Event): void => {
    const select = event.target as HTMLSelectElement | null;
    if (!select) return;
    const stateKey = select.dataset.engineStateKey as EngineTacticStateKey | undefined;
    const param = select.dataset.engineParam as keyof EngineStateParams | undefined;
    if (!stateKey || !param) return;
    const value = select.value;
    this.#updateEngineParam(stateKey, param, value);
  };

  #handleEngineToggleChange = (event: Event): void => {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;
    const stateKey = input.dataset.engineStateKey as EngineTacticStateKey | undefined;
    const param = input.dataset.engineParam as keyof EngineStateParams | undefined;
    if (!stateKey || !param) return;
    const value = Boolean(input.checked);
    this.#updateEngineParam(stateKey, param, value);
  };

  #handleEngineTextChange = (event: Event): void => {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;
    const stateKey = input.dataset.engineStateKey as EngineTacticStateKey | undefined;
    const param = input.dataset.engineParam as keyof EngineStateParams | undefined;
    if (!stateKey || !param) return;
    const value = input.value.trim();
    this.#updateEngineParam(stateKey, param, value);
  };

  #handleFormationChange = (event: Event): void => {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;
    const phase = input.dataset.phase as 'Attacking' | 'Deffending' | undefined;
    if (!phase) return;

    this.#updateTactic(draft => {
      if (phase === 'Attacking') {
        (Object.keys(draft.inPossession) as (keyof Tactic['inPossession'])[]).forEach(key => {
            draft.inPossession[key].formation = input.value;
        });
      } else if (phase === 'Deffending') {
        (Object.keys(draft.outOfPossession) as (keyof Tactic['outOfPossession'])[]).forEach(key => {
            draft.outOfPossession[key].formation = input.value;
        });
      }
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
        if (phase === 'Attacking') {
            (Object.keys(draft.inPossession) as (keyof Tactic['inPossession'])[]).forEach(key => {
                draft.inPossession[key].formation = value;
                draft.inPossession[key].customFormation = undefined;
            });
        } else if (phase === 'Deffending') {
            (Object.keys(draft.outOfPossession) as (keyof Tactic['outOfPossession'])[]).forEach(key => {
                draft.outOfPossession[key].formation = value;
                draft.outOfPossession[key].customFormation = undefined;
            });
        }
    });
  };

  #handleStyleChange = (event: Event): void => {
    const select = event.target as HTMLSelectElement | null;
    if (!select) return;
    const phase = select.dataset.phase as 'Attacking' | 'Deffending' | undefined;
    if (!phase) return;

    this.#updateTactic(draft => {
        if (phase === 'Attacking') {
            const style = select.value as InPossessionStyle;
            (Object.keys(draft.inPossession) as (keyof Tactic['inPossession'])[]).forEach(key => {
                draft.inPossession[key].style = style;
            });
        } else if (phase === 'Deffending') {
            const style = select.value as OutOfPossessionStyle;
            (Object.keys(draft.outOfPossession) as (keyof Tactic['outOfPossession'])[]).forEach(key => {
                draft.outOfPossession[key].style = style;
            });
        }
    });
  };

  #handleTransitionLossChange = (event: Event): void => {
    const select = event.target as HTMLSelectElement | null;
    if (!select) return;
    this.#updateTactic(draft => {
      draft.transitions.on_loss = select.value as typeof draft.transitions.on_loss;
    });
  };

  #handleTransitionWinChange = (event: Event): void => {
    const select = event.target as HTMLSelectElement | null;
    if (!select) return;
    this.#updateTactic(draft => {
      draft.transitions.on_win = select.value as typeof draft.transitions.on_win;
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
    this.render(); // Re-render after state change
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
