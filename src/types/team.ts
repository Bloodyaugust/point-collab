import type { TeamState } from './teamState';

export type Team = {
  id: string;
  name: string;
  state: TeamState;
  storyID: string;
  points: object[];
  history: object;
  adminClientID: string;
};
