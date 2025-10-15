import type {
  Tactic,
  CustomFormationSlot,
  PlayerSelectionEntry,
  PlayerInstruction,
} from '../models/tactic';
import { normalizeTactic } from '../models/tactic';
import { getFormationSlots, type FormationSlot, FormationRole } from '../presets/formationPresets';
import { computeRoleLabels } from '../utils/roleLabels';
import {
  INSTRUCTION_PANEL_STYLE_ID,
  INSTRUCTION_PANEL_STYLES,
  getPressingConfig,
  getPositioningConfig,
} from '../utils/instructionPanel';
import { createPlayerMarker } from '../models/marker';
import type { Player, PlayerProfile } from '../../../squad/src/index';
import type { TacticsStore } from '../state/tacticsStore';

const SVG_NS = 'http://www.w3.org/2000/svg';

const PITCH_WIDTH = 240;
const PITCH_HEIGHT = 360;
const MARGIN = 10;

const GRID_COLS = 5;
const GRID_ROWS = 6;

const PITCH_COLOR = '#3A652A';
const STRIPE_COLOR = 'rgba(0, 0, 0, 0.08)';
const LINE_COLOR = 'rgba(255, 255, 255, 0.7)';
const LINE_WIDTH = '1';

const SLOT_BASE_RADIUS = 12;
const SLOT_HIGHLIGHT_FILL = 'rgba(255, 255, 255, 0.24)';
const SLOT_OCCUPIED_FILL = 'rgba(255, 255, 255, 0.28)';
const SLOT_EMPTY_FILL = 'rgba(255, 255, 255, 0.12)';
const SLOT_HIGHLIGHT_STROKE = '#ffffff';
const SLOT_HOVER_DISTANCE = 80; // px within pitch coordinate space

const ROLE_COLORS: Record<FormationRole, string> = {
  GK: '#f2c94c',
  DF: '#56ccf2',
  MF: '#27ae60',
  FW: '#eb5757',
};


type DraggedProfile = PlayerProfile & { jerseyNumber?: number };
type SlotOccupant = DraggedProfile & { id: number };

function convertProfileToPlayer(profile: SlotOccupant): Player {
  const jerseyNumber = profile.jerseyNumber ?? profile.number ?? profile.id;
  return {
    id: profile.id,
    number: jerseyNumber,
    name: profile.name,
    position: profile.position,
    stats: {
      PAC: profile.pace * 5,
      SHO: (profile.finishing + profile.shot_power) / 2 * 5,
      PAS: (profile.passing + profile.vision) / 2 * 5,
      DRI: (profile.agility + profile.first_touch) / 2 * 5,
      DEF: (profile.tackling + profile.interception) / 2 * 5,
      PHY: (profile.strength + profile.stamina + profile.jumping) / 3 * 5,
    }
  };
}

export interface PitchDisplayOptions {
  mount: HTMLElement;
  tactic: Tactic;
  squad: PlayerProfile[];
  store: TacticsStore;
  mode: 'InPossession' | 'OutOfPossession';
}

interface SlotState {
  readonly index: number;
  x: number; // normalized 0..1 across pitch width
  y: number; // normalized 0..1 across pitch height
  role: FormationRole;
  label: string;
  gridColumn?: number;
  gridRow?: number;
  occupant: SlotOccupant | null;
  element?: SVGPolygonElement;
}

export class PitchDisplay {
  readonly #options: PitchDisplayOptions;
  readonly #svg: SVGSVGElement;
  #slots: SlotState[];
  #nextPlayerId = 1;
  #highlightedSlotIndex: number | null = null;
  #draggedSlot: { slot: SlotState, startX: number, startY: number, isDragging: boolean, startTime: number } | null = null;
  #instructionPanel: HTMLDivElement | null = null;
  #instructionPanelSlot: SlotState | null = null;

  constructor(options: PitchDisplayOptions) {
    this.#options = options;
    this.#slots = this.#createSlots();
    this.#restorePlayerSelection();
    this.#svg = this.createSvgElement();
    this.#ensureInstructionPanelStyles();
    this.#svg.addEventListener('dragover', this.#handleDragOver);
    this.#svg.addEventListener('dragleave', this.#handleDragLeave);
    this.#svg.addEventListener('drop', this.#handleDrop);
    window.addEventListener('mousedown', (e) => {
      if (this.#instructionPanel && !this.#instructionPanel.contains(e.target as Node)) {
        this.#closeInstructionPanel();
      }
    });
    window.addEventListener('keydown', this.#handleInstructionKeyDown);
    this.render();
  }

  #createSlots(): SlotState[] {
    const tacticPhase = this.#options.mode === 'InPossession'
      ? this.#options.tactic.inPossession.progression
      : this.#options.tactic.outOfPossession.midBlock;
    const { formation, customFormation } = tacticPhase;

    if (customFormation && customFormation.length > 0) {
      const slots = customFormation.map((slot, index) => {
        const gridColumn = slot.gridColumn ?? Math.max(0, Math.min(GRID_COLS - 1, Math.round(slot.x * GRID_COLS - 0.5)));
        const gridRow = slot.gridRow ?? Math.max(0, Math.min(GRID_ROWS - 1, Math.round(slot.y * GRID_ROWS - 0.5)));
        const x = (gridColumn + 0.5) / GRID_COLS;
        const y = (gridRow + 0.5) / GRID_ROWS;
        return {
          index,
          role: slot.role as FormationRole,
          x,
          y,
          gridColumn,
          gridRow,
          occupant: null,
          label: slot.role,
        } satisfies SlotState;
      });
      this.#assignRoleLabels(slots);
      return slots;
    }

    const slots = getFormationSlots(formation).map(slot => {
      const gridColumn = Math.max(0, Math.min(GRID_COLS - 1, Math.round(slot.x * GRID_COLS - 0.5)));
      const gridRow = Math.max(0, Math.min(GRID_ROWS - 1, Math.round(slot.y * GRID_ROWS - 0.5)));
      const x = (gridColumn + 0.5) / GRID_COLS;
      const y = (gridRow + 0.5) / GRID_ROWS;
      return { ...slot, x, y, occupant: null, label: slot.role, gridColumn, gridRow };
    });
    this.#assignRoleLabels(slots);
    return slots;
  }

  private createSvgElement(): SVGSVGElement {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${PITCH_WIDTH + MARGIN * 2} ${PITCH_HEIGHT + MARGIN * 2}`);
    svg.style.width = '100%';
    svg.style.height = 'auto';
    return svg;
  }

  #assignRoleLabels(slots: SlotState[]): void {
    const labels = computeRoleLabels(slots.map(slot => ({ index: slot.index, x: slot.x, role: slot.role })));
    slots.forEach(slot => {
      slot.label = labels.get(slot.index) ?? slot.role;
    });
  }

  #ensureInstructionPanelStyles(): void {
    const doc = this.#options.mount.ownerDocument ?? document;
    if (doc.getElementById(INSTRUCTION_PANEL_STYLE_ID)) return;
    const style = doc.createElement('style');
    style.id = INSTRUCTION_PANEL_STYLE_ID;
    style.textContent = INSTRUCTION_PANEL_STYLES;
    doc.head.appendChild(style);
  }

  #updateOccupiedPlayers = (): void => {
    const names = this.#slots.map(s => s.occupant?.name).filter(Boolean) as string[];
    this.#options.store.setOccupiedPlayerNames(names);
  }

  public autoAssignPlayers(): void {
    const allOccupied = this.#slots.every(slot => slot.occupant);
    if (allOccupied) {
      for (const slot of this.#slots) {
        slot.occupant = null;
      }
      this.render();
      return;
    }

    const playersToAssign = [...this.#options.squad];
    const assignedPlayerNames = new Set<string>();

    const existingOccupants = new Map<string, SlotOccupant>();
    for (const slot of this.#slots) {
      if (slot.occupant) {
        existingOccupants.set(slot.occupant.name, slot.occupant);
      }
      slot.occupant = null;
    }

    for (const slot of this.#slots) {
      const playerIndex = playersToAssign.findIndex(p => 
          !assignedPlayerNames.has(p.name) && p.position === slot.role
      );

      if (playerIndex !== -1) {
        const profile = playersToAssign[playerIndex];
        assignedPlayerNames.add(profile.name);

        let occupant = existingOccupants.get(profile.name);
        if (!occupant) {
          const newId = this.#nextPlayerId++;
          occupant = { 
              ...profile, 
              id: newId,
              jerseyNumber: profile.number,
              number: profile.number,
          };
        }
        slot.occupant = occupant;
      }
    }

    this.render();
  }

  public dropPlayer(profile: DraggedProfile, clientX: number, clientY: number): void {
    const coords = this.#toPitchCoordinates(clientX, clientY);
    if (!coords) return;

    const { x, y } = coords;
    let targetSlot = this.#highlightedSlotIndex !== null ? this.#getSlotByIndex(this.#highlightedSlotIndex) : null;
    if (!targetSlot) {
      targetSlot = this.#findClosestSlot(x, y, { preferVacant: true })?.slot
        ?? this.#findClosestSlot(x, y)?.slot
        ?? null;
    }

    if (!targetSlot) return;

    const distanceToTarget = this.#distanceToSlot(targetSlot, x, y);
    if (distanceToTarget > SLOT_HOVER_DISTANCE) {
      this.#setHighlightedSlot(null);
      return;
    }

    const existingSlot = this.#slots.find(slot => slot.occupant?.name === profile.name);
    if (existingSlot && existingSlot === targetSlot) {
      this.#setHighlightedSlot(null);
      return;
    }

    const displaced = targetSlot.occupant ?? null;
    const existingId = existingSlot?.occupant?.id ?? null;
    const existingJersey = existingSlot?.occupant?.jerseyNumber ?? existingSlot?.occupant?.number;
    const incomingJersey = profile.jerseyNumber ?? profile.number ?? existingJersey;

    if (existingSlot && existingSlot !== targetSlot) {
      existingSlot.occupant = null;
      this.#applySlotStyles(existingSlot);
    }

    const assignedId = existingId ?? this.#nextPlayerId++;
    const occupant: SlotOccupant = { ...profile, id: assignedId, jerseyNumber: incomingJersey };
    if (incomingJersey !== undefined) {
      occupant.number = incomingJersey;
    }
    targetSlot.occupant = occupant;

    if (displaced && displaced.name !== profile.name) {
      if (existingSlot && existingSlot !== targetSlot) {
        existingSlot.occupant = displaced;
        this.#applySlotStyles(existingSlot);
      } else {
        this.#assignDisplacedPlayer(displaced, targetSlot.index);
      }
    }

    this.#setHighlightedSlot(null);
    this.render();
  }

  #toPitchCoordinates(clientX: number, clientY: number): { x: number; y: number } | null {
    const svgRect = this.#svg.getBoundingClientRect();
    const width = svgRect.width;
    const height = svgRect.height;
    if (width === 0 || height === 0) return null;

    const scaleX = (PITCH_WIDTH + MARGIN * 2) / width;
    const scaleY = (PITCH_HEIGHT + MARGIN * 2) / height;

    const x = (clientX - svgRect.left) * scaleX - MARGIN;
    const y = (clientY - svgRect.top) * scaleY - MARGIN;
    return { x, y };
  }

  #findClosestSlot(
    x: number,
    y: number,
    options: { preferVacant?: boolean } = {}
  ): { slot: SlotState; distance: number } | null {
    let best: { slot: SlotState; distance: number } | null = null;
    const preferVacant = options.preferVacant ?? false;

    for (const slot of this.#slots) {
      const distance = this.#distanceToSlot(slot, x, y);
      const penalty = preferVacant && slot.occupant ? 60 : 0;
      const effective = distance + penalty;

      if (!best || effective < best.distance) {
        best = { slot, distance: effective };
      }
    }

    if (!best) return null;
    return { slot: best.slot, distance: this.#distanceToSlot(best.slot, x, y) };
  }

  #distanceToSlot(slot: SlotState, x: number, y: number): number {
    const slotX = slot.x * PITCH_WIDTH;
    const slotY = slot.y * PITCH_HEIGHT;
    return Math.hypot(slotX - x, slotY - y);
  }

  #slotRadius(slot: SlotState): number {
    return SLOT_BASE_RADIUS;
  }

  #createHexagonPoints(cx: number, cy: number, radius: number): string {
    const points: string[] = [];
    for (let i = 0; i < 6; i += 1) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      const px = cx + radius * Math.cos(angle);
      const py = cy + radius * Math.sin(angle);
      points.push(`${px},${py}`);
    }
    return points.join(' ');
  }

  #getSlotByIndex(index: number): SlotState | null {
    return this.#slots.find(slot => slot.index === index) ?? null;
  }

  #setHighlightedSlot(slot: SlotState | null): void {
    const previous = this.#highlightedSlotIndex !== null ? this.#getSlotByIndex(this.#highlightedSlotIndex) : null;
    const nextIndex = slot?.index ?? null;
    if (this.#highlightedSlotIndex === nextIndex) return;

    this.#highlightedSlotIndex = nextIndex;
    if (previous) this.#applySlotStyles(previous);
    if (slot) this.#applySlotStyles(slot);
  }

  #applySlotStyles(slot: SlotState): void {
    const element = slot.element;
    if (!element) return;

    const isHighlighted = this.#highlightedSlotIndex === slot.index;
    const roleColor = ROLE_COLORS[slot.role];
    const baseStroke = roleColor;
    const baseFill = slot.occupant ? SLOT_OCCUPIED_FILL : SLOT_EMPTY_FILL;
    const fill = isHighlighted
      ? (slot.occupant ? 'rgba(255, 255, 255, 0.36)' : SLOT_HIGHLIGHT_FILL)
      : baseFill;
    const stroke = isHighlighted ? SLOT_HIGHLIGHT_STROKE : baseStroke;

    element.setAttribute('fill', fill);
    element.setAttribute('stroke', stroke);
    element.setAttribute('stroke-width', '1.9');
  }

  #handleDragOver = (event: DragEvent): void => {
    event.preventDefault();
    const coords = this.#toPitchCoordinates(event.clientX, event.clientY);
    if (!coords) return;

    const { x, y } = coords;
    const candidate = this.#findClosestSlot(x, y, { preferVacant: true })
      ?? this.#findClosestSlot(x, y);
    if (!candidate || candidate.distance > SLOT_HOVER_DISTANCE) {
      this.#setHighlightedSlot(null);
      return;
    }

    this.#setHighlightedSlot(candidate.slot);
  };

  #handleDragLeave = (event: DragEvent): void => {
    const related = event.relatedTarget as Node | null;
    if (related && (related === this.#svg || this.#svg.contains(related))) {
      return;
    }
    this.#setHighlightedSlot(null);
  };

  #handleDrop = (event: DragEvent): void => {
    event.preventDefault();
    this.#setHighlightedSlot(null);
  };

  #assignDisplacedPlayer(player: SlotOccupant, ignoreIndex: number): void {
    const fallback = this.#slots.find(slot => slot.index !== ignoreIndex && !slot.occupant);
    if (fallback) {
      fallback.occupant = player;
      this.#applySlotStyles(fallback);
    }
  }

  #handleSlotMouseDown = (event: MouseEvent, slot: SlotState): void => {
    if (event.button !== 0) return; // Only handle left-clicks
    event.preventDefault();
    const coords = this.#toPitchCoordinates(event.clientX, event.clientY);
    if (!coords) return;

    this.#draggedSlot = {
      slot,
      startX: coords.x,
      startY: coords.y,
      isDragging: false,
      startTime: Date.now(),
    };

    window.addEventListener('mousemove', this.#handleSlotMouseMove);
    window.addEventListener('mouseup', this.#handleSlotMouseUp);
  }

  #handleSlotMouseMove = (event: MouseEvent): void => {
    if (!this.#draggedSlot) return;
    event.preventDefault();

    if (!this.#draggedSlot.isDragging) {
      const dist = Math.hypot(event.clientX - this.#draggedSlot.startX, event.clientY - this.#draggedSlot.startY);
      if (dist > 5) { // Start dragging after 5px movement
        this.#draggedSlot.isDragging = true;
      }
    }

    if (this.#draggedSlot.isDragging) {
      const coords = this.#toPitchCoordinates(event.clientX, event.clientY);
      if (!coords) return;

      const { slot } = this.#draggedSlot;

      const cellWidth = PITCH_WIDTH / GRID_COLS;
      const cellHeight = PITCH_HEIGHT / GRID_ROWS;

      const rawCol = Math.floor(coords.x / cellWidth);
      const rawRow = Math.floor(coords.y / cellHeight);
      const gridColumn = Math.max(0, Math.min(GRID_COLS - 1, rawCol));
      const gridRow = Math.max(0, Math.min(GRID_ROWS - 1, rawRow));

      const targetX = (gridColumn + 0.5) / GRID_COLS;
      const targetY = (gridRow + 0.5) / GRID_ROWS;

      const collision = this.#slots.some(
        s => s !== slot && Math.abs(s.x - targetX) < 0.01 && Math.abs(s.y - targetY) < 0.01
      );

      if (!collision) {
        slot.x = targetX;
        slot.y = targetY;
        slot.gridColumn = gridColumn;
        slot.gridRow = gridRow;
      }

      this.render();
    }
  }

  #handleSlotMouseUp = (event: MouseEvent): void => {
    if (!this.#draggedSlot) return;
    event.preventDefault();

    const wasDragging = this.#draggedSlot.isDragging;
    const duration = Date.now() - this.#draggedSlot.startTime;

    if (wasDragging) {
      this.#persistCustomFormation();
    } else if (duration < 200) {
      this.#openInstructionPanel(this.#draggedSlot.slot);
    }

    this.#draggedSlot = null;
    window.removeEventListener('mousemove', this.#handleSlotMouseMove);
    window.removeEventListener('mouseup', this.#handleSlotMouseUp);
  }

  #persistCustomFormation = (): void => {
    const newFormation = this.getFormation();
    const tactic = JSON.parse(JSON.stringify(this.#options.tactic)) as Tactic;
    const phase = this.#options.mode;

    if (phase === 'InPossession') {
      tactic.inPossession.progression.customFormation = newFormation;
      tactic.inPossession.progression.formation = 'Custom';
    } else {
      tactic.outOfPossession.midBlock.customFormation = newFormation;
      tactic.outOfPossession.midBlock.formation = 'Custom';
    }

    normalizeTactic(tactic);
    this.#options.store.updateActiveTactic(tactic);
  }

  #openInstructionPanel(slot: SlotState): void {
    this.#closeInstructionPanel();

    const occupant = slot.occupant ?? null;
    const tactic = this.#options.tactic;
    const instructions = tactic.playerInstructions ?? [];
    const occupantIndex = typeof occupant?.index === 'number' ? occupant.index : null;

    const existingInstruction = occupantIndex != null
      ? instructions.find(entry => entry.playerIndex === occupantIndex)
      : undefined;

    const fallbackInstruction = instructions.find(entry => entry.playerIndex === slot.index);

    const initialPlayerIndex = existingInstruction?.playerIndex ?? fallbackInstruction?.playerIndex ?? null;

    const workingInstruction: PlayerInstruction = existingInstruction
      ? JSON.parse(JSON.stringify(existingInstruction))
      : fallbackInstruction
        ? JSON.parse(JSON.stringify(fallbackInstruction))
        : {
            playerIndex: occupantIndex ?? slot.index,
            directives: {},
          };

    const panel = document.createElement('div');
    panel.className = 'tactics-instruction-panel';

    const roleOptions = (['GK', 'DF', 'MF', 'FW'] as const)
      .map(role => `<option value="${role}" ${role === slot.role ? 'selected' : ''}>${role}</option>`)
      .join('');

    const markingType = workingInstruction.directives.marking?.type ?? '';
    const markingTarget = workingInstruction.directives.marking?.type === 'man'
      ? workingInstruction.directives.marking.targetPlayerIndex
      : '';
    if (slot.role !== 'DF') {
      delete workingInstruction.directives.marking;
    }

    const pressingConfig = getPressingConfig(slot.role);
    const positioningConfig = getPositioningConfig(slot.role);

    const pressingActive = workingInstruction.directives.pressing != null;
    const pressingIntensity = workingInstruction.directives.pressing?.intensity ?? 0.5;
    const pressingTrigger = workingInstruction.directives.pressing?.trigger ?? 'always';
    let positioningType = workingInstruction.directives.positioning?.type ?? '';
    const positioningX = workingInstruction.directives.positioning?.type === 'hold_zone'
      ? workingInstruction.directives.positioning.x
      : 0.5;
    const positioningY = workingInstruction.directives.positioning?.type === 'hold_zone'
      ? workingInstruction.directives.positioning.y
      : 0.5;

    const positioningOptions = positioningConfig.options ?? [];
    if (positioningOptions.length > 0 && !positioningOptions.some(opt => opt.value === positioningType)) {
      positioningType = '';
    }

    const bodyFields: string[] = [];
    bodyFields.push(`
      <label>
        포지션 역할
        <select data-role="instruction-role">${roleOptions}</select>
      </label>
    `);
    bodyFields.push(`
      <label>
        선수 인덱스
        <input type="number" min="0" max="21" value="${workingInstruction.playerIndex}" data-role="instruction-player-index">
      </label>
    `);

    if (slot.role === 'DF') {
      bodyFields.push(`
        <label>
          마킹 유형
          <select data-role="instruction-marking">
            <option value="" ${markingType === '' ? 'selected' : ''}>없음</option>
            <option value="zonal" ${markingType === 'zonal' ? 'selected' : ''}>지역 방어</option>
            <option value="man" ${markingType === 'man' ? 'selected' : ''}>대인 방어</option>
          </select>
        </label>
      `);
      bodyFields.push(`
        <label>
          마킹 대상
          <input type="number" min="0" max="21" value="${markingTarget}" data-role="instruction-marking-target" ${markingType === 'man' ? '' : 'disabled'}>
        </label>
      `);
    }

    bodyFields.push(`
      <label>
        ${pressingConfig.toggleLabel}
        <input type="checkbox" data-role="instruction-pressing-toggle" ${pressingActive ? 'checked' : ''}>
      </label>
    `);
    bodyFields.push(`
      <label>
        ${pressingConfig.intensityLabel}
        <input type="number" min="0" max="1" step="0.05" value="${pressingIntensity.toFixed(2)}" data-role="instruction-pressing-intensity" ${pressingActive ? '' : 'disabled'}>
      </label>
    `);
    bodyFields.push(`
      <label>
        ${pressingConfig.triggerLabel}
        <select data-role="instruction-pressing-trigger" ${pressingActive ? '' : 'disabled'}>
          <option value="always" ${pressingTrigger === 'always' ? 'selected' : ''}>상시</option>
          <option value="near_ball" ${pressingTrigger === 'near_ball' ? 'selected' : ''}>볼 근처</option>
          <option value="on_touch" ${pressingTrigger === 'on_touch' ? 'selected' : ''}>터치 시</option>
        </select>
      </label>
    `);

    if (positioningOptions.length > 0) {
      const positioningOptionsHtml = positioningOptions
        .map(option => `<option value="${option.value}" ${option.value === positioningType ? 'selected' : ''}>${option.label}</option>`)
        .join('');
      bodyFields.push(`
        <label>
          ${positioningConfig.selectLabel}
          <select data-role="instruction-positioning">
            ${positioningOptionsHtml}
          </select>
        </label>
      `);
      bodyFields.push(`
        <label>
          ${positioningConfig.xLabel}
          <input type="number" min="0" max="1" step="0.01" value="${positioningX.toFixed(2)}" data-role="instruction-positioning-x" ${positioningType === 'hold_zone' ? '' : 'disabled'}>
        </label>
      `);
      bodyFields.push(`
        <label>
          ${positioningConfig.yLabel}
          <input type="number" min="0" max="1" step="0.01" value="${positioningY.toFixed(2)}" data-role="instruction-positioning-y" ${positioningType === 'hold_zone' ? '' : 'disabled'}>
        </label>
      `);
    }

    panel.innerHTML = `
      <div class="tactics-instruction-panel__header">
        <div>
          <div class="tactics-instruction-panel__title">${slot.label} (슬롯 ${slot.index + 1})</div>
          ${occupant ? `<div class="tactics-instruction-panel__subtitle">${occupant.name}${occupant.jerseyNumber ? ` (#${occupant.jerseyNumber})` : ''}</div>` : '<div class="tactics-instruction-panel__subtitle">배치된 선수가 없습니다</div>'}
        </div>
        <button type="button" class="tactics-instruction-panel__close" data-role="instruction-close">✕</button>
      </div>
      <div class="tactics-instruction-panel__body">
        ${bodyFields.join('\n')}
      </div>
      <div class="tactics-instruction-panel__footer">
        <button type="button" class="tactics-instruction-panel__danger" data-role="instruction-remove">지침 제거</button>
        <div class="tactics-instruction-panel__gap"></div>
        <button type="button" class="tactics-instruction-panel__primary" data-role="instruction-apply">적용</button>
      </div>
    `;

    document.body.appendChild(panel);
    this.#instructionPanel = panel;
    this.#instructionPanelSlot = slot;

    this.#positionInstructionPanel(slot, panel);

    panel.querySelector('[data-role="instruction-close"]')?.addEventListener('click', () => this.#closeInstructionPanel());
    panel.querySelector('[data-role="instruction-role"]')?.addEventListener('change', (event) => {
      const select = event.target as HTMLSelectElement;
      const newRole = select.value as FormationRole;
      const slotIndex = slot.index;
      slot.role = newRole;
      this.render();
      const updatedSlot = this.#slots.find(s => s.index === slotIndex);
      if (updatedSlot) {
        this.#openInstructionPanel(updatedSlot);
      }
    });
    panel.querySelector('[data-role="instruction-player-index"]')?.addEventListener('change', (event) => {
      const input = event.target as HTMLInputElement;
      const parsed = Number.parseInt(input.value, 10);
      const clamped = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), 21) : 0;
      input.value = String(clamped);
      workingInstruction.playerIndex = clamped;
    });
    panel.querySelector('[data-role="instruction-marking"]')?.addEventListener('change', (event) => {
      const select = event.target as HTMLSelectElement;
      const targetInput = panel.querySelector<HTMLInputElement>('[data-role="instruction-marking-target"]');
      if (select.value === 'man') {
        workingInstruction.directives.marking = {
          type: 'man',
          targetPlayerIndex: Number.parseInt(targetInput?.value ?? '0', 10) || 0,
        };
        targetInput?.removeAttribute('disabled');
      } else if (select.value === 'zonal') {
        workingInstruction.directives.marking = { type: 'zonal' };
        targetInput?.setAttribute('disabled', 'true');
      } else {
        delete workingInstruction.directives.marking;
        targetInput?.setAttribute('disabled', 'true');
      }
    });
    panel.querySelector('[data-role="instruction-marking-target"]')?.addEventListener('change', (event) => {
      const input = event.target as HTMLInputElement;
      const parsed = Number.parseInt(input.value, 10);
      const clamped = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), 21) : 0;
      input.value = String(clamped);
      workingInstruction.directives.marking = { type: 'man', targetPlayerIndex: clamped };
    });

    const pressingToggle = panel.querySelector<HTMLInputElement>('[data-role="instruction-pressing-toggle"]');
    const pressingIntensityInput = panel.querySelector<HTMLInputElement>('[data-role="instruction-pressing-intensity"]');
    const pressingTriggerSelect = panel.querySelector<HTMLSelectElement>('[data-role="instruction-pressing-trigger"]');

    pressingToggle?.addEventListener('change', () => {
      if (pressingToggle.checked) {
        workingInstruction.directives.pressing = {
          intensity: this.#clamp01(Number.parseFloat(pressingIntensityInput?.value ?? '0.5') || 0.5),
          trigger: (pressingTriggerSelect?.value as 'always' | 'near_ball' | 'on_touch') ?? 'always',
        };
        pressingIntensityInput?.removeAttribute('disabled');
        pressingTriggerSelect?.removeAttribute('disabled');
      } else {
        delete workingInstruction.directives.pressing;
        pressingIntensityInput?.setAttribute('disabled', 'true');
        pressingTriggerSelect?.setAttribute('disabled', 'true');
      }
    });

    pressingIntensityInput?.addEventListener('change', () => {
      const raw = Number.parseFloat(pressingIntensityInput.value);
      const clamped = this.#clamp01(Number.isFinite(raw) ? raw : 0.5);
      pressingIntensityInput.value = clamped.toFixed(2);
      if (!workingInstruction.directives.pressing) {
        workingInstruction.directives.pressing = { intensity: clamped, trigger: 'always' };
      } else {
        workingInstruction.directives.pressing.intensity = clamped;
      }
    });

    pressingTriggerSelect?.addEventListener('change', () => {
      const trigger = pressingTriggerSelect.value as 'always' | 'near_ball' | 'on_touch';
      if (!workingInstruction.directives.pressing) {
        workingInstruction.directives.pressing = { intensity: 0.5, trigger };
      } else {
        workingInstruction.directives.pressing.trigger = trigger;
      }
    });

    const positioningSelect = panel.querySelector<HTMLSelectElement>('[data-role="instruction-positioning"]');
    const posXInput = panel.querySelector<HTMLInputElement>('[data-role="instruction-positioning-x"]');
    const posYInput = panel.querySelector<HTMLInputElement>('[data-role="instruction-positioning-y"]');

    positioningSelect?.addEventListener('change', () => {
      const value = positioningSelect.value;
      switch (value) {
        case '':
          delete workingInstruction.directives.positioning;
          posXInput?.setAttribute('disabled', 'true');
          posYInput?.setAttribute('disabled', 'true');
          break;
        case 'hold_zone': {
          const current = workingInstruction.directives.positioning?.type === 'hold_zone'
            ? workingInstruction.directives.positioning
            : { x: 0.5, y: 0.5 };
          workingInstruction.directives.positioning = {
            type: 'hold_zone',
            x: this.#clamp01(current.x),
            y: this.#clamp01(current.y),
          };
          posXInput?.removeAttribute('disabled');
          posYInput?.removeAttribute('disabled');
          posXInput!.value = workingInstruction.directives.positioning.x.toFixed(2);
          posYInput!.value = workingInstruction.directives.positioning.y.toFixed(2);
          break;
        }
        default:
          workingInstruction.directives.positioning = { type: value as 'stay_wide' | 'cut_inside' | 'overlap' | 'underlap' };
          posXInput?.setAttribute('disabled', 'true');
          posYInput?.setAttribute('disabled', 'true');
          break;
      }
    });

    const handlePositionCoord = (input: HTMLInputElement, axis: 'x' | 'y') => {
      const raw = Number.parseFloat(input.value);
      const clamped = this.#clamp01(Number.isFinite(raw) ? raw : 0.5);
      input.value = clamped.toFixed(2);
      if (workingInstruction.directives.positioning?.type !== 'hold_zone') {
        workingInstruction.directives.positioning = { type: 'hold_zone', x: 0.5, y: 0.5 };
      }
      if (axis === 'x') {
        workingInstruction.directives.positioning.x = clamped;
      } else {
        workingInstruction.directives.positioning.y = clamped;
      }
    };

    posXInput?.addEventListener('change', () => posXInput && handlePositionCoord(posXInput, 'x'));
    posYInput?.addEventListener('change', () => posYInput && handlePositionCoord(posYInput, 'y'));

    panel.querySelector('[data-role="instruction-remove"]')?.addEventListener('click', () => {
      let nextInstructions = (this.#options.tactic.playerInstructions ?? []).filter(entry => entry.playerIndex !== workingInstruction.playerIndex);
      if (initialPlayerIndex != null && initialPlayerIndex !== workingInstruction.playerIndex) {
        nextInstructions = nextInstructions.filter(entry => entry.playerIndex !== initialPlayerIndex);
      }
      const nextTactic = JSON.parse(JSON.stringify(this.#options.tactic)) as Tactic;
      nextTactic.playerInstructions = nextInstructions;
      normalizeTactic(nextTactic);
      this.#options.store.updateActiveTactic(nextTactic);
      this.#closeInstructionPanel();
    });

    panel.querySelector('[data-role="instruction-apply"]')?.addEventListener('click', () => {
      const nextTactic = JSON.parse(JSON.stringify(this.#options.tactic)) as Tactic;
      let list = nextTactic.playerInstructions ?? [];
      const sanitized: PlayerInstruction = JSON.parse(JSON.stringify(workingInstruction));

      if (slot.role !== 'DF') {
        delete sanitized.directives.marking;
      } else if (!sanitized.directives.marking) {
        delete sanitized.directives.marking;
      }
      if (!sanitized.directives.pressing) {
        delete sanitized.directives.pressing;
      } else {
        sanitized.directives.pressing.intensity = this.#clamp01(sanitized.directives.pressing.intensity);
      }
      if (!sanitized.directives.positioning) {
        delete sanitized.directives.positioning;
      } else if ((positioningConfig.options ?? []).length === 0) {
        delete sanitized.directives.positioning;
      }

      const hasDirective = Boolean(sanitized.directives.marking || sanitized.directives.pressing || sanitized.directives.positioning);

      list = list.filter(entry => entry.playerIndex !== workingInstruction.playerIndex);
      if (initialPlayerIndex != null && initialPlayerIndex !== workingInstruction.playerIndex) {
        list = list.filter(entry => entry.playerIndex !== initialPlayerIndex);
      }

      if (hasDirective) {
        list.push(sanitized);
      }
      nextTactic.playerInstructions = list;
      normalizeTactic(nextTactic);
      this.#options.store.updateActiveTactic(nextTactic);
      this.#closeInstructionPanel();
    });
  }

  #closeInstructionPanel(): void {
    if (this.#instructionPanel) {
      this.#instructionPanel.remove();
      this.#instructionPanel = null;
      this.#instructionPanelSlot = null;
    }
  }

  #positionInstructionPanel(slot: SlotState, panel: HTMLDivElement): void {
    const rect = slot.element?.getBoundingClientRect();
    if (!rect) {
      panel.style.position = 'fixed';
      panel.style.right = '24px';
      panel.style.top = '24px';
      return;
    }

    panel.style.position = 'absolute';
    panel.style.left = `${rect.right + 12}px`;
    panel.style.top = `${rect.top}px`;

    const bounds = panel.getBoundingClientRect();
    const margin = 12;

    if (bounds.right > window.innerWidth - margin) {
      panel.style.left = `${Math.max(margin, rect.left - bounds.width - margin)}px`;
    }

    if (bounds.bottom > window.innerHeight - margin) {
      const adjustedTop = Math.max(margin, window.innerHeight - bounds.height - margin);
      panel.style.top = `${adjustedTop}px`;
    }
  }

  #clamp01(value: number): number {
    if (!Number.isFinite(value)) return 0;
    return Math.min(Math.max(value, 0), 1);
  }

  #handleInstructionKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.#closeInstructionPanel();
    }
  };

  public getFormation(): { role: string; x: number; y: number; gridColumn: number; gridRow: number }[] {
    return this.#slots.map(slot => {
      const column = Math.round(slot.x * GRID_COLS - 0.5);
      const row = Math.round(slot.y * GRID_ROWS - 0.5);
      const gridColumn = Math.max(0, Math.min(GRID_COLS - 1, column));
      const gridRow = Math.max(0, Math.min(GRID_ROWS - 1, row));
      const x = (gridColumn + 0.5) / GRID_COLS;
      const y = (gridRow + 0.5) / GRID_ROWS;

      slot.gridColumn = gridColumn;
      slot.gridRow = gridRow;

      return {
        role: slot.role,
        x,
        y,
        gridColumn,
        gridRow,
      };
    });
  }

  private drawPitch(): void {
    const group = document.createElementNS(SVG_NS, 'g');
    group.setAttribute('transform', `translate(${MARGIN}, ${MARGIN})`);
    this.#svg.appendChild(group);

    const baseRect = document.createElementNS(SVG_NS, 'rect');
    baseRect.setAttribute('width', PITCH_WIDTH.toString());
    baseRect.setAttribute('height', PITCH_HEIGHT.toString());
    baseRect.setAttribute('fill', PITCH_COLOR);
    group.appendChild(baseRect);

    const line = (x1: number, y1: number, x2: number, y2: number) => {
      const l = document.createElementNS(SVG_NS, 'line');
      l.setAttribute('x1', x1.toString());
      l.setAttribute('y1', y1.toString());
      l.setAttribute('x2', x2.toString());
      l.setAttribute('y2', y2.toString());
      l.setAttribute('stroke', LINE_COLOR);
      l.setAttribute('stroke-width', LINE_WIDTH);
      group.appendChild(l);
    };

    const boundary = document.createElementNS(SVG_NS, 'rect');
    boundary.setAttribute('x', '0');
    boundary.setAttribute('y', '0');
    boundary.setAttribute('width', PITCH_WIDTH.toString());
    boundary.setAttribute('height', PITCH_HEIGHT.toString());
    boundary.setAttribute('stroke', LINE_COLOR);
    boundary.setAttribute('stroke-width', LINE_WIDTH);
    boundary.setAttribute('fill', 'none');
    group.appendChild(boundary);

    const centerCircle = document.createElementNS(SVG_NS, 'circle');
    centerCircle.setAttribute('cx', (PITCH_WIDTH / 2).toString());
    centerCircle.setAttribute('cy', (PITCH_HEIGHT / 2).toString());
    centerCircle.setAttribute('r', '24');
    centerCircle.setAttribute('stroke', LINE_COLOR);
    centerCircle.setAttribute('stroke-width', LINE_WIDTH);
    centerCircle.setAttribute('fill', 'none');
    group.appendChild(centerCircle);

    line(0, PITCH_HEIGHT / 2, PITCH_WIDTH, PITCH_HEIGHT / 2);

    for (const side of ['top', 'bottom']) {
      const yMultiplier = side === 'top' ? 1 : -1;
      const yOffset = side === 'top' ? 0 : PITCH_HEIGHT;

      const pBoxWidth = 160;
      const pBoxHeight = 66;
      const pBoxX = (PITCH_WIDTH - pBoxWidth) / 2;
      const pBoxLineY = yOffset + yMultiplier * pBoxHeight;
      line(pBoxX, yOffset, pBoxX, pBoxLineY);
      line(pBoxX + pBoxWidth, yOffset, pBoxX + pBoxWidth, pBoxLineY);
      line(pBoxX, pBoxLineY, pBoxX + pBoxWidth, pBoxLineY);

      const gBoxWidth = 80;
      const gBoxHeight = 24;
      const gBoxX = (PITCH_WIDTH - gBoxWidth) / 2;
      const gBoxLineY = yOffset + yMultiplier * gBoxHeight;
      line(gBoxX, yOffset, gBoxX, gBoxLineY);
      line(gBoxX + gBoxWidth, yOffset, gBoxX + gBoxWidth, gBoxLineY);
      line(gBoxX, gBoxLineY, gBoxX + gBoxWidth, gBoxLineY);

      const goalWidth = 32;
      const goalHeight = 4;
      const goal = document.createElementNS(SVG_NS, 'rect');
      goal.setAttribute('x', ((PITCH_WIDTH - goalWidth) / 2).toString());
      goal.setAttribute('y', (side === 'top' ? yOffset - goalHeight : yOffset).toString());
      goal.setAttribute('width', goalWidth.toString());
      goal.setAttribute('height', goalHeight.toString());
      goal.setAttribute('fill', LINE_COLOR);
      group.appendChild(goal);

      const spotY = yOffset + yMultiplier * 40;
      const penaltySpot = document.createElementNS(SVG_NS, 'circle');
      penaltySpot.setAttribute('cx', (PITCH_WIDTH / 2).toString());
      penaltySpot.setAttribute('cy', spotY.toString());
      penaltySpot.setAttribute('r', '1.5');
      penaltySpot.setAttribute('fill', LINE_COLOR);
      group.appendChild(penaltySpot);

      const arc = document.createElementNS(SVG_NS, 'path');
      const arcRadius = 24;
      const arcSweepFlag = side === 'top' ? 1 : 0;
      const startX = PITCH_WIDTH / 2 - 18;
      const endX = PITCH_WIDTH / 2 + 18;
      const arcY = pBoxLineY;
      const d = `M ${startX} ${arcY} A ${arcRadius} ${arcRadius} 0 0 ${arcSweepFlag} ${endX} ${arcY}`;
      arc.setAttribute('d', d);
      arc.setAttribute('stroke', LINE_COLOR);
      arc.setAttribute('stroke-width', LINE_WIDTH);
      arc.setAttribute('fill', 'none');
      group.appendChild(arc);
    }

    const cornerRadius = 6;
    const cornerArc = (x1: number, y1: number, x2: number, y2: number, sweep: number) => {
        const path = document.createElementNS(SVG_NS, 'path');
        const d = `M ${x1} ${y1} A ${cornerRadius} ${cornerRadius} 0 0 ${sweep} ${x2} ${y2}`;
        path.setAttribute('d', d);
        path.setAttribute('stroke', LINE_COLOR);
        path.setAttribute('stroke-width', LINE_WIDTH);
        path.setAttribute('fill', 'none');
        group.appendChild(path);
    }
    cornerArc(0, cornerRadius, cornerRadius, 0, 0);
    cornerArc(PITCH_WIDTH - cornerRadius, 0, PITCH_WIDTH, cornerRadius, 0);
    cornerArc(cornerRadius, PITCH_HEIGHT, 0, PITCH_HEIGHT - cornerRadius, 0);
    cornerArc(PITCH_WIDTH, PITCH_HEIGHT - cornerRadius, PITCH_WIDTH - cornerRadius, PITCH_HEIGHT, 0);
  }

  private drawGrid(): void {
    const group = document.createElementNS(SVG_NS, 'g');
    group.setAttribute('transform', `translate(${MARGIN}, ${MARGIN})`);
    this.#svg.appendChild(group);

    const cellWidth = PITCH_WIDTH / GRID_COLS;
    const cellHeight = PITCH_HEIGHT / GRID_ROWS;

    // Draw vertical lines
    for (let i = 1; i < GRID_COLS; i++) {
      const x = i * cellWidth;
      const line = document.createElementNS(SVG_NS, 'line');
      line.setAttribute('x1', x.toString());
      line.setAttribute('y1', '0');
      line.setAttribute('x2', x.toString());
      line.setAttribute('y2', PITCH_HEIGHT.toString());
      line.setAttribute('stroke', 'rgba(255, 255, 255, 0.1)');
      line.setAttribute('stroke-width', '1');
      line.setAttribute('stroke-dasharray', '3,3');
      group.appendChild(line);
    }

    // Draw horizontal lines
    for (let i = 1; i < GRID_ROWS; i++) {
      const y = i * cellHeight;
      const line = document.createElementNS(SVG_NS, 'line');
      line.setAttribute('x1', '0');
      line.setAttribute('y1', y.toString());
      line.setAttribute('x2', PITCH_WIDTH.toString());
      line.setAttribute('y2', y.toString());
      line.setAttribute('stroke', 'rgba(255, 255, 255, 0.1)');
      line.setAttribute('stroke-width', '1');
      line.setAttribute('stroke-dasharray', '3,3');
      group.appendChild(line);
    }
  }

  private drawPlayers(): void {
    const group = document.createElementNS(SVG_NS, 'g');
    group.setAttribute('transform', `translate(${MARGIN}, ${MARGIN})`);
    this.#svg.appendChild(group);

    this.#slots.forEach(slot => {
      if (!slot.occupant) return;
      const profile = slot.occupant;
      const player = convertProfileToPlayer(profile);
      const cx = slot.x * PITCH_WIDTH;
      const cy = slot.y * PITCH_HEIGHT;
      this.drawPlayer(group, player, profile, cx, cy, slot);
    });
  }

  private drawSlots(): void {
    const group = document.createElementNS(SVG_NS, 'g');
    group.setAttribute('transform', `translate(${MARGIN}, ${MARGIN})`);
    this.#svg.appendChild(group);

    this.#slots.forEach(slot => {
      const radius = this.#slotRadius(slot);
      const cx = slot.x * PITCH_WIDTH;
      const cy = slot.y * PITCH_HEIGHT;
      const polygon = document.createElementNS(SVG_NS, 'polygon');
      polygon.setAttribute('points', this.#createHexagonPoints(cx, cy, radius));
      polygon.setAttribute('stroke-linejoin', 'round');
      polygon.setAttribute('pointer-events', 'all');
      polygon.style.cursor = 'grab';
      slot.element = polygon;
      group.appendChild(polygon);
      this.#applySlotStyles(slot);

      const text = document.createElementNS(SVG_NS, 'text');
      text.setAttribute('x', cx.toString());
      text.setAttribute('y', (cy + radius + 10).toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '7');
      text.setAttribute('fill', 'rgba(255, 255, 255, 0.7)');
      text.textContent = slot.label;
      group.appendChild(text);

      polygon.addEventListener('mousedown', (e) => this.#handleSlotMouseDown(e, slot));
    });
  }

  private drawPlayer(
    svgGroup: SVGGElement,
    player: Player,
    profile: SlotOccupant,
    cx: number,
    cy: number,
    slot: SlotState,
  ): void {
    const markerSize = 40;
    const wrapper = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
    wrapper.style.width = `${markerSize}px`;
    wrapper.style.height = `${markerSize}px`;
    wrapper.style.transform = `scale(${markerSize / 80})`;
    wrapper.style.transformOrigin = 'top left';
    wrapper.draggable = true;

    const markerElement = createPlayerMarker(player);
    markerElement.style.position = 'static';
    markerElement.style.left = '';
    markerElement.style.top = '';
    markerElement.draggable = false;
    
    wrapper.appendChild(markerElement);

    const foreignObject = document.createElementNS(SVG_NS, 'foreignObject');
    foreignObject.setAttribute('x', (cx - markerSize / 2).toString());
    foreignObject.setAttribute('y', (cy - markerSize / 2).toString());
    foreignObject.setAttribute('width', markerSize.toString());
    foreignObject.setAttribute('height', markerSize.toString());
    foreignObject.style.cursor = 'pointer';

    const onDragStart = (event: DragEvent) => {
      if (!event.dataTransfer) return;
      const { id: _ignored, ...rest } = profile;
      const payload = rest as DraggedProfile;
      event.dataTransfer.setData('application/json', JSON.stringify(payload));
      event.dataTransfer.setData('text/plain', profile.name);
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('application/x-fto-source', JSON.stringify({ source: 'pitch', slotIndex: slot.index }));
      event.dataTransfer.setDragImage(wrapper, markerSize / 2, markerSize / 2);
      if (this.#draggedSlot) {
        window.removeEventListener('mousemove', this.#handleSlotMouseMove);
        window.removeEventListener('mouseup', this.#handleSlotMouseUp);
        this.#draggedSlot = null;
      }
      this.#setHighlightedSlot(slot);
    };

    const onDragEnd = () => {
      this.#setHighlightedSlot(null);
    };

    wrapper.addEventListener('dragstart', onDragStart);
    wrapper.addEventListener('dragend', onDragEnd);
    wrapper.addEventListener('mousedown', (event) => this.#handleSlotMouseDown(event as MouseEvent, slot));

    foreignObject.addEventListener('click', (event) => {
      event.preventDefault();
      this.#openInstructionPanel(slot);
    });

    foreignObject.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      slot.occupant = null;
      this.render();
    });

    foreignObject.appendChild(wrapper);
    svgGroup.appendChild(foreignObject);

    const text = document.createElementNS(SVG_NS, 'text');
    text.setAttribute('x', cx.toString());
    text.setAttribute('y', (cy - (markerSize / 2) - 5).toString());
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '7');
    text.setAttribute('fill', 'rgba(255, 255, 255, 0.9)');
    text.textContent = player.name;
    svgGroup.appendChild(text);
  }

  public render(): void {
    this.#closeInstructionPanel();
    this.#assignRoleLabels(this.#slots);
    this.#options.mount.innerHTML = '';
    this.#svg.innerHTML = '';
    this.drawPitch();
    this.drawGrid();
    this.drawSlots();
    this.drawPlayers();
    this.#options.mount.appendChild(this.#svg);
    this.#updateOccupiedPlayers();
    this.#persistPlayerSelection();
  }

  #restorePlayerSelection(): void {
    const selection = this.#options.tactic.playerSelection ?? [];
    if (selection.length === 0) {
      return;
    }

    const squad = this.#options.squad;

    for (const entry of selection) {
      const slot = this.#slots.find(s => s.index === entry.slotIndex);
      if (!slot) continue;

      const profile = squad.find(player => player.name === entry.playerName);
      if (!profile) continue;

      const jerseyNumber = entry.playerNumber ?? profile.number ?? slot.index + 1;
      const occupant: SlotOccupant = {
        ...profile,
        id: this.#nextPlayerId++,
        jerseyNumber,
        number: jerseyNumber,
      };

      slot.occupant = occupant;
    }
  }

  #persistPlayerSelection(): void {
    const currentSelection: PlayerSelectionEntry[] = this.#slots
      .filter(slot => slot.occupant)
      .map(slot => {
        const player = slot.occupant!;
        return {
          slotIndex: slot.index,
          playerName: player.name,
          playerNumber: player.jerseyNumber ?? player.number,
        } satisfies PlayerSelectionEntry;
      })
      .sort((a, b) => a.slotIndex - b.slotIndex);

    const existingSelection = (this.#options.tactic.playerSelection ?? [])
      .slice()
      .sort((a, b) => a.slotIndex - b.slotIndex);

    if (JSON.stringify(currentSelection) === JSON.stringify(existingSelection)) {
      return;
    }

    const tactic = JSON.parse(JSON.stringify(this.#options.tactic)) as Tactic;
    tactic.playerSelection = currentSelection;
    normalizeTactic(tactic);
    this.#options.store.updateActiveTactic(tactic);
  }
}
