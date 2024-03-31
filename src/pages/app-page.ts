import { provide } from "@lit/context";
import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Scores, scoresContext } from "../contexts/scores-context";
import { when } from "lit/directives/when.js";

/** Custom Element for the app's main page. */
@customElement("app-page")
export class AppPage extends LitElement {
  @provide({ context: scoresContext })
  @state()
  scores: Scores = new Scores();

  private finishHandler = this.handleFinish.bind(this);

  override connectedCallback(): void {
    document.addEventListener("finish", this.finishHandler);
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    document.removeEventListener("finish", this.finishHandler);
    super.disconnectedCallback();
  }

  private handleFinish() {
    this.requestUpdate();
  }

  render() {
    return html`
      <score-board></score-board>
      ${when(
        this.scores.finished,
        () => html`<game-finished></game-finished>`,
        () => html`<round-form></round-form>`
      )}
    `;
  }

  static styles = css`
    :host(:not([hidden])) {
      display: grid;
      grid-template-rows: 1fr 1fr;
      block-size: 100%;
    }
  `;
}
