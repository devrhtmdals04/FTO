import type { Tactic } from '../models/tactic';

const SVG_NS = 'http://www.w3.org/2000/svg';

const PITCH_WIDTH = 240;
const PITCH_HEIGHT = 360;
const PITCH_COLOR = '#3A652A';
const LINE_COLOR = '#FFFFFF';

export interface PitchDisplayOptions {
  mount: HTMLElement;
  tactic: Tactic;
  mode: 'in_possession' | 'out_of_possession';
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
    svg.setAttribute('viewBox', `0 0 ${PITCH_WIDTH} ${PITCH_HEIGHT}`);
    svg.style.width = '100%';
    svg.style.height = 'auto';
    return svg;
  }

  private drawPitch(svg: SVGSVGElement): void {
    const rect = document.createElementNS(SVG_NS, 'rect');
    rect.setAttribute('width', PITCH_WIDTH.toString());
    rect.setAttribute('height', PITCH_HEIGHT.toString());
    rect.setAttribute('fill', PITCH_COLOR);
    svg.appendChild(rect);

    // Center circle
    const centerCircle = document.createElementNS(SVG_NS, 'circle');
    centerCircle.setAttribute('cx', (PITCH_WIDTH / 2).toString());
    centerCircle.setAttribute('cy', (PITCH_HEIGHT / 2).toString());
    centerCircle.setAttribute('r', '30');
    centerCircle.setAttribute('stroke', LINE_COLOR);
    centerCircle.setAttribute('stroke-width', '1.5');
    centerCircle.setAttribute('fill', 'none');
    svg.appendChild(centerCircle);

    // Center line
    const centerLine = document.createElementNS(SVG_NS, 'line');
    centerLine.setAttribute('x1', '0');
    centerLine.setAttribute('y1', (PITCH_HEIGHT / 2).toString());
    centerLine.setAttribute('x2', PITCH_WIDTH.toString());
    centerLine.setAttribute('y2', (PITCH_HEIGHT / 2).toString());
    centerLine.setAttribute('stroke', LINE_COLOR);
    centerLine.setAttribute('stroke-width', '1.5');
    svg.appendChild(centerLine);
  }

  private parseFormation(formation: string): number[] {
    return formation.split('-').map(Number).filter(n => !isNaN(n) && n > 0);
  }

  private drawPlayers(svg: SVGSVGElement): void {
    const formationStr = this.#options.tactic[this.#options.mode].formation;
    const lines = this.parseFormation(formationStr);
    const totalPlayers = lines.reduce((sum, count) => sum + count, 0);

    if (totalPlayers > 10 || totalPlayers === 0) {
      console.warn(`Invalid formation: ${formationStr}`);
      return;
    }

    // Goalkeeper
    this.drawPlayer(svg, PITCH_WIDTH / 2, PITCH_HEIGHT - 20, 'GK');

    const lineCount = lines.length;
    const pitchPlayableHeight = PITCH_HEIGHT - 80; // Exclude GK and penalty box area
    
    lines.forEach((playerCount, lineIndex) => {
      const y = PITCH_HEIGHT - 60 - ((lineIndex + 1) * pitchPlayableHeight) / (lineCount + 1);
      const lineWidth = PITCH_WIDTH * 0.8;
      const xOffset = (PITCH_WIDTH - lineWidth) / 2;

      for (let i = 0; i < playerCount; i++) {
        const x = xOffset + (i * lineWidth) / (playerCount - 1 || 1);
        // Center single player in a line
        const finalX = playerCount === 1 ? PITCH_WIDTH / 2 : x;
        this.drawPlayer(svg, finalX, y);
      }
    });
  }

  private drawPlayer(svg: SVGSVGElement, cx: number, cy: number, text?: string): void {
    const group = document.createElementNS(SVG_NS, 'g');
    const circle = document.createElementNS(SVG_NS, 'circle');
    circle.setAttribute('cx', cx.toString());
    circle.setAttribute('cy', cy.toString());
    circle.setAttribute('r', '10');
    circle.setAttribute('fill', '#F0E68C'); // Khaki color
    circle.setAttribute('stroke', '#333');
    circle.setAttribute('stroke-width', '1.5');
    group.appendChild(circle);

    if (text) {
      const textEl = document.createElementNS(SVG_NS, 'text');
      textEl.setAttribute('x', cx.toString());
      textEl.setAttribute('y', (cy + 4).toString());
      textEl.setAttribute('text-anchor', 'middle');
      textEl.setAttribute('font-size', '10');
      textEl.setAttribute('font-weight', 'bold');
      textEl.textContent = text;
      group.appendChild(textEl);
    }
    svg.appendChild(group);
  }

  public render(): void {
    this.#options.mount.innerHTML = '';
    const svg = this.createSvgElement();
    this.drawPitch(svg);
    this.drawPlayers(svg);
    this.#options.mount.appendChild(svg);
  }
}
