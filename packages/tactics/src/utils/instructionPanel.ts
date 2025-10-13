import type { FormationRole } from '../presets/formationPresets';

export const INSTRUCTION_PANEL_STYLE_ID = 'fto-instruction-panel-styles';

export const INSTRUCTION_PANEL_STYLES = `
.tactics-instruction-panel {
  position: absolute;
  z-index: 200;
  width: 280px;
  background: rgba(16, 16, 16, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  padding: 12px;
  color: #f0f0f0;
  font-size: 13px;
  backdrop-filter: blur(6px);
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.tactics-instruction-panel__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}
.tactics-instruction-panel__title {
  font-size: 15px;
  font-weight: 600;
}
.tactics-instruction-panel__subtitle {
  font-size: 12px;
  color: #b4b4b4;
  margin-top: 2px;
}
.tactics-instruction-panel__close {
  border: none;
  background: transparent;
  color: #bbb;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}
.tactics-instruction-panel__close:hover {
  color: #fff;
}
.tactics-instruction-panel__body {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}
.tactics-instruction-panel__body label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 11px;
  color: #bfc4cf;
}
.tactics-instruction-panel__body input,
.tactics-instruction-panel__body select {
  padding: 6px;
  border-radius: 4px;
  border: 1px solid #3d3d3d;
  background: #161616;
  color: #f4f4f4;
  font-size: 12px;
}
.tactics-instruction-panel__body input:disabled,
.tactics-instruction-panel__body select:disabled {
  opacity: 0.5;
}
.tactics-instruction-panel__footer {
  display: flex;
  align-items: center;
  gap: 8px;
}
.tactics-instruction-panel__gap {
  flex: 1 1 auto;
}
.tactics-instruction-panel__primary {
  border: 1px solid #4a8bff;
  background: #4a8bff;
  color: white;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 12px;
}
.tactics-instruction-panel__primary:hover {
  background: #5c96ff;
}
.tactics-instruction-panel__danger {
  border: 1px solid rgba(220, 80, 80, 0.6);
  background: rgba(180, 40, 40, 0.25);
  color: #ffb4b4;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 12px;
}
.tactics-instruction-panel__danger:hover {
  background: rgba(200, 60, 60, 0.35);
}
`;

export interface PressingConfig {
  toggleLabel: string;
  intensityLabel: string;
  triggerLabel: string;
}

const PRESSING_CONFIG: Record<FormationRole, PressingConfig> = {
  GK: { toggleLabel: '스위퍼 출동', intensityLabel: '전진 정도', triggerLabel: '출동 조건' },
  DF: { toggleLabel: '압박', intensityLabel: '압박 강도', triggerLabel: '압박 트리거' },
  MF: { toggleLabel: '중원 압박', intensityLabel: '압박 강도', triggerLabel: '트리거' },
  FW: { toggleLabel: '전방 압박', intensityLabel: '압박 강도', triggerLabel: '트리거' },
};

const DEFAULT_PRESSING_CONFIG: PressingConfig = PRESSING_CONFIG.DF;

export const getPressingConfig = (role: FormationRole): PressingConfig =>
  PRESSING_CONFIG[role] ?? DEFAULT_PRESSING_CONFIG;

export interface PositioningOption {
  readonly value: string;
  readonly label: string;
}

export interface PositioningConfig {
  selectLabel: string;
  xLabel: string;
  yLabel: string;
  options: readonly PositioningOption[];
}

const POSITIONING_CONFIG: Record<FormationRole, PositioningConfig> = {
  GK: {
    selectLabel: '기본 위치',
    xLabel: 'X 좌표',
    yLabel: 'Y 좌표',
    options: [
      { value: '', label: '기본' },
      { value: 'hold_zone', label: '지점 유지' },
    ],
  },
  DF: {
    selectLabel: '라인/겹침',
    xLabel: 'X 좌표',
    yLabel: 'Y 좌표',
    options: [
      { value: '', label: '없음' },
      { value: 'hold_zone', label: '지점 유지' },
      { value: 'stay_wide', label: '넓게 유지' },
      { value: 'overlap', label: '오버랩' },
      { value: 'underlap', label: '언더랩' },
    ],
  },
  MF: {
    selectLabel: '공격 가담',
    xLabel: 'X 좌표',
    yLabel: 'Y 좌표',
    options: [
      { value: '', label: '없음' },
      { value: 'hold_zone', label: '지점 유지' },
      { value: 'stay_wide', label: '측면 유지' },
      { value: 'cut_inside', label: '안쪽 침투' },
    ],
  },
  FW: {
    selectLabel: '움직임',
    xLabel: 'X 좌표',
    yLabel: 'Y 좌표',
    options: [
      { value: '', label: '없음' },
      { value: 'hold_zone', label: '지점 유지' },
      { value: 'stay_wide', label: '측면 유지' },
      { value: 'cut_inside', label: '안쪽 침투' },
      { value: 'overlap', label: '오버랩' },
    ],
  },
};

const DEFAULT_POSITIONING_CONFIG: PositioningConfig = {
  selectLabel: '포지셔닝',
  xLabel: 'X 좌표',
  yLabel: 'Y 좌표',
  options: [],
};

export const getPositioningConfig = (role: FormationRole): PositioningConfig =>
  POSITIONING_CONFIG[role] ?? DEFAULT_POSITIONING_CONFIG;
