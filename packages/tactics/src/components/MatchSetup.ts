import type { EngineTactic } from '../api/engine_types';

const STYLE_ELEMENT_ID = 'fto-match-setup-styles';
const MATCH_SETUP_STYLES = `
[data-match-setup-root] {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  pointer-events: none;
  opacity: 0;
  transition: opacity 200ms ease;
}

[data-match-setup-root].visible {
  pointer-events: auto;
  opacity: 1;
}

.fto-match-setup-panel {
  width: 400px;
  padding: 24px;
  border-radius: 12px;
  background: rgba(28, 28, 28, 0.95);
  color: #f5f5f5;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.fto-match-setup-panel h2 {
  margin: 0;
  text-align: center;
  font-size: 22px;
  font-weight: 600;
}

.fto-match-setup-panel .tactic-selection-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.fto-match-setup-panel .team-column {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.fto-match-setup-panel label {
  font-size: 16px;
  font-weight: 500;
}

.fto-match-setup-panel select {
  width: 100%;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: inherit;
  padding: 10px;
  font-size: 15px;
}

.fto-match-setup-panel .start-btn {
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  background: #3a76f7;
  color: white;
  transition: background 150ms ease;
}

.fto-match-setup-panel .start-btn:hover {
  background: #4a85ff;
}
`;

export interface MatchSetupOptions {
  mount: HTMLElement;
  presets: Record<string, EngineTactic>;
  onStart: (options: { homeTactic: string; awayTactic: string }) => void;
}

export class MatchSetup {
  readonly #options: MatchSetupOptions;

  constructor(options: MatchSetupOptions) {
    this.#options = options;
    this.#options.mount.dataset.matchSetupRoot = 'true';
    this.#ensureStyles();
  }

  public show(): void {
    this.#options.mount.classList.add('visible');
    this.#render();
  }

  public hide(): void {
    this.#options.mount.classList.remove('visible');
    this.#options.mount.innerHTML = '';
  }

  #ensureStyles = (): void => {
    const doc = this.#options.mount.ownerDocument ?? document;
    if (doc.getElementById(STYLE_ELEMENT_ID)) {
      return;
    }
    const style = doc.createElement('style');
    style.id = STYLE_ELEMENT_ID;
    style.textContent = MATCH_SETUP_STYLES;
    doc.head.appendChild(style);
  };

  #render = (): void => {
    const presetOptions = Object.keys(this.#options.presets)
      .map(name => `<option value="${name}">${name}</option>`)
      .join('');

    this.#options.mount.innerHTML = `
      <div class="fto-match-setup-panel">
        <h2>Match Setup</h2>
        <div class="tactic-selection-grid">
          <div class="team-column">
            <label for="home-tactic-select">Home Team</label>
            <select id="home-tactic-select">
              ${presetOptions}
            </select>
          </div>
          <div class="team-column">
            <label for="away-tactic-select">Away Team</label>
            <select id="away-tactic-select">
              ${presetOptions}
            </select>
          </div>
        </div>
        <button class="start-btn">Start Match</button>
      </div>
    `;

    this.#attachEventListeners();
  };

  #attachEventListeners = (): void => {
    const startBtn = this.#options.mount.querySelector('.start-btn');
    startBtn?.addEventListener('click', this.#handleStart);
  };

  #handleStart = (): void => {
    const homeSelect = this.#options.mount.querySelector('#home-tactic-select') as HTMLSelectElement | null;
    const awaySelect = this.#options.mount.querySelector('#away-tactic-select') as HTMLSelectElement | null;

    this.#options.onStart({
      homeTactic: homeSelect?.value ?? 'Balanced',
      awayTactic: awaySelect?.value ?? 'Balanced',
    });

    this.hide();
  };
}
