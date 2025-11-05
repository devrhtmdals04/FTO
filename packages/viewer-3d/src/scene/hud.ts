import * as THREE from 'three';
import { debugStore } from '../debug';
import { DebugStore } from '../debug/store';
import { DebugUpdate, DbgEvent, Tag, TAGS, TAG_TO_BIT } from '../debug/types';
import { SimView } from '../state';

const TEAM_PHASE_MAP: Record<number, string> = {
  0: 'KickoffAttack',
  1: 'KickoffDefense',
  2: 'SetPieceAttack',
  3: 'SetPieceDefense',
  4: 'BuildUp',
  5: 'Progression',
  6: 'FinalThird',
  7: 'HighBlock',
  8: 'MidBlock',
  9: 'LowBlock',
  10: 'Neutral',
};

const TIMELINE_WINDOW = 180;
const VIEW_HISTORY_LIMIT = 900;

const MARKER_ICON: Partial<Record<Tag, string>> = {
  B: '●',
  F: '●',
  C: '━',
  X: '✖',
  W: '⏳',
  R: '⚠',
  G: '▮',
  E: '△',
};

type StepScope = 'all' | 'ai' | 'physics';

export interface HudCallbacks {
  requestTick?: (tick: number) => void;
  requestStep?: (delta: number, scope: StepScope) => void;
  requestPlaybackToggle?: (playing: boolean) => void;
  requestPlayerFocus?: (pid: number | null) => void;
  requestFollowLatestToggle?: (follow: boolean) => void;
  requestMaskChange?: (mask: number) => void;
}

export interface HudUpdateContext {
  playing: boolean;
  stepDt: number;
  selectedPid?: number | null;
  tacticPreset?: string | null;
}

interface TimelineMarker {
  event: DbgEvent;
  icon: string;
  tag: Tag;
}

function createDiv(className: string, parent?: HTMLElement): HTMLDivElement {
  const el = document.createElement('div');
  el.className = className;
  if (parent) parent.appendChild(el);
  return el;
}

function createSpan(className: string, parent?: HTMLElement): HTMLSpanElement {
  const el = document.createElement('span');
  el.className = className;
  if (parent) parent.appendChild(el);
  return el;
}

function createButton(label: string, className: string, parent: HTMLElement): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = className;
  btn.textContent = label;
  parent.appendChild(btn);
  return btn;
}

function formatTick(tick: number): string {
  return tick.toString().padStart(5, '0');
}

function formatNumber(value: number | undefined, decimals = 2): string {
  if (!Number.isFinite(value ?? NaN)) {
    return '-';
  }
  return (value as number).toFixed(decimals);
}

function summarizeFields(event: DbgEvent, limit = 3): string {
  const keys = Object.keys(event.fields).filter((key) => key !== 't' && key !== 'p' && key !== 'tag');
  if (keys.length === 0) {
    return '';
  }
  const parts: string[] = [];
  for (const key of keys) {
    if (parts.length >= limit) break;
    const value = event.fields[key];
    parts.push(`${key}=${value}`);
  }
  return parts.join(', ');
}

export class HUD {
  private readonly store: DebugStore;
  private readonly callbacks: HudCallbacks;

  private readonly root: HTMLDivElement;
  private readonly barTick: HTMLSpanElement;
  private readonly barSim: HTMLSpanElement;
  private readonly barPid: HTMLSpanElement;
  private readonly barBall: HTMLSpanElement;
  private readonly barPreset: HTMLSpanElement;
  private readonly barFps: HTMLSpanElement;
  private readonly playBtn: HTMLButtonElement;
  private readonly stepBackBtn: HTMLButtonElement;
  private readonly stepForwardBtn: HTMLButtonElement;
  private readonly stepBackLargeBtn: HTMLButtonElement;
  private readonly stepForwardLargeBtn: HTMLButtonElement;
  private readonly stepAiBtn: HTMLButtonElement;
  private readonly stepPhysicsBtn: HTMLButtonElement;
  private readonly filterInputs: Map<Tag, HTMLInputElement>;
  private readonly timelineSlider: HTMLInputElement;
  private readonly timelineMarkers: HTMLDivElement;
  private readonly timelineScrubLabel: HTMLSpanElement;
  private readonly pitchCanvas: HTMLCanvasElement;
  private readonly inspectorPlayerHeader: HTMLDivElement;
  private readonly inspectorGapList: HTMLDivElement;
  private readonly inspectorPassTable: HTMLTableSectionElement;
  private readonly inspectorActList: HTMLDivElement;
  private readonly inspectorReasonBadge: HTMLDivElement;
  private readonly eventPanelRaw: HTMLPreElement;
  private readonly consoleTableBody: HTMLTableSectionElement;
  private readonly consolePidInput: HTMLInputElement;
  private readonly consoleTagInput: HTMLInputElement;
  private readonly consoleTickFromInput: HTMLInputElement;
  private readonly consoleTickToInput: HTMLInputElement;

  private readonly unsubscribe: () => void;
  private readonly overlayCtx: CanvasRenderingContext2D | null;
  private readonly projectionVec = new THREE.Vector3();
  private canvasPixelWidth = 0;
  private canvasPixelHeight = 0;
  private canvasRatio = 1;

  private selectedTick: number = 0;
  private followLatest = true;
  private playing = false;
  private stepDt = 0.05;
  private focusPid: number | null = null;
  private latestView: SimView | null = null;
  private latestFps = 0;
  private latestPreset: string | null = null;
  private selectedEvent: DbgEvent | null = null;
  private readonly viewHistory = new Map<number, SimView>();
  private lastTimelineTick = -1;

  private consolePidFilter: number | null = null;
  private consoleTagFilter: string = '';
  private consoleTickFrom: number | null = null;
  private consoleTickTo: number | null = null;

  constructor(store: DebugStore = debugStore, callbacks: HudCallbacks = {}) {
    this.store = store;
    this.callbacks = callbacks;
    const { root, elements } = this.buildHud();
    this.root = root;
    ({
      barTick: this.barTick,
      barSim: this.barSim,
      barPid: this.barPid,
      barBall: this.barBall,
      barPreset: this.barPreset,
      barFps: this.barFps,
      playBtn: this.playBtn,
      stepBackBtn: this.stepBackBtn,
      stepForwardBtn: this.stepForwardBtn,
      stepBackLargeBtn: this.stepBackLargeBtn,
      stepForwardLargeBtn: this.stepForwardLargeBtn,
      stepAiBtn: this.stepAiBtn,
      stepPhysicsBtn: this.stepPhysicsBtn,
      filterInputs: this.filterInputs,
      timelineSlider: this.timelineSlider,
      timelineMarkers: this.timelineMarkers,
      timelineScrubLabel: this.timelineScrubLabel,
      pitchCanvas: this.pitchCanvas,
      inspectorPlayerHeader: this.inspectorPlayerHeader,
      inspectorGapList: this.inspectorGapList,
      inspectorPassTable: this.inspectorPassTable,
      inspectorActList: this.inspectorActList,
      inspectorReasonBadge: this.inspectorReasonBadge,
      eventPanelRaw: this.eventPanelRaw,
      consoleTableBody: this.consoleTableBody,
      consolePidInput: this.consolePidInput,
      consoleTagInput: this.consoleTagInput,
      consoleTickFromInput: this.consoleTickFromInput,
      consoleTickToInput: this.consoleTickToInput,
    } = elements);

    this.overlayCtx = this.pitchCanvas.getContext('2d');
    this.attachHandlers();
    const latestTick = this.store.getLatestTick();
    if (typeof latestTick === 'number') {
      this.selectedTick = latestTick;
    }
    this.unsubscribe = this.store.subscribe(this.onStoreUpdate);
    this.renderAll();
  }

  destroy(): void {
    this.unsubscribe();
    this.root.remove();
  }

  update(view: SimView, fps: number, context: Partial<HudUpdateContext> = {}): void {
    this.latestView = view;
    this.recordView(view);
    this.latestFps = fps;
    if (typeof context.stepDt === 'number' && Number.isFinite(context.stepDt)) {
      this.stepDt = context.stepDt;
    }
    if (typeof context.playing === 'boolean') {
      this.playing = context.playing;
    }
    if (typeof context.selectedPid === 'number') {
      if (this.focusPid == null || this.followLatest) {
        this.focusPid = context.selectedPid;
      }
    } else if (context.selectedPid === null) {
      if (!this.selectedEvent) {
        this.focusPid = null;
      }
    }
    if (typeof context.tacticPreset === 'string') {
      this.latestPreset = context.tacticPreset;
    }

    if (this.followLatest && this.latestView) {
      this.selectedTick = this.latestView.tick;
    }

    this.updateGlobalBar();
    if (this.selectedEvent) {
      this.renderEventPanel(this.selectedEvent);
    }
  }

  private recordView(view: SimView): void {
    const snapshot = this.cloneSimView(view);
    this.viewHistory.set(snapshot.tick, snapshot);
    if (this.viewHistory.size > VIEW_HISTORY_LIMIT) {
      const firstKey = this.viewHistory.keys().next().value;
      if (typeof firstKey === 'number') {
        this.viewHistory.delete(firstKey);
      }
    }
    if (this.followLatest && snapshot.tick !== this.lastTimelineTick) {
      this.lastTimelineTick = snapshot.tick;
      this.selectedTick = snapshot.tick;
      this.renderTimeline();
    }
  }

  private cloneSimView(view: SimView): SimView {
    const players = view.players.map((player) => ({
      ...player,
      h: [player.h[0], player.h[1]] as [number, number],
    }));
    return {
      ...view,
      players,
      ball: { ...view.ball },
    };
  }

  getCanvas(): HTMLCanvasElement {
    return this.pitchCanvas;
  }

  private buildHud() {
    const root = createDiv('fto-debug-hud', document.body);

    const bar = createDiv('hud-bar', root);
    const barLeft = createDiv('hud-bar-section left', bar);
    const barCenter = createDiv('hud-bar-section center', bar);
    const barRight = createDiv('hud-bar-section right', bar);

    const barTick = createSpan('hud-bar-chip', barLeft);
    const barSim = createSpan('hud-bar-chip', barLeft);
    const barPid = createSpan('hud-bar-chip', barLeft);
    const barBall = createSpan('hud-bar-chip', barLeft);
    const barPreset = createSpan('hud-bar-chip', barLeft);
    const barFps = createSpan('hud-bar-chip', barLeft);

    const filterInputs = new Map<Tag, HTMLInputElement>();
    const filterGroup = createDiv('hud-filter-group', barCenter);
    for (const tag of TAGS) {
      const label = document.createElement('label');
      label.className = 'hud-filter';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = (this.store?.getMask() ?? 0) & TAG_TO_BIT[tag] ? true : false;
      input.dataset.tag = tag;
      const span = document.createElement('span');
      span.textContent = tag;
      label.append(input, span);
      filterGroup.appendChild(label);
      filterInputs.set(tag, input);
    }

    const controlsGroup = createDiv('hud-controls', barRight);
    const playBtn = createButton('▶', 'hud-btn', controlsGroup);
    playBtn.title = 'Toggle playback (Space)';
    const stepBackLargeBtn = createButton('⏪', 'hud-btn', controlsGroup);
    const stepBackBtn = createButton('⏮', 'hud-btn', controlsGroup);
    const stepForwardBtn = createButton('⏭', 'hud-btn', controlsGroup);
    const stepForwardLargeBtn = createButton('⏩', 'hud-btn', controlsGroup);
    const stepAiBtn = createButton('AI', 'hud-btn', controlsGroup);
    const stepPhysicsBtn = createButton('PHYS', 'hud-btn', controlsGroup);
    stepAiBtn.title = 'Step AI only';
    stepPhysicsBtn.title = 'Step physics only';

    const body = createDiv('hud-body', root);
    const timelineColumn = createDiv('hud-timeline', body);
    const timelineHeader = createDiv('hud-timeline-header', timelineColumn);
    const timelineScrubLabel = createSpan('hud-timeline-label', timelineHeader);
    const timelineSlider = document.createElement('input');
    timelineSlider.type = 'range';
    timelineSlider.min = '0';
    timelineSlider.max = '0';
    timelineSlider.value = '0';
    timelineSlider.step = '1';
    timelineSlider.className = 'hud-timeline-slider';
    timelineHeader.appendChild(timelineSlider);
    const timelineMarkers = createDiv('hud-timeline-markers', timelineColumn);

    const pitchColumn = createDiv('hud-pitch-stack', body);
    const pitchCanvas = document.createElement('canvas');
    pitchCanvas.className = 'hud-pitch-overlay';
    pitchColumn.appendChild(pitchCanvas);

    const inspectorColumn = createDiv('hud-inspector', body);
    const playerPanel = createDiv('hud-panel player', inspectorColumn);
    const inspectorPlayerHeader = createDiv('player-header', playerPanel);
    const gapSection = createDiv('player-gaps', playerPanel);
    const inspectorGapList = createDiv('player-gap-bars', gapSection);

    const passSection = createDiv('player-pass-options', playerPanel);
    const passTable = document.createElement('table');
    passTable.className = 'player-pass-table';
    const passHead = document.createElement('thead');
    passHead.innerHTML = `
      <tr>
        <th>to</th>
        <th>type</th>
        <th>xtΔ</th>
        <th>p_int</th>
        <th>p_recv</th>
        <th>risk</th>
        <th>offs</th>
      </tr>`;
    const inspectorPassTable = document.createElement('tbody');
    passTable.append(passHead, inspectorPassTable);
    passSection.appendChild(passTable);

    const actSection = createDiv('player-acteval', inspectorColumn);
    const inspectorActList = createDiv('act-list', actSection);

    const reasonSection = createDiv('player-reasons', inspectorColumn);
    const inspectorReasonBadge = createDiv('reason-badges', reasonSection);

    const eventPanel = createDiv('hud-panel event', inspectorColumn);
    const eventPanelRaw = document.createElement('pre');
    eventPanelRaw.className = 'event-raw';
    eventPanel.appendChild(eventPanelRaw);

    const consolePanel = createDiv('hud-console', root);
    const consoleToolbar = createDiv('console-toolbar', consolePanel);

    const consolePidInput = document.createElement('input');
    consolePidInput.type = 'number';
    consolePidInput.placeholder = 'pid';
    consolePidInput.className = 'console-input';
    consoleToolbar.appendChild(consolePidInput);

    const consoleTagInput = document.createElement('input');
    consoleTagInput.type = 'text';
    consoleTagInput.placeholder = 'tag';
    consoleTagInput.className = 'console-input';
    consoleToolbar.appendChild(consoleTagInput);

    const consoleTickFromInput = document.createElement('input');
    consoleTickFromInput.type = 'number';
    consoleTickFromInput.placeholder = 'tick ≥';
    consoleTickFromInput.className = 'console-input';
    consoleToolbar.appendChild(consoleTickFromInput);

    const consoleTickToInput = document.createElement('input');
    consoleTickToInput.type = 'number';
    consoleTickToInput.placeholder = 'tick ≤';
    consoleTickToInput.className = 'console-input';
    consoleToolbar.appendChild(consoleTickToInput);

    const consoleTable = document.createElement('table');
    consoleTable.className = 'console-table';
    const consoleHead = document.createElement('thead');
    consoleHead.innerHTML = `
      <tr>
        <th>tick</th>
        <th>tag</th>
        <th>pid</th>
        <th>summary</th>
      </tr>`;
    const consoleTableBody = document.createElement('tbody');
    consoleTable.append(consoleHead, consoleTableBody);
    consolePanel.append(consoleToolbar, consoleTable);

    return {
      root,
      elements: {
        barTick,
        barSim,
        barPid,
        barBall,
        barPreset,
        barFps,
        playBtn,
        stepBackBtn,
        stepForwardBtn,
        stepBackLargeBtn,
        stepForwardLargeBtn,
        stepAiBtn,
        stepPhysicsBtn,
        filterInputs,
        timelineSlider,
        timelineMarkers,
        timelineScrubLabel,
        pitchCanvas,
        inspectorPlayerHeader,
        inspectorGapList,
        inspectorPassTable,
        inspectorActList,
        inspectorReasonBadge,
        eventPanelRaw,
        consoleTableBody,
        consolePidInput,
        consoleTagInput,
        consoleTickFromInput,
        consoleTickToInput,
      },
    };
  }

  private attachHandlers(): void {
    this.playBtn.addEventListener('click', () => {
      this.playing = !this.playing;
      this.callbacks.requestPlaybackToggle?.(this.playing);
      this.updatePlayButton();
    });

    this.stepBackBtn.addEventListener('click', () => {
      this.handleStep(-1, 'all');
    });
    this.stepForwardBtn.addEventListener('click', () => {
      this.handleStep(1, 'all');
    });
    this.stepBackLargeBtn.addEventListener('click', () => {
      this.handleStep(-10, 'all');
    });
    this.stepForwardLargeBtn.addEventListener('click', () => {
      this.handleStep(10, 'all');
    });
    this.stepAiBtn.addEventListener('click', () => {
      this.handleStep(1, 'ai');
    });
    this.stepPhysicsBtn.addEventListener('click', () => {
      this.handleStep(1, 'physics');
    });

    for (const [tag, input] of this.filterInputs) {
      input.addEventListener('change', () => {
        const currentMask = this.store.getMask();
        const bit = TAG_TO_BIT[tag];
        const nextMask = input.checked ? (currentMask | bit) : (currentMask & ~bit);
        this.store.setMask(nextMask);
        this.callbacks.requestMaskChange?.(nextMask);
      });
    }

    this.timelineSlider.addEventListener('input', () => {
      const tick = Number.parseInt(this.timelineSlider.value, 10);
      if (Number.isFinite(tick)) {
        this.followLatest = tick === Number(this.timelineSlider.max);
        this.selectedTick = tick;
        this.callbacks.requestFollowLatestToggle?.(this.followLatest);
        this.renderAll();
        this.callbacks.requestTick?.(tick);
      }
    });

    this.consolePidInput.addEventListener('input', () => {
      const value = this.consolePidInput.value.trim();
      this.consolePidFilter = value === '' ? null : Number.parseInt(value, 10);
      if (Number.isNaN(this.consolePidFilter ?? NaN)) {
        this.consolePidFilter = null;
      }
      this.renderConsole();
    });
    this.consoleTagInput.addEventListener('input', () => {
      this.consoleTagFilter = this.consoleTagInput.value.trim().toUpperCase();
      this.renderConsole();
    });
    this.consoleTickFromInput.addEventListener('input', () => {
      const value = this.consoleTickFromInput.value.trim();
      this.consoleTickFrom = value === '' ? null : Number.parseInt(value, 10);
      this.renderConsole();
    });
    this.consoleTickToInput.addEventListener('input', () => {
      const value = this.consoleTickToInput.value.trim();
      this.consoleTickTo = value === '' ? null : Number.parseInt(value, 10);
      this.renderConsole();
    });
  }

  private onStoreUpdate = (update: DebugUpdate): void => {
    if (update.kind === 'mask') {
      this.syncFilterInputs();
      this.renderAll();
      return;
    }
    if (update.event.tag === 'K') {
      if (this.followLatest) {
        this.selectedTick = update.event.t;
        this.callbacks.requestTick?.(this.selectedTick);
      }
      this.renderAll();
    } else {
      if (update.event.t === this.selectedTick) {
        this.renderAll();
      } else {
        this.renderTimeline();
        this.renderConsole();
      }
    }
  };

  private renderAll(): void {
    this.renderTimeline();
    this.renderInspector();
    this.renderConsole();
    this.updatePlayButton();
  }

  private renderTimeline(): void {
    const ticks = this.getKnownTicks();
    if (ticks.length === 0) {
      this.timelineMarkers.textContent = '';
      this.timelineSlider.min = '0';
      this.timelineSlider.max = '0';
      this.timelineSlider.value = '0';
      this.timelineScrubLabel.textContent = 'tick: -';
      return;
    }
    const minTick = ticks[0];
    const maxTick = ticks[ticks.length - 1];
    this.timelineSlider.min = minTick.toString();
    this.timelineSlider.max = maxTick.toString();

    if (this.followLatest) {
      this.timelineSlider.value = maxTick.toString();
    } else {
      this.timelineSlider.value = this.selectedTick.toString();
    }

    this.timelineScrubLabel.textContent = `tick ${formatTick(this.selectedTick)}`;

    const rowData: Array<{ tick: number; markers: TimelineMarker[] }> = [];
    for (let i = ticks.length - 1; i >= 0 && rowData.length < TIMELINE_WINDOW; i -= 1) {
      const tick = ticks[i];
      const snapshot = this.store.snapshot(tick);
      const markers = this.buildTimelineMarkersFromSnapshot(snapshot.perTag);
      if (markers.length > 0) {
        rowData.push({ tick, markers });
      }
    }
    rowData.reverse();

    if (!rowData.some((row) => row.tick === this.selectedTick)) {
      const snapshot = this.store.snapshot(this.selectedTick);
      rowData.push({
        tick: this.selectedTick,
        markers: this.buildTimelineMarkersFromSnapshot(snapshot.perTag),
      });
    }

    this.timelineMarkers.textContent = '';

    if (rowData.length === 1 && rowData[0].markers.length === 0) {
      const row = createDiv('timeline-row', this.timelineMarkers);
      row.classList.add('is-selected');
      const label = createSpan('timeline-row-label', row);
      label.textContent = formatTick(rowData[0].tick);
      const markerContainer = createDiv('timeline-row-markers', row);
      const empty = createSpan('timeline-marker empty', markerContainer);
      empty.textContent = 'No events';
      return;
    }

    for (const { tick, markers } of rowData) {
      const row = createDiv('timeline-row', this.timelineMarkers);
      if (tick === this.selectedTick) {
        row.classList.add('is-selected');
      }
      const label = createSpan('timeline-row-label', row);
      label.textContent = formatTick(tick);
      label.dataset.tick = tick.toString();

      const markerContainer = createDiv('timeline-row-markers', row);
      if (markers.length === 0) {
        const empty = createSpan('timeline-marker empty', markerContainer);
        empty.textContent = '-';
        continue;
      }
      for (const marker of markers) {
        const iconSpan = createSpan(`timeline-marker tag-${marker.tag}`, markerContainer);
        iconSpan.textContent = marker.icon;
        iconSpan.title = this.describeEvent(marker.event);
        iconSpan.addEventListener('click', () => {
          this.followLatest = false;
          this.selectedTick = marker.event.t;
          this.selectedEvent = marker.event;
          if (typeof marker.event.p === 'number') {
            this.focusPid = marker.event.p;
            this.callbacks.requestPlayerFocus?.(this.focusPid);
          }
          this.callbacks.requestFollowLatestToggle?.(false);
          this.callbacks.requestTick?.(this.selectedTick);
          this.renderAll();
          this.renderEventPanel(marker.event);
        });
      }
    }
  }

  private getKnownTicks(): number[] {
    const tickSet = new Set<number>(this.store.getTicks());
    for (const tick of this.viewHistory.keys()) {
      tickSet.add(tick);
    }
    tickSet.add(this.selectedTick);
    return Array.from(tickSet).sort((a, b) => a - b);
  }

  private renderInspector(): void {
    const snapshot = this.store.snapshot(this.selectedTick, this.focusPid ?? undefined);
    this.renderPlayerPanel(snapshot);
    if (this.selectedEvent && this.selectedEvent.t === this.selectedTick) {
      this.renderEventPanel(this.selectedEvent);
    } else {
      const tagEntries = Object.values(snapshot.perTag).flat();
      if (tagEntries.length > 0) {
        this.renderEventPanel(tagEntries[tagEntries.length - 1]);
      } else {
        this.eventPanelRaw.textContent = 'No events';
      }
    }
  }

  private renderPlayerPanel(snapshot: ReturnType<DebugStore['snapshot']>): void {
    const view = this.latestView;
    const pid = this.focusPid;

    if (!view || pid == null || pid < 0 || pid >= view.players.length) {
      this.inspectorPlayerHeader.textContent = 'No player focused';
      this.inspectorGapList.textContent = '';
      this.inspectorPassTable.textContent = '';
      this.inspectorActList.textContent = '';
      this.inspectorReasonBadge.textContent = '';
      return;
    }

    const player = view.players[pid];
    const headerLines = [
      `pid ${pid}`,
      `role=${player.role}`,
      `speed=${formatNumber((player as any).speed ?? undefined)}`,
      `has_ball=${player.has_ball ? 'Y' : 'N'}`,
    ];
    this.inspectorPlayerHeader.textContent = headerLines.join(' | ');

    const gapEvents = snapshot.player?.tags?.G ?? [];
    this.renderGapBars(gapEvents);

    const passEvents = snapshot.player?.tags?.F ?? [];
    this.renderPassOptions(passEvents);

    const actEvents = snapshot.player?.tags?.E ?? [];
    this.renderActEval(actEvents);

    const reasonEvents = snapshot.player?.tags?.R ?? [];
    this.renderReasonBadges(reasonEvents);
  }

  private renderGapBars(events: DbgEvent[]): void {
    this.inspectorGapList.textContent = '';
    if (!events || events.length === 0) {
      this.inspectorGapList.textContent = 'No GAP data';
      return;
    }
    const latest = events[events.length - 1];
    const metrics = ['orient', 'lane', 'recv', 'offs', 'press', 'kick'] as const;
    for (const metric of metrics) {
      const raw = latest.fields[metric];
      const value = typeof raw === 'number' ? raw : Number(raw);
      const bar = createDiv('gap-bar', this.inspectorGapList);
      const label = createSpan('gap-bar-label', bar);
      label.textContent = metric;
      const meter = createDiv('gap-bar-meter', bar);
      const fill = createDiv('gap-bar-fill', meter);
      const clamped = Number.isFinite(value) ? Math.max(-1, Math.min(1, value as number)) : 0;
      const normalized = (clamped + 1) * 50;
      fill.style.width = `${normalized}%`;
      if ((value as number) > 0) {
        fill.classList.add('need');
      } else {
        fill.classList.add('ok');
      }
      fill.title = `${metric}=${value}`;
    }
  }

  private renderPassOptions(events: DbgEvent[]): void {
    this.inspectorPassTable.textContent = '';
    if (!events || events.length === 0) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 7;
      cell.textContent = 'No pass options';
      row.appendChild(cell);
      this.inspectorPassTable.appendChild(row);
      return;
    }
    // keep last event
    const latest = events[events.length - 1];
    const optionsRaw = latest.fields.options;
    const rows: Array<Record<string, number | string>> = [];
    if (Array.isArray(optionsRaw)) {
      for (const entry of optionsRaw) {
        if (typeof entry === 'object' && entry) {
          rows.push(entry as Record<string, number | string>);
        }
      }
    } else {
      rows.push(latest.fields as Record<string, number | string>);
    }

    for (const rowData of rows.slice(0, 5)) {
      const row = document.createElement('tr');
      const cols = ['to', 'type', 'xt', 'p_int', 'p_recv', 'risk', 'offs'];
      for (const key of cols) {
        const cell = document.createElement('td');
        const value = rowData[key] ?? rowData[`${key}_on_arrival`] ?? '-';
        cell.textContent = typeof value === 'number' ? value.toFixed(2) : String(value);
        row.appendChild(cell);
      }
      this.inspectorPassTable.appendChild(row);
    }
  }

  private renderActEval(events: DbgEvent[]): void {
    this.inspectorActList.textContent = '';
    if (!events || events.length === 0) {
      this.inspectorActList.textContent = 'No act evals';
      return;
    }
    const sorted = [...events].sort((a, b) => {
      const sa = typeof a.fields.score === 'number' ? (a.fields.score as number) : 0;
      const sb = typeof b.fields.score === 'number' ? (b.fields.score as number) : 0;
      return sb - sa;
    });
    for (const event of sorted.slice(0, 5)) {
      const entry = createDiv('act-entry', this.inspectorActList);
      entry.textContent = `${event.fields.act ?? event.fields.action ?? '?'} | score=${event.fields.score} | prog=${event.fields.prog} | risk=${event.fields.risk}`;
      entry.title = this.describeEvent(event);
      entry.addEventListener('mouseenter', (ev) => {
        (ev.currentTarget as HTMLElement).classList.add('hover');
      });
      entry.addEventListener('mouseleave', (ev) => {
        (ev.currentTarget as HTMLElement).classList.remove('hover');
      });
    }
  }

  private renderReasonBadges(events: DbgEvent[]): void {
    this.inspectorReasonBadge.textContent = '';
    if (!events || events.length === 0) {
      this.inspectorReasonBadge.textContent = 'No filters';
      return;
    }
    const counts = new Map<string, number>();
    for (const event of events) {
      for (const [key, value] of Object.entries(event.fields)) {
        if (key.startsWith('reason') || key === 'why' || key === 'filter') {
          const label = String(value);
          counts.set(label, (counts.get(label) ?? 0) + 1);
        }
      }
    }
    const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
    for (const [label, count] of sorted) {
      const badge = createSpan('reason-badge', this.inspectorReasonBadge);
      badge.textContent = `${label} (${count})`;
    }
  }

  private renderEventPanel(event: DbgEvent): void {
    this.eventPanelRaw.textContent = `${event.tag}@${formatTick(event.t)} pid=${event.p ?? '-'}\n${event.raw}`;
  }

  private renderConsole(): void {
    this.consoleTableBody.textContent = '';
    const events = this.store.getRecentEvents(400).filter((event) => !event.hidden);
    for (let i = events.length - 1; i >= 0; i -= 1) {
      const event = events[i];
      if (this.consolePidFilter != null && event.p !== this.consolePidFilter) {
        continue;
      }
      if (this.consoleTagFilter && event.tag !== this.consoleTagFilter) {
        continue;
      }
      if (this.consoleTickFrom != null && event.t < this.consoleTickFrom) {
        continue;
      }
      if (this.consoleTickTo != null && event.t > this.consoleTickTo) {
        continue;
      }

      const row = document.createElement('tr');
      const tickCell = document.createElement('td');
      tickCell.textContent = formatTick(event.t);
      const tagCell = document.createElement('td');
      tagCell.textContent = event.tag;
      const pidCell = document.createElement('td');
      pidCell.textContent = event.p != null ? String(event.p) : '-';
      const summaryCell = document.createElement('td');
      summaryCell.textContent = summarizeFields(event);
      summaryCell.title = event.raw;

      row.append(tickCell, tagCell, pidCell, summaryCell);
      row.addEventListener('click', () => {
        this.followLatest = false;
        this.selectedTick = event.t;
        this.selectedEvent = event;
        this.renderAll();
        this.renderEventPanel(event);
      });

      this.consoleTableBody.appendChild(row);
    }
  }

  private buildTimelineMarkersFromSnapshot(perTag: ReturnType<DebugStore['snapshot']>['perTag']): TimelineMarker[] {
    const perTagCount = new Map<Tag, number>();
    const markers: TimelineMarker[] = [];
    for (const tag of TAGS) {
      if (tag === 'K') continue;
      const events = perTag[tag];
      if (!events || events.length === 0) continue;
      for (const event of events) {
        const count = perTagCount.get(tag) ?? 0;
        if (count >= 3) break;
        perTagCount.set(tag, count + 1);
        const icon = MARKER_ICON[tag] ?? '•';
        markers.push({ event, icon, tag });
        if (markers.length >= 12) {
          return markers;
        }
      }
    }
    return markers;
  }

  private describeEvent(event: DbgEvent): string {
    const summary = summarizeFields(event);
    const pidDesc = event.p != null ? ` pid=${event.p}` : '';
    return `${event.tag} tick=${event.t}${pidDesc}${summary ? ` | ${summary}` : ''}`;
  }

  private updateGlobalBar(): void {
    const tick = this.latestView?.tick ?? this.selectedTick;
    const simTime = tick * this.stepDt;
    const hasBallPid = this.findBallHolder();
    const preset = this.latestPreset ?? TEAM_PHASE_MAP[this.latestView?.home_team_phase ?? -1] ?? 'n/a';

    this.barTick.textContent = `tick ${formatTick(tick)}`;
    this.barSim.textContent = `sim ${simTime.toFixed(2)}s`;
    this.barPid.textContent = `focus ${this.focusPid != null ? this.focusPid : '-'}`;
    this.barBall.textContent = `ball ${hasBallPid != null ? hasBallPid : '-'}`;
    this.barPreset.textContent = `preset ${preset}`;
    this.barFps.textContent = `fps ${this.latestFps.toFixed(1)}`;

    this.updatePlayButton();
  }

  private updatePlayButton(): void {
    this.playBtn.textContent = this.playing ? '▮▮' : '▶';
  }

  private handleStep(delta: number, scope: StepScope): void {
    this.playing = false;
    this.followLatest = false;
    this.selectedTick += delta;
    if (this.selectedTick < 0) {
      this.selectedTick = 0;
    }
    this.callbacks.requestPlaybackToggle?.(this.playing);
    this.callbacks.requestFollowLatestToggle?.(false);
    this.callbacks.requestStep?.(delta, scope);
    this.renderAll();
  }

  private syncFilterInputs(): void {
    const mask = this.store.getMask();
    for (const [tag, input] of this.filterInputs) {
      const bit = TAG_TO_BIT[tag];
      const shouldCheck = (mask & bit) !== 0;
      if (input.checked !== shouldCheck) {
        input.checked = shouldCheck;
      }
    }
  }

  renderOverlay(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): void {
    if (!this.overlayCtx) {
      return;
    }

    const viewForOverlay = this.followLatest
      ? this.latestView
      : this.viewHistory.get(this.selectedTick) ?? this.latestView;

    if (!viewForOverlay) {
      return;
    }

    const ratio = window.devicePixelRatio || 1;
    const { clientWidth, clientHeight } = renderer.domElement;

    if (clientWidth === 0 || clientHeight === 0) {
      return;
    }

    if (this.canvasPixelWidth !== clientWidth || this.canvasPixelHeight !== clientHeight || this.canvasRatio !== ratio) {
      this.canvasPixelWidth = clientWidth;
      this.canvasPixelHeight = clientHeight;
      this.canvasRatio = ratio;
      this.pitchCanvas.width = clientWidth * ratio;
      this.pitchCanvas.height = clientHeight * ratio;
      this.pitchCanvas.style.width = `${clientWidth}px`;
      this.pitchCanvas.style.height = `${clientHeight}px`;
    }

    const ctx = this.overlayCtx;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, clientWidth, clientHeight);

    const snapshot = this.store.snapshot(this.selectedTick);
    const playerScreens = new Map<number, { x: number; y: number }>();

    for (let pid = 0; pid < viewForOverlay.players.length; pid += 1) {
      const player = viewForOverlay.players[pid];
      if (!player) continue;
      const head = this.project(player.x, 1.7, player.y, camera, clientWidth, clientHeight);
      if (head) {
        playerScreens.set(pid, head);
      }
    }

    const gapEvents = snapshot.perTag.G ?? [];
    for (const event of gapEvents) {
      if (typeof event.p !== 'number') continue;
      const pos = playerScreens.get(event.p);
      if (!pos) continue;
      this.drawGapMiniBars(ctx, pos.x, pos.y - 28, event);
    }

    const actEvents = [...(snapshot.perTag.E ?? [])];
    actEvents.sort((a, b) => {
      const sa = typeof a.fields.score === 'number' ? (a.fields.score as number) : 0;
      const sb = typeof b.fields.score === 'number' ? (b.fields.score as number) : 0;
      return sb - sa;
    });
    for (const event of actEvents.slice(0, 3)) {
      this.drawActArrow(ctx, event, playerScreens, camera, clientWidth, clientHeight, 'rgba(255,255,255,0.5)');
    }

    const fireEvents = snapshot.perTag.F ?? [];
    for (const event of fireEvents) {
      this.drawActArrow(ctx, event, playerScreens, camera, clientWidth, clientHeight, 'rgba(81,207,102,0.65)', true);
    }

    const waitEvents = snapshot.perTag.W ?? [];
    for (const event of waitEvents) {
      if (typeof event.p !== 'number') continue;
      const pos = playerScreens.get(event.p);
      if (!pos) continue;
      const ms = typeof event.fields.ms === 'number'
        ? event.fields.ms as number
        : typeof event.fields.remaining === 'number'
          ? event.fields.remaining as number
          : undefined;
      this.drawCountdown(ctx, pos.x, pos.y - 46, ms);
    }
  }

  private project(x: number, y: number, z: number, camera: THREE.PerspectiveCamera, width: number, height: number):
    { x: number; y: number } | null {
    const v = this.projectionVec.set(x, y, z).project(camera);
    if (v.z < -1 || v.z > 1) {
      return null;
    }
    const sx = (v.x * 0.5 + 0.5) * width;
    const sy = (-v.y * 0.5 + 0.5) * height;
    return { x: sx, y: sy };
  }

  private drawGapMiniBars(ctx: CanvasRenderingContext2D, centerX: number, baseY: number, event: DbgEvent): void {
    const metrics: Array<{ key: string; label: string }> = [
      { key: 'orient', label: 'O' },
      { key: 'lane', label: 'L' },
      { key: 'recv', label: 'R' },
      { key: 'offs', label: 'S' },
      { key: 'press', label: 'P' },
      { key: 'kick', label: 'K' },
    ];
    const barWidth = 12;
    const barHeight = 6;
    const gap = 2;
    const totalWidth = metrics.length * barWidth + (metrics.length - 1) * gap;
    const startX = centerX - totalWidth / 2;

    ctx.save();
    metrics.forEach((metric, index) => {
      const raw = event.fields[metric.key];
      let value = typeof raw === 'number' ? raw : Number(raw);
      if (!Number.isFinite(value)) {
        value = 0;
      }
      const x = startX + index * (barWidth + gap);
      ctx.fillStyle = value > 0 ? 'rgba(255,107,129,0.85)' : 'rgba(81,207,102,0.75)';
      ctx.fillRect(x, baseY, barWidth, barHeight);
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(x, baseY + barHeight * 0.5, barWidth, 1);
    });
    ctx.restore();
  }

  private drawActArrow(
    ctx: CanvasRenderingContext2D,
    event: DbgEvent,
    playerScreens: Map<number, { x: number; y: number }>,
    camera: THREE.PerspectiveCamera,
    width: number,
    height: number,
    color: string,
    emphasize = false,
  ): void {
    if (typeof event.p !== 'number') {
      return;
    }
    const start = playerScreens.get(event.p);
    if (!start) return;
    const target = this.extractTarget(event, camera, width, height);
    if (!target) return;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = emphasize ? 3 : 2;
    ctx.setLineDash(emphasize ? [] : [6, 6]);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(target.x, target.y);
    ctx.stroke();

    const angle = Math.atan2(target.y - start.y, target.x - start.x);
    const arrowLength = emphasize ? 16 : 12;
    const arrowWidth = emphasize ? 8 : 6;

    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.moveTo(target.x, target.y);
    ctx.lineTo(
      target.x - arrowLength * Math.cos(angle - 0.3),
      target.y - arrowLength * Math.sin(angle - 0.3),
    );
    ctx.lineTo(
      target.x - arrowLength * Math.cos(angle + 0.3),
      target.y - arrowLength * Math.sin(angle + 0.3),
    );
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();

    if (emphasize) {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(target.x, target.y, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  private extractTarget(
    event: DbgEvent,
    camera: THREE.PerspectiveCamera,
    width: number,
    height: number,
  ): { x: number; y: number } | null {
    const fields = event.fields;
    const tx = this.pickNumber(fields, ['tx', 'target_x', 'to_x', 'goal_x', 'x2']);
    const ty = this.pickNumber(fields, ['ty', 'target_y', 'to_y', 'goal_y', 'y2']);
    if (tx == null || ty == null) {
      return null;
    }
    return this.project(tx, 0.05, ty, camera, width, height);
  }

  private pickNumber(fields: Record<string, unknown>, candidates: string[]): number | null {
    for (const key of candidates) {
      const value = fields[key];
      if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
      }
      if (typeof value === 'string') {
        const parsed = Number.parseFloat(value);
        if (Number.isFinite(parsed)) {
          return parsed;
        }
      }
    }
    return null;
  }

  private drawCountdown(ctx: CanvasRenderingContext2D, x: number, y: number, ms?: number): void {
    ctx.save();
    ctx.strokeStyle = 'rgba(116,192,252,0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.stroke();
    if (ms != null) {
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(Math.max(0, Math.round(ms)).toString(), x, y + 3);
    }
    ctx.restore();
  }

  private findBallHolder(): number | null {
    if (!this.latestView) {
      return null;
    }
    for (let i = 0; i < this.latestView.players.length; i += 1) {
      if (this.latestView.players[i]?.has_ball) {
        return i;
      }
    }
    return null;
  }
}
