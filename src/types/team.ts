import type { TeamState } from "./teamState";

type Team = {
  id: string;
  name: string;
  state: TeamState;
  storyID: string;
  points: object[];
  history: object;
  adminClientID: string;
};

export type { Team };
