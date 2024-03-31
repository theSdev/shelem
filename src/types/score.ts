import { Group } from "./group";

/** Class representing a single score for a group. */
export class Score {
  constructor(public group: Group, public value: number) {}

  /** Maximum possible score in a round. */
  static MAXIMUM_SCORE = 165;

  /** Finish score of the game. */
  static FINISH_SCORE = 1165;
}
