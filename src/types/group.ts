/** Playing groups. */
export type Group = "us" | "them";

/** Change group name in passive voice to active. */
export function passiveGroupToActive(group: Group) {
  switch (group) {
    case "us":
      return "We";
    case "them":
      return "They";
    default:
      const _exhaustiveCheck: never = group;
      throw Error("Unknown group.");
  }
}

/** Get the group opposing the input group. */
export function opponentGroup(group: Group): Group {
  switch (group) {
    case "us":
      return "them";
    case "them":
      return "us";
    default:
      const _exhaustiveCheck: never = group;
      throw Error("Unknown group.");
  }
}
