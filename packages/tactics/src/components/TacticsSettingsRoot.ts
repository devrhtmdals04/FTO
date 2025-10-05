import { Tactic } from '../models/tactic';
import type { TacticsStore, TacticsState } from '../state/tacticsStore';
import { TacticsEditor } from './TacticsEditor';

const STYLE_ELEMENT_ID = 'fto-tactics-panel-styles';
const TACTICS_PANEL_STYLES = `
[data-tactics-root] {
  width: 100%;
  height: 100%;
}

[data-tactics-root]:empty {
  display: none;
}

[data-tactics-root] .fto-tactics-panel {
  width: 100%;
  height: 100%;
  max-height: 100vh; /* Use viewport height for max-height */
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: transparent; /* The container will provide the background */
  color: #f5f5f5;
  font-size: 14px;
  overflow: hidden;
}

[data-tactics-root] .fto-tactics-panel > .close-btn {
  display: none; /* No longer needed in this layout */
}

.fto-tactics-selector {
  position: relative;
}

.fto-tactics-selector .selector-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(0, 0, 0, 0.35);
  color: inherit;
  cursor: pointer;
  font-size: 14px;
  line-height: 1.2;
}

.fto-tactics-selector .selector-trigger:hover {
  background: rgba(0, 0, 0, 0.45);
}

.fto-tactics-selector .selector-trigger:focus-visible {
  outline: 2px solid rgba(88, 166, 255, 0.6);
  outline-offset: 2px;
}

.fto-tactics-selector .selector-label {
  font-weight: 600;
  opacity: 0.75;
}

.fto-tactics-selector .selector-value {
  flex: 1 1 auto;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fto-tactics-selector .selector-chevron {
  font-size: 12px;
  opacity: 0.8;
}

.fto-tactics-selector .selector-overlay {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  max-height: 320px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(16, 16, 16, 0.95);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;
  gap: 10px;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-6px);
  transition: opacity 120ms ease, transform 120ms ease;
  z-index: 20;
}

.fto-tactics-selector.open .selector-overlay {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.fto-tactics-selector .tactic-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 220px;
  overflow-y: auto;
}

.fto-tactics-selector .tactic-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.12);
  cursor: pointer;
  transition: background 120ms ease;
}

.fto-tactics-selector .tactic-item.empty {
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  color: #b5b5b5;
  cursor: default;
  pointer-events: none;
}

.fto-tactics-selector .tactic-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.fto-tactics-selector .tactic-item.active {
  outline: 2px solid rgba(88, 166, 255, 0.6);
}

.fto-tactics-selector .tactic-item span {
  flex: 1 1 auto;
}

.fto-tactics-selector .delete-btn {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
}

.fto-tactics-selector .create-btn {
  align-self: flex-end;
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  cursor: pointer;
  background: rgba(88, 166, 255, 0.25);
  color: inherit;
  font-size: 14px;
  transition: background 120ms ease;
}

.fto-tactics-selector .create-btn:hover {
  background: rgba(88, 166, 255, 0.35);
}

[data-tactics-root] .fto-tactics-panel .details-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
  padding: 12px;
  background: rgba(0,0,0,0.2);
  border-radius: 8px;
}

[data-tactics-root] .fto-tactics-panel .placeholder,
[data-tactics-root] .fto-tactics-panel .loader {
  border-radius: 6px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  font-size: 13px;
}
`;

export interface TacticsSettingsRootOptions {
  mount: HTMLElement;
  store: TacticsStore;
  listMount?: HTMLElement | null;
}

/**
 * 전술 설정 UI를 렌더링하고 상호작용을 처리하는 메인 클래스
 */
export class TacticsSettingsRoot {
  readonly #mount: HTMLElement;
  readonly #store: TacticsStore;
  readonly #unsubscribe: () => void;
  readonly #listMount: HTMLElement | null;
  readonly #doc: Document;
  #isListOpen = false;

  constructor({ mount, store, listMount = null }: TacticsSettingsRootOptions) {
    this.#mount = mount;
    this.#store = store;
    this.#listMount = listMount;
    this.#doc = this.#mount.ownerDocument ?? document;

    this.#mount.dataset.tacticsRoot = 'true';
    this.#ensureStyles();

    this.#unsubscribe = this.#store.subscribe(this.render);
    this.#store.loadTactics();
  }

  destroy = (): void => {
    this.#unsubscribe();
    this.#mount.innerHTML = '';
    if (this.#listMount) {
      this.#listMount.innerHTML = '';
    }
    this.#doc.removeEventListener('click', this.#handleDocumentClick);
  };

  #ensureStyles = (): void => {
    if (this.#doc.getElementById(STYLE_ELEMENT_ID)) {
      return;
    }
    const style = this.#doc.createElement('style');
    style.id = STYLE_ELEMENT_ID;
    style.textContent = TACTICS_PANEL_STYLES;
    this.#doc.head.appendChild(style);
  };

  render = (state: TacticsState): void => {
    const { isOpen, activeTactic, isLoading } = state;

    if (!isOpen) {
      this.#isListOpen = false;
      this.#doc.removeEventListener('click', this.#handleDocumentClick);
      this.#mount.innerHTML = '';
      if (this.#listMount) {
        this.#listMount.innerHTML = '';
      }
      return;
    }

    const listMarkup = this.#renderList(state);
    if (this.#listMount) {
      this.#listMount.innerHTML = listMarkup;
    }

    this.#mount.innerHTML = `
      <div class="fto-tactics-panel">
        <button class="close-btn">×</button>
        ${this.#listMount ? '' : listMarkup}
        <div class="details-section">
          ${isLoading ? '<div class="loader">Loading...</div>' : ''}
          ${activeTactic ? this.#renderDetails(activeTactic) : '<div class="placeholder">Select or create a tactic.</div>'}
        </div>
      </div>
    `;

    const listRoot = this.#listMount
      ? this.#listMount.querySelector('[data-role="tactics-selector"]')
      : this.#mount.querySelector('[data-role="tactics-selector"]');

    this.#attachEventListeners(listRoot);
    this.#mountSubComponents(state);
  };

  #renderList = ({ tactics, activeTactic }: TacticsState): string => {
    const selectedLabel = activeTactic?.label ?? 'Select a tactic';
    const safeSelectedLabel = this.#escapeHtml(selectedLabel);
    const chevron = this.#isListOpen ? '▲' : '▼';
    const items = tactics.length
      ? tactics.map(t => {
          const safeLabel = this.#escapeHtml(t.label);
          const isActive = t.id === activeTactic?.id;
          return `
            <li class="tactic-item ${isActive ? 'active' : ''}" data-id="${t.id}">
              <span title="${safeLabel}">${safeLabel}</span>
              <button class="delete-btn" type="button" data-id="${t.id}" data-label="${safeLabel}">🗑️</button>
            </li>
          `;
        }).join('')
      : '<li class="tactic-item empty">No presets available</li>';

    return `
      <div class="fto-tactics-selector ${this.#isListOpen ? 'open' : ''}" data-role="tactics-selector">
        <button class="selector-trigger" type="button">
          <span class="selector-label">Preset</span>
          <span class="selector-value" title="${safeSelectedLabel}">${safeSelectedLabel}</span>
          <span class="selector-chevron">${chevron}</span>
        </button>
        <div class="selector-overlay">
          <ul class="tactic-list">
            ${items}
          </ul>
          <button class="create-btn" type="button">+ New Tactic</button>
        </div>
      </div>
    `;
  };

  #renderDetails = (tactic: Tactic): string => {
    return `<div data-editor-mount></div>`;
  };

  #mountSubComponents = (state: TacticsState): void => {
    if (!state.activeTactic) return;

    const editorMount = this.#mount.querySelector<HTMLElement>('[data-editor-mount]');
    if (editorMount) {
      new TacticsEditor({
        mount: editorMount,
        store: this.#store,
        tactic: state.activeTactic,
      });
    }
  };

  #attachEventListeners = (listRoot: ParentNode | null): void => {
    this.#mount.querySelector('.close-btn')?.addEventListener('click', this.#store.close);
    this.#bindListEventHandlers(listRoot);
  };

  #bindListEventHandlers = (listRoot: ParentNode | null): void => {
    if (!listRoot) return;

    listRoot.querySelector('.selector-trigger')?.addEventListener('click', this.#toggleList);

    listRoot.querySelector('.create-btn')?.addEventListener('click', this.#handleCreate);

    listRoot.querySelectorAll('.tactic-item').forEach(el => {
      const id = (el as HTMLElement).dataset.id;
      if (!id) return;
      el.addEventListener('click', () => {
        this.#store.selectTactic(id);
        this.#setListOpen(false);
      });
    });

    listRoot.querySelectorAll('.delete-btn').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        this.#handleDelete((el as HTMLElement).dataset.id!, (el as HTMLElement).dataset.label!);
      });
    });
  };

  #handleCreate = () => {
    const label = prompt('New tactic name:')?.trim();
    if (label) {
      this.#store.createTactic(label);
      this.#setListOpen(false);
    }
  };

  #handleDelete = (id: string, label: string) => {
    if (confirm(`Are you sure you want to delete '${label}'?`)) {
      this.#store.deleteTactic(id);
    }
  };

  #toggleList = (event: Event): void => {
    event.preventDefault();
    event.stopPropagation();
    this.#setListOpen(!this.#isListOpen);
  };

  #setListOpen = (open: boolean): void => {
    if (this.#isListOpen === open) return;
    this.#isListOpen = open;
    if (open) {
      this.#doc.addEventListener('click', this.#handleDocumentClick);
    } else {
      this.#doc.removeEventListener('click', this.#handleDocumentClick);
    }
    this.render(this.#store.snapshot);
  };

  #handleDocumentClick = (event: MouseEvent): void => {
    if (!this.#isListOpen) return;
    const container = this.#listMount ?? this.#mount;
    const selector = container.querySelector('[data-role="tactics-selector"]');
    if (!selector) return;
    if (!selector.contains(event.target as Node)) {
      this.#setListOpen(false);
    }
  };

  #escapeHtml = (value: string): string => {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };
}
