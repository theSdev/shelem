import { Score } from "./score";

/** Class representing a round, holding both group's scores. */
export class Round {
  us: Score;
  them: Score;
  timestamp: string = new Date().toISOString();

  /** Create new round by passing a score per each group. */
  constructor(scores: [Score, Score]) {
    if (scores.length !== 2)
      throw Error("Input should contain one score per group.");

    const us = scores.find((o) => o.group === "us");
    if (!us) throw Error('No score found for group "us"');
    this.us = new Score("us", us.value);

    const them = scores.find((o) => o.group === "them");
    if (!them) throw Error('No score found for group "them"');
    this.them = new Score("them", them.value);
  }
}
