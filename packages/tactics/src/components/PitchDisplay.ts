import type { Tactic } from '../models/tactic';
import { createPlayerMarker, Player, Position } from '../models/marker';

const SVG_NS = 'http://www.w3.org/2000/svg';

const PITCH_WIDTH = 240;
const PITCH_HEIGHT = 360;
const MARGIN = 10;

const PITCH_COLOR = '#3A652A'; // Darker green
const STRIPE_COLOR = 'rgba(0, 0, 0, 0.08)';
const LINE_COLOR = 'rgba(255, 255, 255, 0.7)'; // White with 70% opacity
const LINE_WIDTH = '1'; // Thinner lines

export interface PitchDisplayOptions {
  mount: HTMLElement;
  tactic: Tactic;
  mode: 'Attacking' | 'Deffending';
}

/**
 * Renders a 2D SVG representation of a soccer pitch with player formations.
 */
export class PitchDisplay {
  readonly #options: PitchDisplayOptions;

  constructor(options: PitchDisplayOptions) {
    this.#options = options;
    this.render();
  }

  private createSvgElement(): SVGSVGElement {
    const svg = document.createElementNS(SVG_NS, 'svg');
    // Adjust viewBox to include margin
    svg.setAttribute('viewBox', `0 0 ${PITCH_WIDTH + MARGIN * 2} ${PITCH_HEIGHT + MARGIN * 2}`);
    svg.style.width = '100%';
    svg.style.height = 'auto';
    return svg;
  }

  private drawPitch(svg: SVGSVGElement): void {
    // Create a group to handle the margin offset
    const group = document.createElementNS(SVG_NS, 'g');
    group.setAttribute('transform', `translate(${MARGIN}, ${MARGIN})`);
    svg.appendChild(group);

    // Base pitch color
    const baseRect = document.createElementNS(SVG_NS, 'rect');
    baseRect.setAttribute('width', PITCH_WIDTH.toString());
    baseRect.setAttribute('height', PITCH_HEIGHT.toString());
    baseRect.setAttribute('fill', PITCH_COLOR);
    group.appendChild(baseRect);

    // Grass stripes
    const stripeHeight = PITCH_HEIGHT / 10;
    for (let i = 0; i < 10; i++) {
      if (i % 2 === 0) continue;
      const stripe = document.createElementNS(SVG_NS, 'rect');
      stripe.setAttribute('x', '0');
      stripe.setAttribute('y', (i * stripeHeight).toString());
      stripe.setAttribute('width', PITCH_WIDTH.toString());
      stripe.setAttribute('height', stripeHeight.toString());
      stripe.setAttribute('fill', STRIPE_COLOR);
      group.appendChild(stripe);
    }

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

    // Boundary Lines (Touchlines and Goal Lines)
    const boundary = document.createElementNS(SVG_NS, 'rect');
    boundary.setAttribute('x', '0');
    boundary.setAttribute('y', '0');
    boundary.setAttribute('width', PITCH_WIDTH.toString());
    boundary.setAttribute('height', PITCH_HEIGHT.toString());
    boundary.setAttribute('stroke', LINE_COLOR);
    boundary.setAttribute('stroke-width', LINE_WIDTH);
    boundary.setAttribute('fill', 'none');
    group.appendChild(boundary);

    // Center circle
    const centerCircle = document.createElementNS(SVG_NS, 'circle');
    centerCircle.setAttribute('cx', (PITCH_WIDTH / 2).toString());
    centerCircle.setAttribute('cy', (PITCH_HEIGHT / 2).toString());
    centerCircle.setAttribute('r', '24');
    centerCircle.setAttribute('stroke', LINE_COLOR);
    centerCircle.setAttribute('stroke-width', LINE_WIDTH);
    centerCircle.setAttribute('fill', 'none');
    group.appendChild(centerCircle);

    // Center line
    line(0, PITCH_HEIGHT / 2, PITCH_WIDTH, PITCH_HEIGHT / 2);

    // --- Draw markings for both halves ---
    for (const side of ['top', 'bottom']) {
      const yMultiplier = side === 'top' ? 1 : -1;
      const yOffset = side === 'top' ? 0 : PITCH_HEIGHT;

      // Penalty Box
      const pBoxWidth = 160;
      const pBoxHeight = 66;
      const pBoxX = (PITCH_WIDTH - pBoxWidth) / 2;
      const pBoxLineY = yOffset + yMultiplier * pBoxHeight;
      line(pBoxX, yOffset, pBoxX, pBoxLineY);
      line(pBoxX + pBoxWidth, yOffset, pBoxX + pBoxWidth, pBoxLineY);
      line(pBoxX, pBoxLineY, pBoxX + pBoxWidth, pBoxLineY);

      // Goal Area
      const gBoxWidth = 80;
      const gBoxHeight = 24;
      const gBoxX = (PITCH_WIDTH - gBoxWidth) / 2;
      const gBoxLineY = yOffset + yMultiplier * gBoxHeight;
      line(gBoxX, yOffset, gBoxX, gBoxLineY);
      line(gBoxX + gBoxWidth, yOffset, gBoxX + gBoxWidth, gBoxLineY);
      line(gBoxX, gBoxLineY, gBoxX + gBoxWidth, gBoxLineY);

      // Goal
      const goalWidth = 32;
      const goalHeight = 4;
      const goal = document.createElementNS(SVG_NS, 'rect');
      goal.setAttribute('x', ((PITCH_WIDTH - goalWidth) / 2).toString());
      goal.setAttribute('y', (side === 'top' ? yOffset - goalHeight : yOffset).toString());
      goal.setAttribute('width', goalWidth.toString());
      goal.setAttribute('height', goalHeight.toString());
      goal.setAttribute('fill', LINE_COLOR);
      group.appendChild(goal);

      // Penalty Spot
      const spotY = yOffset + yMultiplier * 40;
      const penaltySpot = document.createElementNS(SVG_NS, 'circle');
      penaltySpot.setAttribute('cx', (PITCH_WIDTH / 2).toString());
      penaltySpot.setAttribute('cy', spotY.toString());
      penaltySpot.setAttribute('r', '1.5');
      penaltySpot.setAttribute('fill', LINE_COLOR);
      group.appendChild(penaltySpot);

      // Penalty Arc
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

    // Corner Arcs
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
    cornerArc(0, cornerRadius, cornerRadius, 0, 0); // Top-left
    cornerArc(PITCH_WIDTH - cornerRadius, 0, PITCH_WIDTH, cornerRadius, 0); // Top-right
    cornerArc(cornerRadius, PITCH_HEIGHT, 0, PITCH_HEIGHT - cornerRadius, 0); // Bottom-left
    cornerArc(PITCH_WIDTH, PITCH_HEIGHT - cornerRadius, PITCH_WIDTH - cornerRadius, PITCH_HEIGHT, 0); // Bottom-right
  }

  private parseFormation(formation: string): number[] {
    return formation.split('-').map(Number).filter(n => !isNaN(n) && n > 0);
  }

  private drawPlayers(svg: SVGSVGElement): void {
    const group = document.createElementNS(SVG_NS, 'g');
    group.setAttribute('transform', `translate(${MARGIN}, ${MARGIN})`);
    svg.appendChild(group);

    const formationStr = this.#options.tactic[this.#options.mode].formation;
    const lines = this.parseFormation(formationStr);
    const totalPlayers = lines.reduce((sum, count) => sum + count, 0);

    if (totalPlayers > 10 || totalPlayers === 0) {
      console.warn(`Invalid formation: ${formationStr}`);
      return;
    }

    let playerIdCounter = 1;

    // Goalkeeper
    const gkPlayer: Player = {
      id: playerIdCounter++,
      number: 1,
      name: 'GK',
      position: 'GK',
      stats: { PAC: 60, SHO: 60, PAS: 60, DRI: 60, DEF: 60, PHY: 60 }, // Generic stats
    };
    this.drawPlayer(group, gkPlayer, PITCH_WIDTH / 2, PITCH_HEIGHT - 20);

    const lineCount = lines.length;
    const pitchPlayableHeight = PITCH_HEIGHT - 80;
    
    lines.forEach((playerCount, lineIndex) => {
      const y = PITCH_HEIGHT - 60 - ((lineIndex + 1) * pitchPlayableHeight) / (lineCount + 1);
      const lineWidth = PITCH_WIDTH * 0.8;
      const xOffset = (PITCH_WIDTH - lineWidth) / 2;

      let position: Position = 'DF';
      if (lineIndex > (lineCount / 3)) position = 'MF';
      if (lineIndex > (lineCount * 2 / 3)) position = 'FW';


      for (let i = 0; i < playerCount; i++) {
        const x = xOffset + (i * lineWidth) / (playerCount - 1 || 1);
        const finalX = playerCount === 1 ? PITCH_WIDTH / 2 : x;
        
        const outfieldPlayer: Player = {
            id: playerIdCounter++,
            number: playerIdCounter,
            name: `P${playerIdCounter-1}`,
            position: position,
            stats: { PAC: 70, SHO: 70, PAS: 70, DRI: 70, DEF: 70, PHY: 70 }, // Generic stats
        };
        this.drawPlayer(group, outfieldPlayer, finalX, y);
      }
    });
  }

  private drawPlayer(
    svgGroup: SVGGElement,
    player: Player,
    cx: number,
    cy: number
  ): void {
    const markerSize = 40; // smaller marker size
    
    const wrapper = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
    wrapper.style.width = `${markerSize}px`;
    wrapper.style.height = `${markerSize}px`;
    wrapper.style.transform = `scale(${markerSize / 80})`; // scale down from 80px
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
    
    foreignObject.appendChild(wrapper);
    svgGroup.appendChild(foreignObject);
  }

  public render(): void {
    this.#options.mount.innerHTML = '';
    const svg = this.createSvgElement();
    this.drawPitch(svg);
    this.drawPlayers(svg);
    this.#options.mount.appendChild(svg);
  }
}
