import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { consume } from "@lit/context";
import { Scores, scoresContext } from "../contexts/scores-context";

/** Custom Element for displaying all rounds and the totals. */
@customElement("score-board")
export class ScoreBoard extends LitElement {
  @consume({ context: scoresContext })
  scores?: Scores;

  private roundHandler = this.handleRound.bind(this);

  override connectedCallback(): void {
    document.addEventListener("round", this.roundHandler);
    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    document.removeEventListener("round", this.roundHandler);
    super.disconnectedCallback();
  }

  private handleRound() {
    this.requestUpdate();
  }

  private handleRemoval(index: number) {
    this.scores?.remove(index);
    this.requestUpdate();
  }

  render() {
    return html`<section aria-labelledby="scoreboard-title">
      <h2 id="scoreboard-title">Scoreboard</h2>
      <div class="table-wrapper">
        <table>
          <thead>
            <th style="inline-size: 1.5em"></th>
            <th></th>
            <th>Us</th>
            <th>Them</th>
          </thead>
          ${this.scores &&
          html`<tbody>
              ${repeat(
                this.scores.rounds,
                ({ timestamp }) => timestamp,
                ({ us, them }, index) =>
                  html`<tr>
                    <td>
                      <button
                        @click=${() => this.handleRemoval(index)}
                        aria-label="Delete row"
                      >
                        X
                      </button>
                    </td>
                    <td>#${index + 1}</td>
                    <td>${us.value}</td>
                    <td>${them.value}</td>
                  </tr>`
              )}
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td>Total</td>
                <td>${this.scores.totals.us.value}</td>
                <td>${this.scores.totals.them.value}</td>
              </tr>
            </tfoot>`}
        </table>
      </div>
    </section> `;
  }

  static styles = css`
    :host(:not([hidden])) {
      display: block;
      min-block-size: 0;
    }

    section {
      block-size: 100%;
      display: grid;
      grid-template-rows: auto 1fr;
    }

    .table-wrapper {
      overflow: auto;
    }

    table {
      border-collapse: collapse;
      inline-size: 100%;
      table-layout: fixed;
    }

    thead,
    tfoot {
      position: sticky;
      background: light-dark(white, black);
    }

    thead {
      inset-block-start: 0;
    }

    th,
    td {
      border: 1px solid light-dark(black, white);
      text-align: center;
      padding: 0.2em;
    }

    tfoot {
      inset-block-end: 0;
      font-weight: 600;
    }
  `;
}
