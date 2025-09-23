export class HUD {
  element: HTMLDivElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.style.position = 'absolute';
    this.element.style.top = '10px';
    this.element.style.left = '10px';
    this.element.style.color = 'white';
    this.element.style.fontFamily = 'monospace';
    document.body.appendChild(this.element);
  }

  update(tick: number, fps: number) {
    this.element.innerText = `Tick: ${tick}\nFPS: ${fps.toFixed(1)}`;
  }
}