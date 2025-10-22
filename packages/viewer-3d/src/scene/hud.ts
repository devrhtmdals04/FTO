import { SimView } from "../state";

const TEAM_PHASE_MAP: Record<number, string> = {
  0: "KickoffAttack",
  1: "KickoffDefense",
  2: "SetPieceAttack",
  3: "SetPieceDefense",
  4: "BuildUp",
  5: "Progression",
  6: "FinalThird",
  7: "HighBlock",
  8: "MidBlock",
  9: "LowBlock",
  10: "Neutral",
};

export class HUD {
  element: HTMLDivElement;
  homeStateDiv: HTMLDivElement;
  awayStateDiv: HTMLDivElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.style.position = 'absolute';
    this.element.style.top = '10px';
    this.element.style.left = '10px';
    this.element.style.color = 'white';
    this.element.style.fontFamily = 'monospace';
    document.body.appendChild(this.element);

    this.homeStateDiv = document.createElement("div");
    this.homeStateDiv.style.position = "absolute";
    this.homeStateDiv.style.top = "50px";
    this.homeStateDiv.style.left = "10px";
    this.homeStateDiv.style.color = "cyan";
    this.homeStateDiv.style.fontSize = "16px";
    this.homeStateDiv.style.fontFamily = "monospace";
    document.body.appendChild(this.homeStateDiv);

    this.awayStateDiv = document.createElement("div");
    this.awayStateDiv.style.position = "absolute";
    this.awayStateDiv.style.top = "50px";
    this.awayStateDiv.style.right = "10px";
    this.awayStateDiv.style.color = "tomato";
    this.awayStateDiv.style.fontSize = "16px";
    this.awayStateDiv.style.fontFamily = "monospace";
    document.body.appendChild(this.awayStateDiv);
  }

  update(view: SimView, fps: number) {
    this.element.innerText = `Tick: ${view.tick}\nFPS: ${fps.toFixed(1)}`;

    if (this.homeStateDiv) {
      this.homeStateDiv.textContent = `Home: ${TEAM_PHASE_MAP[view.home_team_phase] || 'Unknown'}`;
    }
    if (this.awayStateDiv) {
      this.awayStateDiv.textContent = `Away: ${TEAM_PHASE_MAP[view.away_team_phase] || 'Unknown'}`;
    }
  }
}
