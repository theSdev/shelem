import { consume } from "@lit/context";
import { LitElement, html } from "lit";
import { Scores, scoresContext } from "../contexts/scores-context";
import { customElement } from "lit/decorators.js";

/** Custom Element for the finish state. */
@customElement("game-finished")
export class GameFinished extends LitElement {
  @consume({ context: scoresContext })
  scores?: Scores;

  render() {
    return html`
      <h2>Game's finished!</h2>
      <button @click=${this.handleRestart}>Start over</button>
    `;
  }

  private handleRestart() {
    this.scores?.restart();
  }
}
