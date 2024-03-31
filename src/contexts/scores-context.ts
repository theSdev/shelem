import { createContext } from "@lit/context";
import { Score } from "../types/score";
import { Group, opponentGroup } from "../types/group";
import { Round } from "../types/round";

/** Class representing the scores, accessible via scoresContext. */
export class Scores {
  private _rounds: Array<Round>;

  /** Should only be initiated once in the App, by the context provider. */
  constructor() {
    const storedRounds = localStorage.getItem("rounds");
    this._rounds = !storedRounds ? [] : JSON.parse(storedRounds);
  }

  /** Get all score rounds. */
  get rounds(): ReadonlyArray<Readonly<Round>> {
    return [...this._rounds];
  }

  /** Get current total scores. */
  get totals(): Readonly<Round> {
    return new Round([
      new Score(
        "us",
        this._rounds
          .flatMap((o) => o.us.value)
          .reduce((prev, cur) => prev + cur, 0)
      ),
      new Score(
        "them",
        this._rounds
          .flatMap((o) => o.them.value)
          .reduce((prev, cur) => prev + cur, 0)
      ),
    ]);
  }

  /** Get whether the game is finished. */
  get finished(): boolean {
    const { timestamp, ...groups } = this.totals;

    return Object.values(groups).some(
      ({ value }) => value >= Score.FINISH_SCORE
    );
  }

  /** Add a new round to the scores. */
  add(claimingGroup: Group, claimedScore: number, challengerScore: number) {
    const challengerGroup = opponentGroup(claimingGroup);
    const hasClaimerWon = Score.MAXIMUM_SCORE - challengerScore >= claimedScore;
    const canChallengerGetPoints =
      !hasClaimerWon || this.totals[challengerGroup].value < 1000;

    let claimerScore;
    switch (true) {
      // claimer win: double shelem
      case challengerScore === 0:
        claimerScore = claimedScore * 2;
        break;
      // claimer win: normal
      case hasClaimerWon:
        claimerScore = claimedScore;
        break;
      // challenger win: normal
      case challengerScore < Score.MAXIMUM_SCORE / 2:
        claimerScore = -claimedScore;
        break;
      // challenger win: double negative
      default:
        claimerScore = -2 * claimedScore;
        break;
    }

    this._rounds.push(
      new Round([
        new Score(claimingGroup, claimerScore),
        new Score(
          challengerGroup,
          canChallengerGetPoints ? challengerScore : 0
        ),
      ])
    );

    localStorage.setItem("rounds", JSON.stringify(this._rounds));
  }

  /** Remove a round from the scores */
  remove(index: number) {
    this._rounds = this._rounds.toSpliced(index, 1);

    localStorage.setItem("rounds", JSON.stringify(this._rounds));
  }

  /** Restart the game */
  restart() {
    localStorage.removeItem("rounds");
  }
}

/** Global containing the game state */
export const scoresContext = createContext<Scores>("scores");
