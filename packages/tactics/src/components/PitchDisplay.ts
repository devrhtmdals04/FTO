import type { Tactic, CustomFormationSlot } from '../models/tactic';
import { getFormationSlots, type FormationSlot, FormationRole } from '../presets/formationPresets';
import { createPlayerMarker } from '../models/marker';
import { createProfileOverlay } from '../../../squad/src/components/profile/ProfileOverlay';
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
  mode: 'Attacking' | 'Deffending';
}

interface SlotState {
  readonly index: number;
  x: number; // normalized 0..1 across pitch width
  y: number; // normalized 0..1 across pitch height
  role: FormationRole;
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
  #roleSelectionMenu: HTMLDivElement | null = null;

  constructor(options: PitchDisplayOptions) {
    this.#options = options;
    this.#slots = this.#createSlots();
    this.#svg = this.createSvgElement();
    this.#svg.addEventListener('dragover', this.#handleDragOver);
    this.#svg.addEventListener('dragleave', this.#handleDragLeave);
    this.#svg.addEventListener('drop', this.#handleDrop);
    window.addEventListener('mousedown', (e) => {
      if (this.#roleSelectionMenu && !this.#roleSelectionMenu.contains(e.target as Node)) {
        this.#removeRoleSelectionMenu();
      }
    });
    this.render();
  }

  #createSlots(): SlotState[] {
    const tacticPhase = this.#options.tactic[this.#options.mode];
    const { formation, customFormation } = tacticPhase;

    if (customFormation && customFormation.length > 0) {
      return customFormation.map((slot, index) => ({
        ...slot,
        index,
        occupant: null,
      })) as SlotState[];
    }

    return getFormationSlots(formation).map(slot => ({ ...slot, occupant: null }));
  }

  private createSvgElement(): SVGSVGElement {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${PITCH_WIDTH + MARGIN * 2} ${PITCH_HEIGHT + MARGIN * 2}`);
    svg.style.width = '100%';
    svg.style.height = 'auto';
    return svg;
  }

  #updateOccupiedPlayers = (): void => {
    const names = this.#slots.map(s => s.occupant?.name).filter(Boolean) as string[];
    this.#options.store.setOccupiedPlayerNames(names);
  }

  public autoAssignPlayers(): void {
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

      const col = Math.floor(coords.x / cellWidth);
      const row = Math.floor(coords.y / cellHeight);

      const snappedX = (col + 0.5) * cellWidth;
      const snappedY = (row + 0.5) * cellHeight;

      const newX = Math.max(0, Math.min(PITCH_WIDTH, snappedX));
      const newY = Math.max(0, Math.min(PITCH_HEIGHT, snappedY));

      const targetX = newX / PITCH_WIDTH;
      const targetY = newY / PITCH_HEIGHT;

      const collision = this.#slots.some(
        s => s !== slot && Math.abs(s.x - targetX) < 0.01 && Math.abs(s.y - targetY) < 0.01
      );

      if (!collision) {
        slot.x = targetX;
        slot.y = targetY;
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
      this.#handleSlotClick(this.#draggedSlot.slot);
    }

    this.#draggedSlot = null;
    window.removeEventListener('mousemove', this.#handleSlotMouseMove);
    window.removeEventListener('mouseup', this.#handleSlotMouseUp);
  }

  #persistCustomFormation = (): void => {
    const newFormation = this.getFormation();
    const tactic = JSON.parse(JSON.stringify(this.#options.tactic)) as Tactic;
    const phase = this.#options.mode;

    tactic[phase].customFormation = newFormation;
    tactic[phase].formation = 'Custom';

    this.#options.store.updateActiveTactic(tactic);
  }

  #handleSlotClick = (slot: SlotState): void => {
    if (slot.occupant) return;

    this.#removeRoleSelectionMenu();

    const menu = document.createElement('div');
    menu.className = 'role-selection-menu';
    const slotRect = slot.element!.getBoundingClientRect();
    menu.style.position = 'absolute';
    menu.style.left = `${slotRect.right + 5}px`;
    menu.style.top = `${slotRect.top}px`;
    menu.style.backgroundColor = '#2a2a2a';
    menu.style.border = '1px solid #444';
    menu.style.borderRadius = '4px';
    menu.style.padding = '4px';
    menu.style.display = 'flex';
    menu.style.flexDirection = 'column';
    menu.style.gap = '4px';
    menu.style.zIndex = '100';

    const roles: FormationRole[] = ['GK', 'DF', 'MF', 'FW'];
    roles.forEach(role => {
      const button = document.createElement('button');
      button.textContent = role;
      button.style.backgroundColor = '#3a3a3a';
      button.style.color = 'white';
      button.style.border = '1px solid #555';
      button.style.borderRadius = '3px';
      button.style.cursor = 'pointer';
      button.onclick = () => {
        slot.role = role;
        this.#removeRoleSelectionMenu();
        this.render();
      };
      menu.appendChild(button);
    });

    document.body.appendChild(menu);
    this.#roleSelectionMenu = menu;
  }

  #removeRoleSelectionMenu = (): void => {
    if (this.#roleSelectionMenu) {
      this.#roleSelectionMenu.remove();
      this.#roleSelectionMenu = null;
    }
  }

  public getFormation(): { role: string, x: number, y: number }[] {
    return this.#slots.map(slot => ({
      role: slot.role,
      x: slot.x,
      y: slot.y,
    }));
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
      text.textContent = slot.role;
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
      this.#setHighlightedSlot(slot);
    };

    const onDragEnd = () => {
      this.#setHighlightedSlot(null);
    };

    wrapper.addEventListener('dragstart', onDragStart);
    wrapper.addEventListener('dragend', onDragEnd);

    foreignObject.addEventListener('click', () => {
      const overlay = createProfileOverlay(profile);
      document.body.appendChild(overlay);
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
    this.#options.mount.innerHTML = '';
    this.#svg.innerHTML = '';
    this.#removeRoleSelectionMenu();
    this.drawPitch();
    this.drawGrid();
    this.drawSlots();
    this.drawPlayers();
    this.#options.mount.appendChild(this.#svg);
    this.#updateOccupiedPlayers();
  }
}
