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

  update(tick: number, fps: number, actionsEnabled: boolean, presetLabel: string) {
    this.element.innerText = [
      `Tick: ${tick}`,
      `FPS: ${fps.toFixed(1)}`,
      `Actions: ${actionsEnabled ? 'ON' : 'OFF'}`,
      `Tactics: ${presetLabel}`,
      '',
      'Controls:',
      ' - Click: Ground pass',
      ' - Shift+Click: Shoot (Alt = power)',
      ' - Alt+Click: Lofted pass',
      ' - Keys 1-5: Tactics presets',
      ' - T: Toggle AI actions',
      ' - P: Toggle debug avatars',
    ].join('\n');
  }
}
