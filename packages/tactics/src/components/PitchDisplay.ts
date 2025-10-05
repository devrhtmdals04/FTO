import type { Tactic } from '../models/tactic';
import { createPlayerMarker } from '../models/marker';
import { createProfileOverlay } from '../../../squad/src/components/profile/ProfileOverlay';
import type { Player, PlayerProfile, Position } from '../../../squad/src/index';

const SVG_NS = 'http://www.w3.org/2000/svg';

const PITCH_WIDTH = 240;
const PITCH_HEIGHT = 360;
const MARGIN = 10;

const PITCH_COLOR = '#3A652A';
const STRIPE_COLOR = 'rgba(0, 0, 0, 0.08)';
const LINE_COLOR = 'rgba(255, 255, 255, 0.7)';
const LINE_WIDTH = '1';

function convertProfileToPlayer(profile: PlayerProfile, id: number): Player {
  return {
    id,
    number: profile.number || id,
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
  mode: 'Attacking' | 'Deffending';
}

export class PitchDisplay {
  readonly #options: PitchDisplayOptions;
  #players: (PlayerProfile & { x: number; y: number; id: number })[] = [];
  #svg: SVGSVGElement;

  constructor(options: PitchDisplayOptions) {
    this.#options = options;
    this.#svg = this.createSvgElement();
    this.render();
  }

  private createSvgElement(): SVGSVGElement {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${PITCH_WIDTH + MARGIN * 2} ${PITCH_HEIGHT + MARGIN * 2}`);
    svg.style.width = '100%';
    svg.style.height = 'auto';
    return svg;
  }

  public dropPlayer(profile: PlayerProfile, clientX: number, clientY: number): void {
    const svgRect = this.#svg.getBoundingClientRect();
    const svgX = clientX - svgRect.left;
    const svgY = clientY - svgRect.top;

    const pt = this.#svg.createSVGPoint();
    pt.x = svgX;
    pt.y = svgY;
    const svgP = pt.matrixTransform(this.#svg.getScreenCTM()!.inverse());

    const dropX = svgP.x - MARGIN;
    const dropY = svgP.y - MARGIN;

    const alreadyInLineup = this.#players.some(p => p.name === profile.name); // Use name to check for duplicates
    if (!alreadyInLineup) {
      this.#players.push({ ...profile, x: dropX, y: dropY, id: this.#players.length + 1 });
      this.render();
    }
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

  private drawPlayers(): void {
    const group = document.createElementNS(SVG_NS, 'g');
    group.setAttribute('transform', `translate(${MARGIN}, ${MARGIN})`);
    this.#svg.appendChild(group);

    this.#players.forEach(profile => {
      const player = convertProfileToPlayer(profile, profile.id);
      this.drawPlayer(group, player, profile, profile.x, profile.y);
    });
  }

  private drawPlayer(svgGroup: SVGGElement, player: Player, profile: PlayerProfile, cx: number, cy: number): void {
    const markerSize = 40;
    const wrapper = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
    wrapper.style.width = `${markerSize}px`;
    wrapper.style.height = `${markerSize}px`;
    wrapper.style.transform = `scale(${markerSize / 80})`;
    wrapper.style.transformOrigin = 'top left';

    const markerElement = createPlayerMarker(player);
    markerElement.style.position = 'static';
    markerElement.style.left = '';
    markerElement.style.top = '';
    
    wrapper.appendChild(markerElement);

    const foreignObject = document.createElementNS(SVG_NS, 'foreignObject');
    foreignObject.setAttribute('x', (cx - markerSize / 2).toString());
    foreignObject.setAttribute('y', (cy - markerSize / 2).toString());
    foreignObject.setAttribute('width', markerSize.toString());
    foreignObject.setAttribute('height', markerSize.toString());
    foreignObject.style.cursor = 'pointer';

    foreignObject.addEventListener('click', () => {
      const overlay = createProfileOverlay(profile);
      document.body.appendChild(overlay);
    });
    
    foreignObject.appendChild(wrapper);
    svgGroup.appendChild(foreignObject);
  }

  public render(): void {
    this.#options.mount.innerHTML = '';
    this.#svg.innerHTML = '';
    this.drawPitch();
    this.drawPlayers();
    this.#options.mount.appendChild(this.#svg);
  }
}