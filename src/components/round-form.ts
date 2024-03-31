import { consume } from "@lit/context";
import { LitElement, css, html } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { Scores, scoresContext } from "../contexts/scores-context";
import { Score } from "../types/score";
import { Group, opponentGroup, passiveGroupToActive } from "../types/group";

/** Custom Element for submitting a new round. */
@customElement("round-form")
export class RoundForm extends LitElement {
  @consume({ context: scoresContext })
  scores?: Scores;

  @state() challengerGroup: Group = "them";
  @query("form") form!: HTMLFormElement;
  @query("#claiming-group") claimingGroupSelect!: HTMLSelectElement;
  @query("#claimed-score") claimedScoreInput!: HTMLInputElement;
  @query("#challenger-score") challengerScoreInput!: HTMLInputElement;

  render() {
    return html`<section aria-labelledby="round-title">
      <h2 id="round-title">Round</h2>
      <form @submit=${this.handleSubmit}>
        <fieldset name="claim">
          <legend><span>Claim</legend>
          <select
            id="claiming-group"
            @input=${this.handleClaimingGroupInput}
            required
          >
            <option value="us">We</option>
            <option value="them">They</option>
          </select>
          claimed
          <input
            id="claimed-score"
            type="number"
            min="100"
            max=${Score.MAXIMUM_SCORE}
            step="5"
            value="100"
            required
            @focus=${this.handleInputFocus}
          />
        </fieldset>
        <fieldset name="result">
          <legend><span>Result</legend>
          <span>${passiveGroupToActive(this.challengerGroup)}</span>
          <span>scored</span>
          <input
            id="challenger-score"
            type="number"
            min="0"
            max=${Score.MAXIMUM_SCORE}
            step="5"
            value="0"
            required
            @focus=${this.handleInputFocus}
          />
        </fieldset>
        <button type="submit">Submit</button>
      </form>
    </section>`;
  }

  private handleClaimingGroupInput() {
    this.challengerGroup = opponentGroup(
      this.claimingGroupSelect.value as Group
    );
  }

  private handleInputFocus(e: FocusEvent) {
    const input = e.currentTarget as HTMLInputElement;
    input?.select?.();
  }

  private handleSubmit(e: Event) {
    e.preventDefault();

    this.scores?.add(
      this.claimingGroupSelect.value as Group,
      this.claimedScoreInput.valueAsNumber,
      this.challengerScoreInput.valueAsNumber
    );

    const roundEvent = new Event("round", { bubbles: true, composed: true });
    this.dispatchEvent(roundEvent);

    if (this.scores?.finished) {
      const finishEvent = new Event("finish", {
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(finishEvent);
    }

    this.form.reset();
    this.handleClaimingGroupInput();
  }

  static styles = css`
    form {
      display: grid;
      grid-template-columns: 6rem 5rem 5rem;
    }

    fieldset {
      grid-column: 1 / -1;
      padding: 1rem;
      display: grid;
      grid-template-columns: subgrid;
      gap: 1rem;
    }

    legend {
      font-size: 1.2rem;
      font-weight: 600;
    }

    button {
      margin: 1rem;
    }
  `;
}
