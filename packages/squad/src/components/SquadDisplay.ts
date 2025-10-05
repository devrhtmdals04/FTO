import { SQUAD_A, SQUAD_B, PlayerProfile } from '../index';
import { createPlayerMarker, Player } from '../../../tactics/src/models/marker';

export interface SquadDisplayOptions {
  mount: HTMLElement;
}

// Helper to convert detailed profile to the 6-stat model for the marker
function convertProfileToPlayer(profile: PlayerProfile, id: number): Player {
  return {
    id,
    number: id, // Using index as number for now
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

export class SquadDisplay {
  readonly #options: SquadDisplayOptions;
  #players: Player[];

  constructor(options: SquadDisplayOptions) {
    this.#options = options;
    // Combine squads and convert them
    this.#players = [...SQUAD_A, ...SQUAD_B].map((profile, index) => 
      convertProfileToPlayer(profile, index + 1)
    );
    this.render();
  }

  public render(): void {
    this.#options.mount.innerHTML = ''; // Clear previous content

    const squadList = document.createElement('div');
    squadList.className = 'squad-list';

    this.#players.forEach(player => {
      const playerCard = document.createElement('div');
      playerCard.className = 'player-card';
      playerCard.dataset.playerId = player.id.toString();
      playerCard.draggable = true;

      playerCard.addEventListener('dragstart', (event) => {
        if (event.dataTransfer) {
          event.dataTransfer.setData('application/json', JSON.stringify(player));
          event.dataTransfer.effectAllowed = 'move';

          const marker = createPlayerMarker(player);
          marker.style.position = 'absolute';
          marker.style.left = '-1000px'; // Position off-screen
          document.body.appendChild(marker);
          event.dataTransfer.setDragImage(marker, 40, 40);

          setTimeout(() => {
            document.body.removeChild(marker);
          }, 0);
        }
      });
      
      const markerElement = createPlayerMarker(player);
      markerElement.style.transform = 'scale(0.7)';
      markerElement.style.position = 'static';

      const playerName = document.createElement('div');
      playerName.className = 'player-name';
      playerName.textContent = player.name;

      playerCard.appendChild(markerElement);
      playerCard.appendChild(playerName);
      squadList.appendChild(playerCard);
    });

    this.#options.mount.appendChild(squadList);
    this.#addStyles();
  }

  #addStyles(): void {
    const styleId = 'squad-display-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .squad-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        height: 100%;
        overflow-y: auto;
      }
      .player-card {
        display: flex;
        align-items: center;
        gap: 10px;
        background-color: #3a3a3a;
        padding: 5px;
        border-radius: 8px;
        cursor: grab;
      }
      .player-card:active {
        cursor: grabbing;
      }
      .player-name {
        font-weight: bold;
        color: #eee;
      }
    `;
    document.head.appendChild(style);
  }
}